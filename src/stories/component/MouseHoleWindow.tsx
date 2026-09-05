import { Button } from './Button'
import type { WindowMode, WindowPosition, WindowProps } from './Window'
import Window from './Window'

export type MouseHoleWindowProps = {
  mode?: WindowMode
  initialPosition?: WindowPosition
  onClose?: WindowProps['onClose']
  onHuman?: () => void
  onNotHuman?: () => void
}

function MouseHoleWindow({
  mode = 'desktop',
  initialPosition,
  onClose,
  onHuman,
  onNotHuman,
}: MouseHoleWindowProps) {
  const isMobile = mode === 'mobile'

  return (
    <Window
      mode={mode}
      title="老鼠洞"
      initialPosition={initialPosition}
      onClose={onClose}
      className="mouse-hole-window"
    >
      <div className={`grid gap-space-xl text-ink-primary ${isMobile ? 'p-space-md text-small' : 'p-space-lg text-body'}`}>
        <p>
          發現一個老鼠洞
          <br />
          「你是人類嗎？」
        </p>
        <div className="flex justify-center gap-space-md">
          <Button
            label="是"
            size="small"
            textSize="small"
            padding="footer-hug"
            className="window-footer-action w-24"
            onClick={onHuman}
          />
          <Button
            label="不是"
            size="small"
            textSize="small"
            padding="footer-hug"
            className="window-footer-action w-24"
            onClick={onNotHuman}
          />
        </div>
      </div>
    </Window>
  )
}

export default MouseHoleWindow
