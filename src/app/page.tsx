import { AboutSection } from '@/components/home/AboutSection'
import { ExperienceSection } from '@/components/home/ExperienceSection'
import { GalleriesSection } from '@/components/home/GalleriesSection'
import { IntroSection } from '@/components/home/IntroSection'
import { ProjectsSection } from '@/components/home/ProjectsSection'

export default async function Home() {
  return (
    <div className="mx-auto max-w-screen-md space-y-24 px-6 pt-12 pb-24 font-sans md:px-8 md:pt-20 lg:pt-24">
      <IntroSection />

      <AboutSection />

      <ExperienceSection />

      <ProjectsSection />

      <GalleriesSection />
    </div>
  )
}
