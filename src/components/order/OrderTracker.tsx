import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const ORDER_STAGES = [
  { id: 'placed', label: 'Placed' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'received', label: 'Received' },
  { id: 'processing', label: 'Processing' },
  { id: 'quality', label: 'QC' },
  { id: 'ready', label: 'Ready' },
  { id: 'delivered', label: 'Delivered' },
]

interface OrderTrackerProps {
  currentStage: string
  className?: string
}

export function OrderTracker({ currentStage, className }: OrderTrackerProps) {
  const currentIndex = ORDER_STAGES.findIndex(s => s.id === currentStage)

  return (
    <div className={cn("space-y-3", className)}>
      {ORDER_STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isPending = index > currentIndex

        return (
          <div
            key={stage.id}
            className={cn(
              "flex items-center gap-3",
              isPending && "opacity-40"
            )}
          >
            {/* Node */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                  isCompleted && "bg-success border-success text-white",
                  isCurrent && "bg-primary border-primary text-white",
                  isPending && "bg-muted border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              
              {/* Connecting line */}
              {index < ORDER_STAGES.length - 1 && (
                <div className={cn(
                  "w-0.5 h-6 mt-1",
                  index < currentIndex ? "bg-success" : "bg-border"
                )} />
              )}
            </div>

            {/* Label */}
            <div className="flex-1 pb-6">
              <span className={cn(
                "text-sm font-medium",
                isCompleted && "text-success",
                isCurrent && "text-primary",
                isPending && "text-muted-foreground"
              )}>
                {stage.label}
              </span>
              {isCurrent && (
                <p className="text-xs text-muted-foreground mt-0.5">In progress</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Compact version for cards - just shows current status
export function OrderTrackerCompact({ currentStage }: OrderTrackerProps) {
  const currentIndex = ORDER_STAGES.findIndex(s => s.id === currentStage)
  const currentStatus = ORDER_STAGES[currentIndex]
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / ORDER_STAGES.length) * 100}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        {currentIndex + 1}/{ORDER_STAGES.length}
      </span>
    </div>
  )
}
