import {
  characterImageObjectPositionClasses,
  characterImagePositionClasses,
  type CharacterImagePosition,
} from './characterImagePosition'

export type ChatBubbleSpeaker = 'character' | 'user'

export type ChatBubbleProps = {
  avatarSrc?: string
  avatarAlt?: string
  message: string
  speaker?: ChatBubbleSpeaker
  avatarPosition?: CharacterImagePosition
  className?: string
}

const speakerClasses: Record<ChatBubbleSpeaker, string> = {
  character: 'mr-auto',
  user: 'ml-auto flex-row-reverse',
}

const borderClasses: Record<ChatBubbleSpeaker, string> = {
  character: 'border-line-strong',
  user: 'border-line-subtle',
}

const paddingClasses: Record<ChatBubbleSpeaker, string> = {
  character: 'p-space-sm',
  user: 'p-space-sm',
}

export function ChatBubble({
  avatarSrc,
  avatarAlt = '',
  message,
  speaker = 'character',
  avatarPosition = 'default',
  className = '',
}: ChatBubbleProps) {
  const mobileBubbleOffset = avatarPosition === 'slightly-left'
    ? 'translate-x-space-xs translate-y-space-xs sm:translate-x-0 sm:translate-y-0'
    : ''

  return (
    <article
      className={`flex w-fit max-w-chat-bubble-mobile items-start gap-space-sm font-body sm:max-w-chat-bubble ${speakerClasses[speaker]} ${mobileBubbleOffset} ${className}`}
    >
      {speaker === 'character' && avatarSrc ? (
        <div className="h-space-xl w-space-xl shrink-0 overflow-hidden rounded-full bg-scrollbar-track">
          <img
            className={`block h-full w-full scale-125 translate-y-space-xs object-cover ${characterImageObjectPositionClasses[avatarPosition]} ${characterImagePositionClasses[avatarPosition]}`}
            src={avatarSrc}
            alt={avatarAlt}
            draggable="false"
          />
        </div>
      ) : null}
      <p
        className={`min-w-0 w-fit max-w-full break-words whitespace-pre-wrap border-thin font-body text-small text-ink-primary ${paddingClasses[speaker]} ${borderClasses[speaker]} ${speaker === 'character' ? 'bg-scrollbar-track' : 'bg-window-surface'}`}
      >
        {message}
      </p>
    </article>
  )
}

export default ChatBubble
