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

// FDI notation teeth layout
const UPPER_TEETH = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28']
const LOWER_TEETH = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']

// Tooth type mapping for different shapes
const getToothType = (fdi: string): 'molar' | 'premolar' | 'canine' | 'incisor' => {
  const num = parseInt(fdi) % 10
  if (num >= 6) return 'molar'
  if (num >= 4) return 'premolar'
  if (num === 3) return 'canine'
  return 'incisor'
}

// SVG paths for different tooth types (more realistic shapes)
const TOOTH_PATHS = {
  molar: {
    upper: "M2 2 Q0 4 0 8 L1 22 Q2 26 8 26 L16 26 Q22 26 23 22 L24 8 Q24 4 22 2 Q18 0 12 0 Q6 0 2 2",
    lower: "M2 24 Q0 22 0 18 L1 4 Q2 0 8 0 L16 0 Q22 0 23 4 L24 18 Q24 22 22 24 Q18 26 12 26 Q6 26 2 24"
  },
  premolar: {
    upper: "M3 2 Q1 4 1 8 L2 20 Q3 24 10 24 L14 24 Q21 24 22 20 L23 8 Q23 4 21 2 Q17 0 12 0 Q7 0 3 2",
    lower: "M3 24 Q1 22 1 18 L2 6 Q3 2 10 2 L14 2 Q21 2 22 6 L23 18 Q23 22 21 24 Q17 26 12 26 Q7 26 3 24"
  },
  canine: {
    upper: "M4 2 Q2 4 2 7 L3 18 Q4 24 12 24 Q20 24 21 18 L22 7 Q22 4 20 2 Q16 0 12 0 Q8 0 4 2",
    lower: "M4 24 Q2 22 2 19 L3 8 Q4 2 12 2 Q20 2 21 8 L22 19 Q22 22 20 24 Q16 26 12 26 Q8 26 4 24"
  },
  incisor: {
    upper: "M5 2 Q3 4 3 7 L4 17 Q5 22 12 22 Q19 22 20 17 L21 7 Q21 4 19 2 Q15 0 12 0 Q9 0 5 2",
    lower: "M5 24 Q3 22 3 19 L4 9 Q5 4 12 4 Q19 4 20 9 L21 19 Q21 22 19 24 Q15 26 12 26 Q9 26 5 24"
  }
}

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
      const startQuad = Math.floor(parseInt(tempStart) / 10)
      const endQuad = Math.floor(parseInt(tooth) / 10)
      
      if (startQuad === endQuad) {
        const teethInRange = getTeethInRange(tempStart, tooth)
        if (teethInRange.length >= 3) {
          onRangeSelect(tempStart, tooth)
          setSelectionStep('adjust')
        } else {
          setTempStart(tooth)
        }
      } else {
        setTempStart(tooth)
      }
    } else if (selectionStep === 'adjust') {
      const allBridgeTeeth = [...bridgeData.abutments, ...bridgeData.pontics]
      if (allBridgeTeeth.includes(tooth)) {
        onToggleAbutment(tooth)
      }
    }
  }

  const resetSelection = () => {
    setTempStart(null)
    setSelectionStep('start')
    onRangeSelect('', '')
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
        return 'Tap the FIRST tooth of the bridge'
      case 'end':
        return `${tempStart} selected → Tap the LAST tooth`
      case 'adjust':
        return 'Tap to toggle: Abutment ↔ Pontic'
    }
  }

  const renderTooth = (tooth: string, isUpper: boolean) => {
    const inRange = isInBridgeRange(tooth)
    const abutment = isAbutment(tooth)
    const pontic = isPontic(tooth)
    const isStart = isStartSelection(tooth)
    const toothType = getToothType(tooth)
    const path = TOOTH_PATHS[toothType][isUpper ? 'upper' : 'lower']
    
    // Colors
    const getFillColor = () => {
      if (abutment) return '#5ebbbd' // Primary cyan
      if (pontic) return '#f59e0b' // Amber
      if (isStart) return '#5ebbbd80' // Primary with opacity
      return '#374151' // Default gray
    }
    
    const getStrokeColor = () => {
      if (abutment) return '#3d9a9c'
      if (pontic) return '#d97706'
      if (isStart) return '#5ebbbd'
      return '#4b5563'
    }
    
    return (
      <button
        key={tooth}
        onClick={() => handleToothClick(tooth)}
        className="relative group focus:outline-none flex flex-col items-center"
        title={`Tooth ${tooth}`}
      >
        {/* Tooth number on top for upper */}
        {isUpper && (
          <span className={cn(
            "text-[7px] font-medium mb-0.5 leading-none transition-colors",
            inRange ? (abutment ? "text-primary" : "text-amber-400") : isStart ? "text-primary" : "text-white/30"
          )}>
            {tooth}
          </span>
        )}
        
        {/* Tooth SVG */}
        <svg 
          width="16" 
          height="22" 
          viewBox="0 0 24 26"
          className="transition-all duration-150 group-hover:scale-110"
        >
          <path
            d={path}
            fill={getFillColor()}
            stroke={getStrokeColor()}
            strokeWidth="1"
            className="transition-all duration-150"
          />
          {/* A/P indicator */}
          {(abutment || pontic) && (
            <text
              x="12"
              y="15"
              textAnchor="middle"
              fontSize="8"
              fontWeight="bold"
              fill="white"
            >
              {abutment ? 'A' : 'P'}
            </text>
          )}
        </svg>
        
        {/* Tooth number on bottom for lower */}
        {!isUpper && (
          <span className={cn(
            "text-[7px] font-medium mt-0.5 leading-none transition-colors",
            inRange ? (abutment ? "text-primary" : "text-amber-400") : isStart ? "text-primary" : "text-white/30"
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
          "text-xs mb-3 px-3 py-2 rounded-lg text-center",
          selectionStep === 'adjust' ? "bg-primary/10 text-primary" : "bg-white/5 text-white/60"
        )}>
          {getInstructionText()}
        </div>

        {/* Dental Chart */}
        <div className="bg-card/50 rounded-xl p-3 border border-border/30">
          {/* Upper Arch */}
          <div className="mb-2">
            <div className="flex justify-center items-end gap-0">
              {UPPER_TEETH.slice(0, 8).map((tooth) => renderTooth(tooth, true))}
              <div className="w-1.5 h-6 border-l border-dashed border-white/20 mx-0.5" />
              {UPPER_TEETH.slice(8).map((tooth) => renderTooth(tooth, true))}
            </div>
          </div>
          
          {/* Center line */}
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-[8px] text-white/20">MIDLINE</span>
            <div className="flex-1 border-t border-white/10" />
          </div>
          
          {/* Lower Arch */}
          <div>
            <div className="flex justify-center items-start gap-0">
              {LOWER_TEETH.slice(0, 8).map((tooth) => renderTooth(tooth, false))}
              <div className="w-1.5 h-6 border-l border-dashed border-white/20 mx-0.5" />
              {LOWER_TEETH.slice(8).map((tooth) => renderTooth(tooth, false))}
            </div>
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
