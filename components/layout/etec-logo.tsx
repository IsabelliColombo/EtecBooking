import { cn } from "@/lib/cn";

interface EtecLogoProps {
  className?: string;
  variant?: "default" | "compact";
}

export function EtecLogo({ className, variant = "default" }: EtecLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative size-12 shrink-0" aria-hidden>
        <svg viewBox="0 0 48 48" className="size-full" fill="none">
          <rect width="48" height="48" rx="4" fill="#991b1b" />
          <path
            d="M10 8h28v6H22v26h-6V14H10V8z"
            fill="white"
          />
          <path
            d="M30 14h8v26h-6V20h-2v-6z"
            fill="white"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="text-2xl leading-none font-bold tracking-tight text-[#1e3a5f]">
          Etec
        </span>
        {variant === "default" && (
          <>
            <span className="text-small leading-tight text-foreground">
              Escola Técnica Estadual de Araras
            </span>
            <span className="text-small leading-tight font-medium text-primary-500">
              Prefeito Alberto Feres
            </span>
          </>
        )}
      </div>
    </div>
  );
}
