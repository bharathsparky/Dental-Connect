import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, Crosshair, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SurgicalGuideData, GuideType, SurgeryType } from "@/stores/orderStore"

interface SurgicalGuideSelectorProps {
  surgicalGuideData: SurgicalGuideData
  onSurgicalGuideDataChange: (data: Partial<SurgicalGuideData>) => void
}

const GUIDE_TYPES = [
  { id: 'tooth_supported', label: 'Tooth Supported', description: 'Rests on adjacent teeth' },
  { id: 'mucosa_supported', label: 'Mucosa Supported', description: 'Rests on soft tissue' },
  { id: 'bone_supported', label: 'Bone Supported', description: 'Fixated to bone with pins' },
]

const SURGERY_TYPES = [
  { id: 'pilot_drill', label: 'Pilot Drill Only', description: 'Initial osteotomy guidance' },
  { id: 'fully_guided', label: 'Fully Guided', description: 'All drills + implant placement' },
  { id: 'stackable', label: 'Stackable Guide', description: 'Progressive sleeve system' },
]

const IMPLANT_SYSTEMS = [
  'Straumann', 'Nobel Biocare', 'Zimmer Biomet', 'MegaGen', 'Osstem', 
  'Neodent', 'BioHorizons', 'Dentsply Sirona', 'Other'
]

const SLEEVE_SIZES = ['2.0mm', '2.8mm', '3.4mm', '4.1mm', '4.8mm', '5.0mm', '5.5mm']

interface ToothSelection {
  id: string
  notations: { fdi: string; universal: string; palmer: string }
  type: string
}

