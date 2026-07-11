import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500/40",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-primary-50 active:bg-primary-100 dark:hover:bg-surface-2 dark:active:bg-surface-2 focus-visible:ring-primary-500/30",
  ghost:
    "bg-transparent text-foreground hover:bg-primary-50 active:bg-primary-100 dark:hover:bg-surface-2 dark:active:bg-surface-2 focus-visible:ring-primary-500/30",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-button px-6 text-body font-medium",
        "transition-all duration-150 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
