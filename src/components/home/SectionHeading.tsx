import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type SectionHeadingProps = HTMLAttributes<HTMLHeadingElement>

export function SectionHeading({ children, className, ...props }: SectionHeadingProps) {
  return (
    <h2
      className={cn('text-foreground text-md mb-6 font-mono font-bold tracking-tight uppercase', className)}
      {...props}
    >
      {children}
    </h2>
  )
}
