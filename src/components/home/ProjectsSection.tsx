import { client } from '@/lib/contentful'
import { ProjectCard } from '@/components/ProjectCard'
import { SectionHeading } from './SectionHeading'

export type Project = {
  description: string
  name: string
  technologies: string[]
  url: string
}

export const PROJECTS: Project[] = [
  {
    description: 'AI-powered document intelligence for Hawaii HOAs and condominiums.',
    name: 'MyHui AI',
    technologies: ['AI', 'RAG', 'JavaScript', 'Tailwind CSS', 'PostgreSQL', 'Docker'],
    url: 'https://www.myhui.ai/'
  },
  {
    description: 'Search, filter, export, and visualize data on attorneys licensed in Hawaii.',
    name: 'Hawaii Attorney Database',
    technologies: ['React', 'TypeScript', 'Node.js', 'Puppeteer', 'Vitest', 'Netlify'],
    url: 'https://www.hawaiiattorneydatabase.com/'
  },
  {
    description: 'View Hawaii road closures with AI-powered route analysis.',
    name: 'HI Lane AI',
    technologies: ['Next.js', 'React', 'TypeScript', 'Google Gemini API', 'Mapbox', 'Supabase'],
    url: 'https://www.hilane.ai/'
  },
  {
    description: 'Convert photos of to-do lists into interactive checklists.',
    name: 'GPToDo',
    technologies: ['React', 'TypeScript', 'Google Gemini API', 'Supabase'],
    url: 'https://gptodo.app/'
  },
  {
    description: 'Find TLDR newsletter articles that match custom criteria using OpenRouter.',
    name: 'TLDR Newsletter Filter',
    technologies: ['Node.js', 'TypeScript', 'OpenRouter'],
    url: 'https://github.com/bronsonavila/tldr-newsletter-filter'
  }
]

async function getProjectImages() {
  const titles = ['tldr-newsletter-filter', 'gptodo', 'hawaii-attorney-database', 'hi-lane-ai', 'myhui-ai']
  const assets = await client.getAssets({ 'fields.title[in]': titles })

  return assets.items
}

export async function ProjectsSection() {
  const projectImages = await getProjectImages()
  console.log(projectImages)
  const projectImagesBySlug = projectImages.reduce(
    (acc, item) => {
      const title = (item.fields?.title as string | undefined)?.toLowerCase()
      const fileUrl =
        item.fields?.file && 'url' in item.fields.file ? (item.fields.file.url as string | undefined) : undefined

      if (title && fileUrl) {
        acc[title] = `https:${fileUrl}`
      }

      return acc
    },
    {} as Record<string, string>
  )

  return (
    <section>
      <SectionHeading>Featured Projects</SectionHeading>

      <ul className="space-y-9">
        {PROJECTS.map((project) => {
          const slug = project.name.toLowerCase().replace(/ /g, '-')

          return (
            <li key={project.name}>
              <ProjectCard {...project} imageUrl={projectImagesBySlug[slug]} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
