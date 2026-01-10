import { cn } from "@/lib/utils"
import { VITA_SHADES } from "@/data/vitaShades"
import { Check } from "lucide-react"

interface ShadeGuideProps {
  value: string | null
  onChange: (shade: string) => void
}

export function ShadeGuide({ value, onChange }: ShadeGuideProps) {
  const selectedShade = value ? VITA_SHADES[value[0]]?.shades.find(s => s.code === value) : null

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-medium text-white mb-1">VITA Classical Shade Guide</h3>
        <p className="text-sm text-white/50">Select the matching shade</p>
      </div>

      {/* Selected */}
      {value && selectedShade && (
        <div className="p-4 bg-selected rounded-xl border border-primary/30 flex items-center gap-4">
          <div 
            className="w-12 h-14 rounded-lg border-2 border-white/20 shadow-lg"
            style={{ backgroundColor: selectedShade.hex }}
          />
          <div>
            <p className="font-semibold text-primary text-lg">{value}</p>
            <p className="text-sm text-white/50">{selectedShade.description}</p>
          </div>
        </div>
      )}

      {/* Shade groups */}
      <div className="space-y-5">
        {Object.entries(VITA_SHADES).map(([group, data]) => (
          <div key={group}>
            <p className="text-xs font-medium text-white/40 mb-3">{data.name}</p>
            <div className="flex gap-2">
              {data.shades.map((shade) => (
                <button
                  key={shade.code}
                  onClick={() => onChange(shade.code)}
                  className={cn(
                    "relative w-14 h-16 rounded-xl border-2 transition-all flex items-end justify-center pb-1.5",
                    value === shade.code 
                      ? "border-primary shadow-[0_0_16px_rgba(94,189,188,0.3)]" 
                      : "border-white/10 hover:border-white/30"
                  )}
                  style={{ backgroundColor: shade.hex }}
                >
                  {value === shade.code && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  )}
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/50 text-white">
                    {shade.code}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
