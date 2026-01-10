import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-primary-foreground hover:brightness-110 shadow-depth-sm",
        secondary:
          "bg-card-gradient border border-border text-foreground hover:border-primary/50",
        outline: 
          "border border-border bg-transparent hover:bg-muted text-foreground",
        ghost: 
          "hover:bg-muted text-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 rounded-xl",
        sm: "h-10 px-4 text-xs rounded-lg",
        lg: "h-14 px-8 text-base rounded-xl",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
