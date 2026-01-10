import { motion } from "motion/react"
import { ChevronRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Order } from "@/stores/orderStore"

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  placed: { label: 'Placed', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  accepted: { label: 'Accepted', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  pickup: { label: 'Pickup Scheduled', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  received: { label: 'Received', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  processing: { label: 'Processing', color: 'text-cyan-700', bgColor: 'bg-cyan-100' },
  quality: { label: 'Quality Check', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  ready: { label: 'Ready', color: 'text-green-700', bgColor: 'bg-green-100' },
  delivered: { label: 'Delivered', color: 'text-gray-700', bgColor: 'bg-gray-100' },
}

interface OrderCardProps {
  order: Order
  onClick: () => void
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-border p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={order.labImage}
            alt={order.labName}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <h3 className="font-semibold text-sm">{order.labName}</h3>
            <p className="text-xs text-muted-foreground">{order.id}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Order details */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="outline" className="font-normal">
          {order.caseType}
        </Badge>
        <Badge variant="outline" className="font-normal">
          {order.material}
        </Badge>
        <Badge variant="outline" className="font-normal">
          Shade {order.shade}
        </Badge>
        {order.priority !== 'normal' && (
          <Badge variant={order.priority === 'rush' ? 'destructive' : 'warning'}>
            {order.priority === 'rush' ? '🔥 Rush' : '⚡ Urgent'}
          </Badge>
        )}
      </div>

      {/* Teeth */}
      <div className="text-xs text-muted-foreground mb-3">
        <span className="font-medium">Teeth:</span> {order.teeth.join(', ')}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          statusConfig.bgColor,
          statusConfig.color
        )}>
          {statusConfig.label}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Est. {order.estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>
    </motion.div>
  )
}
