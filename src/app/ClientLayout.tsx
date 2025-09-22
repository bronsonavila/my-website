'use client'

import { ReactNode, useCallback, useState } from 'react'
import SpaceBackground from '@/components/SpaceBackground'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isCanvasReady, setCanvasReady] = useState(false)

  const handleCanvasReady = useCallback(() => setCanvasReady(true), [])

  return (
    <>
      <SpaceBackground onReady={handleCanvasReady} />

      <div style={{ opacity: isCanvasReady ? 1 : 0 }}>{children}</div>
    </>
  )
}
