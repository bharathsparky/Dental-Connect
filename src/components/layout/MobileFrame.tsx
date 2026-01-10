import { useState, useEffect } from "react"

interface MobileFrameProps {
  children: React.ReactNode
}

export function MobileFrame({ children }: MobileFrameProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile: render app directly without any frame
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    )
  }

  // Desktop: show only device frame (no branding, no switcher)
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      {/* Background atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[oklch(0.3_0.1_250)] rounded-full blur-[150px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[oklch(0.25_0.08_300)] rounded-full blur-[120px] opacity-15" />
      </div>
      
      {/* Device Frame - iPhone style */}
      <div className="relative z-10">
        <div className="relative">
          <div className="w-[390px] h-[844px] bg-[#1c1c1e] rounded-[55px] p-[12px] shadow-2xl border border-white/10">
            {/* Dynamic Island */}
            <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-20" />
            
            {/* Screen */}
            <div className="w-full h-full bg-background rounded-[43px] overflow-hidden">
              {/* Status bar area */}
              <div className="h-[54px] bg-background flex items-end justify-center pb-1">
                <div className="text-[11px] text-white/50 font-medium">9:41</div>
              </div>
              
              {/* Scrollable content */}
              <div className="h-[calc(100%-54px)] overflow-auto no-scrollbar">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
