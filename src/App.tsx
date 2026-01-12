import { useState } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { MobileFrame } from "./components/layout/MobileFrame"
import { BottomNav } from "./components/layout/BottomNav"
import { SplashScreen } from "./components/SplashScreen"
import { OnboardingScreen } from "./components/OnboardingScreen"
import { ModalProvider, useModal } from "./contexts/ModalContext"
import { useAuthStore } from "./stores/authStore"
import { Home } from "./pages/dentist/Home"
import { Labs } from "./pages/dentist/Labs"
import { Orders } from "./pages/dentist/Orders"
import { Profile } from "./pages/dentist/Profile"
import { NewOrder } from "./pages/dentist/NewOrder"
import { OrderDetail } from "./pages/dentist/OrderDetail"
import { LabProfile } from "./pages/dentist/LabProfile"
import { Wallet } from "./pages/dentist/Wallet"
import { Billing } from "./pages/dentist/Billing"

function AppContent() {
  const location = useLocation()
  const { isModalOpen } = useModal()
  
  // Pages that should not show bottom nav
  const hideBottomNav = 
    location.pathname.startsWith('/new-order') ||
    location.pathname.startsWith('/orders/') ||
    location.pathname.startsWith('/labs/') ||
    location.pathname.startsWith('/wallet') ||
    location.pathname.startsWith('/billing') ||
    isModalOpen

  return (
    <div className="min-h-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/labs/:id" element={<LabProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}

// Main app wrapper to check auth state
function AppWithAuth() {
  const { isOnboardingComplete } = useAuthStore()

  // Show onboarding if not complete
  if (!isOnboardingComplete) {
    return <OnboardingScreen />
  }

  return (
    <>
      {/* Status bar area */}
      <div className="h-[54px] bg-background flex items-end justify-center pb-1">
        <div className="text-[11px] text-white/50 font-medium">9:41</div>
      </div>
      
      {/* Scrollable content */}
      <div className="h-[calc(100%-54px)] overflow-auto no-scrollbar">
        <AppContent />
      </div>
    </>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <BrowserRouter>
      <ModalProvider>
        <MobileFrame>
          {showSplash ? (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          ) : (
            <AppWithAuth />
          )}
        </MobileFrame>
      </ModalProvider>
    </BrowserRouter>
  )
}

export default App
