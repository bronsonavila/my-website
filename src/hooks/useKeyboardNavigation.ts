import { useEffect } from 'react'

// Adds Left/Right arrow keyboard navigation when the dialog is open.
export function useKeyboardNavigation(open: boolean, goToPreviousImage: () => void, goToNextImage: () => void) {
  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goToPreviousImage()
      if (event.key === 'ArrowRight') goToNextImage()
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [open, goToPreviousImage, goToNextImage])
}
