import router from '../router'
import { useUserStore } from '../store/user'

// path → 组件映射表，以后加新页面只在这里加一行
const pathComponentMap: Record<string, () => Promise<any>> = {
  '/roles': () => import('../views/Roles.vue'),
}

export async function setupDynamicRoutes(menuList: any[]) {
  const userStore = useUserStore()
  const paths = ['/home', '/users']

  for (const menu of menuList) {
    for (const child of (menu.children || [])) {
      const component: any = pathComponentMap[child.path]
      if (component) {
        if (!router.hasRoute(child.path)) {
          router.addRoute('MainLayout', {
            path: child.path.replace('/', ''),
            name: child.path,
            component
          })
        }
        paths.push(child.path)
      }
    }
  }

  userStore.setAccessiblePaths(paths)
}