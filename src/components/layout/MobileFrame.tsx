import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Smartphone, TabletSmartphone } from "lucide-react"

type DeviceType = 'iphone' | 'android'

interface MobileFrameProps {
  children: React.ReactNode
}

export function MobileFrame({ children }: MobileFrameProps) {
  const [device, setDevice] = useState<DeviceType>('iphone')
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const checkMobileView = () => {
      // If viewport width is less than 768px, show mobile responsive view
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobileView()
    window.addEventListener('resize', checkMobileView)
    return () => window.removeEventListener('resize', checkMobileView)
  }, [])

  // Mobile responsive view - just render the app directly
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-background overflow-auto">
        {children}
      </div>
    )
  }

  // Desktop view - show device mockup
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      {/* Background atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[oklch(0.3_0.1_250)] rounded-full blur-[150px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[oklch(0.25_0.08_300)] rounded-full blur-[120px] opacity-15" />
      </div>
      
      {/* Device Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-1 flex gap-1">
          <button 
            onClick={() => setDevice('iphone')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              device === 'iphone' 
                ? "bg-primary text-primary-foreground" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <Smartphone className="w-4 h-4" />
            iPhone
          </button>
          <button 
            onClick={() => setDevice('android')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              device === 'android' 
                ? "bg-primary text-primary-foreground" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <TabletSmartphone className="w-4 h-4" />
            Android
          </button>
        </div>
      </div>

      {/* App Title */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.6_0.15_220)] flex items-center justify-center shadow-depth">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-base font-semibold text-white">DentConnect</h1>
          <p className="text-xs text-white/50">Dental Lab Orders</p>
        </div>
      </div>
      
      {/* Device Frame */}
      <div className="relative z-10">
        {device === 'iphone' ? (
          <div className="relative">
            <div className="w-[390px] h-[844px] bg-[#1c1c1e] rounded-[55px] p-[12px] shadow-depth border border-white/5">
              {/* Dynamic Island */}
              <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-20" />
              
              {/* Screen */}
              <div className="w-full h-full bg-background rounded-[43px] overflow-hidden">
                {/* Status bar area - fixed */}
                <div className="h-[54px] bg-background flex items-end justify-center pb-1">
                  <div className="text-[11px] text-white/50 font-medium">9:41</div>
                </div>
                
                {/* Scrollable content area */}
                <div className="h-[calc(100%-54px)] overflow-auto no-scrollbar">
                  {children}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="w-[380px] h-[820px] bg-[#1c1c1e] rounded-[40px] p-[10px] shadow-depth border border-white/5">
              {/* Punch hole */}
              <div className="absolute top-[22px] left-1/2 -translate-x-1/2 w-[14px] h-[14px] bg-[#0a0a0a] rounded-full z-20" />
              
              {/* Screen */}
              <div className="w-full h-full bg-background rounded-[30px] overflow-hidden">
                {/* Status bar area - fixed */}
                <div className="h-[44px] bg-background flex items-end justify-center pb-1">
                  <div className="text-[11px] text-white/50 font-medium">9:41</div>
                </div>
                
                {/* Scrollable content area */}
                <div className="h-[calc(100%-44px)] overflow-auto no-scrollbar">
                  {children}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
