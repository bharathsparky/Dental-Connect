import { useState } from "react"
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

// FDI notation teeth layout - displayed as shown from patient's perspective
// Upper Right (Q1): 18-11 from right to left, Upper Left (Q2): 21-28 from left to right
const UPPER_TEETH = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28']
// Lower Left (Q3): 38-31 from left to right, Lower Right (Q4): 41-48 from right to left
const LOWER_TEETH = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']

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
  onToggleAbutment 
}: BridgeSelectorProps) {
  const [selectionStep, setSelectionStep] = useState<'start' | 'end' | 'adjust'>(
    bridgeData.units > 0 ? 'adjust' : 'start'
  )
  const [tempStart, setTempStart] = useState<string | null>(bridgeData.startTooth)

  const handleToothClick = (tooth: string) => {
    if (selectionStep === 'start') {
      setTempStart(tooth)
      setSelectionStep('end')
    } else if (selectionStep === 'end' && tempStart) {
      // Validate same quadrant
      const startQuad = Math.floor(parseInt(tempStart) / 10)
      const endQuad = Math.floor(parseInt(tooth) / 10)
      
      if (startQuad === endQuad) {
        const teethInRange = getTeethInRange(tempStart, tooth)
        if (teethInRange.length >= 3) {
          onRangeSelect(tempStart, tooth)
          setSelectionStep('adjust')
        } else {
          // Not enough teeth for a bridge, reset
          setTempStart(tooth)
        }
      } else {
        // Different quadrant - restart with this tooth
        setTempStart(tooth)
      }
    } else if (selectionStep === 'adjust') {
      // In adjust mode, toggle between abutment and pontic
      const allBridgeTeeth = [...bridgeData.abutments, ...bridgeData.pontics]
      if (allBridgeTeeth.includes(tooth)) {
        onToggleAbutment(tooth)
      }
    }
  }

  const resetSelection = () => {
    setTempStart(null)
    setSelectionStep('start')
    onRangeSelect('', '') // Signal reset
  }

  const isInBridgeRange = (tooth: string) => {
    return bridgeData.abutments.includes(tooth) || bridgeData.pontics.includes(tooth)
  }

  const isAbutment = (tooth: string) => bridgeData.abutments.includes(tooth)
  const isPontic = (tooth: string) => bridgeData.pontics.includes(tooth)
  const isStartSelection = (tooth: string) => tooth === tempStart && selectionStep === 'end'

  const getInstructionText = () => {
    switch (selectionStep) {
      case 'start':
        return 'Tap the FIRST tooth of the bridge span'
      case 'end':
        return `Start: ${tempStart} → Now tap the LAST tooth (min 3)`
      case 'adjust':
        return 'Tap teeth to toggle Abutment ↔ Pontic'
    }
  }

  const renderTooth = (tooth: string, isUpper: boolean) => {
    const inRange = isInBridgeRange(tooth)
    const abutment = isAbutment(tooth)
    const pontic = isPontic(tooth)
    const isStart = isStartSelection(tooth)
    
    return (
      <button
        key={tooth}
        onClick={() => handleToothClick(tooth)}
        className="relative group focus:outline-none flex flex-col items-center"
        title={`Tooth ${tooth}`}
      >
        {/* Tooth number on top for upper, bottom for lower */}
        {isUpper && (
          <span className={cn(
            "text-[8px] font-medium mb-0.5 leading-none",
            inRange ? (abutment ? "text-primary" : "text-amber-400") : isStart ? "text-primary" : "text-white/40"
          )}>
            {tooth}
          </span>
        )}
        
        {/* Tooth shape */}
        <div
          className={cn(
            "w-4 h-5 rounded-sm transition-all duration-200 flex items-center justify-center",
            inRange
              ? abutment 
                ? "bg-primary border border-primary/80"
                : "bg-amber-500 border border-amber-400"
              : isStart
                ? "bg-primary/60 border border-primary"
                : "bg-slate-700 border border-slate-500 group-hover:bg-slate-600"
          )}
        >
          {/* A/P indicator inside tooth */}
          {abutment && (
            <span className="text-[7px] text-white font-bold">A</span>
          )}
          {pontic && (
            <span className="text-[7px] text-white font-bold">P</span>
          )}
        </div>
        
        {/* Tooth number on bottom for lower */}
        {!isUpper && (
          <span className={cn(
            "text-[8px] font-medium mt-0.5 leading-none",
            inRange ? (abutment ? "text-primary" : "text-amber-400") : isStart ? "text-primary" : "text-white/40"
          )}>
            {tooth}
          </span>
        )}
      </button>
    )
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
              onClick={resetSelection}
              className="text-xs text-primary flex items-center gap-1 hover:text-primary/80"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        
        <div className={cn(
          "text-xs mb-3 px-3 py-2 rounded-lg",
          selectionStep === 'adjust' ? "bg-primary/10 text-primary" : "bg-white/5 text-white/60"
        )}>
          {getInstructionText()}
        </div>

        {/* Dental Chart - Compact Layout */}
        <div className="bg-card/50 rounded-xl p-3 border border-border/30 overflow-hidden">
          {/* Upper Arch */}
          <div className="mb-3">
            <p className="text-[9px] text-white/30 uppercase tracking-wider text-center mb-2">Upper</p>
            <div className="flex justify-center gap-px">
              {UPPER_TEETH.slice(0, 8).map((tooth) => renderTooth(tooth, true))}
              <div className="w-2 mx-0.5 border-l border-white/10" />
              {UPPER_TEETH.slice(8).map((tooth) => renderTooth(tooth, true))}
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-dashed border-white/10 my-2" />
          
          {/* Lower Arch */}
          <div>
            <div className="flex justify-center gap-px">
              {LOWER_TEETH.slice(0, 8).map((tooth) => renderTooth(tooth, false))}
              <div className="w-2 mx-0.5 border-l border-white/10" />
              {LOWER_TEETH.slice(8).map((tooth) => renderTooth(tooth, false))}
            </div>
            <p className="text-[9px] text-white/30 uppercase tracking-wider text-center mt-2">Lower</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span className="text-white/50">Abutment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-500" />
            <span className="text-white/50">Pontic</span>
          </div>
        </div>
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
    </div>
  )
}
