import { useState } from 'react'
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
  onContact?: ButtonProps['onClick']
  onMusicToggle?: () => void
}

type FooterCopy = {
  brand: string
  legal: string
  contact: string
  language: string
  musicOn: string
  musicOff: string
  home: string
  navigation: string
}

const copy: Record<FooterLanguage, FooterCopy> = {
  zh: {
    brand: '動物公報',
    legal: '網站資訊',
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
  currentTime = '22:53',
  currentDate = '2026/8/18',
  musicEnabled,
  onHome,
  onLegal,
  onContact,
  onMusicToggle,
}: FooterProps) {
  const [language, setLanguage] = useState<FooterLanguage>('zh')
  const [internalMusicEnabled, setInternalMusicEnabled] = useState(true)
  const isMusicEnabled = musicEnabled ?? internalMusicEnabled
  const labels = copy[language]
  const isCompact = mode === 'mobile'
  const isTablet = mode === 'tablet'
  const rootLayout = mode === 'desktop' || isTablet || isCompact ? 'flex-nowrap' : 'flex-wrap sm:flex-nowrap'
  const groupLayout = isTablet || isCompact ? 'flex-nowrap' : 'flex-wrap'
  const stackedGroup = 'w-auto'
  const footerTextSize = 'small'
  const footerTextClass = 'text-small'

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
      className={`flex ${rootLayout} min-h-[2.5rem] min-w-0 shrink-0 items-stretch border-t-thin border-ink-primary bg-window-surface font-ui text-ink-primary`}
    >
      <div className={`flex ${groupLayout} ${stackedGroup} min-w-0 items-stretch`}>
        <Button
          label={labels.brand}
          ariaLabel={labels.home}
          tone="brand"
          size="large"
          padding="footer-hug"
          textSize={footerTextSize}
          className="shrink-0"
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
        {!isCompact && <span className={`whitespace-nowrap px-space-xs py-space-xs ${footerTextClass}`}>{currentTime}</span>}
        {!isCompact && <span className={`whitespace-nowrap px-space-xs py-space-xs ${footerTextClass}`}>{currentDate}</span>}
      </div>
    </footer>
  )
}

export default Footer
