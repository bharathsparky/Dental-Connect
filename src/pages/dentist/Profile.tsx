import { motion } from "motion/react"
import { 
  User, 
  Building2, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle,
  ChevronRight,
  LogOut,
  Settings
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MENU_ITEMS = [
  { 
    section: 'Account',
    items: [
      { icon: User, label: 'Personal Details' },
      { icon: Building2, label: 'Clinic Details' },
      { icon: CreditCard, label: 'Payment Methods' },
    ]
  },
  {
    section: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications' },
      { icon: Shield, label: 'Privacy & Security' },
    ]
  },
  {
    section: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support' },
    ]
  },
]

export function Profile() {
  return (
    <div className="min-h-full bg-atmosphere flex flex-col">
      <div className="flex-1 px-5 pt-2 pb-4 space-y-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gradient-accent">
            <CardContent className="p-5 pt-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.5_0.15_220)] flex items-center justify-center">
                  <span className="text-xl font-bold text-white">PS</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-white">Dr. Priya Sharma</h2>
                  <p className="text-sm text-white/60">General Dentist</p>
                  <Badge className="mt-2">Verified</Badge>
                </div>
                <button className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="gradient">
            <CardContent className="p-4 pt-4">
              <div className="grid grid-cols-3 divide-x divide-white/10">
                {[
                  { label: 'Orders', value: '156' },
                  { label: 'Labs', value: '12' },
                  { label: 'This Month', value: '₹45K' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center px-2">
                    <p className="text-xl font-semibold text-white">{stat.value}</p>
                    <p className="text-xs text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu sections */}
        {MENU_ITEMS.map((section, sectionIndex) => (
          <motion.div
            key={section.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + sectionIndex * 0.05 }}
          >
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 px-1">
              {section.section}
            </h3>
            <Card variant="gradient">
              <CardContent className="p-0 divide-y divide-white/5">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white/70" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-white">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="gradient">
            <CardContent className="p-0">
              <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-destructive" />
                </div>
                <span className="text-sm font-medium text-destructive">Log Out</span>
              </button>
            </CardContent>
          </Card>
        </motion.div>

        <p className="text-center text-xs text-white/30 py-2">
          DentConnect v2.0
        </p>
      </div>
    </div>
  )
}
