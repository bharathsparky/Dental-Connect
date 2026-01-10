import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { 
  Copy, 
  Check, 
  Loader2,
  RefreshCcw,
  Smartphone,
  QrCode,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/stores/paymentStore'
import { cn } from '@/lib/utils'

interface UPIPaymentProps {
  amount: number
  onSuccess: (transactionId: string) => void
  onFailure: (reason: string) => void
  onCancel: () => void
}

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: '🔵', color: 'bg-blue-500/20 border-blue-500/30' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'bg-purple-500/20 border-purple-500/30' },
  { id: 'paytm', name: 'Paytm', icon: '🔵', color: 'bg-cyan-500/20 border-cyan-500/30' },
  { id: 'bhim', name: 'BHIM', icon: '🟢', color: 'bg-green-500/20 border-green-500/30' }
]

type PaymentMode = 'qr' | 'upi_id' | 'apps'

export function UPIPayment({ amount, onSuccess, onFailure, onCancel }: UPIPaymentProps) {
  const [mode, setMode] = useState<PaymentMode>('qr')
  const [upiId, setUpiId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [checkingStatus, setCheckingStatus] = useState(false)

  // Mock UPI ID for the lab
  const labUpiId = 'dentlab@upi'

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onFailure('Payment timeout. Please try again.')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onFailure])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(labUpiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePayViaUpiId = async () => {
    if (!upiId.includes('@')) {
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock success
    onSuccess(`UPI${Date.now()}`)
  }

  const handlePayViaApp = async (appId: string) => {
    setIsProcessing(true)
    
    // In a real app, this would open the UPI app via deep link
    // upi://pay?pa=dentlab@upi&pn=DentLab&am=1000&cu=INR&tn=Order123
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock success
    onSuccess(`${appId.toUpperCase()}${Date.now()}`)
  }

  const handleCheckStatus = async () => {
    setCheckingStatus(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCheckingStatus(false)
    
    // In a real app, this would poll the server for payment status
    // For demo, we'll show it's still pending
  }

  return (
    <div className="space-y-6">
      {/* Amount & Timer */}
      <Card variant="gradient-accent">
        <CardContent className="p-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wide">Amount to Pay</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(amount)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50 uppercase tracking-wide">Time Left</p>
              <p className={cn(
                "text-xl font-mono font-semibold",
                timeLeft <= 60 ? "text-red-400" : "text-amber-400"
              )}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Mode Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'qr' as PaymentMode, label: 'Scan QR', icon: QrCode },
          { id: 'apps' as PaymentMode, label: 'UPI Apps', icon: Smartphone },
          { id: 'upi_id' as PaymentMode, label: 'Enter UPI ID', icon: ArrowRight }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                mode === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50 text-white/70 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* QR Code Mode */}
      {mode === 'qr' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* QR Code */}
          <Card variant="gradient">
            <CardContent className="p-6 pt-6 flex flex-col items-center">
              <div className="w-48 h-48 bg-white rounded-2xl p-3 mb-4">
                {/* Mock QR Code - In real app, generate actual QR */}
                <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23000%22 x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2220%22 y=%2210%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2230%22 y=%2210%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2210%22 y=%2220%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2230%22 y=%2220%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2210%22 y=%2230%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2220%22 y=%2230%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2230%22 y=%2230%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2260%22 y=%2210%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2270%22 y=%2210%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2280%22 y=%2210%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2260%22 y=%2220%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2280%22 y=%2220%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2260%22 y=%2230%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2270%22 y=%2230%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2280%22 y=%2230%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2240%22 y=%2240%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2250%22 y=%2240%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2210%22 y=%2260%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2220%22 y=%2260%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2230%22 y=%2260%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2210%22 y=%2270%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2230%22 y=%2270%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2210%22 y=%2280%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2220%22 y=%2280%22 width=%2210%22 height=%2210%22/%3E%3Crect fill=%22%23000%22 x=%2230%22 y=%2280%22 width=%2210%22 height=%2210%22/%3E%3C/svg%3E')] bg-contain" />
              </div>
              <p className="text-sm text-white/60 text-center">
                Scan this QR code with any UPI app
              </p>
            </CardContent>
          </Card>

          {/* Lab UPI ID */}
          <div className="flex items-center gap-2 p-3 bg-card rounded-xl border border-border/50">
            <span className="text-white/50 text-sm">UPI ID:</span>
            <span className="flex-1 font-mono text-white">{labUpiId}</span>
            <button
              onClick={handleCopyUpiId}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
            </button>
          </div>

          {/* Check Status Button */}
          <button
            onClick={handleCheckStatus}
            disabled={checkingStatus}
            className="w-full py-3 rounded-xl bg-white/5 border border-border/50 text-white/70 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            {checkingStatus ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking payment status...
              </>
            ) : (
              <>
                <RefreshCcw className="w-4 h-4" />
                I've made the payment
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* UPI Apps Mode */}
      {mode === 'apps' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <p className="text-sm text-white/50 text-center mb-4">
            Select your UPI app to pay
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {UPI_APPS.map((app) => (
              <button
                key={app.id}
                onClick={() => handlePayViaApp(app.id)}
                disabled={isProcessing}
                className={cn(
                  "p-4 rounded-xl border transition-all flex flex-col items-center gap-2",
                  app.color,
                  "hover:brightness-110"
                )}
              >
                <span className="text-3xl">{app.icon}</span>
                <span className="text-sm font-medium text-white">{app.name}</span>
              </button>
            ))}
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 py-4 text-primary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Opening {UPI_APPS.find(a => a.id === 'gpay')?.name}...</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Enter UPI ID Mode */}
      {mode === 'upi_id' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm text-white/60 mb-2 block">Enter your UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
            />
            {upiId && !upiId.includes('@') && (
              <p className="text-xs text-red-400 mt-2">Please enter a valid UPI ID (e.g., name@upi)</p>
            )}
          </div>

          <button
            onClick={handlePayViaUpiId}
            disabled={isProcessing || !upiId.includes('@')}
            className={cn(
              "w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
              upiId.includes('@')
                ? "bg-primary text-primary-foreground hover:brightness-110"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending payment request...
              </>
            ) : (
              <>
                Pay {formatCurrency(amount)}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-xs text-white/40 text-center">
            You'll receive a payment request on your UPI app
          </p>
        </motion.div>
      )}

      {/* Cancel Button */}
      <button
        onClick={onCancel}
        className="w-full py-3 text-sm text-white/50 hover:text-white transition-colors"
      >
        Cancel Payment
      </button>
    </div>
  )
}
