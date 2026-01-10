import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  FileText, 
  CreditCard, 
  AlertCircle,
  ChevronRight,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Download
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePaymentStore, formatCurrency } from '@/stores/paymentStore'
import type { MonthlyStatement, ClinicCreditStatus } from '@/stores/paymentStore'
import { cn } from '@/lib/utils'

type TabType = 'statements' | 'credit'

export function Billing() {
  const { creditStatuses, statements } = usePaymentStore()
  const [activeTab, setActiveTab] = useState<TabType>('statements')
  const [selectedStatement, setSelectedStatement] = useState<MonthlyStatement | null>(null)
  const [selectedCredit, setSelectedCredit] = useState<ClinicCreditStatus | null>(null)

  // Calculate totals
  const totalOutstanding = creditStatuses.reduce((sum, cs) => sum + cs.currentOutstanding, 0)
  const totalOverdue = creditStatuses.reduce((sum, cs) => sum + cs.overdueAmount, 0)
  const pendingStatements = statements.filter(s => s.status === 'pending' || s.status === 'overdue')

  const getStatusColor = (status: MonthlyStatement['status']) => {
    switch (status) {
      case 'paid': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
      case 'partial': return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
      case 'pending': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'overdue': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-white/50 bg-white/5 border-white/10'
    }
  }

  const getCreditStatusColor = (status: ClinicCreditStatus['accountStatus']) => {
    switch (status) {
      case 'active': return 'text-emerald-400'
      case 'on_hold': return 'text-amber-400'
      case 'suspended': return 'text-red-400'
      case 'closed': return 'text-white/40'
      default: return 'text-white/50'
    }
  }

  return (
    <div className="min-h-full bg-atmosphere flex flex-col">
      <Header title="Billing & Payments" showBack />

      <div className="flex-1 px-5 py-4 space-y-5">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gradient-accent">
            <CardContent className="p-5 pt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Total Outstanding</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalOutstanding)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Overdue</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    totalOverdue > 0 ? "text-red-400" : "text-emerald-400"
                  )}>
                    {formatCurrency(totalOverdue)}
                  </p>
                </div>
              </div>

              {pendingStatements.length > 0 && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-400">
                    {pendingStatements.length} pending {pendingStatements.length === 1 ? 'statement' : 'statements'} awaiting payment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'statements' as TabType, label: 'Statements', icon: FileText },
            { id: 'credit' as TabType, label: 'Credit Accounts', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                  activeTab === tab.id
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

        {/* Statements Tab */}
        {activeTab === 'statements' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {statements.map((statement, index) => (
              <motion.div
                key={statement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  variant="gradient"
                  className="cursor-pointer hover:border-white/30 transition-all"
                  onClick={() => setSelectedStatement(statement)}
                >
                  <CardContent className="p-4 pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-white">{statement.labName}</p>
                        <p className="text-xs text-white/50">{statement.month}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(statement.status)}>
                        {statement.status.charAt(0).toUpperCase() + statement.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <p className="text-white/50">Total Due</p>
                          <p className="font-semibold text-white">{formatCurrency(statement.totalDue)}</p>
                        </div>
                        {statement.paidAmount > 0 && (
                          <div>
                            <p className="text-white/50">Paid</p>
                            <p className="font-semibold text-emerald-400">{formatCurrency(statement.paidAmount)}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-white/40">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">Due: {new Date(statement.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {statements.length === 0 && (
              <div className="text-center py-10">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">No statements yet</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Credit Accounts Tab */}
        {activeTab === 'credit' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {creditStatuses.map((credit, index) => (
              <motion.div
                key={credit.labId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  variant="gradient"
                  className="cursor-pointer hover:border-white/30 transition-all"
                  onClick={() => setSelectedCredit(credit)}
                >
                  <CardContent className="p-4 pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white/60" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{credit.labName}</p>
                          <p className={cn("text-xs flex items-center gap-1", getCreditStatusColor(credit.accountStatus))}>
                            {credit.accountStatus === 'active' && <CheckCircle2 className="w-3 h-3" />}
                            {credit.accountStatus === 'on_hold' && <AlertTriangle className="w-3 h-3" />}
                            {credit.accountStatus.charAt(0).toUpperCase() + credit.accountStatus.slice(1)}
                          </p>
                        </div>
                      </div>
                      {credit.creditPending && (
                        <Badge variant="outline" className="text-amber-400 bg-amber-500/20 border-amber-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>

                    {credit.creditApproved && (
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-white/50 text-xs">Credit Limit</p>
                          <p className="font-semibold text-white">{formatCurrency(credit.creditLimit)}</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs">Available</p>
                          <p className="font-semibold text-emerald-400">{formatCurrency(credit.availableCredit)}</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs">Outstanding</p>
                          <p className={cn(
                            "font-semibold",
                            credit.currentOutstanding > 0 ? "text-amber-400" : "text-white/40"
                          )}>
                            {formatCurrency(credit.currentOutstanding)}
                          </p>
                        </div>
                      </div>
                    )}

                    {credit.creditPending && (
                      <p className="text-sm text-white/50">
                        Your credit application is being reviewed
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {creditStatuses.length === 0 && (
              <div className="text-center py-10">
                <CreditCard className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">No credit accounts</p>
                <p className="text-xs text-white/30 mt-1">Apply for credit with your preferred labs</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Statement Detail Modal */}
      <AnimatePresence>
        {selectedStatement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
            onClick={() => setSelectedStatement(null)}
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
                <div>
                  <h2 className="text-lg font-semibold text-white">{selectedStatement.labName}</h2>
                  <p className="text-sm text-white/50">{selectedStatement.month}</p>
                </div>
                <button
                  onClick={() => setSelectedStatement(null)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="p-5 space-y-5 overflow-auto max-h-[60vh]">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50">Total Due</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(selectedStatement.totalDue)}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50">Due Date</p>
                    <p className="text-xl font-bold text-white">
                      {new Date(selectedStatement.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Previous Balance</span>
                    <span className="text-white">{formatCurrency(selectedStatement.previousBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Current Charges</span>
                    <span className="text-white">{formatCurrency(selectedStatement.currentCharges)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Payments</span>
                    <span className="text-emerald-400">-{formatCurrency(selectedStatement.payments)}</span>
                  </div>
                  {selectedStatement.adjustments !== 0 && (
                    <div className="flex justify-between">
                      <span className="text-white/50">Adjustments</span>
                      <span className={selectedStatement.adjustments > 0 ? "text-red-400" : "text-emerald-400"}>
                        {selectedStatement.adjustments > 0 ? '+' : ''}{formatCurrency(selectedStatement.adjustments)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Line Items */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Order Details</h3>
                  <div className="space-y-2">
                    {selectedStatement.lineItems.map((item) => (
                      <div 
                        key={item.orderId}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{item.caseType}</p>
                          <p className="text-xs text-white/50">{item.description}</p>
                          <p className="text-xs text-white/40">
                            {new Date(item.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                        <p className="font-medium text-white">{formatCurrency(item.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  {selectedStatement.status !== 'paid' && (
                    <Button className="flex-1">
                      Pay {formatCurrency(selectedStatement.totalDue - selectedStatement.paidAmount)}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Credit Detail Modal */}
      <AnimatePresence>
        {selectedCredit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
            onClick={() => setSelectedCredit(null)}
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
                <div>
                  <h2 className="text-lg font-semibold text-white">{selectedCredit.labName}</h2>
                  <p className={cn("text-sm flex items-center gap-1", getCreditStatusColor(selectedCredit.accountStatus))}>
                    {selectedCredit.accountStatus === 'active' && <CheckCircle2 className="w-4 h-4" />}
                    Credit Account
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCredit(null)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="p-5 space-y-5 overflow-auto max-h-[60vh]">
                {/* Credit Limit Visual */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">Credit Used</span>
                    <span className="text-white">
                      {formatCurrency(selectedCredit.currentOutstanding)} of {formatCurrency(selectedCredit.creditLimit)}
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        (selectedCredit.currentOutstanding / selectedCredit.creditLimit) > 0.8
                          ? "bg-red-500"
                          : (selectedCredit.currentOutstanding / selectedCredit.creditLimit) > 0.5
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      )}
                      style={{ width: `${(selectedCredit.currentOutstanding / selectedCredit.creditLimit) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-emerald-400 mt-2">
                    {formatCurrency(selectedCredit.availableCredit)} available
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Payment Terms</span>
                    <span className="text-white capitalize">
                      {selectedCredit.paymentTerms?.replace('_', ' ') || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/50">Billing Cycle</span>
                    <span className="text-white capitalize">{selectedCredit.billingCycle}</span>
                  </div>
                  {selectedCredit.nextDueDate && (
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/50">Next Due Date</span>
                      <span className="text-white">
                        {new Date(selectedCredit.nextDueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {selectedCredit.lastPaymentDate && (
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/50">Last Payment</span>
                      <span className="text-white">
                        {new Date(selectedCredit.lastPaymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {selectedCredit.creditApprovedDate && (
                    <div className="flex justify-between py-2">
                      <span className="text-white/50">Account Since</span>
                      <span className="text-white">
                        {new Date(selectedCredit.creditApprovedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selectedCredit.currentOutstanding > 0 && (
                  <Button className="w-full">
                    Pay Outstanding {formatCurrency(selectedCredit.currentOutstanding)}
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
