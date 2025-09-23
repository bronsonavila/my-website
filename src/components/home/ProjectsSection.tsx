import { client } from '@/lib/contentful'
import { ProjectCard } from '@/components/ProjectCard'

export type Project = {
  description: string
  name: string
  technologies: string[]
  url: string
}

export const PROJECTS: Project[] = [
  {
    description: 'View Hawaii road closures with AI-powered route analysis.',
    name: 'HI Lane AI',
    technologies: ['Google Gemini API', 'Mapbox', 'Next.js', 'React', 'Supabase', 'TypeScript'],
    url: 'https://www.hilane.ai/'
  },
  {
    description: 'Search, filter, export, and visualize data on attorneys licensed in Hawaii.',
    name: 'Hawaii Attorney Database',
    technologies: ['Netlify', 'Node.js', 'Puppeteer', 'React', 'TypeScript', 'Vitest'],
    url: 'https://www.hawaiiattorneydatabase.com/'
  },
  {
    description: 'Convert photos of to-do lists into interactive checklists.',
    name: 'GPToDo',
    technologies: ['Google Gemini API', 'React', 'Supabase', 'TypeScript'],
    url: 'https://gptodo.app/'
  }
]

async function getProjectImages() {
  const titles = ['gptodo', 'hawaii-attorney-database', 'hi-lane-ai']
  const assets = await client.getAssets({ 'fields.title[in]': titles })

  return assets.items
}

export async function ProjectsSection() {
  const projectImages = await getProjectImages()

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
    <div className="mb-24">
      <h2 className="text-foreground mb-6 font-mono text-lg font-bold tracking-tight uppercase">Featured Projects</h2>

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
    </div>
  )
}
