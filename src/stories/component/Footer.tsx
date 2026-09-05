import { useEffect, useState } from 'react'
import type { ButtonProps } from './Button'
import { Button } from './Button'

export type FooterMode = 'responsive' | 'desktop' | 'tablet' | 'mobile'

export type FooterProps = {
  mode?: FooterMode
  currentTime?: string
  currentDate?: string
  musicEnabled?: boolean
  onHome?: ButtonProps['onClick']
  onLegal?: ButtonProps['onClick']
  onFaq?: ButtonProps['onClick']
  onContact?: ButtonProps['onClick']
  onMusicToggle?: () => void
  onTour?: ButtonProps['onClick']
}

type FooterCopy = {
  brand: string
  legal: string
  faq: string
  contact: string
  tour: string
  musicOn: string
  musicOff: string
  home: string
  navigation: string
}

function formatLocalTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function formatLocalDate(date: Date) {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

const labels: FooterCopy = {
  brand: '動物公報',
  legal: '網站資訊',
  faq: 'FAQ',
  contact: '聯絡我',
  tour: '系統導覽',
  musicOn: '音樂開啟',
  musicOff: '音樂關閉',
  home: '回到動物公報首頁',
  navigation: '頁尾導覽',
}

function Footer({
  mode = 'responsive',
  currentTime,
  currentDate,
  musicEnabled,
  onHome,
  onLegal,
  onFaq,
  onContact,
  onMusicToggle,
  onTour,
}: FooterProps) {
  const [internalMusicEnabled, setInternalMusicEnabled] = useState(true)
  const [localTime, setLocalTime] = useState(currentTime ?? '')
  const [localDate, setLocalDate] = useState(currentDate ?? '')
  const isMusicEnabled = musicEnabled ?? internalMusicEnabled
  const isCompact = mode === 'mobile'
  const isTablet = mode === 'tablet'
  const rootLayout = mode === 'desktop' || isTablet || isCompact ? 'flex-nowrap' : 'flex-wrap sm:flex-nowrap'
  const groupLayout = isTablet || isCompact ? 'flex-nowrap' : 'flex-wrap'
  const stackedGroup = 'w-auto'
  const footerTextSize = 'small'
  const footerTextClass = 'text-small'
  const mobileBottomBorder = isCompact ? ' border-b-thin' : ''

  useEffect(() => {
    if (currentTime !== undefined && currentDate !== undefined) return

    const updateClock = () => {
      const now = new Date()
      if (currentTime === undefined) setLocalTime(formatLocalTime(now))
      if (currentDate === undefined) setLocalDate(formatLocalDate(now))
    }

    updateClock()
    const clockTimer = window.setInterval(updateClock, 1000)
    return () => window.clearInterval(clockTimer)
  }, [currentDate, currentTime])

  const toggleMusic = () => {
    if (onMusicToggle) {
      onMusicToggle()
      return
    }

    setInternalMusicEnabled((enabled) => !enabled)
  }

  return (
    <footer
      className={`flex ${rootLayout} min-h-[2.5rem] min-w-0 shrink-0 items-stretch border-t-thin${mobileBottomBorder} border-ink-primary bg-window-surface font-ui text-ink-primary`}
    >
      <div className={`flex ${groupLayout} ${stackedGroup} min-w-0 items-stretch`}>
        <Button
          label={labels.brand}
          ariaLabel={labels.home}
          tone="brand"
          size="large"
          padding="footer-hug"
          textSize={footerTextSize}
          className="shrink-0 border-r-thin border-ink-primary"
          onClick={onHome}
        />

        <Button
          label={labels.legal}
          appearance="text"
          size="large"
          padding="footer-hug"
          textSize={footerTextSize}
          className="whitespace-nowrap border-r-thin border-ink-primary"
          ariaLabel={labels.navigation}
          onClick={onLegal}
        />
        {!isCompact && (
          <Button
            label={labels.faq}
            appearance="text"
            size="large"
            padding="footer-hug"
            textSize={footerTextSize}
            className="whitespace-nowrap border-r-thin border-ink-primary"
            ariaLabel={labels.faq}
            onClick={onFaq}
          />
        )}
        <Button
          label={labels.contact}
          appearance="text"
          size="large"
          padding="footer-hug"
          textSize={footerTextSize}
          className="whitespace-nowrap border-r-thin border-ink-primary"
          ariaLabel={labels.navigation}
          onClick={onContact}
        />
      </div>

      <div
        className={`ml-auto flex ${groupLayout} ${stackedGroup} min-w-0 items-center justify-end p-space-xs`}
      >
        <Button
          label={isCompact ? '導覽' : labels.tour}
          appearance="text"
          size="small"
          textSize={footerTextSize}
          className="footer-tour-button whitespace-nowrap"
          ariaLabel={isCompact ? '開啟導覽' : '開啟系統導覽'}
          onClick={onTour}
        />
        <Button
          icon={isMusicEnabled ? 'volume-on' : 'volume-off'}
          iconOnly
          iconSize="small"
          appearance="text"
          size="small"
          textSize={footerTextSize}
          ariaLabel={isMusicEnabled ? labels.musicOn : labels.musicOff}
          onClick={toggleMusic}
        />
        {!isCompact && <span className={`whitespace-nowrap px-space-xs py-space-xs ${footerTextClass}`}>{localTime}</span>}
        {!isCompact && <span className={`whitespace-nowrap px-space-xs py-space-xs ${footerTextClass}`}>{localDate}</span>}
      </div>
    </footer>
  )
}

export default Footer
