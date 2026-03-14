// src/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-[0_0_15px_rgba(99,102,241,0.6)]",
                destructive: "bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]",
                outline: "border border-indigo-500/50 bg-transparent text-indigo-300 hover:bg-indigo-950/50 hover:border-indigo-400 hover:shadow-[0_0_10px_rgba(99,102,241,0.4)]",
                secondary: "bg-gray-800 text-gray-200 hover:bg-gray-700 hover:shadow-[0_0_10px_rgba(100,116,139,0.4)]",
                ghost: "hover:bg-gray-800/50 hover:text-white hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]",
                link: "text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300",
            },
            size: {
                default: "h-11 px-8 py-2 text-base",
                sm: "h-9 rounded-md px-4 text-sm",
                lg: "h-12 rounded-lg px-10 text-lg",
                icon: "h-10 w-10 rounded-lg",
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
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(
                    buttonVariants({ variant, size, className }),
                    "active:scale-95 transition-transform" // subtle press effect
                )}
                ref={ref}
                {...(props as any)}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }