import { SectionHeading } from './SectionHeading'

export function AboutSection() {
  return (
    <section>
      <SectionHeading>About</SectionHeading>

      <p className="text-muted-foreground leading-relaxed">
        I&apos;m a full-stack developer specializing in front-end software engineering. I work in fully remote teams to
        build accessible, performant, and polished web applications for enterprise customers. On the side, I enjoy
        working on projects that involve solving problems with AI technologies.
      </p>

      <p className="text-muted-foreground mt-4 leading-relaxed">
        In a past life, I worked as an attorney practicing in criminal defense (both public and private),
        plaintiffs&apos; civil rights litigation, and legislative policy.
      </p>

      <p className="text-muted-foreground mt-4 leading-relaxed">Born and raised in Hawaii – still here to stay.</p>
    </section>
  )
}
