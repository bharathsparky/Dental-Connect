import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, Sparkles, Shield, Eye, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import type { 
  BleachingTrayData, SportsGuardData, ClearAlignerData, ProvisionalData,
  DentureArch, SportLevel
} from "@/stores/orderStore"

// ============ BLEACHING TRAY SELECTOR ============
interface BleachingTraySelectorProps {
  bleachingTrayData: BleachingTrayData
  onBleachingTrayDataChange: (data: Partial<BleachingTrayData>) => void
}

export function BleachingTraySelector({ bleachingTrayData, onBleachingTrayDataChange }: BleachingTraySelectorProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <p className="font-medium text-white">Bleaching/Whitening Tray</p>
        </div>
        <p className="text-xs text-white/60">Custom-fitted tray for at-home whitening treatment.</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-white mb-3">Select Arch</h3>
        <div className="space-y-2">
          {[
            { id: 'upper', label: 'Upper Arch Only' },
            { id: 'lower', label: 'Lower Arch Only' },
            { id: 'both', label: 'Both Arches' },
          ].map((arch) => (
            <button
              key={arch.id}
              onClick={() => onBleachingTrayDataChange({ arch: arch.id as DentureArch })}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                bleachingTrayData.arch === arch.id ? "bg-selected border-primary/50" : "bg-card border-border/50"
              )}
            >
              <p className={cn("font-medium text-sm", bleachingTrayData.arch === arch.id ? "text-primary" : "text-white")}>
                {arch.label}
              </p>
              {bleachingTrayData.arch === arch.id && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {bleachingTrayData.arch && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-medium text-white mb-3">Tray Options</h3>
          <div className="space-y-2">
            {[
              { key: 'reservoirIncluded', label: 'Include Reservoirs', desc: 'Space for bleaching gel' },
              { key: 'scalloped', label: 'Scalloped Design', desc: 'Follows gingival margin' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => onBleachingTrayDataChange({ [opt.key]: !bleachingTrayData[opt.key as keyof BleachingTrayData] })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                  bleachingTrayData[opt.key as keyof BleachingTrayData] ? "bg-selected border-primary/50" : "bg-card border-border/50"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center",
                  bleachingTrayData[opt.key as keyof BleachingTrayData] ? "bg-primary border-primary" : "border-white/30"
                )}>
                  {bleachingTrayData[opt.key as keyof BleachingTrayData] && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn("font-medium text-sm", bleachingTrayData[opt.key as keyof BleachingTrayData] ? "text-primary" : "text-white")}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-white/50">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {bleachingTrayData.arch && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-sm font-medium text-white mb-3">Thickness</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'thin', label: 'Thin', desc: '0.5mm' },
              { id: 'medium', label: 'Medium', desc: '1.0mm' },
              { id: 'thick', label: 'Thick', desc: '1.5mm' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onBleachingTrayDataChange({ thickness: t.id as 'thin' | 'medium' | 'thick' })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-center",
                  bleachingTrayData.thickness === t.id ? "bg-selected border-primary/50" : "bg-card border-border/50"
                )}
              >
                <p className={cn("font-medium text-sm", bleachingTrayData.thickness === t.id ? "text-primary" : "text-white")}>{t.label}</p>
                <p className="text-[9px] text-white/50">{t.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {bleachingTrayData.arch && bleachingTrayData.thickness && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-selected rounded-xl border border-primary/30">
          <p className="text-sm font-medium text-primary mb-1">Bleaching Tray</p>
          <p className="text-xs text-white/60">
            {bleachingTrayData.arch === 'both' ? 'Both Arches' : `${bleachingTrayData.arch} Arch`} • 
            {bleachingTrayData.thickness} • 
            {bleachingTrayData.reservoirIncluded ? 'With reservoirs' : 'No reservoirs'} • 
            {bleachingTrayData.scalloped ? 'Scalloped' : 'Straight edge'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

// ============ SPORTS GUARD SELECTOR ============
interface SportsGuardSelectorProps {
  sportsGuardData: SportsGuardData
  onSportsGuardDataChange: (data: Partial<SportsGuardData>) => void
}

const SPORT_LEVELS = [
  { id: 'low_risk', label: 'Low Risk', examples: 'Tennis, golf, running', color: 'bg-green-500/20 text-green-400' },
  { id: 'medium_risk', label: 'Medium Risk', examples: 'Basketball, soccer, baseball', color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'high_risk', label: 'High Risk', examples: 'Boxing, MMA, hockey, football', color: 'bg-red-500/20 text-red-400' },
]

const GUARD_COLORS = ['Clear', 'White', 'Black', 'Blue', 'Red', 'Green', 'Custom Team Color']

export function SportsGuardSelector({ sportsGuardData, onSportsGuardDataChange }: SportsGuardSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <p className="font-medium text-white">Sports/Mouth Guard</p>
        </div>
        <p className="text-xs text-white/60">Custom athletic mouthguard for dental protection during sports.</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-white mb-3">Sport Risk Level</h3>
        <div className="space-y-2">
          {SPORT_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => onSportsGuardDataChange({ sportLevel: level.id as SportLevel })}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all",
                sportsGuardData.sportLevel === level.id ? "bg-selected border-primary/50" : "bg-card border-border/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded", level.color)}>{level.label}</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1">{level.examples}</p>
                </div>
                {sportsGuardData.sportLevel === level.id && <Check className="w-4 h-4 text-primary" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {sportsGuardData.sportLevel && (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs text-white/60 mb-2">Specific Sport (optional)</p>
            <input
              type="text"
              value={sportsGuardData.sportType || ''}
              onChange={(e) => onSportsGuardDataChange({ sportType: e.target.value })}
              placeholder="e.g., Boxing, Football..."
              className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white placeholder:text-white/30"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-medium text-white mb-3">Thickness</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standard', label: 'Standard', desc: '3mm' },
                { id: 'heavy', label: 'Heavy', desc: '4mm' },
                { id: 'extra_heavy', label: 'Extra Heavy', desc: '5mm+' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSportsGuardDataChange({ thickness: t.id as 'standard' | 'heavy' | 'extra_heavy' })}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-center",
                    sportsGuardData.thickness === t.id ? "bg-selected border-primary/50" : "bg-card border-border/50"
                  )}
                >
                  <p className={cn("font-medium text-sm", sportsGuardData.thickness === t.id ? "text-primary" : "text-white")}>{t.label}</p>
                  <p className="text-[9px] text-white/50">{t.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs text-white/60 mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {GUARD_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onSportsGuardDataChange({ color })}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    sportsGuardData.color === color ? "bg-primary text-primary-foreground" : "bg-white/5 text-white/60 border border-white/10"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {sportsGuardData.sportLevel && sportsGuardData.thickness && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-selected rounded-xl border border-primary/30">
          <p className="text-sm font-medium text-primary mb-1">Sports Guard</p>
          <p className="text-xs text-white/60">
            {sportsGuardData.sportLevel?.replace('_', ' ')} • 
            {sportsGuardData.thickness} • 
            {sportsGuardData.color || 'Clear'} • 
            {sportsGuardData.sportType || 'General use'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

// ============ CLEAR ALIGNER SELECTOR ============
interface ClearAlignerSelectorProps {
  clearAlignerData: ClearAlignerData
  onClearAlignerDataChange: (data: Partial<ClearAlignerData>) => void
}

const ALIGNER_STAGES = [
  { id: 'records', label: 'Initial Records', desc: 'Scans & photos for treatment planning' },
  { id: 'refinement', label: 'Refinement', desc: 'Mid-treatment adjustment aligners' },
  { id: 'retainer', label: 'Retainer Phase', desc: 'Post-treatment retention aligners' },
]

export function ClearAlignerSelector({ clearAlignerData, onClearAlignerDataChange }: ClearAlignerSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          <p className="font-medium text-white">Clear Aligners</p>
        </div>
        <p className="text-xs text-white/60">Orthodontic treatment with clear, removable aligners.</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-white mb-3">Treatment Stage</h3>
        <div className="space-y-2">
          {ALIGNER_STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => onClearAlignerDataChange({ stage: stage.id as 'records' | 'refinement' | 'retainer' })}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between",
                clearAlignerData.stage === stage.id ? "bg-selected border-primary/50" : "bg-card border-border/50"
              )}
            >
              <div>
                <p className={cn("font-medium text-sm", clearAlignerData.stage === stage.id ? "text-primary" : "text-white")}>{stage.label}</p>
                <p className="text-[10px] text-white/50">{stage.desc}</p>
              </div>
              {clearAlignerData.stage === stage.id && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {clearAlignerData.stage && (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-medium text-white mb-3">Records Available</h3>
            <div className="space-y-2">
              {[
                { key: 'hasDigitalScan', label: 'Digital Intraoral Scan', desc: 'STL files' },
                { key: 'hasPhotos', label: 'Intraoral & Extraoral Photos', desc: 'For smile analysis' },
                { key: 'hasCBCT', label: 'CBCT Scan', desc: 'For complex cases' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onClearAlignerDataChange({ [opt.key]: !clearAlignerData[opt.key as keyof ClearAlignerData] })}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                    clearAlignerData[opt.key as keyof ClearAlignerData] ? "bg-selected border-primary/50" : "bg-card border-border/50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center",
                    clearAlignerData[opt.key as keyof ClearAlignerData] ? "bg-primary border-primary" : "border-white/30"
                  )}>
                    {clearAlignerData[opt.key as keyof ClearAlignerData] && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className={cn("font-medium text-sm", clearAlignerData[opt.key as keyof ClearAlignerData] ? "text-primary" : "text-white")}>{opt.label}</p>
                    <p className="text-[10px] text-white/50">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {clearAlignerData.stage !== 'records' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/60 mb-2">Current Aligner #</p>
                <input
                  type="text"
                  value={clearAlignerData.alignerNumber || ''}
                  onChange={(e) => onClearAlignerDataChange({ alignerNumber: e.target.value })}
                  placeholder="e.g., 12"
                  className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white"
                />
              </div>
              <div>
                <p className="text-xs text-white/60 mb-2">Total Aligners</p>
                <input
                  type="text"
                  value={clearAlignerData.totalAligners || ''}
                  onChange={(e) => onClearAlignerDataChange({ totalAligners: e.target.value })}
                  placeholder="e.g., 24"
                  className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white"
                />
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-medium text-white mb-3">Treatment Options</h3>
            <div className="space-y-2">
              {[
                { key: 'ipr', label: 'IPR Required', desc: 'Interproximal reduction' },
                { key: 'attachments', label: 'Attachments Needed', desc: 'Composite buttons' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onClearAlignerDataChange({ [opt.key]: !clearAlignerData[opt.key as keyof ClearAlignerData] })}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                    clearAlignerData[opt.key as keyof ClearAlignerData] ? "bg-selected border-primary/50" : "bg-card border-border/50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center",
                    clearAlignerData[opt.key as keyof ClearAlignerData] ? "bg-primary border-primary" : "border-white/30"
                  )}>
                    {clearAlignerData[opt.key as keyof ClearAlignerData] && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className={cn("font-medium text-sm", clearAlignerData[opt.key as keyof ClearAlignerData] ? "text-primary" : "text-white")}>{opt.label}</p>
                    <p className="text-[10px] text-white/50">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {clearAlignerData.stage && clearAlignerData.hasDigitalScan && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-selected rounded-xl border border-primary/30">
          <p className="text-sm font-medium text-primary mb-1">Clear Aligners - {ALIGNER_STAGES.find(s => s.id === clearAlignerData.stage)?.label}</p>
          <p className="text-xs text-white/60">
            {clearAlignerData.alignerNumber && `Aligner ${clearAlignerData.alignerNumber}/${clearAlignerData.totalAligners || '?'} • `}
            {clearAlignerData.ipr && 'IPR • '}
            {clearAlignerData.attachments && 'Attachments'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

// ============ PROVISIONAL SELECTOR ============
interface ProvisionalSelectorProps {
  provisionalData: ProvisionalData
  onProvisionalDataChange: (data: Partial<ProvisionalData>) => void
}

interface ToothSelection {
  id: string
  notations: { fdi: string; universal: string; palmer: string }
  type: string
}

const PROVISIONAL_TYPES = [
  { id: 'crown', label: 'Crown', desc: 'Single unit temporary' },
  { id: 'bridge', label: 'Bridge', desc: 'Multi-unit temporary span' },
  { id: 'full_arch', label: 'Full Arch', desc: 'Complete arch provisional' },
]

const PROVISIONAL_MATERIALS = [
  { id: 'pmma', label: 'PMMA', desc: 'CAD/CAM milled, durable' },
  { id: 'composite', label: 'Composite', desc: 'Lab-processed composite' },
  { id: 'bis_acrylic', label: 'Bis-Acrylic', desc: 'Chairside temporary' },
]

export function ProvisionalSelector({ provisionalData, onProvisionalDataChange }: ProvisionalSelectorProps) {
  const prevRef = useRef<string[]>(provisionalData.selectedTeeth || [])

  const handleOdontogramChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    onProvisionalDataChange({ selectedTeeth: currentSelection })
    prevRef.current = currentSelection
  }, [onProvisionalDataChange])

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="w-5 h-5 text-amber-400" />
          <p className="font-medium text-white">Provisional/Temporary</p>
        </div>
        <p className="text-xs text-white/60">Long-term temporaries for extended provisional periods.</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-white mb-3">Provisional Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {PROVISIONAL_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onProvisionalDataChange({ type: type.id as 'crown' | 'bridge' | 'full_arch' })}
              className={cn(
                "p-3 rounded-xl border transition-all text-center",
                provisionalData.type === type.id ? "bg-selected border-primary/50" : "bg-card border-border/50"
              )}
            >
              <p className={cn("font-medium text-sm", provisionalData.type === type.id ? "text-primary" : "text-white")}>{type.label}</p>
              <p className="text-[9px] text-white/50">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {provisionalData.type && (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-medium text-white mb-3">Material</h3>
            <div className="space-y-2">
              {PROVISIONAL_MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => onProvisionalDataChange({ material: mat.id as 'pmma' | 'composite' | 'bis_acrylic' })}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                    provisionalData.material === mat.id ? "bg-selected border-primary/50" : "bg-card border-border/50"
                  )}
                >
                  <div>
                    <p className={cn("font-medium text-sm", provisionalData.material === mat.id ? "text-primary" : "text-white")}>{mat.label}</p>
                    <p className="text-[10px] text-white/50">{mat.desc}</p>
                  </div>
                  {provisionalData.material === mat.id && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-medium text-white mb-3">Duration</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'short_term', label: 'Short Term', desc: '< 3 months' },
                { id: 'long_term', label: 'Long Term', desc: '3-12 months' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => onProvisionalDataChange({ duration: d.id as 'short_term' | 'long_term' })}
                  className={cn(
                    "p-4 rounded-xl border transition-all text-center",
                    provisionalData.duration === d.id ? "bg-selected border-primary/50" : "bg-card border-border/50"
                  )}
                >
                  <p className={cn("font-medium text-sm", provisionalData.duration === d.id ? "text-primary" : "text-white")}>{d.label}</p>
                  <p className="text-[10px] text-white/50">{d.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-medium text-white mb-1">Select Teeth</h3>
            <p className="text-xs text-white/50 mb-4">Tap on teeth for provisional</p>
            <div className="rounded-2xl p-4 overflow-hidden odontogram-provisional-wrapper">
              <Odontogram 
                onChange={handleOdontogramChange}
                className="w-full"
                theme="dark"
                colors={{ selected: '#5ebbbd', hover: '#4a7096', default: '#3d5a7a', stroke: '#5a7a9a' }}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            {[
              { key: 'needsCustomStaining', label: 'Custom Staining', desc: 'Match natural tooth characterization' },
              { key: 'hasDigitalDesign', label: 'From Digital Design', desc: 'Based on wax-up or smile design' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => onProvisionalDataChange({ [opt.key]: !provisionalData[opt.key as keyof ProvisionalData] })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                  provisionalData[opt.key as keyof ProvisionalData] ? "bg-selected border-primary/50" : "bg-card border-border/50"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center",
                  provisionalData[opt.key as keyof ProvisionalData] ? "bg-primary border-primary" : "border-white/30"
                )}>
                  {provisionalData[opt.key as keyof ProvisionalData] && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn("font-medium text-sm", provisionalData[opt.key as keyof ProvisionalData] ? "text-primary" : "text-white")}>{opt.label}</p>
                  <p className="text-[10px] text-white/50">{opt.desc}</p>
                </div>
              </button>
            ))}
          </motion.div>
        </>
      )}

      {provisionalData.type && provisionalData.material && provisionalData.selectedTeeth.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-selected rounded-xl border border-primary/30">
          <p className="text-sm font-medium text-primary mb-1">
            Provisional {provisionalData.type?.charAt(0).toUpperCase()}{provisionalData.type?.slice(1)}
          </p>
          <p className="text-xs text-white/60">
            {provisionalData.material?.toUpperCase()} • 
            {provisionalData.duration?.replace('_', ' ')} • 
            Teeth: {provisionalData.selectedTeeth.sort().join(', ')}
          </p>
        </motion.div>
      )}

      <style>{`
        .odontogram-provisional-wrapper svg { width: 100%; height: auto; }
        .odontogram-provisional-wrapper svg path { fill: #3d5a7a; stroke: #5a7a9a; stroke-width: 1; transition: all 0.2s; cursor: pointer; }
        .odontogram-provisional-wrapper svg [aria-selected="true"] path { fill: #5ebbbd !important; stroke: #7dd3d5 !important; }
        .odontogram-provisional-wrapper svg text { display: none !important; }
      `}</style>
    </div>
  )
}
