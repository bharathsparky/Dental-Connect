import { useState, useCallback, useRef, useEffect, useLayoutEffect } from "react"
import { motion } from "motion/react"
import { Check, ArrowRight, RotateCcw, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Odontogram } from "react-odontogram"
import type { BridgeData, BridgeType, PonticDesign } from "@/stores/orderStore"

interface BridgeSelectorProps {
  bridgeData: BridgeData
  onBridgeTypeChange: (type: BridgeType) => void
  onBridgeDataChange: (data: Partial<BridgeData>) => void
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
  { id: 'maryland', label: 'Maryland', description: 'Resin-bonded wings to adjacent teeth' },
  { id: 'precision_attachment', label: 'Precision Attachment', description: 'Fixed-removable with hidden connector' },
]

const PONTIC_DESIGNS = [
  { id: 'ridge_lap', label: 'Ridge Lap', description: 'Covers ridge, concave fit surface' },
  { id: 'modified_ridge_lap', label: 'Modified Ridge Lap', description: 'Convex labial, concave lingual' },
  { id: 'sanitary', label: 'Sanitary (Hygienic)', description: 'No ridge contact, easy clean' },
  { id: 'ovate', label: 'Ovate', description: 'Convex, sits in prepared socket' },
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
  onBridgeDataChange,
  onRangeSelect,
  onToggleAbutment,
  onReset
}: BridgeSelectorProps) {
  const [selectionStep, setSelectionStep] = useState<'start' | 'end' | 'adjust'>(
    bridgeData.units > 0 ? 'adjust' : 'start'
  )
  const [tempStart, setTempStart] = useState<string | null>(bridgeData.startTooth || null)
  const [odontogramKey, setOdontogramKey] = useState(0) // Key to force remount and clear selection
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lastClickTimeRef = useRef(0)

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

    // The library uses CLASS names like "teeth-11", "teeth-21", not IDs
    // Query all groups that have a class starting with "teeth-"
    const allToothGroups = svg.querySelectorAll('g[class*="teeth-"]')
    
    // Reset ALL teeth to default color first
    allToothGroups.forEach(group => {
      const paths = group.querySelectorAll('path')
      paths.forEach(path => {
        (path as SVGPathElement).style.setProperty('fill', '#3d5a7a', 'important')
        ;(path as SVGPathElement).style.setProperty('stroke', '#5a7a9a', 'important')
      })
    })

    // Helper to find tooth group by FDI number using class selector
    const findToothGroup = (toothFDI: string): Element | null => {
      // The library uses class="teeth-XY" where XY is the FDI notation
      return svg.querySelector(`g.teeth-${toothFDI}`)
    }

    // Color temp start (first tooth selected, waiting for second) - Cyan
    if (tempStart && selectionStep === 'end') {
      const startGroup = findToothGroup(tempStart)
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
      const group = findToothGroup(tooth)
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
      const group = findToothGroup(tooth)
      if (group) {
        const paths = group.querySelectorAll('path')
        paths.forEach(path => {
          (path as SVGPathElement).style.setProperty('fill', '#f59e0b', 'important')
          ;(path as SVGPathElement).style.setProperty('stroke', '#d97706', 'important')
        })
      }
    })
  }, [bridgeData.abutments, bridgeData.pontics, tempStart, selectionStep])

  // Apply colors after render with a delay (also re-apply when key changes)
  useLayoutEffect(() => {
    const timer = setTimeout(applyColors, 50)
    return () => clearTimeout(timer)
  }, [applyColors, odontogramKey])

  // Handle tooth click - Use simple detection with debounce
  const handleChange = useCallback((selections: ToothSelection[]) => {
    // Debounce rapid calls (the library sometimes fires multiple times)
    const now = Date.now()
    if (now - lastClickTimeRef.current < 100) return
    lastClickTimeRef.current = now
    
    // Get the last selection (most recently clicked tooth)
    if (selections.length === 0) return
    const clickedTooth = selections[selections.length - 1].notations.fdi
    
    console.log('Bridge: Tooth clicked:', clickedTooth, 'Step:', selectionStep, 'Selections:', selections.length)
    
    if (selectionStep === 'start') {
      // First tooth of range
      setTempStart(clickedTooth)
      setSelectionStep('end')
      // Clear library selection for next click
      setOdontogramKey(k => k + 1)
    } else if (selectionStep === 'end' && tempStart) {
      // Second tooth - validate and create range
      const startQuad = Math.floor(parseInt(tempStart) / 10)
      const endQuad = Math.floor(parseInt(clickedTooth) / 10)
      
      if (startQuad === endQuad && clickedTooth !== tempStart) {
        const teethInRange = getTeethInRange(tempStart, clickedTooth)
        if (teethInRange.length >= 3) {
          // Valid bridge span - call parent
          onRangeSelect(tempStart, clickedTooth)
          setSelectionStep('adjust')
        } else {
          // Not enough teeth, restart with new tooth
          setTempStart(clickedTooth)
        }
      } else if (clickedTooth === tempStart) {
        // Same tooth clicked twice - deselect and restart
        setTempStart(null)
        setSelectionStep('start')
      } else {
        // Different quadrant, restart with new tooth
        setTempStart(clickedTooth)
      }
      // Clear library selection for next action
      setOdontogramKey(k => k + 1)
    } else if (selectionStep === 'adjust') {
      // Toggle abutment/pontic for existing bridge teeth
      const allBridgeTeeth = [...bridgeData.abutments, ...bridgeData.pontics]
      if (allBridgeTeeth.includes(clickedTooth)) {
        onToggleAbutment(clickedTooth)
      }
      // Clear library selection
      setOdontogramKey(k => k + 1)
    }
    
    // Re-apply colors after state change
    setTimeout(applyColors, 150)
  }, [selectionStep, tempStart, bridgeData.abutments, bridgeData.pontics, onRangeSelect, onToggleAbutment, applyColors])

  const handleReset = () => {
    setTempStart(null)
    setSelectionStep('start')
    setOdontogramKey(k => k + 1)
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
              key={odontogramKey}
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

      {/* Pontic Design */}
      {bridgeData.units >= 3 && bridgeData.pontics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-2">Pontic Design</h3>
          <div className="grid grid-cols-2 gap-2">
            {PONTIC_DESIGNS.map((design) => (
              <button
                key={design.id}
                onClick={() => onBridgeDataChange({ ponticDesign: design.id as PonticDesign })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-left",
                  bridgeData.ponticDesign === design.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-xs",
                  bridgeData.ponticDesign === design.id ? "text-primary" : "text-white"
                )}>
                  {design.label}
                </p>
                <p className="text-[9px] text-white/50 mt-0.5">{design.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Precision Attachment Position - Only show for precision attachment bridges */}
      {bridgeData.bridgeType === 'precision_attachment' && bridgeData.units >= 3 && bridgeData.abutments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-white">Attachment Position</h3>
          </div>
          <p className="text-xs text-white/50 mb-3">
            Select which abutment(s) will have the precision attachment for the RPD
          </p>
          <div className="space-y-2">
            {bridgeData.abutments.sort().map((tooth) => {
              const isSelected = bridgeData.attachmentPositions?.includes(tooth)
              return (
                <button
                  key={tooth}
                  onClick={() => {
                    const currentPositions = bridgeData.attachmentPositions || []
                    const newPositions = isSelected
                      ? currentPositions.filter(t => t !== tooth)
                      : [...currentPositions, tooth]
                    onBridgeDataChange({ attachmentPositions: newPositions })
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                    isSelected
                      ? "bg-selected border-primary/50"
                      : "bg-card border-border/50 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-white/10 text-white"
                    )}>
                      {tooth}
                    </div>
                    <div>
                      <p className={cn(
                        "font-medium text-sm",
                        isSelected ? "text-primary" : "text-white"
                      )}>
                        Tooth {tooth}
                      </p>
                      <p className="text-[10px] text-white/50">
                        {tooth === bridgeData.abutments[0] ? 'Mesial abutment' : 
                         tooth === bridgeData.abutments[bridgeData.abutments.length - 1] ? 'Distal abutment' : 
                         'Intermediate abutment'}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              )
            })}
          </div>
          {bridgeData.attachmentPositions && bridgeData.attachmentPositions.length > 0 && (
            <div className="mt-3 p-3 bg-primary/10 rounded-xl border border-primary/30">
              <p className="text-xs text-primary font-medium">
                Attachment on: {bridgeData.attachmentPositions.sort().join(', ')}
              </p>
              <p className="text-[10px] text-white/50 mt-1">
                The lab will place the precision attachment connector on {bridgeData.attachmentPositions.length === 1 ? 'this tooth' : 'these teeth'}
              </p>
            </div>
          )}
        </motion.div>
      )}

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
          
          {(bridgeData.ponticDesign || (bridgeData.bridgeType === 'precision_attachment' && bridgeData.attachmentPositions && bridgeData.attachmentPositions.length > 0)) && (
            <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
              {bridgeData.ponticDesign && (
                <p className="text-[9px] text-white/50">
                  Pontic Design: {PONTIC_DESIGNS.find(d => d.id === bridgeData.ponticDesign)?.label}
                </p>
              )}
              {bridgeData.bridgeType === 'precision_attachment' && bridgeData.attachmentPositions && bridgeData.attachmentPositions.length > 0 && (
                <p className="text-[9px] text-white/50 flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  Attachment: {bridgeData.attachmentPositions.sort().join(', ')}
                </p>
              )}
            </div>
          )}
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
