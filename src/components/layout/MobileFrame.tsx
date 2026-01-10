interface MobileFrameProps {
  children: React.ReactNode
}

export function MobileFrame({ children }: MobileFrameProps) {
  // Direct mobile app view - no device frame, no branding
  return (
    <div className="min-h-screen max-w-md mx-auto bg-background overflow-auto">
      {children}
    </div>
  )
}
