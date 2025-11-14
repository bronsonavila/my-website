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
        In a past life, I worked as an attorney practicing in criminal defense (both public and private),
        plaintiffs&apos; civil rights litigation, and legislative policy.
      </p>

      <p className="text-muted-foreground mt-4 leading-relaxed">
        Currently open to new opportunities. Feel free to reach out to me via email or LinkedIn.
      </p>
    </section>
  )
}
