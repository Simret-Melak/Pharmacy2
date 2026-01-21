import * as React from "react"
import { cn } from "@/utils/cn"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    destructive: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-100",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
