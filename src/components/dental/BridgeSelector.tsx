import { useState, useCallback, useRef, useEffect } from "react"
import { motion } from "motion/react"
import { Check, ArrowRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Odontogram } from "react-odontogram"
import type { BridgeData, BridgeType } from "@/stores/orderStore"

interface BridgeSelectorProps {
  bridgeData: BridgeData
  onBridgeTypeChange: (type: BridgeType) => void
  onRangeSelect: (start: string, end: string) => void
  onToggleAbutment: (tooth: string) => void
  onReset: () => void
}

interface ToothSelection {
  id: string
  notations: {
    fdi: string
    universal: string
    palmer: string
  }
  type: string
}

const BRIDGE_TYPES = [
  { id: 'conventional', label: 'Conventional', description: 'Abutments on both sides' },
  { id: 'cantilever', label: 'Cantilever', description: 'Abutment on one side only' },
  { id: 'maryland', label: 'Maryland', description: 'Wings bonded to adjacent teeth' },
]

// Get all teeth in a range (same quadrant)
function getTeethInRange(start: string, end: string): string[] {
  const startNum = parseInt(start)
  const endNum = parseInt(end)
  
  const startQuadrant = Math.floor(startNum / 10)
  const endQuadrant = Math.floor(endNum / 10)
  
  if (startQuadrant !== endQuadrant) return []
  
  const teeth: string[] = []
  const startTooth = startNum % 10
  const endTooth = endNum % 10
  
  const minTooth = Math.min(startTooth, endTooth)
  const maxTooth = Math.max(startTooth, endTooth)
  
  for (let i = minTooth; i <= maxTooth; i++) {
    teeth.push(`${startQuadrant}${i}`)
  }
  
  return teeth
}

