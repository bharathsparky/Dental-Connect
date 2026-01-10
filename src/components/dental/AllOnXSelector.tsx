import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AllOnXData, AllOnXType, DentureArch, HybridMaterial } from "@/stores/orderStore"

interface AllOnXSelectorProps {
  allOnXData: AllOnXData
  onAllOnXDataChange: (data: Partial<AllOnXData>) => void
}

const ALLONX_TYPES = [
  { id: 'all_on_4', label: 'All-on-4', description: '4 implants, tilted posteriors', implants: 4 },
  { id: 'all_on_6', label: 'All-on-6', description: '6 implants, more stability', implants: 6 },
  { id: 'zygomatic', label: 'Zygomatic', description: 'Zygomatic implants for severe resorption', implants: 4 },
]

const STAGES = [
  { id: 'conversion', label: 'Conversion Prosthesis', description: 'Convert denture to fixed provisional' },
  { id: 'immediate_load', label: 'Immediate Load', description: 'Same-day provisional loading' },
  { id: 'final', label: 'Final Prosthesis', description: 'Definitive hybrid restoration' },
]

const MATERIALS = [
  { id: 'pmma', label: 'PMMA', description: 'Provisional, economical' },
  { id: 'zirconia', label: 'Zirconia Hybrid', description: 'Premium, monolithic strength' },
  { id: 'titanium_acrylic', label: 'Titanium + Acrylic', description: 'Ti bar with acrylic teeth' },
  { id: 'peek', label: 'PEEK Framework', description: 'Lightweight, shock-absorbing' },
]

const IMPLANT_SYSTEMS = [
  'Straumann', 'Nobel Biocare', 'Zimmer Biomet', 'MegaGen', 'Osstem', 'Neodent', 'Other'
]

interface ToothSelection {
  id: string
  notations: { fdi: string; universal: string; palmer: string }
  type: string
}

