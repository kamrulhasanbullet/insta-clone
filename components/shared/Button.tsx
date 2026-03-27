import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  iconOnly?: boolean;
  children: ReactNode;
  className?: string;
}

const variants = {
  primary:
    "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-transparent shadow-sm hover:shadow-md",
  secondary:
    "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm hover:shadow-md",
  ghost: "hover:bg-gray-100 text-gray-900 hover:shadow-sm",
  outline:
    "border border-gray-300 hover:bg-gray-50 text-gray-900 shadow-sm hover:shadow-md",
  destructive:
    "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-transparent shadow-sm hover:shadow-md",
};

const sizes = {
  xs: "h-8 px-2.5 rounded-lg text-xs",
  sm: "h-9 px-3 rounded-lg text-sm",
  md: "h-10 px-4 py-2 rounded-xl text-sm",
  lg: "h-12 px-6 rounded-2xl text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      iconOnly = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          loading && "cursor-not-allowed",
          className,
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
        ) : null}
        {iconOnly ? children : <span className="truncate">{children}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
