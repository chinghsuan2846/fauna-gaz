import type { ReactNode } from 'react'

type ColorToken = {
  label: string
  value: string
  className: string
}

type FontSizeToken = readonly [label: string, className: string, value: string]
type SpacingToken = readonly [label: string, value: string]

type FoundationPageProps = {
  eyebrow: string
  title: string
  children: ReactNode
}

const colorTokens: readonly ColorToken[] = [
  { label: 'window-surface', value: '#E6DED1', className: 'bg-window-surface' },
  { label: 'window-header', value: '#8699A7', className: 'bg-window-header' },
  { label: 'window-header-hover', value: 'rgb(255 255 255 / 15%)', className: 'bg-window-header-hover' },
  { label: 'ink-primary', value: '#38342E', className: 'bg-ink-primary' },
  { label: 'ink-primary-hover', value: 'rgb(56 52 46 / 20%)', className: 'bg-ink-primary-hover' },
  { label: 'ink-secondary', value: '#988F7F', className: 'bg-ink-secondary' },
  { label: 'ink-muted', value: '#A49D93', className: 'bg-ink-muted' },
  { label: 'ink-inverse', value: '#FFFFFF', className: 'bg-ink-inverse' },
  { label: 'line', value: '#38342E', className: 'bg-line' },
  { label: 'line-strong', value: '#988F7F', className: 'bg-line-strong' },
  { label: 'line-subtle', value: '#A49D93', className: 'bg-line-subtle' },
  { label: 'overlay-scrim', value: 'rgb(0 0 0 / 25%)', className: 'bg-overlay-scrim' },
  { label: 'scrollbar-track', value: '#F3ECE1', className: 'bg-scrollbar-track' },
  { label: 'scrollbar-highlight', value: '#FFFFFF', className: 'bg-scrollbar-highlight' },
  { label: 'scrollbar-shadow', value: '#D8CDBA', className: 'bg-scrollbar-shadow' },
  { label: 'sidebar-active', value: 'rgb(125 144 158 / 40%)', className: 'bg-sidebar-active' },
  { label: 'sidebar-folder', value: '#F2C94C', className: 'bg-sidebar-folder' },
  { label: 'action-link', value: '#002BFF', className: 'bg-action-link' },
  { label: 'action-close-hover', value: '#F79685', className: 'bg-action-close-hover' },
]

const fontSizes: readonly FontSizeToken[] = [
  ['caption', 'text-caption', '0.75rem / 1rem'],
  ['small', 'text-small', '0.875rem / 1.25rem'],
  ['body', 'text-body', '1rem / 1.75rem'],
  ['lead', 'text-lead', '1.125rem / 1.75rem'],
  ['button', 'text-button', '1.375rem / 1.75rem'],
  ['title', 'text-title', '1.5rem / 2rem'],
  ['headline', 'text-headline', 'clamp(2rem, 5vw, 4rem) / 1.05'],
  ['display', 'text-display', 'clamp(2.75rem, 6.5vw, 5rem) / 1'],
]

const spacingTokens: readonly SpacingToken[] = [
  ['space-xs', '0.25rem'],
  ['space-sm', '0.5rem'],
  ['space-md', '1rem'],
  ['space-lg', '1.5rem'],
  ['space-xl', '2rem'],
  ['space-2xl', '3rem'],
  ['space-3xl', '4rem'],
  ['space-4xl', '6rem'],
  ['space-button-lg-x', '0.75rem'],
  ['space-button-footer-h', '2.25rem'],
  ['space-sidebar-icon', '1.25rem'],
  ['entry-line', '8rem'],
]

function FoundationPage({ eyebrow, title, children }: FoundationPageProps) {
  return (
    <main className="min-h-screen bg-window-surface p-space-lg font-body text-body text-ink-primary">
      <section className="mx-auto grid max-w-5xl gap-space-xl">
        <header className="grid gap-space-sm">
          <p className="font-ui text-caption uppercase tracking-display text-ink-secondary">
            Storybook / Foundation
          </p>
          <p className="font-ui text-small uppercase text-ink-secondary">{eyebrow}</p>
          <h1 className="font-ui text-headline font-medium">{title}</h1>
        </header>
        {children}
      </section>
    </main>
  )
}

