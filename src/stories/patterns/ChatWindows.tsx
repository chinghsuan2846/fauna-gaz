import { useEffect, useMemo, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'

import CharacterProfile from '../component/CharacterProfile'
import ChatBubble from '../component/ChatBubble'
import ChatSubmit from '../component/ChatSubmit'
import { Button, type PixelIconName } from '../component/Button'
import { getBubbleImagePosition } from '../component/characterImagePosition'
import type { WindowMode, WindowPosition, WindowProps } from '../component/Window'
import Window from '../component/Window'

export type ChatWindowsMessage = ComponentProps<typeof ChatBubble> & {
  id: string
}

export type ChatWindowsDialogueOption = {
  label: string
  nextNodeId?: string
  choiceId?: string
  requiresAllChoices?: boolean
}

export type ChatWindowsDialogueNode = {
  id: string
  text: string
  options: readonly ChatWindowsDialogueOption[]
  choiceGroupId?: string
}

export type ChatWindowsDialogue = {
  startNodeId: string
  nodes: readonly ChatWindowsDialogueNode[]
}

export type ChatWindowsQuickReply = {
  label: string
  onSelect?: () => void
}

export type ChatWindowsProps = {
  viewport?: WindowMode
  title?: string
  headerIcon?: PixelIconName
  profile: ComponentProps<typeof CharacterProfile>
  messages?: readonly ChatWindowsMessage[]
  dialogue?: ChatWindowsDialogue
  quickReplies?: readonly ChatWindowsQuickReply[]
  submit?: ComponentProps<typeof ChatSubmit>
  className?: string
  showClose?: boolean
  initialPosition?: WindowPosition
  onClose?: WindowProps['onClose']
}

const layoutClasses: Record<WindowMode, string> = {
  desktop: 'grid min-h-0 flex-1 grid-cols-chat-desktop',
  tablet: 'grid min-h-0 flex-1 grid-cols-chat-tablet',
  mobile: 'grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)]',
}

const profileClasses: Record<WindowMode, string> = {
  desktop: 'retroScrollArea min-h-0 min-w-0 overflow-y-auto p-space-md',
  tablet: 'retroScrollArea min-h-0 min-w-0 overflow-y-auto p-space-sm',
  mobile: 'min-w-0 p-space-sm',
}

const messageAreaClasses: Record<WindowMode, string> = {
  desktop: 'flex min-h-0 min-w-0 py-space-md pl-space-sm pr-space-md',
  tablet: 'flex min-h-0 min-w-0 py-space-sm pl-space-xs pr-space-sm',
  mobile: 'flex min-h-0 min-w-0 px-space-sm pb-space-sm pt-space-xs',
}

const messageScrollClasses: Record<WindowMode, string> = {
  desktop: 'retroScrollArea min-h-0 min-w-0 flex-1 overflow-y-auto border-thin border-line-strong p-space-md',
  tablet: 'retroScrollArea min-h-0 min-w-0 flex-1 overflow-y-auto border-thin border-line-strong p-space-sm',
  mobile: 'retroScrollArea min-h-0 min-w-0 flex-1 overflow-y-auto border-thin border-line-strong p-space-sm',
}

const submitAreaClasses: Record<WindowMode, string> = {
  desktop: 'window-footer grid shrink-0 gap-space-sm p-space-md',
  tablet: 'window-footer grid shrink-0 gap-space-sm p-space-sm',
  mobile: 'window-footer grid shrink-0 gap-space-sm p-space-sm',
}

type ChatWindowsContentProps = {
  viewport: WindowMode
  profile: ComponentProps<typeof CharacterProfile>
  messages: readonly ChatWindowsMessage[]
  dialogue?: ChatWindowsDialogue
  quickReplies?: readonly ChatWindowsQuickReply[]
  submit?: ComponentProps<typeof ChatSubmit>
}

function ChatWindowsContent({
  viewport,
  profile,
  messages,
  dialogue,
  quickReplies: providedQuickReplies,
  submit,
}: ChatWindowsContentProps) {
  const isMobile = viewport === 'mobile'
  const [dialogueMessages, setDialogueMessages] = useState<ChatWindowsMessage[]>([])
  const [submittedMessages, setSubmittedMessages] = useState<ChatWindowsMessage[]>([])
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const [selectedDialogueChoices, setSelectedDialogueChoices] = useState<Record<string, string[]>>({})
  const dialogueNodeMap = useMemo(
    () => new Map((dialogue?.nodes ?? []).map((node) => [node.id, node])),
    [dialogue],
  )
  const dialogueChoiceGroupSizes = useMemo(() => {
    const groupChoices = new Map<string, Set<string>>()

    for (const node of dialogue?.nodes ?? []) {
      if (!node.choiceGroupId) continue

      const choices = groupChoices.get(node.choiceGroupId) ?? new Set<string>()
      for (const option of node.options) {
        if (option.choiceId) choices.add(option.choiceId)
      }
      groupChoices.set(node.choiceGroupId, choices)
    }

    return new Map([...groupChoices].map(([groupId, choices]) => [groupId, choices.size]))
  }, [dialogue])

  useEffect(() => {
    if (!dialogue) {
      setDialogueMessages([])
      setActiveNodeId(null)
      setSubmittedMessages([])
      setSelectedDialogueChoices({})
      return
    }

    const startNode = dialogueNodeMap.get(dialogue.startNodeId) ?? dialogue.nodes[0]
    if (!startNode) {
      setDialogueMessages([])
      setActiveNodeId(null)
      setSelectedDialogueChoices({})
      return
    }

    setDialogueMessages([
      {
        id: `${startNode.id}-character`,
        avatarSrc: profile.imageSrc,
        avatarAlt: profile.imageAlt,
        message: startNode.text,
        speaker: 'character',
      },
    ])
    setSubmittedMessages([])
    setActiveNodeId(startNode.id)
    setSelectedDialogueChoices({})
  }, [dialogue, dialogueNodeMap, profile.imageAlt, profile.imageSrc])

  const visibleMessages = dialogue ? dialogueMessages : [...messages, ...submittedMessages]
  const activeNode = activeNodeId ? dialogueNodeMap.get(activeNodeId) : undefined

  const chooseDialogueOption = (option: ChatWindowsDialogueOption) => {
    if (!dialogue || !activeNode) return

    const choiceGroupId = activeNode.choiceGroupId
    const selectedChoices = choiceGroupId ? selectedDialogueChoices[choiceGroupId] ?? [] : []
    if (choiceGroupId && option.choiceId && selectedChoices.includes(option.choiceId)) return

    const nextNode = option.nextNodeId ? dialogueNodeMap.get(option.nextNodeId) : undefined
    const nextMessages: ChatWindowsMessage[] = [
      ...dialogueMessages,
      { id: `${activeNode.id}-${option.label}`, message: option.label, speaker: 'user' },
    ]

    if (nextNode) {
      nextMessages.push({
        id: `${nextNode.id}-character-${nextMessages.length}`,
        avatarSrc: profile.imageSrc,
        avatarAlt: profile.imageAlt,
        message: nextNode.text,
        speaker: 'character',
      })
    }

    if (choiceGroupId && option.choiceId) {
      setSelectedDialogueChoices((current) => ({
        ...current,
        [choiceGroupId]: [...selectedChoices, option.choiceId as string],
      }))
    }

    setDialogueMessages(nextMessages)
    setActiveNodeId(nextNode?.id ?? null)
  }

  const submitMessage = (message: string) => {
    submit?.onSubmit?.(message)

    const nextMessage: ChatWindowsMessage = {
      id: `user-message-${visibleMessages.length}`,
      message,
      speaker: 'user',
    }

    if (dialogue) {
      setDialogueMessages((current) => [...current, nextMessage])
    } else {
      setSubmittedMessages((current) => [...current, nextMessage])
    }
  }

  const quickReplies = dialogue
    ? activeNode
      ? activeNode.options
          .filter((option) => {
            if (!activeNode.choiceGroupId) return true

            const selectedChoices = selectedDialogueChoices[activeNode.choiceGroupId] ?? []
            if (option.choiceId && selectedChoices.includes(option.choiceId)) return false

            if (option.requiresAllChoices) {
              const totalChoices = dialogueChoiceGroupSizes.get(activeNode.choiceGroupId) ?? 0
              return totalChoices > 0 && selectedChoices.length >= totalChoices
            }

            return true
          })
          .map((option) => ({
            label: option.label,
            onSelect: () => chooseDialogueOption(option),
          }))
      : []
    : providedQuickReplies

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className={layoutClasses[viewport]}>
        <aside className={profileClasses[viewport]}>
          <CharacterProfile {...profile} variant={isMobile ? 'compact' : 'full'} className="max-w-full" />
        </aside>
        <section className={messageAreaClasses[viewport]} aria-label="Chat messages">
          <div className={messageScrollClasses[viewport]}>
            <div className="grid min-h-full content-start gap-space-md">
              {visibleMessages.map(({ id, ...message }) => (
                <ChatBubble
                  key={id}
                  {...message}
                  avatarPosition={message.avatarPosition ?? getBubbleImagePosition(profile.name, viewport)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className={submitAreaClasses[viewport]}>
        {quickReplies && quickReplies.length > 0 && (
          <div className="flex flex-wrap justify-start gap-space-xs" aria-label="快速回覆">
            {quickReplies.map((quickReply) => (
              <Button
                key={quickReply.label}
                appearance="outline"
                label={quickReply.label}
                size="small"
                textSize="small"
                onClick={quickReply.onSelect}
              />
            ))}
          </div>
        )}
        <ChatSubmit
          {...submit}
          onSubmit={submitMessage}
        />
      </div>
    </div>
  )
}

export function ChatWindows({
  viewport = 'desktop',
  title = '',
  headerIcon = 'message',
  profile,
  messages = [],
  dialogue,
  quickReplies,
  submit,
  className = '',
  showClose = true,
  initialPosition,
  onClose,
}: ChatWindowsProps) {
  return (
    <Window
      mode={viewport}
      title={title}
      headerIcon={headerIcon}
      showClose={showClose}
      initialPosition={initialPosition}
      onClose={onClose}
      className={`h-full min-h-0 ${className}`}
    >
      <ChatWindowsContent
        viewport={viewport}
        profile={profile}
        messages={messages}
        dialogue={dialogue}
        quickReplies={quickReplies}
        submit={submit}
      />
    </Window>
  )
}

export default ChatWindows
