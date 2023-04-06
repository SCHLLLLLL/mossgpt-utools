import { openCommandPanel } from '../../components/popups/commandPanel'
import { homeRoute } from '../../pages/home/route'
import { homeStore } from '../../pages/home/store'
import { router } from '../../router'

export function registerKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 't' &&
      e.ctrlKey &&
      router.location?.pathname === homeRoute.path
    ) {
      homeStore.createConversation()
    } else if (e.key === 'p' && e.ctrlKey) {
      openCommandPanel()
    }
  })
}

