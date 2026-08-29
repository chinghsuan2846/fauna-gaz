import { useEffect, useState } from 'react'
import type { ButtonProps } from './Button'
import { Button } from './Button'

export type FooterMode = 'responsive' | 'desktop' | 'tablet' | 'mobile'
type FooterLanguage = 'zh' | 'en'

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
}

type FooterCopy = {
  brand: string
  legal: string
  faq: string
  contact: string
  language: string
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

const copy: Record<FooterLanguage, FooterCopy> = {
  zh: {
    brand: '動物公報',
    legal: '網站資訊',
    faq: 'FAQ',
    contact: '聯絡我',
    language: '中文',
    musicOn: '音樂開啟',
    musicOff: '音樂關閉',
    home: '回到動物公報首頁',
    navigation: '頁尾導覽',
  },
  en: {
    brand: 'Fauna Gaz',
    legal: 'Info',
    faq: 'FAQ',
    contact: 'Contact',
    language: 'English',
    musicOn: 'Music on',
    musicOff: 'Music off',
    home: 'Back to Fauna Gaz home',
    navigation: 'Footer navigation',
  },
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
}: FooterProps) {
  const [language, setLanguage] = useState<FooterLanguage>('zh')
  const [internalMusicEnabled, setInternalMusicEnabled] = useState(true)
  const [localTime, setLocalTime] = useState(currentTime ?? '')
  const [localDate, setLocalDate] = useState(currentDate ?? '')
  const isMusicEnabled = musicEnabled ?? internalMusicEnabled
  const labels = copy[language]
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

  const toggleLanguage = () => setLanguage((current) => (current === 'zh' ? 'en' : 'zh'))
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
          label={labels.language}
          appearance="text"
          size="small"
          textSize={footerTextSize}
          className="whitespace-nowrap"
          ariaLabel={language === 'zh' ? '切換成 English' : '切換成中文'}
          onClick={toggleLanguage}
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
