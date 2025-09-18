import { AboutSection } from '@/components/home/AboutSection'
import { ExperienceSection } from '@/components/home/ExperienceSection'
import { GalleriesSection } from '@/components/home/GalleriesSection'
import { IntroSection } from '@/components/home/IntroSection'
import { ProjectsSection } from '@/components/home/ProjectsSection'

export default async function Home() {
  return (
    <div className="mx-auto max-w-screen-md px-6 py-12 font-sans md:px-8 md:py-20 lg:py-24">
      <IntroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <GalleriesSection />
    </div>
  )
}
