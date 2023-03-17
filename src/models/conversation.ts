import { makeAutoObservable, toJS } from 'mobx'
import { Storage } from '../shared/storage'
import { chatgptStore } from '../stores/chatgpt'
import { Message } from './message'

export class Conversation {
  id: string
  messages: Message[] = []
  name: string
  createdAt: number
  updatedAt: number

  constructor(opts?: {
    id?: string
    name?: string
    createdAt?: number
    updatedAt?: number
  }) {
    this.id = opts?.id || Date.now() + ''
    this.name = opts?.name || '新会话'
    this.createdAt = opts?.createdAt || Date.now()
    this.updatedAt = opts?.updatedAt || opts?.createdAt || Date.now()

    makeAutoObservable(this)
  }

  private initialized = false

  private loading = false

  get lastMessage() {
    return this.messages[this.messages.length - 1]
  }

  init = () => {
    if (this.initialized) return
    this.messages = Storage.getMessagesByConversationId(this.id)
    this.initialized = true
  }

  check = () => {
    if (!this.lastMessage) return
    if (this.loading) throw Error('请等待上一条消息回复完成')
    if (this.lastMessage.state === 'sending') {
      throw Error('请等待上一条消息回复完成')
    } else if (this.lastMessage.state === 'fail') {
      this.resendMessage()
      throw Error('请等待上一条消息回复完成')
    }
  }

  generateTitle = async (text: string) => {
    await chatgptStore.getTitle(text, ({ text }) => {
      text = text.trim()
      if (!text) return
      this.name = text
    })
    this.flushDb()
  }

  private _sendMessage = async (
    lastMessage: Message,
    chatgptMessage: Message
  ) => {
    this.updatedAt = Date.now()
    this.flushDb()
    try {
      this.loading = true
      const { prompt } = Storage.getConfig()

      await chatgptStore.sendMessage(lastMessage.text, {
        parentMessageId: lastMessage.parentMessageId,
        messageId: lastMessage.id,
        systemMessage: prompt.trim() !== '' ? prompt.trim() : undefined,
        onProgress: ({ text }) => {
          text = text.trim()
          if (!text) return
          chatgptMessage.text = text
          chatgptMessage.flushDb()
        },
      })
      chatgptMessage.state = 'done'

      if (this.messages.length === 2 && this.name === '新会话') {
        this.generateTitle(lastMessage.text)
      }
    } catch (err: any) {
      chatgptMessage.state = 'fail'
      chatgptMessage.failedReason = err.message
    } finally {
      chatgptMessage.flushDb()
      this.loading = false
    }
  }

  sendMessage = async (text: string) => {
    const lastMessage = this.lastMessage
    const now = Date.now()
    const userMessage = new Message({
      role: 'user',
      text,
      createdAt: now,
      state: 'done',
      conversationId: this.id,
      parentMessageId: lastMessage?.id,
    }).flushDb()
    let chatgptMessage = new Message({
      role: 'assistant',
      text: '',
      createdAt: now + 1,
      state: 'sending',
      parentMessageId: userMessage.id,
      conversationId: this.id,
    }).flushDb()
    this.messages.push(userMessage, chatgptMessage)
    this._sendMessage(userMessage, chatgptMessage)
  }

  resendMessage = async () => {
    let lastMessage = this.messages[this.messages.length - 2]
    let chatgptMessage = this.messages[this.messages.length - 1]
    if (lastMessage === undefined) {
      lastMessage = chatgptMessage
      chatgptMessage = new Message({
        role: 'assistant',
        state: 'sending',
        text: '',
        createdAt: Date.now(),
        parentMessageId: lastMessage.id,
        conversationId: this.id,
      })
      this.messages.push(chatgptMessage)
    } else {
      chatgptMessage.state = 'sending'
      chatgptMessage.text = ''
      chatgptMessage.createdAt = Date.now()
      chatgptMessage.failedReason = undefined
    }

    chatgptMessage.flushDb()
    this._sendMessage(lastMessage, chatgptMessage)
  }

  /**
   * 删除指定位置消息，并把父子关系转移到下一条消息
   * @param index
   */
  removeMessage = (index: number) => {
    const message = this.messages[index]
    const nextMessage = this.messages[index + 1]
    if (nextMessage) {
      nextMessage.parentMessageId = message.parentMessageId
      nextMessage.flushDb()
    }
    this.messages.splice(index, 1)
    Storage.removeMessage(message.id)
    this.flushDb()
  }

  flushDb = () => {
    Storage.setConversation(this)
    return this
  }
}

