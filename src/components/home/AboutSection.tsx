import { ExternalLink } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

export function AboutSection() {
  return (
    <section>
      <SectionHeading>About</SectionHeading>

      <p className="text-muted-foreground leading-relaxed">
        I&apos;m a software engineer with 7 years of experience specializing in the React and JavaScript/TypeScript
        ecosystems. I build accessible and performant web applications and enjoy solving complex challenges with clean,
        efficient code and AI-powered tools.
      </p>

      <p className="text-muted-foreground mt-4 leading-relaxed">
        I previously worked as an attorney practicing in criminal defense (both public and private),
        plaintiffs&apos; civil rights litigation, and legislative policy. I still stay connected to the industry through
        a niche consultancy developing custom technical solutions for attorneys in Hawaii:{' '}
        <a
          aria-label="bronsonavila.com (opens in a new tab)"
          className="text-foreground focus-visible:text-primary inline-flex items-baseline text-base leading-tight font-semibold hover:underline"
          href="https://www.bronsonavila.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="inline-flex gap-2">
            bronsonavila.com <ExternalLink className="inline-block h-4 w-4 shrink-0" />
          </span>
        </a>
      </p>

      <p className="text-muted-foreground mt-4 leading-relaxed">
        Currently open to new full-time remote software engineering opportunities, specifically in front-end or
        full-stack roles. Feel free to reach out to me via email or LinkedIn.
      </p>
    </section>
  )
}
