import { useState, useCallback, useRef, useEffect, useLayoutEffect } from "react"
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
  const wrapperRef = useRef<HTMLDivElement>(null)

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

  // Apply custom colors via DOM - runs after every render
  const applyColors = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const svg = wrapper.querySelector('svg')
    if (!svg) return

    // Reset ALL teeth to default color first
    const allGroups = svg.querySelectorAll('g[id^="teeth-"]')
    allGroups.forEach(group => {
      const paths = group.querySelectorAll('path')
      paths.forEach(path => {
        (path as SVGPathElement).style.setProperty('fill', '#3d5a7a', 'important')
        ;(path as SVGPathElement).style.setProperty('stroke', '#5a7a9a', 'important')
      })
    })

    // Color temp start (first tooth selected, waiting for second) - Cyan
    if (tempStart && selectionStep === 'end') {
      const startGroup = svg.querySelector(`g[id="teeth-${tempStart}"]`)
      if (startGroup) {
        const paths = startGroup.querySelectorAll('path')
        paths.forEach(path => {
          (path as SVGPathElement).style.setProperty('fill', '#5ebbbd', 'important')
          ;(path as SVGPathElement).style.setProperty('stroke', '#4aa8aa', 'important')
        })
      }
    }

    // Color abutments - Cyan
    bridgeData.abutments.forEach(tooth => {
      const group = svg.querySelector(`g[id="teeth-${tooth}"]`)
      if (group) {
        const paths = group.querySelectorAll('path')
        paths.forEach(path => {
          (path as SVGPathElement).style.setProperty('fill', '#5ebbbd', 'important')
          ;(path as SVGPathElement).style.setProperty('stroke', '#3d9a9c', 'important')
        })
      }
    })

    // Color pontics - Amber  
    bridgeData.pontics.forEach(tooth => {
      const group = svg.querySelector(`g[id="teeth-${tooth}"]`)
      if (group) {
        const paths = group.querySelectorAll('path')
        paths.forEach(path => {
          (path as SVGPathElement).style.setProperty('fill', '#f59e0b', 'important')
          ;(path as SVGPathElement).style.setProperty('stroke', '#d97706', 'important')
        })
      }
    })
  }, [bridgeData.abutments, bridgeData.pontics, tempStart, selectionStep])

  // Apply colors after render with a delay
  useLayoutEffect(() => {
    const timer = setTimeout(applyColors, 50)
    return () => clearTimeout(timer)
  }, [applyColors])

  // Handle tooth click - SIMPLIFIED like ToothChart
  const handleChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    const previousSelection = prevSelectionRef.current
    
    // Find newly added tooth (clicked)
    const addedTeeth = currentSelection.filter(t => !previousSelection.includes(t))
    // Also check for removed teeth (user clicked same tooth to deselect)
    const removedTeeth = previousSelection.filter(t => !currentSelection.includes(t))
    
    // Update ref for next comparison
    prevSelectionRef.current = currentSelection
    
    // Determine which tooth was clicked
    let clickedTooth: string | null = null
    if (addedTeeth.length > 0) {
      clickedTooth = addedTeeth[0]
    } else if (removedTeeth.length > 0) {
      clickedTooth = removedTeeth[0]
    }
    
    if (!clickedTooth) return
    
    console.log('Bridge: Tooth clicked:', clickedTooth, 'Step:', selectionStep)
    
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
          // Valid bridge span - call parent
          onRangeSelect(tempStart, clickedTooth)
          setSelectionStep('adjust')
          // Reset the library's internal selection
          prevSelectionRef.current = []
        } else {
          // Not enough teeth, restart with new tooth
          setTempStart(clickedTooth)
          prevSelectionRef.current = []
        }
      } else {
        // Different quadrant, restart with new tooth
        setTempStart(clickedTooth)
        prevSelectionRef.current = []
      }
    } else if (selectionStep === 'adjust') {
      // Toggle abutment/pontic for existing bridge teeth
      const allBridgeTeeth = [...bridgeData.abutments, ...bridgeData.pontics]
      if (allBridgeTeeth.includes(clickedTooth)) {
        onToggleAbutment(clickedTooth)
      }
      // Keep library selection in sync with bridge teeth
      prevSelectionRef.current = []
    }
    
    // Re-apply colors after state change
    setTimeout(applyColors, 100)
  }, [selectionStep, tempStart, bridgeData.abutments, bridgeData.pontics, onRangeSelect, onToggleAbutment, applyColors])

  const handleReset = () => {
    setTempStart(null)
    setSelectionStep('start')
    prevSelectionRef.current = []
    onReset()
    setTimeout(applyColors, 100)
  }

  const getInstructionText = () => {
    switch (selectionStep) {
      case 'start':
        return 'Tap the FIRST tooth of the bridge'
      case 'end':
        return `${tempStart} selected → Tap the LAST tooth (min 3)`
      case 'adjust':
        return 'Tap teeth or pills to toggle Abutment/Pontic'
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
        <div className="rounded-2xl p-4 overflow-hidden">
          <div ref={wrapperRef} className="odontogram-wrapper">
            <Odontogram
              onChange={handleChange}
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
          <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
            {[...bridgeData.abutments, ...bridgeData.pontics].sort().map(tooth => (
              <button
                key={tooth}
                onClick={() => {
                  onToggleAbutment(tooth)
                  setTimeout(applyColors, 100)
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
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

      {/* Styles */}
      <style>{`
        .odontogram-wrapper svg {
          width: 100%;
          height: auto;
        }
        
        .odontogram-wrapper .Odontogram__tooltip,
        .odontogram-wrapper [class*="tooltip"] {
          display: none !important;
        }
        
        .odontogram-wrapper svg path {
          fill: #3d5a7a;
          stroke: #5a7a9a;
          stroke-width: 1;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .odontogram-wrapper svg path:hover {
          fill: #4a7096;
        }
        
        .odontogram-wrapper svg text {
          display: none !important;
        }
        
        /* Override library's selected state since we handle colors manually */
        .odontogram-wrapper svg [aria-selected="true"] path,
        .odontogram-wrapper svg g[aria-selected="true"] path {
          /* Let our JS handle colors instead */
        }
      `}</style>
    </div>
  )
}
