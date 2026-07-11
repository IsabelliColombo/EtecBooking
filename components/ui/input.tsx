import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export function Input({
  label,
  icon: Icon,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-small font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
            aria-hidden
          />
        )}
        <input
          id={inputId}
          className={cn(
            "h-12 w-full rounded-input border border-border bg-surface px-4 text-body text-foreground",
            "placeholder:text-muted",
            "transition-all duration-150 ease-in-out",
            "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-12",
            error && "border-error focus:border-error focus:ring-error/30",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-small text-error">{error}</p>}
    </div>
  );
}
