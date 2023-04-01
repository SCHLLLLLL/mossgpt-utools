import { IConfig, MessageShortcutKey } from './types'

export const Models = ['gpt-3.5-turbo', 'gpt-3.5-turbo-0301']

export const DefaultAutoTranslation = true

export const DefaultConfig: IConfig = {
  model: Models[0],
  apiBaseUrl: 'https://closeai.deno.dev/v1',
  prompt: undefined,
  max_tokens: undefined,
  temperature: undefined,
  top_p: undefined,
  presence_penalty: undefined,
  frequency_penalty: undefined,
  proxy: {
    open: false,
    host: undefined,
    port: undefined,
    username: undefined,
    password: undefined,
  },
}

export const DefaultTemplates = [
  {
    title: '写邮件',
    template: '请为我写一份正式的邮件，要求如下：\n{内容}',
  },
  {
    title: '任何语言翻译为中文',
    template: '请为我翻译以下这段文字为中文：\n{内容}',
  },
  {
    title: '充当英英词典(附中文解释)',
    template:
      '将英文单词转换为包括中文翻译、英文释义和一个例句的完整解释。请检查所有信息是否准确，并在回答时保持简洁，不需要任何其他反馈。第一个单词是：{内容}',
    recommendTopic: true,
  },
  {
    title: '把任何语言翻译成中文',
    template:
      '下面我让你来充当翻译家，你的目标是把任何语言翻译成中文，请翻译时不要带翻译腔，而是要翻译得自然、流畅和地道，使用优美和高雅的表达方式。请翻译这句话：{内容}',
    recommendTopic: true,
  },
  {
    title: '充当“电影/书籍/任何东西”中的“角色”',
    template:
      '我希望你表现得像{作品}中的{角色}。我希望你像{角色}一样回应和回答。不要写任何解释。只回答像{角色}。你必须知道{角色}的所有知识。我的第一句话是：“你好”',
    recommendTopic: true,
  },
  {
    title: '充当前端智能思路助手',
    template:
      '我想让你充当前端开发专家。我将提供一些关于Js、Node等前端代码问题的具体信息，而你的工作就是想出为我解决问题的策略。这可能包括建议代码、代码逻辑思路策略。我的第一个请求是：“{内容}”',
    recommendTopic: true,
  },
  {
    title: '充当小说家',
    template:
      '我想让你扮演一个小说家。您将想出富有创意且引人入胜的故事，可以长期吸引读者。你可以选择任何类型，如奇幻、浪漫、历史小说等——但你的目标是写出具有出色情节、引人入胜的人物和意想不到的高潮的作品。我的第一个要求是：“{内容}”。',
    recommendTopic: true,
  },
  {
    title: '装作杠精',
    template:
      '我想让你装做一个很会抬杠的人（抬杠指的是唱反调，调侃和讽刺对方），不管我说什么你都先挑刺反驳。我的第一句话是：“{内容}”',
    recommendTopic: true,
  },
]

export const dataVersion = 2

export const defaultMessageShortcutKey = MessageShortcutKey.Enter

export const ApiUrls = [
  {
    name: 'OpenAI 官方线路',
    url: 'https://api.openai.com/v1',
    needVpn: true,
  },
  {
    name: '免费线路 - justjavac 大佬搭建',
    url: 'https://closeai.deno.dev/v1',
    needVpn: false,
  },
]

