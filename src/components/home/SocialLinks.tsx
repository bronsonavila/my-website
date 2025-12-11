import { SiGithub, SiLinkedin } from 'react-icons/si'
import { HiMail } from 'react-icons/hi'

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
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

      <a
        aria-label="Email"
        className="text-muted-foreground hover:text-foreground group transition-colors"
        href="mailto:bronson@bronsonavila.com"
      >
        <span className="bg-muted-foreground group-hover:bg-foreground block rounded-[1.5px] transition-colors">
          <HiMail className="h-4 w-4 fill-[rgb(5,5,10)] p-[1px] sm:h-5 sm:w-5 sm:p-[1.25px]" />
        </span>
      </a>
    </div>
  )
}
