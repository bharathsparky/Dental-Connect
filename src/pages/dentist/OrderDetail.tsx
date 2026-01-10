import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Calendar,
  Clock,
  AlertCircle,
  ChevronRight,
  FileText,
  User,
  CreditCard,
  CheckCircle2,
  X,
  IndianRupee
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/Header"
import { MOCK_ORDERS } from "@/stores/orderStore"
import { getLabById } from "@/data/mockLabs"
import { formatCurrency } from "@/stores/paymentStore"
import { UPIPayment } from "@/components/payment/UPIPayment"
import { cn } from "@/lib/utils"

const ORDER_STAGES = [
  { id: 'placed', label: 'Placed' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'received', label: 'Received' },
  { id: 'processing', label: 'Production' },
  { id: 'quality', label: 'QC' },
  { id: 'ready', label: 'Ready' },
  { id: 'delivered', label: 'Delivered' },
]

export function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const order = MOCK_ORDERS.find(o => o.id === id)
  const lab = order ? getLabById(order.labId) : null
  
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Check if payment is needed
  const needsPayment = order?.paymentStatus === 'pending' || order?.paymentStatus === 'deposit_paid'
  const amountDue = order?.paymentStatus === 'deposit_paid' 
    ? (order.balanceAmount || order.totalAmount)
    : order?.totalAmount || 0

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId)
    setPaymentSuccess(true)
    setTimeout(() => {
      setShowPaymentModal(false)
      setPaymentSuccess(false)
    }, 2000)
  }

  const handlePaymentFailure = (reason: string) => {
    console.log('Payment failed:', reason)
  }

  if (!order || !lab) {
    return (
      <div className="min-h-full bg-atmosphere flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Order not found</p>
          <Button variant="secondary" onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  const currentIndex = ORDER_STAGES.findIndex(s => s.id === order.status)
  const isUrgent = order.priority === 'rush' || order.priority === 'urgent'

  return (
    <div className="min-h-full bg-atmosphere flex flex-col">
      <Header showBack title="Order Details" />

      <div className="flex-1 px-5 pb-4 space-y-4">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gradient-accent">
            <CardContent className="p-5 pt-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-white/50">Order ID</p>
                  <p className="font-mono font-medium text-white">{order.id}</p>
                </div>
                {isUrgent && (
                  <Badge variant="warning">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {order.priority}
                  </Badge>
                )}
              </div>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span>{ORDER_STAGES[currentIndex].label}</span>
                  <span>{currentIndex + 1} of {ORDER_STAGES.length}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / ORDER_STAGES.length) * 100}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar className="w-4 h-4" />
                <span>Placed {order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                <span className="mx-1">·</span>
                <Clock className="w-4 h-4" />
                <span>Est. {order.estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lab Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="gradient">
            <CardContent className="p-4 pt-4">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={lab.image}
                  alt={lab.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-white">{lab.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <MapPin className="w-3 h-3" />
                    <span>{lab.address}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1 gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gradient">
            <CardContent className="p-4 pt-4 space-y-4">
              <h3 className="font-medium text-white">Details</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/40 text-xs">Case Type</p>
                  <p className="font-medium text-white capitalize">{order.caseType}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs">Material</p>
                  <p className="font-medium text-white">{order.material}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs">Shade</p>
                  <p className="font-medium text-white">{order.shade}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs">Teeth</p>
                  <p className="font-medium text-white">{order.teeth.join(', ')}</p>
                </div>
                {order.patientName && (
                  <div className="col-span-2">
                    <p className="text-white/40 text-xs flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Patient
                    </p>
                    <p className="font-medium text-white">{order.patientName}</p>
                  </div>
                )}
              </div>
              
              {/* Special Instructions */}
              {order.instructions && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-medium text-white">Special Instructions</h4>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed bg-white/5 rounded-xl p-3">
                    {order.instructions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card variant="gradient">
            <CardContent className="p-4 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  Payment
                </h3>
                <Badge 
                  variant="outline"
                  className={cn(
                    order.paymentStatus === 'paid' && "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
                    order.paymentStatus === 'credit' && "text-blue-400 bg-blue-500/20 border-blue-500/30",
                    order.paymentStatus === 'deposit_paid' && "text-amber-400 bg-amber-500/20 border-amber-500/30",
                    order.paymentStatus === 'pending' && "text-red-400 bg-red-500/20 border-red-500/30"
                  )}
                >
                  {order.paymentStatus === 'paid' && (
                    <><CheckCircle2 className="w-3 h-3 mr-1" />Paid</>
                  )}
                  {order.paymentStatus === 'credit' && 'Monthly Bill'}
                  {order.paymentStatus === 'deposit_paid' && 'Deposit Paid'}
                  {order.paymentStatus === 'pending' && 'Pending'}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Order Total</span>
                  <span className="font-medium text-white">{formatCurrency(order.totalAmount)}</span>
                </div>
                
                {order.depositAmount && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Deposit Paid</span>
                    <span className="text-emerald-400">{formatCurrency(order.depositAmount)}</span>
                  </div>
                )}
                
                {order.paymentStatus === 'deposit_paid' && order.balanceAmount && (
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-white/70 font-medium">Balance Due</span>
                    <span className="font-semibold text-amber-400">{formatCurrency(order.balanceAmount)}</span>
                  </div>
                )}
                
                {order.paymentStatus === 'credit' && (
                  <p className="text-xs text-white/40 mt-2">
                    This order will be included in your monthly statement
                  </p>
                )}
              </div>

              {/* Pay Now Button */}
              {needsPayment && (
                <Button 
                  className="w-full mt-4"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay {formatCurrency(amountDue)} Now
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="gradient">
            <CardContent className="p-4 pt-4">
              <h3 className="font-medium text-white mb-4">Progress</h3>
              <div className="space-y-0">
                {ORDER_STAGES.map((stage, index) => {
                  const isCompleted = index < currentIndex
                  const isCurrent = index === currentIndex
                  const isPending = index > currentIndex
                  
                  return (
                    <div key={stage.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full border-2",
                          isCompleted && "bg-primary border-primary",
                          isCurrent && "bg-primary border-primary shadow-[0_0_8px_rgba(94,189,188,0.5)]",
                          isPending && "bg-transparent border-white/20"
                        )} />
                        {index < ORDER_STAGES.length - 1 && (
                          <div className={cn(
                            "w-0.5 h-6",
                            index < currentIndex ? "bg-primary" : "bg-white/10"
                          )} />
                        )}
                      </div>
                      <span className={cn(
                        "text-sm pb-6",
                        isCompleted && "text-primary",
                        isCurrent && "text-white font-medium",
                        isPending && "text-white/30"
                      )}>
                        {stage.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="secondary" className="w-full gap-2">
            <MessageCircle className="w-4 h-4" />
            Message Lab
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
            onClick={() => !paymentSuccess && setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[390px] bg-card rounded-t-3xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-border/50">
                <div>
                  <h2 className="text-lg font-semibold text-white">Pay Balance</h2>
                  <p className="text-sm text-white/50">Order {order.id}</p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="p-5 overflow-auto max-h-[75vh]">
                {paymentSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 flex flex-col items-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-xl font-semibold text-emerald-400">Payment Successful!</p>
                    <p className="text-white/50 mt-2">{formatCurrency(amountDue)} paid</p>
                  </motion.div>
                ) : (
                  <UPIPayment
                    amount={amountDue}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                    onCancel={() => setShowPaymentModal(false)}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
