import { useState } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { MobileFrame } from "./components/layout/MobileFrame"
import { BottomNav } from "./components/layout/BottomNav"
import { SplashScreen } from "./components/SplashScreen"
import { Home } from "./pages/dentist/Home"
import { Labs } from "./pages/dentist/Labs"
import { Orders } from "./pages/dentist/Orders"
import { Profile } from "./pages/dentist/Profile"
import { NewOrder } from "./pages/dentist/NewOrder"
import { OrderDetail } from "./pages/dentist/OrderDetail"
import { LabProfile } from "./pages/dentist/LabProfile"

function AppContent() {
  const location = useLocation()
  
  // Pages that should not show bottom nav
  const hideBottomNav = 
    location.pathname.startsWith('/new-order') ||
    location.pathname.startsWith('/orders/') ||
    location.pathname.startsWith('/labs/')

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
      </Routes>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <BrowserRouter>
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      <MobileFrame>
        <AppContent />
      </MobileFrame>
    </BrowserRouter>
  )
}

export default App
