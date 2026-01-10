import { create } from 'zustand'

// ============================================
// PAYMENT TYPES & INTERFACES
// ============================================

// Payment methods
export type PaymentMethod = 'upi' | 'card' | 'cash' | 'bank_transfer' | 'wallet' | 'credit'

// Payment timing options
export type PaymentTiming = 'prepaid' | 'on_delivery' | 'credit'

// Payment status
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled'

// Credit/Billing terms
export type CreditTerms = 'net_7' | 'net_15' | 'net_30' | 'monthly' | null

// Billing cycle
export type BillingCycle = 'weekly' | 'bi_weekly' | 'monthly'

// UPI Apps for quick pay
export type UPIApp = 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'other'

// ============================================
// LAB PAYMENT POLICY
// ============================================

export interface LabPaymentPolicy {
  labId: string
  // Payment methods accepted
  acceptedMethods: PaymentMethod[]
  // Timing options
  acceptsPrepaid: boolean
  acceptsCOD: boolean
  offersCredit: boolean
  // Credit terms (if credit is offered)
  creditTerms: CreditTerms
  minimumOrderForCredit: number // Minimum order value to use credit
  creditApplicationRequired: boolean // Does clinic need to apply for credit?
  // Deposit requirements
  depositRequired: boolean
  depositPercentage: number // e.g., 30 means 30%
  depositThreshold: number // Orders above this amount require deposit
  // COD limits
  maxCODAmount: number // Maximum order value for COD
  // Discounts
  prepaidDiscount: number // Discount % for prepaid orders
}

// ============================================
// CLINIC CREDIT STATUS (per lab)
// ============================================

export interface ClinicCreditStatus {
  labId: string
  labName: string
  // Credit approval
  creditApproved: boolean
  creditPending: boolean // Application pending
  creditRejected: boolean
  rejectionReason: string | null
  // Credit terms
  creditLimit: number
  availableCredit: number // creditLimit - currentOutstanding
  currentOutstanding: number
  overdueAmount: number
  // Payment terms
  paymentTerms: CreditTerms
  billingCycle: BillingCycle
  // Dates
  creditApprovedDate: string | null
  lastPaymentDate: string | null
  nextDueDate: string | null
  // Status
  accountStatus: 'active' | 'on_hold' | 'suspended' | 'closed'
  holdReason: string | null
}

// ============================================
// ORDER PAYMENT
// ============================================

export interface OrderPayment {
  orderId: string
  // Amounts
  subtotal: number
  discount: number
  discountReason: string | null
  taxes: number
  deliveryCharge: number
  totalAmount: number
  // Deposit (if applicable)
  depositAmount: number | null
  depositPaid: boolean
  depositPaidAt: string | null
  depositMethod: PaymentMethod | null
  depositTransactionId: string | null
  // Balance
  balanceAmount: number
  balancePaid: boolean
  balancePaidAt: string | null
  balanceMethod: PaymentMethod | null
  balanceTransactionId: string | null
  // Overall status
  paymentTiming: PaymentTiming
  paymentStatus: PaymentStatus
  // Credit (if paid via credit)
  addedToCredit: boolean
  creditStatementId: string | null
}

// ============================================
// WALLET
// ============================================

export interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  orderId: string | null
  labId: string | null
  method: PaymentMethod | null // How money was added (for credits)
  status: 'completed' | 'pending' | 'failed'
  timestamp: string
  referenceId: string | null
}

export interface Wallet {
  balance: number
  transactions: WalletTransaction[]
  lastUpdated: string
}

// ============================================
// MONTHLY STATEMENT / INVOICE
// ============================================

export interface StatementLineItem {
  orderId: string
  orderDate: string
  caseType: string
  description: string
  amount: number
}

export interface MonthlyStatement {
  id: string
  labId: string
  labName: string
  // Period
  periodStart: string
  periodEnd: string
  month: string // e.g., "January 2026"
  // Amounts
  previousBalance: number
  currentCharges: number
  payments: number
  adjustments: number
  totalDue: number
  minimumDue: number
  // Line items
  lineItems: StatementLineItem[]
  // Dates
  statementDate: string
  dueDate: string
  // Status
  status: 'pending' | 'partial' | 'paid' | 'overdue'
  paidAmount: number
  paidAt: string | null
}

