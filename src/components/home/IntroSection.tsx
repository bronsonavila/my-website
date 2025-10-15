import { SocialLinks } from './SocialLinks'

export function IntroSection() {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">Bronson Avila</h1>

        <SocialLinks className="hidden items-center gap-4 sm:flex sm:gap-5" />
      </div>

      <h2 className="text-muted-foreground mt-2 text-base font-semibold sm:text-lg">
        Full-Stack Developer · Front-End Focus
      </h2>

      <SocialLinks className="mt-4 flex items-center gap-4 sm:hidden sm:gap-5" />
    </section>
  )
}
