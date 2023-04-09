import { RouteObject } from 'oh-router'
import { BasicLayout } from '../layouts/basic'
import { aboutRoute } from '../pages/about/route'
import { homeRoute } from '../pages/home/route'
import { settingRoute } from '../pages/setting/route'
import { templateRoute } from '../pages/template/route'
import { templateFormRoute } from '../pages/templateForm/route'
import { translationRoute } from '../pages/translation/route'

export interface Meta {
  mustApiKey?: boolean
}

export const routes: RouteObject<Meta>[] = [
  {
    element: <BasicLayout />,
    meta: {
      mustApiKey: true,
    },
    redirect: settingRoute.path,
    children: [
      homeRoute,
      templateRoute,
      translationRoute,
      templateFormRoute,
      settingRoute,
      aboutRoute,
    ],
  },
]

