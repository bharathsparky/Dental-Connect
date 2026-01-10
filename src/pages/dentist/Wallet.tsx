import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Wallet as WalletIcon,
  Smartphone,
  CreditCard,
  Building2,
  X,
  Check,
  Loader2
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePaymentStore, formatCurrency, type PaymentMethod } from '@/stores/paymentStore'
import { cn } from '@/lib/utils'

const ADD_AMOUNTS = [500, 1000, 2000, 5000, 10000]

const PAYMENT_METHODS = [
  { id: 'upi' as PaymentMethod, label: 'UPI', icon: Smartphone, description: 'GPay, PhonePe, Paytm' },
  { id: 'card' as PaymentMethod, label: 'Card', icon: CreditCard, description: 'Credit/Debit Card' },
  { id: 'bank_transfer' as PaymentMethod, label: 'Bank', icon: Building2, description: 'NEFT/RTGS/IMPS' }
]

export function Wallet() {
  const { wallet, addWalletBalance } = usePaymentStore()
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const amount = selectedAmount || (customAmount ? parseInt(customAmount) : 0)

  const handleAddMoney = async () => {
    if (amount < 100 || !selectedMethod) return

    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Add to wallet
    addWalletBalance(amount, selectedMethod, `TXN${Date.now()}`)
    
    setIsProcessing(false)
    setShowSuccess(true)
    
    // Reset after delay
    setTimeout(() => {
      setShowSuccess(false)
      setShowAddMoney(false)
      setSelectedAmount(null)
      setCustomAmount('')
      setSelectedMethod(null)
    }, 2000)
  }

  return (
    <div className="min-h-full bg-atmosphere flex flex-col">
      <Header title="Wallet" showBack />

      <div className="flex-1 px-5 py-4 space-y-5">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gradient-accent">
            <CardContent className="p-6 pt-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <WalletIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Available Balance</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(wallet.balance)}</p>
                </div>
              </div>

              <Button
                onClick={() => setShowAddMoney(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Transaction History</h2>
            <Badge variant="outline" className="text-xs">
              {wallet.transactions.length} transactions
            </Badge>
          </div>

          <div className="space-y-2">
            {wallet.transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="gradient">
                  <CardContent className="p-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        transaction.type === 'credit' 
                          ? "bg-emerald-500/20" 
                          : "bg-red-500/20"
                      )}>
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{transaction.description}</p>
                        <p className="text-xs text-white/50">
                          {new Date(transaction.timestamp).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-semibold",
                          transaction.type === 'credit' ? "text-emerald-400" : "text-red-400"
                        )}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            transaction.status === 'completed' 
                              ? "text-emerald-400 border-emerald-400/30"
                              : "text-amber-400 border-amber-400/30"
                          )}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {wallet.transactions.length === 0 && (
              <div className="text-center py-10">
                <WalletIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">No transactions yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Money Modal */}
      <AnimatePresence>
        {showAddMoney && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
            onClick={() => !isProcessing && setShowAddMoney(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[390px] bg-card rounded-t-3xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-border/50">
                <h2 className="text-lg font-semibold text-white">Add Money to Wallet</h2>
                <button
                  onClick={() => !isProcessing && setShowAddMoney(false)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <Check className="w-10 h-10 text-emerald-400" />
                  </div>
                  <p className="text-xl font-semibold text-emerald-400">Money Added!</p>
                  <p className="text-white/50 mt-2">{formatCurrency(amount)} added to your wallet</p>
                </motion.div>
              ) : (
                <div className="p-5 space-y-5 overflow-auto max-h-[70vh]">
                  {/* Amount Selection */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">Select Amount</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {ADD_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => {
                            setSelectedAmount(amt)
                            setCustomAmount('')
                          }}
                          className={cn(
                            "py-3 rounded-xl text-sm font-medium transition-all",
                            selectedAmount === amt
                              ? "bg-primary text-primary-foreground"
                              : "bg-white/5 text-white/70 hover:text-white border border-border/50"
                          )}
                        >
                          {formatCurrency(amt)}
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="mt-3">
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value)
                          setSelectedAmount(null)
                        }}
                        placeholder="Enter custom amount"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border/50 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
                      />
                      {customAmount && parseInt(customAmount) < 100 && (
                        <p className="text-xs text-amber-400 mt-2">Minimum amount is ₹100</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">Payment Method</h3>
                    <div className="space-y-2">
                      {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon
                        const isSelected = selectedMethod === method.id
                        return (
                          <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={cn(
                              "w-full p-4 rounded-xl border transition-all text-left flex items-center gap-3",
                              isSelected
                                ? "bg-primary/20 border-primary"
                                : "bg-white/5 border-border/50 hover:border-white/30"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              isSelected ? "bg-primary/30" : "bg-white/5"
                            )}>
                              <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-white/60")} />
                            </div>
                            <div className="flex-1">
                              <p className={cn("font-medium", isSelected ? "text-primary" : "text-white")}>
                                {method.label}
                              </p>
                              <p className="text-xs text-white/50">{method.description}</p>
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Add Money Button */}
                  <Button
                    onClick={handleAddMoney}
                    disabled={amount < 100 || !selectedMethod || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Add {amount >= 100 ? formatCurrency(amount) : 'Money'}</>
                    )}
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
