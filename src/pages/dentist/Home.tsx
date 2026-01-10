import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { Plus, ChevronRight, Clock, Bell, AlertCircle, CheckCircle2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MOCK_ORDERS } from "@/stores/orderStore"
import { MOCK_LABS } from "@/data/mockLabs"
import { cn } from "@/lib/utils"

function getStatusInfo(status: string) {
  switch (status) {
    case 'placed': return { label: 'Order Placed', color: 'text-blue-400' }
    case 'accepted': return { label: 'Accepted', color: 'text-blue-400' }
    case 'pickup': return { label: 'Pickup Scheduled', color: 'text-amber-400' }
    case 'received': return { label: 'Received at Lab', color: 'text-blue-400' }
    case 'processing': return { label: 'In Production', color: 'text-primary' }
    case 'quality': return { label: 'Quality Check', color: 'text-primary' }
    case 'ready': return { label: 'Ready', color: 'text-emerald-400' }
    case 'delivered': return { label: 'Delivered', color: 'text-emerald-400' }
    default: return { label: status, color: 'text-muted-foreground' }
  }
}

export function Home() {
  const navigate = useNavigate()
  const activeOrders = MOCK_ORDERS.filter(o => o.status !== 'delivered')
  const recentLabs = MOCK_LABS.slice(0, 3)

  // Calculate relevant KPIs
  const today = new Date()
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const dueSoon = MOCK_ORDERS.filter(o => {
    const deliveryDate = new Date(o.estimatedDelivery)
    return deliveryDate <= sevenDaysFromNow && 
           deliveryDate >= today && 
           o.status !== 'delivered' && 
           o.status !== 'ready'
  }).length

  const inProduction = MOCK_ORDERS.filter(o => 
    o.status === 'processing' || o.status === 'quality'
  ).length

  const readyForPickup = MOCK_ORDERS.filter(o => 
    o.status === 'ready'
  ).length

  const completedThisMonth = MOCK_ORDERS.filter(o => {
    if (o.status !== 'delivered') return false
    const deliveredDate = o.estimatedDelivery // Using estimatedDelivery as delivered date for mock
    return deliveredDate >= startOfMonth
  }).length

  return (
    <div className="min-h-full bg-atmosphere flex flex-col">
      <div className="flex-1 px-5 pt-2 pb-4 space-y-5">
        {/* Welcome Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gradient-accent" className="overflow-hidden">
            <CardContent className="p-5 pt-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-white/60">Welcome back</p>
                  <h1 className="text-xl font-semibold text-white">Dr. Priya Sharma</h1>
                </div>
                <button className="relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white/80" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                </button>
              </div>
              
              <Button
                onClick={() => navigate('/new-order')}
                className="w-full"
              >
                <Plus className="w-4 h-4" />
                New Lab Order
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { 
              label: 'Due Soon', 
              value: dueSoon,
              icon: AlertCircle,
              color: 'text-amber-400',
              bgColor: 'bg-amber-500/10',
              description: 'Next 7 days'
            },
            { 
              label: 'In Production', 
              value: inProduction,
              icon: Package,
              color: 'text-primary',
              bgColor: 'bg-primary/10',
              description: 'Being made'
            },
            { 
              label: 'Ready', 
              value: readyForPickup,
              icon: CheckCircle2,
              color: 'text-emerald-400',
              bgColor: 'bg-emerald-500/10',
              description: 'For pickup'
            },
            { 
              label: 'Completed', 
              value: completedThisMonth,
              icon: CheckCircle2,
              color: 'text-white',
              bgColor: 'bg-white/5',
              description: 'This month'
            },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} variant="gradient" className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                      <Icon className={cn("w-4 h-4", stat.color)} />
                    </div>
                    <p className={cn("text-2xl font-semibold", stat.color)}>{stat.value}</p>
                  </div>
                  <p className="text-xs font-medium text-white">{stat.label}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>

        {/* Active Orders */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Active Orders</h2>
            <button
              onClick={() => navigate('/orders')}
              className="text-sm text-primary font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Card variant="gradient">
            <CardContent className="p-0 divide-y divide-white/5">
              {activeOrders.slice(0, 3).map((order, i) => {
                const statusInfo = getStatusInfo(order.status)
                
                return (
                  <motion.button
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-white/5",
                      i === 0 && "rounded-t-2xl",
                      i === activeOrders.slice(0, 3).length - 1 && "rounded-b-2xl"
                    )}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={order.labImage}
                      alt={order.labName}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{order.labName}</p>
                      <p className="text-xs text-white/50">
                        {order.caseType} · {order.teeth.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-xs font-medium", statusInfo.color)}>
                        {statusInfo.label}
                      </p>
                      <p className="text-[10px] text-white/40 flex items-center gap-1 justify-end mt-0.5">
                        <Clock className="w-3 h-3" />
                        {order.estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </motion.button>
                )
              })}
            </CardContent>
          </Card>
        </motion.section>

        {/* Quick Labs */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Labs Near You</h2>
            <button
              onClick={() => navigate('/labs')}
              className="text-sm text-primary font-medium flex items-center gap-1"
            >
              Browse <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            {recentLabs.map((lab) => (
              <motion.div
                key={lab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/labs/${lab.id}`)}
                className="flex-shrink-0"
              >
                <Card variant="gradient" className="w-32 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="h-20 relative">
                      <img
                        src={lab.image}
                        alt={lab.name}
                        className="w-full h-full object-cover rounded-t-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 rounded-t-2xl" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-white/90">
                        <span className="text-amber-400">★</span> {lab.rating}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-xs text-white truncate">{lab.name}</p>
                      <p className="text-[10px] text-white/50 mt-0.5">{lab.turnaround}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
