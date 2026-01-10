import { useRef, useCallback } from "react"
import { Odontogram } from "react-odontogram"
import { motion } from "motion/react"
import { Check, AlertCircle, Sparkles, Target, Layers, ClipboardCheck, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FMRData, FMRStage, OVDChange, TreatmentApproach } from "@/stores/orderStore"

interface FullMouthRehabSelectorProps {
  fmrData: FMRData
  onFMRDataChange: (data: Partial<FMRData>) => void
}

const FMR_STAGES = [
  { 
    id: 'diagnostic', 
    label: 'Diagnostic Phase', 
    description: 'Wax-up, mock-up, treatment planning',
    icon: Target,
    color: 'bg-blue-500/20 text-blue-400'
  },
  { 
    id: 'provisionals', 
    label: 'Provisionals', 
    description: 'Temporary restorations at new OVD',
    icon: Layers,
    color: 'bg-amber-500/20 text-amber-400'
  },
  { 
    id: 'trial_bite', 
    label: 'Trial Bite', 
    description: 'Verify OVD and occlusion before final',
    icon: ClipboardCheck,
    color: 'bg-purple-500/20 text-purple-400'
  },
  { 
    id: 'bisque_trial', 
    label: 'Bisque Trial', 
    description: 'Unglazed ceramic try-in for fit & aesthetics',
    icon: Palette,
    color: 'bg-pink-500/20 text-pink-400'
  },
  { 
    id: 'final_upper', 
    label: 'Final Upper Arch', 
    description: 'Upper arch final restorations',
    icon: Sparkles,
    color: 'bg-emerald-500/20 text-emerald-400'
  },
  { 
    id: 'final_lower', 
    label: 'Final Lower Arch', 
    description: 'Lower arch final restorations',
    icon: Sparkles,
    color: 'bg-emerald-500/20 text-emerald-400'
  },
  { 
    id: 'final_both', 
    label: 'Final Both Arches', 
    description: 'Complete final restorations',
    icon: Sparkles,
    color: 'bg-primary/20 text-primary'
  },
]

const OVD_CHANGES = [
  { id: 'maintain', label: 'Maintain Current OVD', description: 'No vertical change needed' },
  { id: 'increase_1_2mm', label: 'Increase 1-2mm', description: 'Mild increase, minimal adaptation' },
  { id: 'increase_2_4mm', label: 'Increase 2-4mm', description: 'Moderate increase, provisional period' },
  { id: 'increase_4plus', label: 'Increase 4mm+', description: 'Significant increase, extended provisionals' },
]

const TREATMENT_APPROACHES = [
  { id: 'segmented', label: 'Segmented', description: 'One quadrant/sextant at a time' },
  { id: 'full_arch', label: 'Full Arch', description: 'Complete arch at once' },
  { id: 'quadrant', label: 'Quadrant-wise', description: 'Upper right → Lower left rotation' },
]

const RESTORATION_TYPES = [
  { id: 'crowns', label: 'Crowns' },
  { id: 'bridges', label: 'Bridges' },
  { id: 'implants', label: 'Implants' },
  { id: 'veneers', label: 'Veneers' },
  { id: 'onlays', label: 'Onlays' },
]

