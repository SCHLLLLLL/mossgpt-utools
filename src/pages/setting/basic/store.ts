import { objectPick } from '@libeilong/func'
import { message } from 'antd'
import { makeAutoObservable } from 'mobx'
import { stores } from '../../../stores'
import { IConfig } from '../../../types'

let time: NodeJS.Timer

export class Store {
  constructor() {
    clearInterval(time)
    makeAutoObservable(this)

    this.fields = objectPick(stores.config.config, [
      'apiBaseUrl',
      'model',
      'max_tokens',
      'systemMessage',
    ])
    this.apiKey = stores.config.apiKey

    time = setInterval(() => {
      this.currentLink = this.currentLink === 1 ? 0 : 1
    }, 3000)
  }

  currentLink = 0

  fields: Pick<IConfig, 'apiBaseUrl' | 'model' | 'max_tokens' | 'systemMessage'>

  apiKey: string

  onSubmit = () => {
    Object.assign(stores.config.config, this.fields)
    stores.config.apiKey = this.apiKey
    stores.config.flushDb()
    stores.chatgpt.reset()
    message.success('成功')
  }
}

