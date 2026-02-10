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
    description: 'View Hawaii road closures with AI-powered route analysis.',
    name: 'HI Lane AI',
    technologies: ['Next.js', 'React', 'TypeScript', 'Google Gemini API', 'Mapbox', 'Supabase'],
    url: 'https://www.hilane.ai/'
  },
  {
    description: 'Browse AI-extracted Honolulu police arrest log data from public PDFs.',
    name: 'Honolulu Arrest Logs',
    technologies: ['Next.js', 'React', 'TypeScript', 'Google Gemini API', 'Node.js', 'Vercel'],
    url: 'https://www.honoluluarrestlogs.com/'
  },
  {
    description: 'Search, filter, export, and visualize data on attorneys licensed in Hawaii.',
    name: 'Hawaii Attorney Database',
    technologies: ['React', 'TypeScript', 'Node.js', 'Puppeteer', 'Vitest', 'Netlify'],
    url: 'https://www.hawaiiattorneydatabase.com/'
  },
  {
    description: 'Convert photos of to-do lists into interactive checklists.',
    name: 'GPToDo',
    technologies: ['React', 'TypeScript', 'Google Gemini API', 'Supabase'],
    url: 'https://gptodo.app/'
  },
  {
    description: 'Control Chrome using Google Gemini with natural language from the CLI.',
    name: 'Chrome Gemini CLI',
    technologies: ['Node.js', 'TypeScript', 'Google Gemini API', 'Chrome DevTools MCP'],
    url: 'https://github.com/bronsonavila/chrome-gemini-cli'
  }
]

async function getProjectImages() {
  const titles = ['chrome-gemini-cli', 'gptodo', 'hawaii-attorney-database', 'hi-lane-ai', 'honolulu-arrest-logs']
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
