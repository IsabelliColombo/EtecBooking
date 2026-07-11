import { Clock, Mail, MapPin } from "lucide-react";

const footerItems = [
  {
    icon: Clock,
    title: "Horário de Funcionamento",
    lines: [
      "Segunda a Sexta: 8h às 21h",
      "Sábado: 8h às 12h",
    ],
  },
  {
    icon: MapPin,
    title: "Localização",
    lines: [
      "R. Domingos Graziano, 355 - Jd. José Ometto",
      "Araras - SP, 13607-018",
    ],
  },
  {
    icon: Mail,
    title: "Fale Conosco",
    lines: [
      "biblioteca@etecararas.com.br",
      "(19) 99999-9999",
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-background px-4 py-12 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="rounded-card border border-border bg-surface-2 p-8 shadow-sm md:p-10">
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {footerItems.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex gap-4">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-primary-500/10"
                  aria-hidden
                >
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-body font-semibold text-foreground">
                    {title}
                  </h3>
                  {lines.map((line) => (
                    <p key={line} className="text-small text-muted">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
