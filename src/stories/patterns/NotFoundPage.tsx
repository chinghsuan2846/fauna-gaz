import { useEffect, useState } from 'react'

import { Button } from '../component/Button'
import type { WindowMode } from '../component/Window'
import Window from '../component/Window'

export type NotFoundPageProps = {
  homeHref?: string
  mode?: WindowMode
  className?: string
}

function resolveViewportMode(): WindowMode {
  if (typeof window === 'undefined') return 'desktop'
  if (window.innerWidth < 600) return 'mobile'
  if (window.innerWidth < 1024) return 'tablet'
  return 'desktop'
}

function useViewportMode() {
  const [viewportMode, setViewportMode] = useState<WindowMode>('desktop')

  useEffect(() => {
    const updateViewportMode = () => setViewportMode(resolveViewportMode())
    updateViewportMode()
    window.addEventListener('resize', updateViewportMode)
    return () => window.removeEventListener('resize', updateViewportMode)
  }, [])

  return viewportMode
}

const pagePaddingClasses: Record<WindowMode, string> = {
  desktop: 'p-space-xl',
  tablet: 'p-space-lg',
  mobile: 'p-space-md',
}

const windowFrameClasses: Record<WindowMode, string> = {
  desktop: 'h-[min(20rem,calc(100svh-4rem))] max-h-[calc(100svh-4rem)] max-w-viewport-mobile',
  tablet: 'h-[min(20rem,calc(100svh-3rem))] max-h-[calc(100svh-3rem)] w-[40rem] max-w-full',
  mobile: 'h-[min(18rem,calc(100svh-2rem))] max-h-[calc(100svh-2rem)] max-w-viewport-mobile',
}

function NotFoundPage({ homeHref = '/', mode, className = '' }: NotFoundPageProps) {
  const viewportMode = useViewportMode()
  const resolvedMode = mode ?? viewportMode
  const isMobile = resolvedMode === 'mobile'

  return (
    <main
      className={`relative grid min-h-screen place-items-center overflow-hidden bg-window-surface font-ui text-ink-primary ${pagePaddingClasses[resolvedMode]} ${className}`}
    >
      <div className="not-found-forest pointer-events-none absolute inset-0" aria-hidden="true">
        <img className="h-full w-full object-cover" src="/assets/forest_pixel.svg" alt="" />
      </div>

      <div className={`relative z-10 flex w-full ${windowFrameClasses[resolvedMode]}`}>
        <Window title="404 / 找不到頁面" mode={resolvedMode} showClose={false} className="h-full w-full">
          <div className="retroScrollArea min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
            <div className={`flex min-h-full items-center justify-center text-center ${isMobile ? 'p-space-md' : 'p-space-lg'}`}>
              <div className="grid w-full justify-items-center gap-space-xl">
                <div className="grid gap-space-sm">
                  <p className="font-ui text-caption uppercase tracking-display text-ink-secondary">ERROR 404</p>
                  <h1 className={`font-ui font-medium leading-none ${isMobile ? 'text-headline' : 'text-display'}`}>404</h1>
                </div>

                <div className="grid gap-space-sm">
                  <h2 className={`font-ui font-medium leading-compact ${isMobile ? 'text-lead' : 'text-title'}`}>這一頁不在動物公報裡</h2>
                  <p className={`max-w-[24rem] font-body text-ink-secondary ${isMobile ? 'text-caption' : 'text-small'}`}>
                    你要找的內容可能已經移動，或尚未刊出。
                  </p>
                </div>

                <div className="w-full pt-space-md">
                  <Button
                    label="回到首頁"
                    icon="chevron-left"
                    iconSize="small"
                    size="large"
                    textSize="small"
                    href={homeHref}
                    ariaLabel="回到動物公報首頁"
                  />
                </div>
              </div>
            </div>
          </div>
        </Window>
      </div>
    </main>
  )
}

export default NotFoundPage
