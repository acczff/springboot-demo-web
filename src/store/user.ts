import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义一个名为 'user' 的全公司共享仓库（Store）
// useUserStore 是我们以后去别的房间调取这个仓库的“专属钥匙”
export const useUserStore = defineStore('user', () => {

  // 1. 存放在仓库里的公共物资（State）
  const username = ref('')
  const employeeList = ref([
    { name: '李四', age: 20 },
    { name: '王五', age: 22 },
    { name: '赵六', age: 19 }
  ])
  const roles = ref<string[]>([])
  const accessiblePaths = ref<string[]>([])

  function setAccessiblePaths(paths: string[]) {
    accessiblePaths.value = paths
  }

  function setRoles(newRoles: string[]) {
    roles.value = newRoles
  }

  // 2. 仓库管理员提供的“物资操作手册”（Actions）
  // 任何人想改名字，最好调用这个规范的方法，不要自己瞎改
  function setUsername(newName: string) {
    username.value = newName
  }

  function addEmployee(employee: { name: string; age: number }) {
    employeeList.value.push(employee)
  }

  function growUpEmployee(index: number) {
    if (employeeList.value[index]) {
      employeeList.value[index].age += 1
    }
  }

  // 3. 把允许别人使用的物资和方法，统统交回出去
  return { username, setUsername, employeeList, addEmployee, growUpEmployee, roles, setRoles, accessiblePaths, setAccessiblePaths }
})


