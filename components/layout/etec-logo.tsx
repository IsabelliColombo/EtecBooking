import { cn } from "@/lib/cn";

interface EtecLogoProps {
  className?: string;
  variant?: "default" | "compact";
}

export function EtecLogo({ className, variant = "default" }: EtecLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img src="/etec_sao_paulo.png" alt="Etec Logo" className="size-18" />
      <div className="flex flex-col">
        <span className="text-2xl leading-none font-bold tracking-tight text-[#1e3a5f]">
          Etec
        </span>
        {variant === "default" && (
          <>
            <span className="text-small leading-tight text-foreground">
              Escola Técnica Estadual 
            </span>
            <span className="text-small leading-tight font-medium text-primary-500">
              Prefeito Alberto Feres - Araras
            </span>
          </>
        )}
      </div>
    </div>
  );
}