// ============================================
// PAYMENT TRANSACTION
// ============================================

export interface PaymentTransaction {
  id: string
  // What's being paid
  type: 'order' | 'deposit' | 'balance' | 'statement' | 'wallet_topup'
  orderId: string | null
  statementId: string | null
  // Payment details
  amount: number
  method: PaymentMethod
  // UPI specific
  upiId: string | null
  upiApp: UPIApp | null
  // Card specific
  cardLast4: string | null
  cardBrand: string | null
  // Bank transfer specific
  bankRefNumber: string | null
  // Transaction status
  status: PaymentStatus
  failureReason: string | null
  // Timestamps
  initiatedAt: string
  completedAt: string | null
  // Reference
  transactionId: string | null
  receiptUrl: string | null
}

// ============================================
// STORE STATE
// ============================================

interface PaymentState {
  // Wallet
  wallet: Wallet
  
  // Credit status with different labs
  creditStatuses: ClinicCreditStatus[]
  
  // Pending payments
  pendingPayments: OrderPayment[]
  
  // Transaction history
  transactions: PaymentTransaction[]
  
  // Monthly statements
  statements: MonthlyStatement[]
  
  // Current payment flow state
  currentPayment: {
    orderId: string | null
    amount: number
    method: PaymentMethod | null
    timing: PaymentTiming | null
    step: 'select_timing' | 'select_method' | 'processing' | 'success' | 'failed'
  }
  
  // Actions
  setCurrentPayment: (payment: Partial<PaymentState['currentPayment']>) => void
  addWalletBalance: (amount: number, method: PaymentMethod, referenceId: string) => void
  deductWalletBalance: (amount: number, orderId: string, description: string) => void
  getCreditStatus: (labId: string) => ClinicCreditStatus | undefined
  addTransaction: (transaction: PaymentTransaction) => void
  markOrderPaid: (orderId: string, method: PaymentMethod, transactionId: string) => void
  getLabPaymentOptions: (labId: string, orderAmount: number) => AvailablePaymentOptions
  resetCurrentPayment: () => void
}

// ============================================
// AVAILABLE PAYMENT OPTIONS (computed)
// ============================================

