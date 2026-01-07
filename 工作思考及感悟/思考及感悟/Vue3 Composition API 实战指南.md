# Vue3 Composition API 实战指南

Vue3 的发布带来了许多激动人心的新特性，其中最引人注目的就是 Composition API。它提供了一种全新的组织组件逻辑的方式，解决了 Vue2 Options API 在处理复杂组件时遇到的代码复用和逻辑组织问题。

## 为什么需要 Composition API

在 Vue2 的 Options API 中，我们通过 data、methods、computed、watch 等选项来组织组件代码。这种方式对于简单组件来说非常直观，但随着组件复杂度的增加，会出现以下问题：

1. **逻辑分散**：同一个功能的代码可能分散在不同的选项中，难以维护
2. **代码复用困难**：通过 Mixins 实现代码复用容易导致命名冲突和数据来源不明确
3. **TypeScript 支持不友好**：Options API 对 TypeScript 的类型推断支持有限

Composition API 通过组合函数（Composable Functions）的方式，让我们能够更灵活地组织和复用逻辑。

## 基础概念

### setup 函数

setup 是 Composition API 的入口函数，它在组件创建之前执行，是组件中唯一可以访问 Composition API 的地方。

```javascript
import { ref, reactive } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: 'Vue3',
      version: '3.0'
    })

    const increment = () => {
      count.value++
    }

    return {
      count,
      state,
      increment
    }
  }
}
```

### ref 和 reactive

- **ref**：用于创建响应式的原始值或对象，访问值需要通过 .value
- **reactive**：用于创建响应式的对象，可以直接访问属性

```javascript
import { ref, reactive } from 'vue'

const count = ref(0)
console.log(count.value) // 0

const user = reactive({
  name: 'John',
  age: 25
})
console.log(user.name) // 'John'
```

### computed 和 watch

```javascript
import { ref, computed, watch } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

watch([firstName, lastName], ([newFirst, newLast]) => {
  console.log(`Name changed to: ${newFirst} ${newLast}`)
})
```

## 实战案例

### 1. 表单处理

创建一个可复用的表单处理函数：

```javascript
import { ref, reactive } from 'vue'

export function useForm(initialValues, validationRules) {
  const form = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})

  const validate = () => {
    let isValid = true
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field]
      const error = rule(form[field])
      if (error) {
        errors[field] = error
        isValid = false
      } else {
        delete errors[field]
      }
    })
    return isValid
  }

  const handleBlur = (field) => {
    touched[field] = true
    validate()
  }

  const handleSubmit = (callback) => {
    Object.keys(form).forEach(field => {
      touched[field] = true
    })
    if (validate()) {
      callback(form)
    }
  }

  const reset = () => {
    Object.assign(form, initialValues)
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])
  }

  return {
    form,
    errors,
    touched,
    validate,
    handleBlur,
    handleSubmit,
    reset
  }
}
```

使用示例：

```javascript
import { useForm } from './composables/useForm'

export default {
  setup() {
    const { form, errors, touched, handleBlur, handleSubmit, reset } = useForm(
      {
        email: '',
        password: '',
        confirmPassword: ''
      },
      {
        email: (value) => {
          if (!value) return '邮箱不能为空'
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return '邮箱格式不正确'
          }
          return null
        },
        password: (value) => {
          if (!value) return '密码不能为空'
          if (value.length < 6) return '密码至少6位'
          return null
        },
        confirmPassword: (value, form) => {
          if (value !== form.password) return '两次密码不一致'
          return null
        }
      }
    )

    const onSubmit = (formData) => {
      console.log('Form submitted:', formData)
    }

    return {
      form,
      errors,
      touched,
      handleBlur,
      handleSubmit: () => handleSubmit(onSubmit),
      reset
    }
  }
}
```

### 2. 数据请求

创建一个通用的数据请求 Hook：

```javascript
import { ref, onMounted } from 'vue'

export function useFetch(url, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchData()
  })

  return {
    data,
    error,
    loading,
    refetch: fetchData
  }
}
```

使用示例：

```javascript
import { useFetch } from './composables/useFetch'

export default {
  setup() {
    const { data, error, loading, refetch } = useFetch(
      'https://api.example.com/users'
    )

    return {
      data,
      error,
      loading,
      refetch
    }
  }
}
```

### 3. 本地存储管理

```javascript
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const value = ref(storedValue ? JSON.parse(storedValue) : defaultValue)

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  const remove = () => {
    localStorage.removeItem(key)
    value.value = defaultValue
  }

  return {
    value,
    remove
  }
}
```

### 4. 防抖和节流

```javascript
import { ref, onUnmounted } from 'vue'

export function useDebounce(fn, delay) {
  let timeoutId = null

  const debouncedFn = (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return debouncedFn
}

export function useThrottle(fn, delay) {
  let lastTime = 0
  let timeoutId = null

  const throttledFn = (...args) => {
    const now = Date.now()
    const remaining = delay - (now - lastTime)

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastTime = now
      fn(...args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now()
        timeoutId = null
        fn(...args)
      }, remaining)
    }
  }

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return throttledFn
}
```

### 5. 窗口大小监听

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const handleResize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    width,
    height
  }
}
```

## 最佳实践

### 1. 合理拆分逻辑

将复杂组件拆分为多个小的、可复用的组合函数：

```javascript
export default {
  setup() {
    const { form, errors, handleSubmit } = useForm(initialValues, rules)
    const { data, loading, error } = useFetch('/api/users')
    const { width, height } = useWindowSize()

    return {
      form,
      errors,
      handleSubmit,
      data,
      loading,
      error,
      width,
      height
    }
  }
}
```

### 2. 使用 TypeScript 增强类型安全

```typescript
import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export function useUser() {
  const users = ref<User[]>([])
  const loading = ref(false)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await fetch('/api/users')
      users.value = await response.json()
    } finally {
      loading.value = false
    }
  }

  const userCount = computed(() => users.value.length)

  return {
    users,
    loading,
    fetchUsers,
    userCount
  }
}
```

### 3. 响应式系统最佳实践

- 使用 ref 处理原始值
- 使用 reactive 处理对象
- 避免解构 reactive 对象，会失去响应性
- 使用 toRefs 解构时保持响应性

```javascript
import { reactive, toRefs } from 'vue'

export default {
  setup() {
    const state = reactive({
      count: 0,
      name: 'Vue3'
    })

    // 错误：会失去响应性
    // const { count, name } = state

    // 正确：使用 toRefs
    const { count, name } = toRefs(state)

    return {
      count,
      name
    }
  }
}
```

### 4. 生命周期钩子

Composition API 中的生命周期钩子需要在 setup 中调用：

```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('Component mounted')
    })

    onUpdated(() => {
      console.log('Component updated')
    })

    onUnmounted(() => {
      console.log('Component unmounted')
    })
  }
}
```

## 总结

Composition API 为 Vue3 带来了更强大的代码组织能力和更好的 TypeScript 支持。通过合理使用组合函数，我们可以：

1. 提高代码的可维护性和可读性
2. 更容易地实现逻辑复用
3. 获得更好的类型推断
4. 更灵活地组织组件逻辑

在实际项目中，建议从简单场景开始使用 Composition API，逐步积累经验，最终形成自己的组合函数库。
