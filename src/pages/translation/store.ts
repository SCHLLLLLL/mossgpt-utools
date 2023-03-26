import { makeAutoObservable } from 'mobx'
import { Storage } from '../../shared/storage'
import { chatgptStore } from '../../stores/chatgpt'

export const translationStore = new (class {
  constructor() {
    this.autoMode = Storage.getAutoTranslation()
    makeAutoObservable(this)
  }

  autoMode: boolean

  get config() {
    if (/[\u4e00-\u9fa5]/.test(this.source)) {
      return {
        targetLang: '英语',
        sourceLang: '中文',
      }
    } else {
      return {
        targetLang: '中文',
        sourceLang: '英语',
      }
    }
  }

  source = ''
  target = ''

  err?: Error

  timer?: NodeJS.Timeout

  onSourceChange = (text: string) => {
    this.source = text
    clearTimeout(this.timer)
    if (this.autoMode) this.timer = setTimeout(this.start, 1000)
  }

  start = async () => {
    if (this.source.trim() === '') return
    this.err = undefined
    try {
      const { targetLang } = this.config
      await chatgptStore.sendMessage(
        `下面我让你来充当翻译家，你的目标是把任何语言翻译成${targetLang}，请翻译时不要带翻译腔，而是要翻译得自然、流畅和地道，使用优美和高雅的表达方式。请翻译下面的内容：\n${this.source}`,
        {
          onProgress: ({ text }) => {
            this.target = text
          },
        }
      )
    } catch (err: any) {
      this.err = err
    }
  }

  reverse = () => {
    if (this.target.trim() === '') return
    this.onSourceChange(this.target)
    this.target = ''
  }

  setAutoMode = (value: boolean) => {
    this.autoMode = value
    Storage.setAutoTranslation(value)
  }
})()