export interface AvailablePaymentOptions {
  // Timing options
  canPayNow: boolean
  canPayOnDelivery: boolean
  canUseCredit: boolean
  // Method options
  availableMethods: PaymentMethod[]
  // Constraints
  requiresDeposit: boolean
  depositAmount: number
  prepaidDiscount: number
  prepaidDiscountAmount: number
  // Credit info
  creditAvailable: number
  creditExceeded: boolean
  // COD info
  codAllowed: boolean
  codExceeded: boolean
  // Messages
  messages: string[]
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_WALLET: Wallet = {
  balance: 2500,
  transactions: [
    {
      id: 'wt1',
      type: 'credit',
      amount: 5000,
      description: 'Added via UPI',
      orderId: null,
      labId: null,
      method: 'upi',
      status: 'completed',
      timestamp: '2026-01-05T10:30:00Z',
      referenceId: 'UPI123456789'
    },
    {
      id: 'wt2',
      type: 'debit',
      amount: 1500,
      description: 'Payment for Order #ORD-001',
      orderId: 'order-1',
      labId: 'lab-1',
      method: null,
      status: 'completed',
      timestamp: '2026-01-06T14:20:00Z',
      referenceId: null
    },
    {
      id: 'wt3',
      type: 'debit',
      amount: 1000,
      description: 'Payment for Order #ORD-002',
      orderId: 'order-2',
      labId: 'lab-2',
      method: null,
      status: 'completed',
      timestamp: '2026-01-08T09:15:00Z',
      referenceId: null
    }
  ],
  lastUpdated: '2026-01-08T09:15:00Z'
}

const MOCK_CREDIT_STATUSES: ClinicCreditStatus[] = [
  {
    labId: 'lab-1',
    labName: 'Precision Dental Lab',
    creditApproved: true,
    creditPending: false,
    creditRejected: false,
    rejectionReason: null,
    creditLimit: 50000,
    availableCredit: 35000,
    currentOutstanding: 15000,
    overdueAmount: 0,
    paymentTerms: 'monthly',
    billingCycle: 'monthly',
    creditApprovedDate: '2025-06-15',
    lastPaymentDate: '2025-12-28',
    nextDueDate: '2026-01-31',
    accountStatus: 'active',
    holdReason: null
  },
  {
    labId: 'lab-2',
    labName: 'Elite Prosthodontics',
    creditApproved: true,
    creditPending: false,
    creditRejected: false,
    rejectionReason: null,
    creditLimit: 30000,
    availableCredit: 22000,
    currentOutstanding: 8000,
    overdueAmount: 0,
    paymentTerms: 'net_15',
    billingCycle: 'bi_weekly',
    creditApprovedDate: '2025-08-20',
    lastPaymentDate: '2026-01-02',
    nextDueDate: '2026-01-20',
    accountStatus: 'active',
    holdReason: null
  },
  {
    labId: 'lab-3',
    labName: 'Smile Crafters Lab',
    creditApproved: false,
    creditPending: true,
    creditRejected: false,
    rejectionReason: null,
    creditLimit: 0,
    availableCredit: 0,
    currentOutstanding: 0,
    overdueAmount: 0,
    paymentTerms: null,
    billingCycle: 'monthly',
    creditApprovedDate: null,
    lastPaymentDate: null,
    nextDueDate: null,
    accountStatus: 'active',
    holdReason: null
  }
]

const MOCK_STATEMENTS: MonthlyStatement[] = [
  {
    id: 'stmt-1',
    labId: 'lab-1',
    labName: 'Precision Dental Lab',
    periodStart: '2025-12-01',
    periodEnd: '2025-12-31',
    month: 'December 2025',
    previousBalance: 5000,
    currentCharges: 18000,
    payments: 8000,
    adjustments: 0,
    totalDue: 15000,
    minimumDue: 5000,
    lineItems: [
      { orderId: 'ord-101', orderDate: '2025-12-05', caseType: 'Crown', description: 'Zirconia Crown #14', amount: 4500 },
      { orderId: 'ord-102', orderDate: '2025-12-12', caseType: 'Bridge', description: '3-unit Bridge #21-23', amount: 8500 },
      { orderId: 'ord-103', orderDate: '2025-12-20', caseType: 'Denture', description: 'Full Upper Denture', amount: 5000 }
    ],
    statementDate: '2026-01-01',
    dueDate: '2026-01-31',
    status: 'pending',
    paidAmount: 0,
    paidAt: null
  },
  {
    id: 'stmt-2',
    labId: 'lab-2',
    labName: 'Elite Prosthodontics',
    periodStart: '2025-12-16',
    periodEnd: '2025-12-31',
    month: 'Dec 16-31, 2025',
    previousBalance: 0,
    currentCharges: 8000,
    payments: 0,
    adjustments: 0,
    totalDue: 8000,
    minimumDue: 8000,
    lineItems: [
      { orderId: 'ord-201', orderDate: '2025-12-18', caseType: 'Implant', description: 'Implant Crown #36', amount: 8000 }
    ],
    statementDate: '2026-01-01',
    dueDate: '2026-01-20',
    status: 'pending',
    paidAmount: 0,
    paidAt: null
  }
]

// Lab payment policies (would be fetched from server)
export const LAB_PAYMENT_POLICIES: Record<string, LabPaymentPolicy> = {
  'lab-1': {
    labId: 'lab-1',
    acceptedMethods: ['upi', 'card', 'cash', 'bank_transfer', 'wallet', 'credit'],
    acceptsPrepaid: true,
    acceptsCOD: true,
    offersCredit: true,
    creditTerms: 'monthly',
    minimumOrderForCredit: 1000,
    creditApplicationRequired: true,
    depositRequired: true,
    depositPercentage: 30,
    depositThreshold: 20000, // Deposit required for orders > 20k
    maxCODAmount: 15000,
    prepaidDiscount: 5
  },
  'lab-2': {
    labId: 'lab-2',
    acceptedMethods: ['upi', 'card', 'cash', 'wallet', 'credit'],
    acceptsPrepaid: true,
    acceptsCOD: true,
    offersCredit: true,
    creditTerms: 'net_15',
    minimumOrderForCredit: 2000,
    creditApplicationRequired: true,
    depositRequired: false,
    depositPercentage: 0,
    depositThreshold: 0,
    maxCODAmount: 10000,
    prepaidDiscount: 3
  },
  'lab-3': {
    labId: 'lab-3',
    acceptedMethods: ['upi', 'card', 'cash', 'wallet'],
    acceptsPrepaid: true,
    acceptsCOD: true,
    offersCredit: false, // No credit for new relationships
    creditTerms: null,
    minimumOrderForCredit: 0,
    creditApplicationRequired: false,
    depositRequired: false,
    depositPercentage: 0,
    depositThreshold: 0,
    maxCODAmount: 20000,
    prepaidDiscount: 2
  }
}

// Default policy for labs without specific policy
const DEFAULT_POLICY: LabPaymentPolicy = {
  labId: 'default',
  acceptedMethods: ['upi', 'card', 'cash', 'wallet'],
  acceptsPrepaid: true,
  acceptsCOD: true,
  offersCredit: false,
  creditTerms: null,
  minimumOrderForCredit: 0,
  creditApplicationRequired: false,
  depositRequired: false,
  depositPercentage: 0,
  depositThreshold: 0,
  maxCODAmount: 15000,
  prepaidDiscount: 0
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const usePaymentStore = create<PaymentState>((set, get) => ({
  wallet: MOCK_WALLET,
  creditStatuses: MOCK_CREDIT_STATUSES,
  pendingPayments: [],
  transactions: [],
  statements: MOCK_STATEMENTS,
  currentPayment: {
    orderId: null,
    amount: 0,
    method: null,
    timing: null,
    step: 'select_timing'
  },

  setCurrentPayment: (payment) => set((state) => ({
    currentPayment: { ...state.currentPayment, ...payment }
  })),

  resetCurrentPayment: () => set({
    currentPayment: {
      orderId: null,
      amount: 0,
      method: null,
      timing: null,
      step: 'select_timing'
    }
  }),

  addWalletBalance: (amount, method, referenceId) => set((state) => ({
    wallet: {
      ...state.wallet,
      balance: state.wallet.balance + amount,
      transactions: [
        {
          id: `wt-${Date.now()}`,
          type: 'credit',
          amount,
          description: `Added via ${method.toUpperCase()}`,
          orderId: null,
          labId: null,
          method,
          status: 'completed',
          timestamp: new Date().toISOString(),
          referenceId
        },
        ...state.wallet.transactions
      ],
      lastUpdated: new Date().toISOString()
    }
  })),

  deductWalletBalance: (amount, orderId, description) => set((state) => ({
    wallet: {
      ...state.wallet,
      balance: state.wallet.balance - amount,
      transactions: [
        {
          id: `wt-${Date.now()}`,
          type: 'debit',
          amount,
          description,
          orderId,
          labId: null,
          method: null,
          status: 'completed',
          timestamp: new Date().toISOString(),
          referenceId: null
        },
        ...state.wallet.transactions
      ],
      lastUpdated: new Date().toISOString()
    }
  })),

  getCreditStatus: (labId) => {
    return get().creditStatuses.find(cs => cs.labId === labId)
  },

  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),

  markOrderPaid: (orderId, method, transactionId) => set((state) => ({
    pendingPayments: state.pendingPayments.map(p => 
      p.orderId === orderId 
        ? { 
            ...p, 
            paymentStatus: 'completed' as PaymentStatus,
            balancePaid: true,
            balancePaidAt: new Date().toISOString(),
            balanceMethod: method,
            balanceTransactionId: transactionId
          } 
        : p
    )
  })),

  getLabPaymentOptions: (labId, orderAmount) => {
    const policy = LAB_PAYMENT_POLICIES[labId] || DEFAULT_POLICY
    const creditStatus = get().getCreditStatus(labId)
    const walletBalance = get().wallet.balance

    const options: AvailablePaymentOptions = {
      canPayNow: policy.acceptsPrepaid,
      canPayOnDelivery: policy.acceptsCOD && orderAmount <= policy.maxCODAmount,
      canUseCredit: false,
      availableMethods: [],
      requiresDeposit: policy.depositRequired && orderAmount > policy.depositThreshold,
      depositAmount: policy.depositRequired && orderAmount > policy.depositThreshold
        ? Math.ceil(orderAmount * policy.depositPercentage / 100)
        : 0,
      prepaidDiscount: policy.prepaidDiscount,
      prepaidDiscountAmount: Math.ceil(orderAmount * policy.prepaidDiscount / 100),
      creditAvailable: 0,
      creditExceeded: false,
      codAllowed: policy.acceptsCOD,
      codExceeded: orderAmount > policy.maxCODAmount,
      messages: []
    }

    // Check credit availability
    if (policy.offersCredit && creditStatus) {
      if (creditStatus.creditApproved && creditStatus.accountStatus === 'active') {
        if (orderAmount <= creditStatus.availableCredit) {
          options.canUseCredit = true
          options.creditAvailable = creditStatus.availableCredit
        } else {
          options.creditExceeded = true
          options.creditAvailable = creditStatus.availableCredit
          options.messages.push(`Credit limit exceeded. Available: ₹${creditStatus.availableCredit.toLocaleString()}`)
        }
      } else if (creditStatus.creditPending) {
        options.messages.push('Credit application is pending approval')
      } else if (creditStatus.accountStatus === 'on_hold') {
        options.messages.push(`Credit account on hold: ${creditStatus.holdReason}`)
      } else if (creditStatus.accountStatus === 'suspended') {
        options.messages.push('Credit account suspended. Please contact lab.')
      }
    } else if (policy.offersCredit && !creditStatus) {
      options.messages.push('Apply for credit to get monthly billing')
    }

    // Build available methods
    const methods: PaymentMethod[] = []
    
    if (policy.acceptedMethods.includes('upi')) methods.push('upi')
    if (policy.acceptedMethods.includes('card')) methods.push('card')
    if (policy.acceptedMethods.includes('cash') && options.canPayOnDelivery) methods.push('cash')
    if (policy.acceptedMethods.includes('bank_transfer')) methods.push('bank_transfer')
    if (policy.acceptedMethods.includes('wallet') && walletBalance >= orderAmount) methods.push('wallet')
    if (policy.acceptedMethods.includes('credit') && options.canUseCredit) methods.push('credit')

    options.availableMethods = methods

    // Add wallet message if insufficient balance
    if (policy.acceptedMethods.includes('wallet') && walletBalance < orderAmount) {
      options.messages.push(`Wallet balance: ₹${walletBalance.toLocaleString()} (Insufficient)`)
    }

    // Add prepaid discount message
    if (policy.prepaidDiscount > 0) {
      options.messages.push(`Save ${policy.prepaidDiscount}% (₹${options.prepaidDiscountAmount}) by paying now`)
    }

    // Add COD limit message
    if (options.codExceeded) {
      options.messages.push(`COD not available for orders above ₹${policy.maxCODAmount.toLocaleString()}`)
    }

    // Add deposit message
    if (options.requiresDeposit) {
      options.messages.push(`Deposit of ₹${options.depositAmount.toLocaleString()} required for this order`)
    }

    return options
  }
}))

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getPaymentMethodIcon(method: PaymentMethod): string {
  switch (method) {
    case 'upi': return '📱'
    case 'card': return '💳'
    case 'cash': return '💵'
    case 'bank_transfer': return '🏦'
    case 'wallet': return '👛'
    case 'credit': return '📋'
    default: return '💰'
  }
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'upi': return 'UPI'
    case 'card': return 'Card'
    case 'cash': return 'Cash'
    case 'bank_transfer': return 'Bank Transfer'
    case 'wallet': return 'Wallet'
    case 'credit': return 'Monthly Billing'
    default: return 'Payment'
  }
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case 'completed': return 'text-emerald-400'
    case 'pending': return 'text-amber-400'
    case 'processing': return 'text-blue-400'
    case 'failed': return 'text-red-400'
    case 'refunded': return 'text-purple-400'
    case 'cancelled': return 'text-gray-400'
    default: return 'text-white/50'
  }
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}
