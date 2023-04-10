import { withStore } from '@libeilong/react-store-provider'
import { withObserver } from '../../shared/func/withObserver'
import { BasicSetting } from './basic'
import styles from './index.module.scss'
import { OtherSetting } from './other'
import { Store } from './store'

function _Page() {
  return withObserver(() => (
    <div className={styles.index}>
      <h2>设置</h2>
      <div className={styles.title}>基本配置</div>
      <div className={styles.box}>
        <BasicSetting />
      </div>

      <div className={styles.title}>其他</div>
      <div className={styles.box}>
        <OtherSetting />
      </div>
    </div>
  ))
}

export const Page = withStore(_Page, Store)

