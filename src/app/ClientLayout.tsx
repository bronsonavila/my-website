'use client'

import { useState } from 'react'
import SpaceBackground from '@/components/SpaceBackground'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCanvasReady, setCanvasReady] = useState(false)

  return (
    <>
      <SpaceBackground onReady={() => setCanvasReady(true)} />

      <div style={{ opacity: isCanvasReady ? 1 : 0 }}>{children}</div>
    </>
  )
}