export function ColorFoundation() {
  return (
    <FoundationPage eyebrow="Color" title="Color tokens">
      <div className="grid gap-space-sm sm:grid-cols-2 lg:grid-cols-3">
        {colorTokens.map(({ label, value, className }) => (
          <div
            key={label}
            className="grid min-h-28 content-between rounded border-thin border-line bg-window-surface p-space-sm shadow-window"
          >
            <div className={`h-12 rounded border-thin border-line ${className}`} aria-hidden="true" />
            <div className="grid gap-1">
              <span className="font-ui text-small">{label}</span>
              <code className="text-caption text-ink-secondary">{value}</code>
            </div>
          </div>
        ))}
      </div>
    </FoundationPage>
  )
}

export function FontFoundation() {
  return (
    <FoundationPage eyebrow="Font" title="Font tokens">
      <div className="grid gap-space-lg">
        <section className="grid gap-space-sm" aria-labelledby="font-families-heading">
          <h2 id="font-families-heading" className="font-ui text-title font-medium">
            Families
          </h2>
          <div className="grid gap-space-md border-thin border-line bg-window-surface p-space-md sm:grid-cols-2">
            <div className="grid gap-space-sm">
              <p className="font-ui text-caption uppercase text-ink-secondary">UI / Cubic 11</p>
              <p className="font-ui text-title">Fauna Gaz / 動物公報</p>
              <code className="text-caption text-ink-secondary">font-ui</code>
            </div>
            <div className="grid gap-space-sm">
              <p className="font-ui text-caption uppercase text-ink-secondary">Body / Source Han Mono TC</p>
              <p className="font-body text-title">Fauna Gaz / 動物行為學季刊</p>
              <code className="text-caption text-ink-secondary">font-body</code>
            </div>
          </div>
        </section>

        <section className="grid gap-space-sm" aria-labelledby="font-sizes-heading">
          <h2 id="font-sizes-heading" className="font-ui text-title font-medium">
            Sizes
          </h2>
          <div className="grid gap-space-sm border-thin border-line bg-window-surface p-space-md">
            {fontSizes.map(([label, className, value]) => (
              <div key={label} className="grid gap-1 border-b border-line-subtle pb-space-sm last:border-b-0 last:pb-0">
                <div className="grid gap-space-sm lg:grid-cols-2">
                  <div>
                    <p className="font-ui text-caption uppercase text-ink-secondary">UI / Cubic 11</p>
                    <p className={`font-ui ${className}`}>{label} / 動物公報</p>
                  </div>
                  <div>
                    <p className="font-ui text-caption uppercase text-ink-secondary">Body / Source Han Mono TC</p>
                    <p className={`font-body ${className}`}>{label} / 動物行為學季刊</p>
                  </div>
                </div>
                <code className="text-caption text-ink-secondary">text-{label} / {value}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-space-sm" aria-labelledby="font-weights-heading">
          <h2 id="font-weights-heading" className="font-ui text-title font-medium">
            Weights
          </h2>
          <div className="grid gap-space-sm border-thin border-line bg-window-surface p-space-md">
            <p className="font-ui text-title font-regular">regular / 400</p>
            <p className="font-ui text-title font-medium">medium / 500</p>
          </div>
        </section>
      </div>
    </FoundationPage>
  )
}

export function SpaceFoundation() {
  return (
    <FoundationPage eyebrow="Space" title="Space tokens">
      <div className="grid gap-space-sm border-thin border-line bg-window-surface p-space-md">
        {spacingTokens.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[8rem_1fr_auto] items-center gap-space-sm">
            <code className="text-caption text-ink-secondary">{label}</code>
            <div className="h-space-sm bg-window-header" style={{ width: value }} aria-hidden="true" />
            <code className="text-caption text-ink-secondary">{value}</code>
          </div>
        ))}
      </div>
    </FoundationPage>
  )
}

export function ShadowFoundation() {
  return (
    <FoundationPage eyebrow="Shadow" title="Shadow tokens">
      <div className="grid gap-space-lg sm:grid-cols-2">
        <div className="grid min-h-48 content-between border-thin border-line bg-window-surface p-space-lg shadow-window">
          <span className="font-ui text-title">window</span>
          <code className="text-caption text-ink-secondary">0 0.25rem 0.5rem rgb(0 0 0 / 25%)</code>
        </div>
      </div>
    </FoundationPage>
  )
}
