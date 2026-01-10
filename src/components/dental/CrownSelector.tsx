import { motion } from "motion/react"
import { Check, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { ToothChart } from "./ToothChart"
import type { CrownData, CrownSubtype, MarginType, OcclusalReduction, OpposingDentition } from "@/stores/orderStore"

interface CrownSelectorProps {
  selectedTeeth: string[]
  onToothClick: (tooth: string) => void
  crownData: CrownData
  onCrownDataChange: (data: Partial<CrownData>) => void
}

const CROWN_SUBTYPES = [
  { id: 'full', label: 'Full Crown', description: 'Complete coverage restoration' },
  { id: 'three_quarter', label: '3/4 Crown', description: 'Preserves one tooth surface' },
]

const MARGIN_TYPES = [
  { id: 'shoulder', label: 'Shoulder', description: '90° shoulder with rounded internal angles' },
  { id: 'chamfer', label: 'Chamfer', description: 'Concave margin, most common' },
  { id: 'knife_edge', label: 'Knife Edge', description: 'Minimal reduction, feathered margin' },
  { id: 'feather_edge', label: 'Feather Edge', description: 'Very thin margin, conservative' },
]

const OCCLUSAL_REDUCTIONS = [
  { id: 'standard', label: 'Standard (1.5-2mm)', description: 'Adequate for most materials' },
  { id: 'minimal', label: 'Minimal (1-1.5mm)', description: 'Conservative, full zirconia only' },
  { id: 'extensive', label: 'Extensive (2mm+)', description: 'For layered ceramics, tight occlusion' },
]

const OPPOSING_DENTITION = [
  { id: 'natural', label: 'Natural Teeth', description: 'Opposing arch has natural dentition' },
  { id: 'crown', label: 'Crown/Bridge', description: 'Opposing tooth has a restoration' },
  { id: 'denture', label: 'Denture', description: 'Opposing arch is removable denture' },
  { id: 'implant', label: 'Implant Crown', description: 'Opposing tooth is implant-supported' },
]

export function CrownSelector({ 
  selectedTeeth, 
  onToothClick, 
  crownData, 
  onCrownDataChange 
}: CrownSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Crown Subtype */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Crown Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {CROWN_SUBTYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onCrownDataChange({ crownSubtype: type.id as CrownSubtype })}
              className={cn(
                "p-4 rounded-xl border transition-all text-center",
                crownData.crownSubtype === type.id
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20"
              )}
            >
              <p className={cn(
                "font-medium text-sm mb-1",
                crownData.crownSubtype === type.id ? "text-primary" : "text-white"
              )}>
                {type.label}
              </p>
              <p className="text-[10px] text-white/50">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tooth Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-1">Select Teeth</h3>
        <p className="text-xs text-white/50 mb-4">
          Tap on teeth that need crowns
        </p>
        <ToothChart
          selectedTeeth={selectedTeeth}
          onToothClick={onToothClick}
        />
      </div>

      {/* Post & Core - Show when teeth are selected */}
      {selectedTeeth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Post & Core Required?</h3>
          <p className="text-xs text-white/50 mb-3">
            Is the tooth endodontically treated and needs post/core buildup?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onCrownDataChange({ needsPostCore: true })}
              className={cn(
                "p-4 rounded-xl border transition-all text-center",
                crownData.needsPostCore === true
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20"
              )}
            >
              <p className={cn(
                "font-medium text-sm",
                crownData.needsPostCore === true ? "text-primary" : "text-white"
              )}>
                Yes, needs Post & Core
              </p>
              <p className="text-[10px] text-white/50 mt-1">RCT tooth, insufficient structure</p>
            </button>
            <button
              onClick={() => onCrownDataChange({ needsPostCore: false })}
              className={cn(
                "p-4 rounded-xl border transition-all text-center",
                crownData.needsPostCore === false
                  ? "bg-selected border-primary/50"
                  : "bg-card border-border/50 hover:border-white/20"
              )}
            >
              <p className={cn(
                "font-medium text-sm",
                crownData.needsPostCore === false ? "text-primary" : "text-white"
              )}>
                No, sufficient structure
              </p>
              <p className="text-[10px] text-white/50 mt-1">Good remaining tooth structure</p>
            </button>
          </div>

          {/* Post type selection if needed */}
          {crownData.needsPostCore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <p className="text-xs text-white/60 mb-2">Post Type</p>
              <div className="grid grid-cols-3 gap-2">
                {['fiber', 'metal', 'cast'].map((type) => (
                  <button
                    key={type}
                    onClick={() => onCrownDataChange({ postType: type as 'fiber' | 'metal' | 'cast' })}
                    className={cn(
                      "p-2 rounded-lg border transition-all text-center",
                      crownData.postType === type
                        ? "bg-selected border-primary/50"
                        : "bg-card border-border/50 hover:border-white/20"
                    )}
                  >
                    <p className={cn(
                      "text-xs font-medium capitalize",
                      crownData.postType === type ? "text-primary" : "text-white"
                    )}>
                      {type === 'fiber' ? 'Fiber Post' : type === 'metal' ? 'Metal Post' : 'Cast P&C'}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Margin Type - show when teeth are selected */}
      {selectedTeeth.length > 0 && crownData.needsPostCore !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Margin Preparation</h3>
          <div className="space-y-2">
            {MARGIN_TYPES.map((margin) => (
              <button
                key={margin.id}
                onClick={() => onCrownDataChange({ marginType: margin.id as MarginType })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  crownData.marginType === margin.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    crownData.marginType === margin.id ? "text-primary" : "text-white"
                  )}>
                    {margin.label}
                  </p>
                  <p className="text-[10px] text-white/50">{margin.description}</p>
                </div>
                {crownData.marginType === margin.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Occlusal Reduction */}
      {crownData.marginType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Occlusal Reduction</h3>
          <div className="space-y-2">
            {OCCLUSAL_REDUCTIONS.map((reduction) => (
              <button
                key={reduction.id}
                onClick={() => onCrownDataChange({ occlusalReduction: reduction.id as OcclusalReduction })}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                  crownData.occlusalReduction === reduction.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    crownData.occlusalReduction === reduction.id ? "text-primary" : "text-white"
                  )}>
                    {reduction.label}
                  </p>
                  <p className="text-[10px] text-white/50">{reduction.description}</p>
                </div>
                {crownData.occlusalReduction === reduction.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Opposing Dentition */}
      {crownData.occlusalReduction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Opposing Dentition</h3>
          <div className="grid grid-cols-2 gap-2">
            {OPPOSING_DENTITION.map((opp) => (
              <button
                key={opp.id}
                onClick={() => onCrownDataChange({ opposingDentition: opp.id as OpposingDentition })}
                className={cn(
                  "p-3 rounded-xl border transition-all text-left",
                  crownData.opposingDentition === opp.id
                    ? "bg-selected border-primary/50"
                    : "bg-card border-border/50 hover:border-white/20"
                )}
              >
                <p className={cn(
                  "font-medium text-xs",
                  crownData.opposingDentition === opp.id ? "text-primary" : "text-white"
                )}>
                  {opp.label}
                </p>
                <p className="text-[9px] text-white/50">{opp.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Splinting Option */}
      {crownData.opposingDentition && selectedTeeth.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border/50">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">Splint Crowns Together?</p>
                <button
                  onClick={() => onCrownDataChange({ splinted: !crownData.splinted })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    crownData.splinted ? "bg-primary" : "bg-white/20"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all",
                    crownData.splinted ? "left-6" : "left-0.5"
                  )} />
                </button>
              </div>
              <p className="text-xs text-white/50 mt-1">
                Connect multiple crowns for added stability (periodontally compromised teeth)
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Warning for minimal occlusal with layered */}
      {crownData.occlusalReduction === 'minimal' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-2"
        >
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/60">
            <span className="text-amber-400 font-medium">Minimal reduction</span> is only suitable for 
            full-contour zirconia. If you want a layered/aesthetic crown, please select standard or extensive reduction.
          </p>
        </motion.div>
      )}

      {/* Summary */}
      {selectedTeeth.length > 0 && crownData.opposingDentition && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-selected rounded-xl border border-primary/30"
        >
          <p className="text-sm font-medium text-primary mb-2">
            {selectedTeeth.length} {crownData.crownSubtype === 'three_quarter' ? '3/4' : 'Full'} Crown{selectedTeeth.length > 1 ? 's' : ''}
            {crownData.splinted && selectedTeeth.length > 1 && ' (Splinted)'}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="text-white/50">Teeth:</span>
              <span className="text-white ml-1">{selectedTeeth.sort().join(', ')}</span>
            </div>
            <div>
              <span className="text-white/50">Margin:</span>
              <span className="text-white ml-1">{MARGIN_TYPES.find(m => m.id === crownData.marginType)?.label}</span>
            </div>
            {crownData.needsPostCore && (
              <div>
                <span className="text-white/50">Post:</span>
                <span className="text-white ml-1 capitalize">{crownData.postType || 'Fiber'}</span>
              </div>
            )}
            <div>
              <span className="text-white/50">Occlusal:</span>
              <span className="text-white ml-1">{crownData.occlusalReduction?.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-white/50">Opposing:</span>
              <span className="text-white ml-1">{crownData.opposingDentition?.replace('_', ' ')}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
