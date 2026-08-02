import Image from "next/image";

export function HeroSection() {
  return (
    <section className="px-4 pt-6 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-hero">
          <Image
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden />

          <div className="relative flex flex-col items-center justify-center px-6 py-12 text-center md:px-12 md:py-16 lg:py-20">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-h2 font-bold text-white md:text-h1">
                ETECBOOKING: BIBLIOTECA ONLINE DA ETEC PREFEITO ALBERTO FERES
              </h1>
              <p className="text-body text-white/90 md:text-lg">
                Conhecimento ao seu alcance. Pesquise, explore e empreste livros
                que estão disponíveis na biblioteca.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