export function AllOnXSelector({ allOnXData, onAllOnXDataChange }: AllOnXSelectorProps) {
  const prevRef = useRef<string[]>(allOnXData.implantPositions || [])

  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    onAllOnXDataChange({ implantPositions: currentSelection })
    prevRef.current = currentSelection
  }, [onAllOnXDataChange])

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/30 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-primary" />
          <p className="font-medium text-white">Full Arch Implant Prosthesis</p>
        </div>
        <p className="text-xs text-white/60">
          Fixed full-arch restoration on 4-6 implants. Combines the stability of implants with the aesthetics of a full arch.
        </p>
      </div>

      {/* Arch Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Select Arch</h3>
        <div className="grid grid-cols-2 gap-3">
          {(['upper', 'lower'] as DentureArch[]).map((arch) => (
            <button
              key={arch}
              onClick={() => onAllOnXDataChange({ arch, implantPositions: [] })}
              className={cn(
                "p-4 rounded-xl border transition-all text-center",
                allOnXData.arch === arch ? "bg-selected border-primary/50" : "bg-card border-border/50 hover:border-white/20"
              )}
            >
              <p className={cn("font-medium text-sm capitalize", allOnXData.arch === arch ? "text-primary" : "text-white")}>
                {arch} Arch
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Type Selection */}
      {allOnXData.arch && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-medium text-white mb-3">Implant Configuration</h3>
          <div className="space-y-2">
            {ALLONX_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => onAllOnXDataChange({ type: type.id as AllOnXType })}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                  allOnXData.type === type.id ? "bg-selected border-primary/50" : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn("font-medium text-sm", allOnXData.type === type.id ? "text-primary" : "text-white")}>
                    {type.label}
                  </p>
                  <p className="text-[10px] text-white/50">{type.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded">{type.implants} implants</span>
                  {allOnXData.type === type.id && <Check className="w-4 h-4 text-primary" />}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stage Selection */}
      {allOnXData.type && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-medium text-white mb-3">Prosthesis Stage</h3>
          <div className="space-y-2">
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => onAllOnXDataChange({ stage: stage.id as 'conversion' | 'immediate_load' | 'final' })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  allOnXData.stage === stage.id ? "bg-selected border-primary/50" : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn("font-medium text-sm", allOnXData.stage === stage.id ? "text-primary" : "text-white")}>
                    {stage.label}
                  </p>
                  <p className="text-[10px] text-white/50">{stage.description}</p>
                </div>
                {allOnXData.stage === stage.id && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Implant Positions */}
      {allOnXData.stage && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-medium text-white mb-1">Implant Positions</h3>
          <p className="text-xs text-white/50 mb-4">Select implant sites</p>
          <div className="rounded-2xl p-4 overflow-hidden odontogram-allonx-wrapper">
            <Odontogram 
              onChange={handleOdontogramChange}
              className="w-full"
              theme="dark"
              colors={{ selected: '#5ebbbd', hover: '#4a7096', default: '#3d5a7a', stroke: '#5a7a9a' }}
            />
          </div>
        </motion.div>
      )}

      {/* Material & System */}
      {allOnXData.implantPositions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Material</h3>
            <div className="grid grid-cols-2 gap-2">
              {MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => onAllOnXDataChange({ material: mat.id as HybridMaterial })}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-left",
                    allOnXData.material === mat.id ? "bg-selected border-primary/50" : "bg-card border-border/50 hover:border-white/20"
                  )}
                >
                  <p className={cn("font-medium text-xs", allOnXData.material === mat.id ? "text-primary" : "text-white")}>
                    {mat.label}
                  </p>
                  <p className="text-[9px] text-white/50">{mat.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-white/60 mb-2">Implant System</p>
            <select
              value={allOnXData.implantSystem || ''}
              onChange={(e) => onAllOnXDataChange({ implantSystem: e.target.value })}
              className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white"
            >
              <option value="">Select...</option>
              {IMPLANT_SYSTEMS.map((sys) => <option key={sys} value={sys}>{sys}</option>)}
            </select>
          </div>

          {/* Multi-Unit & Ti-Bar */}
          <div className="space-y-2">
            {[
              { key: 'hasMultiUnitAbutments', label: 'Multi-Unit Abutments', desc: 'Angled abutments for parallelism' },
              { key: 'tiBarIncluded', label: 'Ti-Bar Framework', desc: 'Titanium bar for strength' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => onAllOnXDataChange({ [opt.key]: !allOnXData[opt.key as keyof AllOnXData] })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                  allOnXData[opt.key as keyof AllOnXData] ? "bg-selected border-primary/50" : "bg-card border-border/50"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center",
                  allOnXData[opt.key as keyof AllOnXData] ? "bg-primary border-primary" : "border-white/30"
                )}>
                  {allOnXData[opt.key as keyof AllOnXData] && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn("font-medium text-sm", allOnXData[opt.key as keyof AllOnXData] ? "text-primary" : "text-white")}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-white/50">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {allOnXData.material && allOnXData.implantSystem && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-2">
            {ALLONX_TYPES.find(t => t.id === allOnXData.type)?.label} - {allOnXData.arch?.charAt(0).toUpperCase()}{allOnXData.arch?.slice(1)}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div><span className="text-white/50">Stage:</span> <span className="text-white ml-1">{allOnXData.stage?.replace('_', ' ')}</span></div>
            <div><span className="text-white/50">Material:</span> <span className="text-white ml-1">{allOnXData.material?.toUpperCase()}</span></div>
            <div><span className="text-white/50">System:</span> <span className="text-white ml-1">{allOnXData.implantSystem}</span></div>
            <div><span className="text-white/50">Implants:</span> <span className="text-white ml-1">{allOnXData.implantPositions.length}</span></div>
          </div>
        </motion.div>
      )}

      <style>{`
        .odontogram-allonx-wrapper svg { width: 100%; height: auto; }
        .odontogram-allonx-wrapper svg path { fill: #3d5a7a; stroke: #5a7a9a; stroke-width: 1; transition: all 0.2s; cursor: pointer; }
        .odontogram-allonx-wrapper svg [aria-selected="true"] path { fill: #5ebbbd !important; stroke: #7dd3d5 !important; }
        .odontogram-allonx-wrapper svg text { display: none !important; }
        select option { background: #1a2a3a; color: white; }
      `}</style>
    </div>
  )
}
