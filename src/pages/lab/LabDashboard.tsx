import { motion } from "motion/react"
// import { useNavigate } from "react-router-dom"
import { 
  Package, 
  Clock, 
  AlertCircle,
  TrendingUp,
  IndianRupee,
  ChevronRight,
  Settings,
  Bell,
  Star,
  Calendar
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore, LAB_SERVICES } from "@/stores/authStore"
import { cn } from "@/lib/utils"

// Mock data for lab orders
const MOCK_LAB_ORDERS = [
  {
    id: 'ORD-001',
    clinicName: 'Smile Dental Clinic',
    doctorName: 'Dr. Priya Sharma',
    caseType: 'crown',
    teeth: [21, 22],
    material: 'Zirconia',
    status: 'in_production',
    priority: 'normal',
    receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ORD-002',
    clinicName: 'City Dental Care',
    doctorName: 'Dr. Raj Kumar',
    caseType: 'bridge',
    teeth: [35, 36, 37],
    material: 'PFM',
    status: 'pending_acceptance',
    priority: 'rush',
    receivedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ORD-003',
    clinicName: 'Dental Excellence',
    doctorName: 'Dr. Anita Mehta',
    caseType: 'denture',
    teeth: [],
    material: 'Acrylic',
    status: 'quality_check',
    priority: 'normal',
    receivedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
]

const STATUS_CONFIG = {
  pending_acceptance: { label: 'New', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  accepted: { label: 'Accepted', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  in_production: { label: 'In Production', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  quality_check: { label: 'QC', color: 'text-violet-400', bg: 'bg-violet-500/20' },
  ready: { label: 'Ready', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  dispatched: { label: 'Dispatched', color: 'text-green-400', bg: 'bg-green-500/20' },
}

export function LabDashboard() {
  // const navigate = useNavigate()
  const { labProfile, logout } = useAuthStore()

  // Stats
  const newOrders = MOCK_LAB_ORDERS.filter(o => o.status === 'pending_acceptance').length
  const inProduction = MOCK_LAB_ORDERS.filter(o => o.status === 'in_production').length
  const dueSoon = MOCK_LAB_ORDERS.filter(o => {
    const daysUntilDue = Math.ceil((o.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntilDue <= 2 && o.status !== 'ready' && o.status !== 'dispatched'
  }).length

  return (
    <div className="min-h-full bg-atmosphere flex flex-col">
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-white/50 text-sm">Welcome back</p>
            <h1 className="text-xl font-bold text-white">{labProfile.labName || 'Your Lab'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-white/70" />
              {newOrders > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-xs font-bold flex items-center justify-center text-white">
                  {newOrders}
                </span>
              )}
            </button>
            <button 
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
              onClick={() => logout()}
            >
              <Settings className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 px-5 pb-4 space-y-5">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card variant="gradient" className="border-amber-500/30">
            <CardContent className="p-4 pt-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-2xl font-bold text-amber-400">{newOrders}</span>
              </div>
              <p className="text-sm text-white/60">New Orders</p>
            </CardContent>
          </Card>

          <Card variant="gradient">
            <CardContent className="p-4 pt-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-2xl font-bold text-cyan-400">{inProduction}</span>
              </div>
              <p className="text-sm text-white/60">In Production</p>
            </CardContent>
          </Card>

          <Card variant="gradient" className={dueSoon > 0 ? "border-red-500/30" : ""}>
            <CardContent className="p-4 pt-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  dueSoon > 0 ? "bg-red-500/20" : "bg-white/10"
                )}>
                  <Clock className={cn("w-5 h-5", dueSoon > 0 ? "text-red-400" : "text-white/50")} />
                </div>
                <span className={cn(
                  "text-2xl font-bold",
                  dueSoon > 0 ? "text-red-400" : "text-white"
                )}>{dueSoon}</span>
              </div>
              <p className="text-sm text-white/60">Due Soon</p>
            </CardContent>
          </Card>

          <Card variant="gradient">
            <CardContent className="p-4 pt-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-2xl font-bold text-emerald-400">12</span>
              </div>
              <p className="text-sm text-white/60">This Week</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Orders */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Active Orders</h2>
            <Button variant="ghost" size="sm" className="text-violet-400 gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {MOCK_LAB_ORDERS.map((order, index) => {
              const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
              const daysUntilDue = Math.ceil((order.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card variant="gradient" className={order.priority === 'rush' ? "border-amber-500/30" : ""}>
                    <CardContent className="p-4 pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm text-white/50">{order.id}</span>
                            {order.priority === 'rush' && (
                              <Badge variant="warning" className="text-xs">Rush</Badge>
                            )}
                          </div>
                          <p className="font-medium text-white">{order.clinicName}</p>
                          <p className="text-sm text-white/50">{order.doctorName}</p>
                        </div>
                        <Badge 
                          variant="outline"
                          className={cn(status.color, status.bg, "border-current/30")}
                        >
                          {status.label}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-white/70 capitalize">{order.caseType}</span>
                          {order.teeth.length > 0 && (
                            <span className="text-white/50">#{order.teeth.join(', ')}</span>
                          )}
                          <span className="text-white/50">{order.material}</span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1",
                          daysUntilDue <= 1 ? "text-red-400" : daysUntilDue <= 2 ? "text-amber-400" : "text-white/50"
                        )}>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{daysUntilDue <= 0 ? 'Today' : `${daysUntilDue}d`}</span>
                        </div>
                      </div>

                      {order.status === 'pending_acceptance' && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                          <Button variant="secondary" size="sm" className="flex-1">
                            Decline
                          </Button>
                          <Button size="sm" className="flex-1 bg-violet-600 hover:bg-violet-700">
                            Accept Order
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gradient-accent">
            <CardContent className="p-4 pt-4">
              <h3 className="font-medium text-white mb-3">This Month</h3>
              <div className="grid grid-cols-3 divide-x divide-white/10">
                <div className="text-center px-2">
                  <p className="text-2xl font-bold text-white">48</p>
                  <p className="text-xs text-white/50">Orders</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-2xl font-bold text-emerald-400">96%</p>
                  <p className="text-xs text-white/50">On-time</p>
                </div>
                <div className="text-center px-2">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <p className="text-2xl font-bold text-white">4.8</p>
                  </div>
                  <p className="text-xs text-white/50">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Services Offered */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white/50">Your Services</h2>
            <Button variant="ghost" size="sm" className="text-violet-400 text-xs">
              Edit
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {labProfile.services.slice(0, 6).map(serviceId => {
              const service = LAB_SERVICES.find(s => s.id === serviceId)
              return service ? (
                <span 
                  key={serviceId}
                  className="px-3 py-1.5 rounded-full bg-violet-500/10 text-xs text-violet-400 border border-violet-500/20"
                >
                  {service.label}
                </span>
              ) : null
            })}
            {labProfile.services.length > 6 && (
              <span className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-white/50">
                +{labProfile.services.length - 6} more
              </span>
            )}
          </div>
        </motion.section>
      </div>

      {/* Bottom Navigation for Lab */}
      <div className="h-[54px] bg-card/80 backdrop-blur-lg border-t border-border/50">
        <nav className="h-full flex items-center justify-around px-4">
          {[
            { icon: Package, label: 'Orders', active: true },
            { icon: IndianRupee, label: 'Earnings', active: false },
            { icon: Star, label: 'Reviews', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all",
                item.active 
                  ? "text-violet-400" 
                  : "text-white/40 hover:text-white/60"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
