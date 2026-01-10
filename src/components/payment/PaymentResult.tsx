import { motion } from 'motion/react'
import { 
  CheckCircle2, 
  XCircle, 
  Download, 
  Share2,
  Home,
  FileText,
  Copy,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, type PaymentMethod, getPaymentMethodLabel } from '@/stores/paymentStore'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface PaymentResultProps {
  success: boolean
  amount: number
  transactionId: string | null
  method: PaymentMethod
  orderId: string
  labName: string
  failureReason?: string
  onGoHome: () => void
  onViewOrder: () => void
  onRetry?: () => void
}

export function PaymentResult({
  success,
  amount,
  transactionId,
  method,
  orderId,
  labName,
  failureReason,
  onGoHome,
  onViewOrder,
  onRetry
}: PaymentResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyTransactionId = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadReceipt = () => {
    // In a real app, this would download a PDF receipt
    console.log('Downloading receipt...')
  }

  const handleShare = () => {
    // In a real app, this would open share dialog
    if (navigator.share) {
      navigator.share({
        title: 'Payment Receipt',
        text: `Payment of ${formatCurrency(amount)} for Order ${orderId} was successful.`,
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Success/Failure Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mb-6",
          success 
            ? "bg-emerald-500/20" 
            : "bg-red-500/20"
        )}
      >
        {success ? (
          <CheckCircle2 className="w-14 h-14 text-emerald-400" />
        ) : (
          <XCircle className="w-14 h-14 text-red-400" />
        )}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "text-2xl font-bold mb-2",
          success ? "text-emerald-400" : "text-red-400"
        )}
      >
        {success ? 'Payment Successful!' : 'Payment Failed'}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/60 text-center mb-6"
      >
        {success 
          ? `Your order has been placed with ${labName}`
          : failureReason || 'Something went wrong. Please try again.'
        }
      </motion.p>

      {/* Payment Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <Card variant="gradient">
          <CardContent className="p-5 pt-5">
            {/* Amount */}
            <div className="text-center pb-4 border-b border-white/10">
              <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Amount Paid</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(amount)}</p>
            </div>

            {/* Details */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Order ID</span>
                <span className="text-sm font-medium text-white">{orderId}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Payment Method</span>
                <span className="text-sm font-medium text-white">{getPaymentMethodLabel(method)}</span>
              </div>

              {success && transactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Transaction ID</span>
                  <button
                    onClick={handleCopyTransactionId}
                    className="flex items-center gap-1.5 text-sm font-mono text-primary hover:text-primary/80"
                  >
                    {transactionId.substring(0, 12)}...
                    {copied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Date & Time</span>
                <span className="text-sm font-medium text-white">
                  {new Date().toLocaleDateString('en-IN', { 
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Actions for Success */}
            {success && (
              <div className="flex gap-2 mt-5 pt-4 border-t border-white/10">
                <button
                  onClick={handleDownloadReceipt}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-border/50 text-white/70 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Receipt
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-border/50 text-white/70 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm mt-6 space-y-3"
      >
        {success ? (
          <>
            <Button
              onClick={onViewOrder}
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Order Details
            </Button>
            <Button
              variant="secondary"
              onClick={onGoHome}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </>
        ) : (
          <>
            {onRetry && (
              <Button
                onClick={onRetry}
                className="w-full"
              >
                Try Again
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={onGoHome}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}
