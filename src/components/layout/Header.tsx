import { ChevronLeft, Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface HeaderProps {
  title?: string
  showBack?: boolean
  showNotifications?: boolean
  rightAction?: React.ReactNode
}

export function Header({ 
  title, 
  showBack = false, 
  showNotifications = false,
  rightAction
}: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="bg-background/80 backdrop-blur-lg z-40">
      <div className="flex items-center justify-between h-14 px-5">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center hover:bg-muted transition-colors -ml-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {title && (
            <h1 className="text-lg font-semibold">{title}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {rightAction}
          {showNotifications && (
            <button className="relative w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