export function BridgeSelector({ 
  bridgeData, 
  onBridgeTypeChange, 
  onRangeSelect,
  onToggleAbutment,
  onReset
}: BridgeSelectorProps) {
  const [selectionStep, setSelectionStep] = useState<'start' | 'end' | 'adjust'>(
    bridgeData.units > 0 ? 'adjust' : 'start'
  )
  const [tempStart, setTempStart] = useState<string | null>(bridgeData.startTooth || null)
  const prevSelectionRef = useRef<string[]>([])
  const chartRef = useRef<HTMLDivElement>(null)

  // Sync selection step with bridgeData
  useEffect(() => {
    if (bridgeData.units > 0) {
      setSelectionStep('adjust')
      setTempStart(bridgeData.startTooth || null)
    } else {
      setSelectionStep('start')
      setTempStart(null)
    }
  }, [bridgeData.units, bridgeData.startTooth])

  // Apply custom colors to teeth via DOM manipulation
  useEffect(() => {
    if (!chartRef.current) return
    
    const svg = chartRef.current.querySelector('svg')
    if (!svg) return

    // Reset all teeth to default color first
    const allPaths = svg.querySelectorAll('g[id^="teeth-"] path')
    allPaths.forEach(path => {
      (path as SVGPathElement).style.fill = '#3d5a7a';
      (path as SVGPathElement).style.stroke = '#5a7a9a';
    })

    // Color abutment teeth - Cyan
    bridgeData.abutments.forEach(tooth => {
      const toothGroup = svg.querySelector(`#teeth-${tooth}`)
      if (toothGroup) {
        const paths = toothGroup.querySelectorAll('path')
        paths.forEach(path => {
          (path as SVGPathElement).style.fill = '#5ebbbd';
          (path as SVGPathElement).style.stroke = '#3d9a9c';
        })
      }
    })

    // Color pontic teeth - Amber
    bridgeData.pontics.forEach(tooth => {
      const toothGroup = svg.querySelector(`#teeth-${tooth}`)
      if (toothGroup) {
        const paths = toothGroup.querySelectorAll('path')
        paths.forEach(path => {
          (path as SVGPathElement).style.fill = '#f59e0b';
          (path as SVGPathElement).style.stroke = '#d97706';
        })
      }
    })

    // Color temp start selection - Semi-transparent cyan
    if (tempStart && selectionStep === 'end') {
      const toothGroup = svg.querySelector(`#teeth-${tempStart}`)
      if (toothGroup) {
        const paths = toothGroup.querySelectorAll('path')
        paths.forEach(path => {
          (path as SVGPathElement).style.fill = 'rgba(94, 187, 189, 0.5)';
          (path as SVGPathElement).style.stroke = '#5ebbbd';
        })
      }
    }
  }, [bridgeData.abutments, bridgeData.pontics, tempStart, selectionStep])

  // Handle tooth click from odontogram
  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    const previousSelection = prevSelectionRef.current
    
    // Find newly clicked tooth
    const addedTeeth = currentSelection.filter(t => !previousSelection.includes(t))
    
    prevSelectionRef.current = currentSelection
    
    if (addedTeeth.length === 0) return
    
    const clickedTooth = addedTeeth[0]
    
    if (selectionStep === 'start') {
      // First tooth of range
      setTempStart(clickedTooth)
      setSelectionStep('end')
    } else if (selectionStep === 'end' && tempStart) {
      // Second tooth - validate and create range
      const startQuad = Math.floor(parseInt(tempStart) / 10)
      const endQuad = Math.floor(parseInt(clickedTooth) / 10)
      
      if (startQuad === endQuad) {
        const teethInRange = getTeethInRange(tempStart, clickedTooth)
        if (teethInRange.length >= 3) {
          // Valid bridge span
          onRangeSelect(tempStart, clickedTooth)
          setSelectionStep('adjust')
        } else {
          // Not enough teeth, restart with new tooth
          setTempStart(clickedTooth)
          prevSelectionRef.current = [clickedTooth]
        }
      } else {
        // Different quadrant, restart
        setTempStart(clickedTooth)
        prevSelectionRef.current = [clickedTooth]
      }
    } else if (selectionStep === 'adjust') {
      // Toggle abutment/pontic for existing bridge teeth
      const allBridgeTeeth = [...bridgeData.abutments, ...bridgeData.pontics]
      if (allBridgeTeeth.includes(clickedTooth)) {
        onToggleAbutment(clickedTooth)
      }
      // Keep ref synced
      prevSelectionRef.current = allBridgeTeeth
    }
  }, [selectionStep, tempStart, bridgeData.abutments, bridgeData.pontics, onRangeSelect, onToggleAbutment])

  const handleReset = () => {
    setTempStart(null)
    setSelectionStep('start')
    prevSelectionRef.current = []
    onReset()
  }

  const getInstructionText = () => {
    switch (selectionStep) {
      case 'start':
        return 'Tap the FIRST tooth of the bridge'
      case 'end':
        return `${tempStart} selected → Tap the LAST tooth (min 3)`
      case 'adjust':
        return 'Tap to toggle: Abutment ↔ Pontic'
    }
  }

  return (
    <div className="space-y-5">
      {/* Bridge Type Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Bridge Type</h3>
        <div className="space-y-2">
          {BRIDGE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onBridgeTypeChange(type.id as BridgeType)}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                bridgeData.bridgeType === type.id
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20"
              )}
            >
              <div>
                <p className={cn(
                  "font-medium text-sm",
                  bridgeData.bridgeType === type.id ? "text-primary" : "text-white"
                )}>
                  {type.label}
                </p>
                <p className="text-xs text-white/50">{type.description}</p>
              </div>
              {bridgeData.bridgeType === type.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bridge Span Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white">Select Bridge Span</h3>
          {(tempStart || bridgeData.units > 0) && (
            <button 
              onClick={handleReset}
              className="text-xs text-primary flex items-center gap-1 hover:text-primary/80"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        
        <div className={cn(
          "text-xs mb-3 px-3 py-2 rounded-lg text-center",
          selectionStep === 'adjust' ? "bg-primary/10 text-primary" : "bg-white/5 text-white/60"
        )}>
          {getInstructionText()}
        </div>

        {/* Odontogram Chart */}
        <div ref={chartRef} className="bridge-chart bg-card/50 rounded-xl p-3 border border-border/30 overflow-hidden">
          <Odontogram
            onChange={handleOdontogramChange}
            className="w-full"
            theme="dark"
            colors={{
              tooth: '#3d5a7a',
              toothStroke: '#5a7a9a',
              selected: '#5ebbbd',
              selectedStroke: '#4aa8aa',
              hover: '#4a7096'
            }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-4 rounded-sm bg-primary" />
            <span className="text-white/50">Abutment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-4 rounded-sm bg-amber-500" />
            <span className="text-white/50">Pontic</span>
          </div>
        </div>

        {/* Quick toggle pills for selected teeth */}
        {bridgeData.units >= 3 && (
          <div className="mt-3 flex flex-wrap gap-1 justify-center">
            {[...bridgeData.abutments, ...bridgeData.pontics].sort().map(tooth => (
              <button
                key={tooth}
                onClick={() => onToggleAbutment(tooth)}
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium transition-all",
                  bridgeData.abutments.includes(tooth)
                    ? "bg-primary text-primary-foreground"
                    : "bg-amber-500 text-white"
                )}
              >
                {tooth} ({bridgeData.abutments.includes(tooth) ? 'A' : 'P'})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {bridgeData.units >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-selected rounded-xl border border-primary/30"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-primary">
              {bridgeData.units}-Unit Bridge
            </p>
            <p className="text-xs text-white/50 flex items-center gap-1">
              {bridgeData.startTooth} <ArrowRight className="w-3 h-3" /> {bridgeData.endTooth}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-primary/20 rounded-lg p-2">
              <p className="text-[9px] text-white/50 uppercase tracking-wider">Abutments</p>
              <p className="font-medium text-primary text-xs mt-0.5">
                {bridgeData.abutments.length > 0 ? bridgeData.abutments.sort().join(', ') : '-'}
              </p>
            </div>
            <div className="bg-amber-500/20 rounded-lg p-2">
              <p className="text-[9px] text-white/50 uppercase tracking-wider">Pontics</p>
              <p className="font-medium text-amber-400 text-xs mt-0.5">
                {bridgeData.pontics.length > 0 ? bridgeData.pontics.sort().join(', ') : '-'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Base styles */}
      <style>{`
        .bridge-chart svg {
          width: 100%;
          height: auto;
        }
        
        .bridge-chart .Odontogram__tooltip,
        .bridge-chart [class*="tooltip"] {
          display: none !important;
        }
        
        .bridge-chart svg text {
          display: none !important;
        }
        
        .bridge-chart svg g[id^="teeth-"] path {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .bridge-chart svg g[id^="teeth-"]:hover path {
          filter: brightness(1.2);
        }
      `}</style>
    </div>
  )
}
