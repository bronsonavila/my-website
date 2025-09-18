import { SiGithub, SiLinkedin } from 'react-icons/si'

export function IntroSection() {
  return (
    <div className="mb-24">
      <div className="flex items-baseline justify-between">
        <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">Bronson Avila</h1>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-colors"
            href="https://github.com/bronsonavila"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiGithub className="h-4 w-4 sm:h-5 sm:w-5" />
          </a>

          <a
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-foreground transition-colors"
            href="https://linkedin.com/in/bronsonavila"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiLinkedin className="h-4 w-4 sm:h-5 sm:w-5" />
          </a>
        </div>
      </div>

      <h3 className="text-muted-foreground mt-2 text-base font-semibold sm:text-lg">
        Full-Stack Developer · Front-End Focus
      </h3>
    </div>
  )
}