export function SurgicalGuideSelector({ surgicalGuideData, onSurgicalGuideDataChange }: SurgicalGuideSelectorProps) {
  const prevRef = useRef<string[]>(surgicalGuideData.implantPositions || [])

  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    onSurgicalGuideDataChange({ implantPositions: currentSelection })
    prevRef.current = currentSelection
  }, [onSurgicalGuideDataChange])

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl flex gap-3">
        <Crosshair className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-white text-sm">Surgical Guide</p>
          <p className="text-xs text-white/60 mt-1">
            For precise implant placement. Requires CBCT scan and digital impression.
          </p>
        </div>
      </div>

      {/* Required Records */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Digital Records Available</h3>
        <div className="space-y-2">
          {[
            { key: 'hasCBCT', label: 'CBCT Scan', desc: 'Required for implant planning', required: true },
            { key: 'hasDigitalScan', label: 'Digital Intraoral Scan', desc: 'For accurate guide fabrication', required: true },
          ].map((record) => (
            <button
              key={record.key}
              onClick={() => onSurgicalGuideDataChange({ [record.key]: !surgicalGuideData[record.key as keyof SurgicalGuideData] })}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                surgicalGuideData[record.key as keyof SurgicalGuideData]
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                surgicalGuideData[record.key as keyof SurgicalGuideData] ? "bg-primary border-primary" : "border-white/30"
              )}>
                {surgicalGuideData[record.key as keyof SurgicalGuideData] && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "font-medium text-sm",
                  surgicalGuideData[record.key as keyof SurgicalGuideData] ? "text-primary" : "text-white"
                )}>
                  {record.label} {record.required && <span className="text-red-400">*</span>}
                </p>
                <p className="text-[10px] text-white/50">{record.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {(!surgicalGuideData.hasCBCT || !surgicalGuideData.hasDigitalScan) && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/60">
              <span className="text-red-400 font-medium">Both CBCT and digital scan required</span> for surgical guide fabrication.
            </p>
          </div>
        )}
      </div>

      {/* Guide Type */}
      {surgicalGuideData.hasCBCT && surgicalGuideData.hasDigitalScan && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-medium text-white mb-3">Guide Type</h3>
          <div className="space-y-2">
            {GUIDE_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => onSurgicalGuideDataChange({ guideType: type.id as GuideType })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  surgicalGuideData.guideType === type.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn("font-medium text-sm", surgicalGuideData.guideType === type.id ? "text-primary" : "text-white")}>
                    {type.label}
                  </p>
                  <p className="text-[10px] text-white/50">{type.description}</p>
                </div>
                {surgicalGuideData.guideType === type.id && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Surgery Type */}
      {surgicalGuideData.guideType && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-medium text-white mb-3">Surgery Type</h3>
          <div className="space-y-2">
            {SURGERY_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => onSurgicalGuideDataChange({ surgeryType: type.id as SurgeryType })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  surgicalGuideData.surgeryType === type.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn("font-medium text-sm", surgicalGuideData.surgeryType === type.id ? "text-primary" : "text-white")}>
                    {type.label}
                  </p>
                  <p className="text-[10px] text-white/50">{type.description}</p>
                </div>
                {surgicalGuideData.surgeryType === type.id && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Implant Positions */}
      {surgicalGuideData.surgeryType && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-medium text-white mb-1">Implant Positions</h3>
          <p className="text-xs text-white/50 mb-4">Select planned implant sites</p>
          <div className="rounded-2xl p-4 overflow-hidden odontogram-guide-wrapper">
            <Odontogram 
              onChange={handleOdontogramChange}
              className="w-full"
              theme="dark"
              colors={{ selected: '#5ebbbd', hover: '#4a7096', default: '#3d5a7a', stroke: '#5a7a9a' }}
            />
          </div>
          {surgicalGuideData.implantPositions.length > 0 && (
            <div className="mt-3 p-3 bg-primary/10 rounded-xl border border-primary/30">
              <p className="text-xs text-primary font-medium">{surgicalGuideData.implantPositions.length} implant site(s)</p>
              <p className="text-xs text-white/50">{surgicalGuideData.implantPositions.sort().join(', ')}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Implant System & Sleeve */}
      {surgicalGuideData.implantPositions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/60 mb-2">Implant System</p>
            <select
              value={surgicalGuideData.implantSystem || ''}
              onChange={(e) => onSurgicalGuideDataChange({ implantSystem: e.target.value })}
              className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white"
            >
              <option value="">Select...</option>
              {IMPLANT_SYSTEMS.map((sys) => <option key={sys} value={sys}>{sys}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-2">Sleeve Size</p>
            <select
              value={surgicalGuideData.sleeveSize || ''}
              onChange={(e) => onSurgicalGuideDataChange({ sleeveSize: e.target.value })}
              className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white"
            >
              <option value="">Select...</option>
              {SLEEVE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {surgicalGuideData.implantSystem && surgicalGuideData.sleeveSize && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-2">Surgical Guide</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div><span className="text-white/50">Type:</span> <span className="text-white ml-1">{surgicalGuideData.guideType?.replace('_', ' ')}</span></div>
            <div><span className="text-white/50">Surgery:</span> <span className="text-white ml-1">{surgicalGuideData.surgeryType?.replace('_', ' ')}</span></div>
            <div><span className="text-white/50">System:</span> <span className="text-white ml-1">{surgicalGuideData.implantSystem}</span></div>
            <div><span className="text-white/50">Sleeve:</span> <span className="text-white ml-1">{surgicalGuideData.sleeveSize}</span></div>
            <div className="col-span-2"><span className="text-white/50">Positions:</span> <span className="text-white ml-1">{surgicalGuideData.implantPositions.join(', ')}</span></div>
          </div>
        </motion.div>
      )}

      <style>{`
        .odontogram-guide-wrapper svg { width: 100%; height: auto; }
        .odontogram-guide-wrapper svg path { fill: #3d5a7a; stroke: #5a7a9a; stroke-width: 1; transition: all 0.2s; cursor: pointer; }
        .odontogram-guide-wrapper svg path:hover { fill: #4a7096; }
        .odontogram-guide-wrapper svg [aria-selected="true"] path { fill: #5ebbbd !important; stroke: #7dd3d5 !important; }
        .odontogram-guide-wrapper svg text { display: none !important; }
        select option { background: #1a2a3a; color: white; }
      `}</style>
    </div>
  )
}
