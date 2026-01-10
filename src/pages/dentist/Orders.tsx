import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_ORDERS } from "@/stores/orderStore"
import { cn } from "@/lib/utils"
import { Clock, AlertCircle, ChevronRight } from "lucide-react"

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  placed: { label: 'Order Placed', color: 'text-blue-400' },
  accepted: { label: 'Accepted', color: 'text-blue-400' },
  pickup: { label: 'Pickup Scheduled', color: 'text-amber-400' },
  received: { label: 'Received', color: 'text-blue-400' },
  processing: { label: 'In Production', color: 'text-primary' },
  quality: { label: 'Quality Check', color: 'text-primary' },
  ready: { label: 'Ready', color: 'text-emerald-400' },
  delivered: { label: 'Delivered', color: 'text-emerald-400' },
}

export function Orders() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

  const activeOrders = MOCK_ORDERS.filter(o => o.status !== 'delivered')
  const completedOrders = MOCK_ORDERS.filter(o => o.status === 'delivered')
  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders

  return (
    <div className="min-h-full bg-atmosphere flex flex-col">
      {/* Page Title & Tabs */}
      <div className="px-5 pt-2 pb-3">
        <h1 className="text-xl font-semibold text-white mb-4">Orders</h1>
        
        <div className="flex gap-1 p-1 bg-card rounded-xl border border-border/50">
          {[
            { id: 'active', label: 'Active', count: activeOrders.length },
            { id: 'completed', label: 'Completed', count: completedOrders.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'active' | 'completed')}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="flex-1 px-5 pb-4 space-y-3">
        <AnimatePresence mode="wait">
          {displayOrders.length > 0 ? (
            displayOrders.map((order, i) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed
              const isUrgent = order.priority === 'rush' || order.priority === 'urgent'
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    variant="gradient"
                    className="cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={order.labImage}
                          alt={order.labName}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-white truncate">{order.labName}</h3>
                            {isUrgent && (
                              <Badge variant="warning" className="text-[10px] py-0.5">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {order.priority}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-white/50">{order.id}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/30" />
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{order.caseType}</Badge>
                        <Badge variant="outline">Teeth: {order.teeth.join(', ')}</Badge>
                        <Badge variant="outline">{order.shade}</Badge>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <p className={cn("text-sm font-medium", status.color)}>
                          {status.label}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-white/40">
                          <Clock className="w-3.5 h-3.5" />
                          Est. {order.estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-card mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-white/50">No orders</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
