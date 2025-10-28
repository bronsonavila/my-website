import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

type Experience = {
  company: string
  date: string
  description: string
  technologies: string[]
  title: string
}

const EXPERIENCES: Experience[] = [
  {
    company: 'Klarity',
    date: '07/2022 – 10/2025',
    description:
      "Improved the front-end of Klarity's contract review platform by optimizing application performance, modernizing the codebase, and leading accessibility and security initiatives, which helped secure major contracts and ensure SOC 2 compliance.",
    technologies: ['React', 'TypeScript', 'GraphQL', 'Webpack', 'Material UI', 'WCAG', 'MongoDB', 'Okta', 'Sentry'],
    title: 'Senior Software Engineer'
  },
  {
    company: 'Bbot',
    date: '01/2021 – 02/2022',
    description:
      'Rebuilt the front-end of Bbot’s web application from AngularJS to React as part of a major initiative to revamp the UI/UX of the application, which was ultimately purchased by DoorDash.',
    technologies: [
      'React',
      'React Native',
      'AngularJS',
      'JavaScript',
      'Node.js',
      'Python',
      'Django',
      'MobX',
      'Cypress'
    ],
    title: 'Software Engineer'
  },
  {
    company: 'Atlantic 57',
    date: '11/2018 – 01/2021',
    description:
      'Built accessible websites and applications for clients such as the American Cancer Society, McChrystal Group, and Open Government Partnership. Handled the full development process from concept to launch, creating pixel-perfect UIs and custom content management systems.',
    technologies: ['React', 'JavaScript', 'Tailwind', 'Node.js', 'Python', 'Django', 'PostgreSQL', 'WordPress', 'PHP'],
    title: 'Developer'
  }
]

export function ExperienceSection() {
  return (
    <section>
      <SectionHeading>Experience</SectionHeading>

      <div className="space-y-9">
        {EXPERIENCES.map((item) => (
          <div key={item.company}>
            <h3 className="text-foreground text-lg font-semibold">
              {item.title} · {item.company}
            </h3>

            <p className="text-muted-foreground text-sm">{item.date}</p>

            <p className="text-muted-foreground mt-4">{item.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-9">
        <a
          className="hover:text-foreground inline-flex items-center gap-2 font-semibold hover:underline"
          href="/resume.pdf"
          rel="noopener noreferrer"
          target="_blank"
        >
          View Full Resume
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
