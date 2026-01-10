import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Building2, 
  Wallet, 
  FileText,
  Check,
  ChevronRight,
  Clock,
  Percent,
  AlertCircle,
  Info
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  usePaymentStore, 
  formatCurrency,
  type PaymentMethod,
  type PaymentTiming,
  type AvailablePaymentOptions
} from '@/stores/paymentStore'
import { cn } from '@/lib/utils'

interface PaymentSelectorProps {
  labId: string
  orderAmount: number
  onPaymentSelected: (timing: PaymentTiming, method: PaymentMethod) => void
}

const PAYMENT_TIMING_OPTIONS = [
  {
    id: 'prepaid' as PaymentTiming,
    label: 'Pay Now',
    description: 'Complete payment before lab starts work',
    icon: CreditCard
  },
  {
    id: 'on_delivery' as PaymentTiming,
    label: 'Pay on Delivery',
    description: 'Pay when you receive the order',
    icon: Clock
  },
  {
    id: 'credit' as PaymentTiming,
    label: 'Add to Monthly Bill',
    description: 'Pay at the end of billing cycle',
    icon: FileText
  }
]

const PAYMENT_METHOD_OPTIONS = [
  {
    id: 'upi' as PaymentMethod,
    label: 'UPI',
    description: 'GPay, PhonePe, Paytm',
    icon: Smartphone,
    popular: true
  },
  {
    id: 'card' as PaymentMethod,
    label: 'Credit/Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
    popular: false
  },
  {
    id: 'wallet' as PaymentMethod,
    label: 'DentConnect Wallet',
    description: 'Pay from wallet balance',
    icon: Wallet,
    popular: false
  },
  {
    id: 'cash' as PaymentMethod,
    label: 'Cash',
    description: 'Pay cash on delivery',
    icon: Banknote,
    popular: false
  },
  {
    id: 'bank_transfer' as PaymentMethod,
    label: 'Bank Transfer',
    description: 'NEFT, RTGS, IMPS',
    icon: Building2,
    popular: false
  }
]

