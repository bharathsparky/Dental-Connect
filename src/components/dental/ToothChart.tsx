import { Odontogram } from "react-odontogram"
import { useRef, useCallback } from "react"

interface ToothChartProps {
  selectedTeeth: string[]
  onToothClick: (tooth: string) => void
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

export function ToothChart({ selectedTeeth, onToothClick }: ToothChartProps) {
  const prevSelectionRef = useRef<string[]>(selectedTeeth)

  const handleChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    const previousSelection = prevSelectionRef.current
    
    const addedTeeth = currentSelection.filter(t => !previousSelection.includes(t))
    const removedTeeth = previousSelection.filter(t => !currentSelection.includes(t))
    
    prevSelectionRef.current = currentSelection
    
    addedTeeth.forEach(tooth => onToothClick(tooth))
    removedTeeth.forEach(tooth => onToothClick(tooth))
  }, [onToothClick])

  return (
    <div className="space-y-4">
      {/* Selected teeth summary */}
      {selectedTeeth.length > 0 && (
        <div className="p-4 bg-selected rounded-xl border border-primary/30">
          <p className="text-sm text-primary font-medium">
            {selectedTeeth.length} {selectedTeeth.length === 1 ? 'tooth' : 'teeth'} selected
          </p>
          <p className="text-xs text-white/50 mt-1">{selectedTeeth.sort().join(', ')}</p>
        </div>
      )}
      
      {/* Dental Chart */}
      <div className="rounded-2xl p-4 overflow-hidden">
        <p className="text-center text-sm font-semibold text-white/80 mb-3">Select Teeth</p>
        
        <div className="odontogram-wrapper">
          <Odontogram 
            onChange={handleChange}
            className="w-full"
            theme="dark"
            colors={{
              default: { fill: '#3d5a7a', stroke: '#5a7a9a' },
              selected: { fill: '#5ebbbd', stroke: '#4aa8aa' },
              hover: { fill: '#4a7096', stroke: '#5a7a9a' }
            }}
          />
        </div>
        
        <p className="text-center text-xs text-white/40 mt-3">
          Tap to select
        </p>
      </div>

      <style>{`
        .odontogram-wrapper svg {
          width: 100%;
          height: auto;
        }
        
        /* Hide tooltip */
        .odontogram-wrapper .Odontogram__tooltip,
        .odontogram-wrapper [class*="tooltip"] {
          display: none !important;
        }
        
        /* Style teeth */
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
        
        /* Selected teeth */
        .odontogram-wrapper svg [aria-selected="true"] path,
        .odontogram-wrapper svg g[aria-selected="true"] path {
          fill: #5ebbbd !important;
          stroke: #4aa8aa !important;
        }
        
        /* Hide text labels inside teeth */
        .odontogram-wrapper svg text {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
