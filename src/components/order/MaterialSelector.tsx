import { cn } from "@/lib/utils"
import { Check, Clock } from "lucide-react"
import { getMaterialsByCategory } from "@/data/materials"
import { Badge } from "@/components/ui/badge"

interface MaterialSelectorProps {
  category: string
  value: string | null
  onChange: (materialId: string) => void
}

export function MaterialSelector({ category, value, onChange }: MaterialSelectorProps) {
  const materials = getMaterialsByCategory(category)

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/50 mb-4">Choose the material</p>
      
      {materials.map((material) => (
        <button
          key={material.id}
          onClick={() => onChange(material.id)}
          className={cn(
            "w-full text-left p-4 rounded-2xl border transition-all",
            value === material.id
              ? "bg-selected border-primary/50"
              : "bg-card border-border/50 hover:border-white/20"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className={cn(
                "font-medium",
                value === material.id ? "text-primary" : "text-white"
              )}>
                {material.name}
              </p>
              <p className="text-sm text-white/50">{material.description}</p>
            </div>
            {value === material.id && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {material.features.slice(0, 3).map((feature) => (
              <span key={feature} className="text-xs px-2 py-0.5 bg-white/5 rounded text-white/50">
                {feature}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="font-medium text-primary">₹{material.priceRange}</span>
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {material.turnaround}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