export function PaymentSelector({ labId, orderAmount, onPaymentSelected }: PaymentSelectorProps) {
  const { getLabPaymentOptions, wallet } = usePaymentStore()
  const [selectedTiming, setSelectedTiming] = useState<PaymentTiming | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  const options: AvailablePaymentOptions = getLabPaymentOptions(labId, orderAmount)

  // Calculate final amount based on timing
  const getFinalAmount = (timing: PaymentTiming | null) => {
    if (timing === 'prepaid' && options.prepaidDiscount > 0) {
      return orderAmount - options.prepaidDiscountAmount
    }
    return orderAmount
  }

  const finalAmount = getFinalAmount(selectedTiming)
  const depositRequired = options.requiresDeposit && selectedTiming === 'prepaid'

  // Get available methods for selected timing
  const getAvailableMethodsForTiming = (timing: PaymentTiming): PaymentMethod[] => {
    if (timing === 'on_delivery') {
      return ['cash', 'upi'] // Only cash and UPI on delivery
    }
    if (timing === 'credit') {
      return ['credit'] // Credit is automatic
    }
    // Prepaid - all methods except cash and credit
    return options.availableMethods.filter(m => m !== 'cash' && m !== 'credit')
  }

  const handleTimingSelect = (timing: PaymentTiming) => {
    setSelectedTiming(timing)
    setSelectedMethod(null)

    // If credit, auto-select credit method
    if (timing === 'credit') {
      setSelectedMethod('credit')
    }
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
  }

  const handleContinue = () => {
    if (selectedTiming && selectedMethod) {
      onPaymentSelected(selectedTiming, selectedMethod)
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Amount Summary */}
      <Card variant="gradient-accent">
        <CardContent className="p-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60">Order Total</span>
            <span className="text-xl font-semibold text-white">{formatCurrency(orderAmount)}</span>
          </div>
          
          {selectedTiming === 'prepaid' && options.prepaidDiscount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-3 border-t border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <Percent className="w-4 h-4" />
                  Prepaid Discount ({options.prepaidDiscount}%)
                </span>
                <span className="text-emerald-400">-{formatCurrency(options.prepaidDiscountAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">You Pay</span>
                <span className="text-lg font-semibold text-primary">{formatCurrency(finalAmount)}</span>
              </div>
            </motion.div>
          )}

          {depositRequired && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-amber-400 font-medium">Deposit Required</p>
                  <p className="text-white/60 mt-0.5">
                    Pay {formatCurrency(options.depositAmount)} now, balance {formatCurrency(finalAmount - options.depositAmount)} on delivery
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Payment Timing Selection */}
      <div>
        <h3 className="font-medium text-white mb-3">When do you want to pay?</h3>
        <div className="space-y-2">
          {PAYMENT_TIMING_OPTIONS.map((timing) => {
            const isAvailable = 
              (timing.id === 'prepaid' && options.canPayNow) ||
              (timing.id === 'on_delivery' && options.canPayOnDelivery) ||
              (timing.id === 'credit' && options.canUseCredit)

            const isSelected = selectedTiming === timing.id
            const Icon = timing.icon

            return (
              <button
                key={timing.id}
                onClick={() => isAvailable && handleTimingSelect(timing.id)}
                disabled={!isAvailable}
                className={cn(
                  "w-full p-4 rounded-xl border transition-all text-left",
                  isSelected 
                    ? "bg-primary/20 border-primary"
                    : isAvailable
                      ? "bg-card border-border/50 hover:border-white/30"
                      : "bg-card/50 border-border/30 opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isSelected ? "bg-primary/30" : "bg-white/5"
                  )}>
                    <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-white/60")} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-medium", isSelected ? "text-primary" : "text-white")}>
                        {timing.label}
                      </span>
                      {timing.id === 'prepaid' && options.prepaidDiscount > 0 && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                          Save {options.prepaidDiscount}%
                        </Badge>
                      )}
                      {timing.id === 'credit' && options.canUseCredit && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          {formatCurrency(options.creditAvailable)} available
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">{timing.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* COD exceeded message */}
                {timing.id === 'on_delivery' && options.codExceeded && (
                  <p className="text-xs text-red-400 mt-2 ml-13">
                    Not available for orders above ₹15,000
                  </p>
                )}

                {/* Credit exceeded message */}
                {timing.id === 'credit' && options.creditExceeded && (
                  <p className="text-xs text-amber-400 mt-2 ml-13">
                    Exceeds available credit limit
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Payment Method Selection */}
      <AnimatePresence>
        {selectedTiming && selectedTiming !== 'credit' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="font-medium text-white mb-3">Choose payment method</h3>
            <div className="space-y-2">
              {PAYMENT_METHOD_OPTIONS.map((method) => {
                const availableMethods = getAvailableMethodsForTiming(selectedTiming)
                const isAvailable = availableMethods.includes(method.id)
                const isSelected = selectedMethod === method.id
                const Icon = method.icon

                // Special handling for wallet
                const isWalletInsufficient = method.id === 'wallet' && wallet.balance < finalAmount

                if (!isAvailable && method.id !== 'wallet') return null

                return (
                  <button
                    key={method.id}
                    onClick={() => isAvailable && !isWalletInsufficient && handleMethodSelect(method.id)}
                    disabled={!isAvailable || isWalletInsufficient}
                    className={cn(
                      "w-full p-4 rounded-xl border transition-all text-left",
                      isSelected 
                        ? "bg-primary/20 border-primary"
                        : isAvailable && !isWalletInsufficient
                          ? "bg-card border-border/50 hover:border-white/30"
                          : "bg-card/50 border-border/30 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        isSelected ? "bg-primary/30" : "bg-white/5"
                      )}>
                        <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-white/60")} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-medium", isSelected ? "text-primary" : "text-white")}>
                            {method.label}
                          </span>
                          {method.popular && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-white/50 mt-0.5">
                          {method.id === 'wallet' 
                            ? `Balance: ${formatCurrency(wallet.balance)}`
                            : method.description
                          }
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    {isWalletInsufficient && (
                      <p className="text-xs text-amber-400 mt-2 ml-13">
                        Insufficient balance. Add {formatCurrency(finalAmount - wallet.balance)} more.
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages/Info */}
      {options.messages.length > 0 && (
        <div className="space-y-2">
          {options.messages.map((message, index) => (
            <div 
              key={index}
              className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl"
            >
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-400">{message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedTiming || !selectedMethod}
        className={cn(
          "w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
          selectedTiming && selectedMethod
            ? "bg-primary text-primary-foreground hover:brightness-110"
            : "bg-white/10 text-white/40 cursor-not-allowed"
        )}
      >
        {selectedTiming === 'credit' ? (
          <>Place Order & Add to Bill</>
        ) : selectedTiming === 'on_delivery' ? (
          <>Confirm Order (Pay {formatCurrency(depositRequired ? options.depositAmount : 0)} now)</>
        ) : (
          <>Pay {formatCurrency(depositRequired ? options.depositAmount : finalAmount)} Now</>
        )}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
