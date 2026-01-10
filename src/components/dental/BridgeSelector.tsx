import { useState, useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, ArrowRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BridgeData, BridgeType } from "@/stores/orderStore"

interface BridgeSelectorProps {
  bridgeData: BridgeData
  onBridgeTypeChange: (type: BridgeType) => void
  onRangeSelect: (start: string, end: string) => void
  onToggleAbutment: (tooth: string) => void
}

const BRIDGE_TYPES = [
  { id: 'conventional', label: 'Conventional', description: 'Abutments on both sides' },
  { id: 'cantilever', label: 'Cantilever', description: 'Abutment on one side only' },
  { id: 'maryland', label: 'Maryland', description: 'Wings bonded to adjacent teeth' },
]

interface ToothSelection {
  id: string
  notations: {
    fdi: string
    universal: string
    palmer: string
  }
  type: string
}

export function BridgeSelector({ 
  bridgeData, 
  onBridgeTypeChange, 
  onRangeSelect,
  onToggleAbutment 
}: BridgeSelectorProps) {
  const [selectionStep, setSelectionStep] = useState<'start' | 'end' | 'adjust'>('start')
  const [tempStart, setTempStart] = useState<string | null>(null)
  const prevSelectionRef = useRef<string[]>([])

  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    const previousSelection = prevSelectionRef.current
    
    // Find newly added tooth
    const addedTeeth = currentSelection.filter(t => !previousSelection.includes(t))
    
    prevSelectionRef.current = currentSelection
    
    if (addedTeeth.length === 0) return
    
    const clickedTooth = addedTeeth[0]
    
    if (selectionStep === 'start') {
      setTempStart(clickedTooth)
      setSelectionStep('end')
    } else if (selectionStep === 'end' && tempStart) {
      // Validate same quadrant
      const startQuad = Math.floor(parseInt(tempStart) / 10)
      const endQuad = Math.floor(parseInt(clickedTooth) / 10)
      
      if (startQuad === endQuad) {
        onRangeSelect(tempStart, clickedTooth)
        setSelectionStep('adjust')
      } else {
        // Different quadrant - reset and start over
        setTempStart(clickedTooth)
        setSelectionStep('end')
      }
    } else if (selectionStep === 'adjust') {
      // In adjust mode, toggle between abutment and pontic
      if (bridgeData.abutments.includes(clickedTooth) || bridgeData.pontics.includes(clickedTooth)) {
        onToggleAbutment(clickedTooth)
      }
    }
  }, [selectionStep, tempStart, onRangeSelect, onToggleAbutment, bridgeData])

  const resetSelection = () => {
    setTempStart(null)
    setSelectionStep('start')
    prevSelectionRef.current = []
    // Reset bridge data would need to be handled by parent
  }

  const getInstructionText = () => {
    switch (selectionStep) {
      case 'start':
        return 'Tap the FIRST tooth of the bridge span'
      case 'end':
        return `Start: ${tempStart} → Now tap the LAST tooth`
      case 'adjust':
        return 'Tap teeth to toggle Abutment ↔ Pontic'
    }
  }

  return (
    <div className="space-y-6">
      {/* Bridge Type Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Bridge Type</h3>
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

      {/* Range Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Select Bridge Span</h3>
          {(tempStart || bridgeData.units > 0) && (
            <button 
              onClick={resetSelection}
              className="text-xs text-primary flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        
        <p className="text-xs text-white/50 mb-4">{getInstructionText()}</p>

        {/* Dental Chart using react-odontogram */}
        <div className="rounded-2xl p-4 overflow-hidden">
          <div className="odontogram-bridge-wrapper">
            <Odontogram 
              onChange={handleOdontogramChange}
              className="w-full"
              theme="dark"
              colors={{
                selected: '#5ebbbd',
                hover: '#4a7096',
                default: '#3d5a7a',
                stroke: '#5a7a9a',
              }}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-white/60">Abutment (A)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span className="text-white/60">Pontic (P)</span>
        </div>
      </div>

      {/* Summary */}
      {bridgeData.units > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-primary">
              {bridgeData.units}-Unit Bridge
            </p>
            <p className="text-xs text-white/50">
              {bridgeData.startTooth} <ArrowRight className="w-3 h-3 inline" /> {bridgeData.endTooth}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-primary/20 rounded-lg p-2">
              <span className="text-white/50">Abutments:</span>
              <p className="font-medium text-primary">{bridgeData.abutments.join(', ')}</p>
            </div>
            {bridgeData.pontics.length > 0 && (
              <div className="bg-amber-500/20 rounded-lg p-2">
                <span className="text-white/50">Pontics:</span>
                <p className="font-medium text-amber-400">{bridgeData.pontics.join(', ')}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <style>{`
        .odontogram-bridge-wrapper svg {
          width: 100%;
          height: auto;
        }
        
        .odontogram-bridge-wrapper .Odontogram__tooltip,
        .odontogram-bridge-wrapper [class*="tooltip"] {
          display: none !important;
        }
        
        .odontogram-bridge-wrapper svg path {
          fill: #3d5a7a;
          stroke: #5a7a9a;
          stroke-width: 1;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .odontogram-bridge-wrapper svg path:hover {
          fill: #4a7096;
        }
        
        .odontogram-bridge-wrapper svg [aria-selected="true"] path,
        .odontogram-bridge-wrapper svg g[aria-selected="true"] path {
          fill: #5ebbbd !important;
          stroke: #7dd3d5 !important;
        }
        
        .odontogram-bridge-wrapper svg text {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