const GUIDEPLANE_OPTIONS = [
  { id: 'anterior', label: 'Anterior Guidance', description: 'Incisors disclude posteriors' },
  { id: 'canine', label: 'Canine Guidance', description: 'Canines disclude in lateral' },
  { id: 'group_function', label: 'Group Function', description: 'Multiple teeth share load' },
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

export function FullMouthRehabSelector({ fmrData, onFMRDataChange }: FullMouthRehabSelectorProps) {
  const prevTeethRef = useRef<string[]>([...(fmrData.upperTeeth || []), ...(fmrData.lowerTeeth || [])])

  const handleTeethChange = useCallback((selections: ToothSelection[]) => {
    const currentSelection = selections.map(s => s.notations.fdi)
    // Split into upper (1x, 2x) and lower (3x, 4x)
    const upperTeeth = currentSelection.filter(t => t.startsWith('1') || t.startsWith('2'))
    const lowerTeeth = currentSelection.filter(t => t.startsWith('3') || t.startsWith('4'))
    onFMRDataChange({ upperTeeth, lowerTeeth })
    prevTeethRef.current = currentSelection
  }, [onFMRDataChange])

  const toggleArchPlan = (arch: 'upper' | 'lower', type: string) => {
    const currentPlan = arch === 'upper' ? fmrData.upperArchPlan : fmrData.lowerArchPlan
    const newPlan = currentPlan.includes(type)
      ? currentPlan.filter(t => t !== type)
      : [...currentPlan, type]
    onFMRDataChange(arch === 'upper' ? { upperArchPlan: newPlan } : { lowerArchPlan: newPlan })
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/30 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <p className="font-medium text-white">Full Mouth Rehabilitation</p>
        </div>
        <p className="text-xs text-white/60">
          Comprehensive restoration of occlusion, function, and aesthetics. 
          This involves careful planning and often multiple phases.
        </p>
      </div>

      {/* Stage Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Current Phase</h3>
        <div className="space-y-2">
          {FMR_STAGES.map((stage) => {
            const Icon = stage.icon
            return (
              <button
                key={stage.id}
                onClick={() => onFMRDataChange({ stage: stage.id as FMRStage })}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  fmrData.stage === stage.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", stage.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "font-medium text-sm",
                        fmrData.stage === stage.id ? "text-primary" : "text-white"
                      )}>
                        {stage.label}
                      </p>
                      {fmrData.stage === stage.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-[10px] text-white/50">{stage.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Trial Bite Stage */}
      {fmrData.stage === 'trial_bite' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <p className="text-sm text-purple-400 font-medium mb-1">Trial Bite Stage</p>
            <p className="text-xs text-white/60">
              Verify OVD and occlusion after provisional period. Lab will fabricate trial bite rims/plates.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-3">Arch for Trial Bite</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'upper', label: 'Upper' },
                { id: 'lower', label: 'Lower' },
                { id: 'both', label: 'Both' },
              ].map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => onFMRDataChange({ trialBiteArch: arch.id as 'upper' | 'lower' | 'both' })}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-center",
                    fmrData.trialBiteArch === arch.id
                      ? "bg-selected border-primary/50"
                      : "bg-card border-border/50 hover:border-white/20"
                  )}
                >
                  <p className={cn(
                    "font-medium text-sm",
                    fmrData.trialBiteArch === arch.id ? "text-primary" : "text-white"
                  )}>
                    {arch.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {fmrData.trialBiteArch && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-medium text-white mb-3">Verification Checklist</h3>
              
              <button
                onClick={() => onFMRDataChange({ trialBiteOVDVerified: !fmrData.trialBiteOVDVerified })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                  fmrData.trialBiteOVDVerified
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                  fmrData.trialBiteOVDVerified ? "bg-primary border-primary" : "border-white/30"
                )}>
                  {fmrData.trialBiteOVDVerified && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn("font-medium text-sm", fmrData.trialBiteOVDVerified ? "text-primary" : "text-white")}>
                    OVD Verified
                  </p>
                  <p className="text-[10px] text-white/50">Vertical dimension confirmed</p>
                </div>
              </button>

              <button
                onClick={() => onFMRDataChange({ trialBiteOcclusionVerified: !fmrData.trialBiteOcclusionVerified })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                  fmrData.trialBiteOcclusionVerified
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                  fmrData.trialBiteOcclusionVerified ? "bg-primary border-primary" : "border-white/30"
                )}>
                  {fmrData.trialBiteOcclusionVerified && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn("font-medium text-sm", fmrData.trialBiteOcclusionVerified ? "text-primary" : "text-white")}>
                    Occlusion Verified
                  </p>
                  <p className="text-[10px] text-white/50">Centric, lateral, protrusive verified</p>
                </div>
              </button>

              <div>
                <p className="text-xs text-white/60 mb-2">Adjustments Needed (if any)</p>
                <textarea
                  value={fmrData.trialBiteAdjustments || ''}
                  onChange={(e) => onFMRDataChange({ trialBiteAdjustments: e.target.value })}
                  placeholder="e.g., Increase OVD by 0.5mm, adjust anterior guidance..."
                  className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none min-h-[80px] resize-none"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Bisque Trial Stage */}
      {fmrData.stage === 'bisque_trial' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
            <p className="text-sm text-pink-400 font-medium mb-1">Bisque Trial Stage</p>
            <p className="text-xs text-white/60">
              Unglazed ceramic try-in for fit, function, and aesthetics before final glazing.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-3">Arch for Bisque Trial</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'upper', label: 'Upper' },
                { id: 'lower', label: 'Lower' },
                { id: 'both', label: 'Both' },
              ].map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => onFMRDataChange({ bisqueTrialArch: arch.id as 'upper' | 'lower' | 'both' })}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-center",
                    fmrData.bisqueTrialArch === arch.id
                      ? "bg-selected border-primary/50"
                      : "bg-card border-border/50 hover:border-white/20"
                  )}
                >
                  <p className={cn(
                    "font-medium text-sm",
                    fmrData.bisqueTrialArch === arch.id ? "text-primary" : "text-white"
                  )}>
                    {arch.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {fmrData.bisqueTrialArch && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-medium text-white mb-3">Try-In Checklist</h3>
              
              <button
                onClick={() => onFMRDataChange({ bisqueFitCheck: !fmrData.bisqueFitCheck })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                  fmrData.bisqueFitCheck
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                  fmrData.bisqueFitCheck ? "bg-primary border-primary" : "border-white/30"
                )}>
                  {fmrData.bisqueFitCheck && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn("font-medium text-sm", fmrData.bisqueFitCheck ? "text-primary" : "text-white")}>
                    Fit Check
                  </p>
                  <p className="text-[10px] text-white/50">Margins, contacts, seating verified</p>
                </div>
              </button>

              <button
                onClick={() => onFMRDataChange({ bisqueAestheticCheck: !fmrData.bisqueAestheticCheck })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                  fmrData.bisqueAestheticCheck
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                  fmrData.bisqueAestheticCheck ? "bg-primary border-primary" : "border-white/30"
                )}>
                  {fmrData.bisqueAestheticCheck && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn("font-medium text-sm", fmrData.bisqueAestheticCheck ? "text-primary" : "text-white")}>
                    Aesthetic Check
                  </p>
                  <p className="text-[10px] text-white/50">Shape, size, contour, symmetry</p>
                </div>
              </button>

              <button
                onClick={() => onFMRDataChange({ bisqueOcclusionCheck: !fmrData.bisqueOcclusionCheck })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                  fmrData.bisqueOcclusionCheck
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                  fmrData.bisqueOcclusionCheck ? "bg-primary border-primary" : "border-white/30"
                )}>
                  {fmrData.bisqueOcclusionCheck && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn("font-medium text-sm", fmrData.bisqueOcclusionCheck ? "text-primary" : "text-white")}>
                    Occlusion Check
                  </p>
                  <p className="text-[10px] text-white/50">Centric, excursive movements verified</p>
                </div>
              </button>

              <button
                onClick={() => onFMRDataChange({ bisqueShadeVerified: !fmrData.bisqueShadeVerified })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                  fmrData.bisqueShadeVerified
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                  fmrData.bisqueShadeVerified ? "bg-primary border-primary" : "border-white/30"
                )}>
                  {fmrData.bisqueShadeVerified && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn("font-medium text-sm", fmrData.bisqueShadeVerified ? "text-primary" : "text-white")}>
                    Shade Verified
                  </p>
                  <p className="text-[10px] text-white/50">Color match confirmed</p>
                </div>
              </button>

              <div>
                <p className="text-xs text-white/60 mb-2">Adjustments Needed (if any)</p>
                <textarea
                  value={fmrData.bisqueAdjustments || ''}
                  onChange={(e) => onFMRDataChange({ bisqueAdjustments: e.target.value })}
                  placeholder="e.g., Reduce incisal length on 11, 21 by 0.5mm, adjust shade on 12..."
                  className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none min-h-[80px] resize-none"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Diagnostic Records - For diagnostic phase */}
      {fmrData.stage === 'diagnostic' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Diagnostic Records Available</h3>
          <div className="space-y-2">
            {[
              { key: 'hasFacebowRecord', label: 'Facebow Transfer', desc: 'For accurate articulator mounting' },
              { key: 'hasCRRecord', label: 'Centric Relation Record', desc: 'True hinge axis position' },
              { key: 'hasDiagnosticWaxup', label: 'Diagnostic Wax-Up', desc: 'Treatment visualization' },
            ].map((record) => (
              <button
                key={record.key}
                onClick={() => onFMRDataChange({ [record.key]: !fmrData[record.key as keyof FMRData] })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                  fmrData[record.key as keyof FMRData]
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                  fmrData[record.key as keyof FMRData] ? "bg-primary border-primary" : "border-white/30"
                )}>
                  {fmrData[record.key as keyof FMRData] && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    fmrData[record.key as keyof FMRData] ? "text-primary" : "text-white"
                  )}>
                    {record.label}
                  </p>
                  <p className="text-[10px] text-white/50">{record.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {!fmrData.hasDiagnosticWaxup && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/60">
                <span className="text-amber-400 font-medium">Diagnostic wax-up recommended</span> before 
                proceeding to provisionals for patient approval and template fabrication.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* OVD Change */}
      {fmrData.stage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Occlusal Vertical Dimension</h3>
          <div className="space-y-2">
            {OVD_CHANGES.map((ovd) => (
              <button
                key={ovd.id}
                onClick={() => onFMRDataChange({ ovdChange: ovd.id as OVDChange })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  fmrData.ovdChange === ovd.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    fmrData.ovdChange === ovd.id ? "text-primary" : "text-white"
                  )}>
                    {ovd.label}
                  </p>
                  <p className="text-[10px] text-white/50">{ovd.description}</p>
                </div>
                {fmrData.ovdChange === ovd.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>

          {/* OVD measurements if increasing */}
          {fmrData.ovdChange && fmrData.ovdChange !== 'maintain' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 grid grid-cols-2 gap-3"
            >
              <div>
                <p className="text-xs text-white/60 mb-2">Current OVD (mm)</p>
                <input
                  type="text"
                  value={fmrData.currentOVD || ''}
                  onChange={(e) => onFMRDataChange({ currentOVD: e.target.value })}
                  placeholder="e.g., 68"
                  className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
                />
              </div>
              <div>
                <p className="text-xs text-white/60 mb-2">Proposed OVD (mm)</p>
                <input
                  type="text"
                  value={fmrData.proposedOVD || ''}
                  onChange={(e) => onFMRDataChange({ proposedOVD: e.target.value })}
                  placeholder="e.g., 71"
                  className="w-full p-3 rounded-xl bg-card border border-border/50 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Treatment Approach */}
      {fmrData.ovdChange && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Treatment Approach</h3>
          <div className="grid grid-cols-3 gap-2">
            {TREATMENT_APPROACHES.map((approach) => (
              <button
                key={approach.id}
                onClick={() => onFMRDataChange({ treatmentApproach: approach.id as TreatmentApproach })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-center",
                  fmrData.treatmentApproach === approach.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-xs",
                  fmrData.treatmentApproach === approach.id ? "text-primary" : "text-white"
                )}>
                  {approach.label}
                </p>
                <p className="text-[9px] text-white/50 mt-0.5">{approach.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Arch Plans */}
      {fmrData.treatmentApproach && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Upper Arch Plan */}
          <div>
            <h3 className="text-sm font-medium text-white mb-2">Upper Arch Restoration Types</h3>
            <div className="flex flex-wrap gap-2">
              {RESTORATION_TYPES.map((type) => {
                const isSelected = fmrData.upperArchPlan?.includes(type.id)
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleArchPlan('upper', type.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/5 text-white/60 border border-white/10 hover:border-white/20"
                    )}
                  >
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Lower Arch Plan */}
          <div>
            <h3 className="text-sm font-medium text-white mb-2">Lower Arch Restoration Types</h3>
            <div className="flex flex-wrap gap-2">
              {RESTORATION_TYPES.map((type) => {
                const isSelected = fmrData.lowerArchPlan?.includes(type.id)
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleArchPlan('lower', type.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/5 text-white/60 border border-white/10 hover:border-white/20"
                    )}
                  >
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Teeth Selection */}
      {fmrData.treatmentApproach && (fmrData.upperArchPlan?.length > 0 || fmrData.lowerArchPlan?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-1">Select Teeth Involved</h3>
          <p className="text-xs text-white/50 mb-4">
            Tap on all teeth that will be restored
          </p>

          <div className="rounded-2xl p-4 overflow-hidden">
            <div className="odontogram-fmr-wrapper">
              <Odontogram 
                onChange={handleTeethChange}
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

          {(fmrData.upperTeeth?.length > 0 || fmrData.lowerTeeth?.length > 0) && (
            <div className="mt-3 p-3 bg-primary/10 rounded-xl border border-primary/30">
              <p className="text-xs text-primary font-medium">
                {(fmrData.upperTeeth?.length || 0) + (fmrData.lowerTeeth?.length || 0)} teeth selected
              </p>
              {fmrData.upperTeeth?.length > 0 && (
                <p className="text-[10px] text-white/50 mt-1">
                  Upper: {fmrData.upperTeeth.sort().join(', ')}
                </p>
              )}
              {fmrData.lowerTeeth?.length > 0 && (
                <p className="text-[10px] text-white/50">
                  Lower: {fmrData.lowerTeeth.sort().join(', ')}
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Occlusal Scheme */}
      {(fmrData.upperTeeth?.length > 0 || fmrData.lowerTeeth?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Occlusal Scheme</h3>
          <div className="space-y-2">
            {GUIDEPLANE_OPTIONS.map((guide) => (
              <button
                key={guide.id}
                onClick={() => onFMRDataChange({ guideplane: guide.id as 'anterior' | 'canine' | 'group_function' })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  fmrData.guideplane === guide.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    fmrData.guideplane === guide.id ? "text-primary" : "text-white"
                  )}>
                    {guide.label}
                  </p>
                  <p className="text-[10px] text-white/50">{guide.description}</p>
                </div>
                {fmrData.guideplane === guide.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Additional Options */}
      {fmrData.guideplane && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h3 className="text-sm font-medium text-white mb-3">Additional Considerations</h3>
          
          <button
            onClick={() => onFMRDataChange({ smileDesign: !fmrData.smileDesign })}
            className={cn(
              "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
              fmrData.smileDesign
                ? "bg-selected border-primary/50"
                : "bg-card border-border/50 hover:border-white/20"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
              fmrData.smileDesign ? "bg-primary border-primary" : "border-white/30"
            )}>
              {fmrData.smileDesign && <Check className="w-3 h-3 text-white" />}
            </div>
            <div>
              <p className={cn("font-medium text-sm", fmrData.smileDesign ? "text-primary" : "text-white")}>
                Smile Design Considerations
              </p>
              <p className="text-[10px] text-white/50">Include facial analysis, midline, gingival display</p>
            </div>
          </button>

          <button
            onClick={() => onFMRDataChange({ deprogrammer: !fmrData.deprogrammer })}
            className={cn(
              "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
              fmrData.deprogrammer
                ? "bg-selected border-primary/50"
                : "bg-card border-border/50 hover:border-white/20"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
              fmrData.deprogrammer ? "bg-primary border-primary" : "border-white/30"
            )}>
              {fmrData.deprogrammer && <Check className="w-3 h-3 text-white" />}
            </div>
            <div>
              <p className={cn("font-medium text-sm", fmrData.deprogrammer ? "text-primary" : "text-white")}>
                Deprogrammer Used
              </p>
              <p className="text-[10px] text-white/50">Anterior jig/Lucia jig for muscle deprogramming</p>
            </div>
          </button>
        </motion.div>
      )}

      {/* Summary */}
      {fmrData.guideplane && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-primary/20 to-cyan-500/10 rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-2">
            Full Mouth Rehabilitation - {FMR_STAGES.find(s => s.id === fmrData.stage)?.label}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="text-white/50">Total Teeth:</span>
              <span className="text-white ml-1">{(fmrData.upperTeeth?.length || 0) + (fmrData.lowerTeeth?.length || 0)}</span>
            </div>
            <div>
              <span className="text-white/50">OVD:</span>
              <span className="text-white ml-1">{fmrData.ovdChange?.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-white/50">Approach:</span>
              <span className="text-white ml-1 capitalize">{fmrData.treatmentApproach}</span>
            </div>
            <div>
              <span className="text-white/50">Guidance:</span>
              <span className="text-white ml-1 capitalize">{fmrData.guideplane?.replace('_', ' ')}</span>
            </div>
            {fmrData.upperArchPlan?.length > 0 && (
              <div className="col-span-2">
                <span className="text-white/50">Upper:</span>
                <span className="text-white ml-1">{fmrData.upperArchPlan.join(', ')}</span>
              </div>
            )}
            {fmrData.lowerArchPlan?.length > 0 && (
              <div className="col-span-2">
                <span className="text-white/50">Lower:</span>
                <span className="text-white ml-1">{fmrData.lowerArchPlan.join(', ')}</span>
              </div>
            )}
          </div>
          {(fmrData.smileDesign || fmrData.deprogrammer) && (
            <div className="mt-2 pt-2 border-t border-white/10 flex gap-2">
              {fmrData.smileDesign && (
                <span className="text-[9px] px-1.5 py-0.5 bg-primary/30 rounded text-primary">Smile Design</span>
              )}
              {fmrData.deprogrammer && (
                <span className="text-[9px] px-1.5 py-0.5 bg-primary/30 rounded text-primary">Deprogrammed</span>
              )}
            </div>
          )}
        </motion.div>
      )}

      <style>{`
        .odontogram-fmr-wrapper svg {
          width: 100%;
          height: auto;
        }
        
        .odontogram-fmr-wrapper .Odontogram__tooltip,
        .odontogram-fmr-wrapper [class*="tooltip"] {
          display: none !important;
        }
        
        .odontogram-fmr-wrapper svg path {
          fill: #3d5a7a;
          stroke: #5a7a9a;
          stroke-width: 1;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .odontogram-fmr-wrapper svg path:hover {
          fill: #4a7096;
        }
        
        .odontogram-fmr-wrapper svg [aria-selected="true"] path,
        .odontogram-fmr-wrapper svg g[aria-selected="true"] path {
          fill: #5ebbbd !important;
          stroke: #7dd3d5 !important;
        }
        
        .odontogram-fmr-wrapper svg text {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
