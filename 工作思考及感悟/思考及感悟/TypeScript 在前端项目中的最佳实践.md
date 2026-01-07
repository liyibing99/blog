# TypeScript 在前端项目中的最佳实践

TypeScript 作为 JavaScript 的超集，为前端开发带来了静态类型检查、更好的 IDE 支持和更优秀的代码可维护性。本文将介绍在实际项目中使用 TypeScript 的最佳实践。

## 为什么选择 TypeScript

### 1. 类型安全

TypeScript 的静态类型系统可以在编译时捕获大部分错误，而不是等到运行时才发现问题。

```typescript
// JavaScript - 运行时才能发现错误
function calculateTotal(price, quantity) {
  return price * quantity
}

console.log(calculateTotal('10', 5)) // '1010' - 不是我们想要的结果

// TypeScript - 编译时就能发现错误
function calculateTotal(price: number, quantity: number): number {
  return price * quantity
}

console.log(calculateTotal('10', 5)) // 编译错误：类型不匹配
```

### 2. 更好的 IDE 支持

TypeScript 提供了智能提示、自动补全、重构等功能，大大提升了开发效率。

### 3. 更好的代码文档

类型本身就是最好的文档，让代码更易于理解和维护。

## 基础类型定义

### 原始类型

```typescript
let name: string = 'John'
let age: number = 25
let isActive: boolean = true
let nothing: null = null
let notDefined: undefined = undefined

// 数组
let numbers: number[] = [1, 2, 3]
let strings: Array<string> = ['a', 'b', 'c']

// 元组
let user: [string, number] = ['John', 25]

// 枚举
enum Direction {
  Up,
  Down,
  Left,
  Right
}

let direction: Direction = Direction.Up

// any 和 unknown
let anything: any = 'anything'
let unknownValue: unknown = 'unknown'

// void
function log(message: string): void {
  console.log(message)
}

// never
function throwError(message: string): never {
  throw new Error(message)
}
```

### 对象类型

```typescript
interface User {
  id: number
  name: string
  email: string
  age?: number // 可选属性
  readonly createdAt: Date // 只读属性
}

const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  createdAt: new Date()
}

// 类型别名
type ID = number | string

type Status = 'pending' | 'success' | 'error'

type ApiResponse<T> = {
  data: T
  status: Status
  message?: string
}
```

## 函数类型

### 基本函数类型

```typescript
// 函数声明
function add(a: number, b: number): number {
  return a + b
}

// 函数表达式
const multiply = (a: number, b: number): number => {
  return a * b
}

// 可选参数
function greet(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}` : `Hello, ${name}`
}

// 默认参数
function createUrl(path: string, protocol: string = 'https'): string {
  return `${protocol}://${path}`
}

// 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0)
}

// 函数重载
function processInput(input: string): string
function processInput(input: number): number
function processInput(input: string | number): string | number {
  if (typeof input === 'string') {
    return input.toUpperCase()
  }
  return input * 2
}
```

### 高阶函数

```typescript
type AsyncCallback<T> = (data: T) => Promise<void>

async function fetchData<T>(
  url: string,
  callback: AsyncCallback<T>
): Promise<void> {
  const response = await fetch(url)
  const data: T = await response.json()
  await callback(data)
}
```

## 高级类型

### 泛型

```typescript
// 基本泛型
function identity<T>(arg: T): T {
  return arg
}

const result = identity<string>('hello')

// 泛型约束
interface Lengthwise {
  length: number
}

function getLength<T extends Lengthwise>(arg: T): number {
  return arg.length
}

// 多个泛型参数
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second]
}

// 泛型类
class Storage<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  get(index: number): T {
    return this.items[index]
  }
}

const stringStorage = new Storage<string>()
stringStorage.add('hello')
```

### 条件类型

```typescript
type NonNullable<T> = T extends null | undefined ? never : T

type MessageOf<T> = T extends { message: unknown } ? T['message'] : never

interface Email {
  message: string
}

interface Dog {
  bark(): void
}

type EmailMessage = MessageOf<Email> // string
type DogMessage = MessageOf<Dog> // never
```

### 映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

type Required<T> = {
  [P in keyof T]-?: T[P]
}

interface User {
  id: number
  name: string
  email: string
}

type ReadonlyUser = Readonly<User>
type PartialUser = Partial<User>
```

### 工具类型

```typescript
// Partial - 将所有属性变为可选
type PartialUser = Partial<User>

// Required - 将所有属性变为必需
type RequiredUser = Required<PartialUser>

// Readonly - 将所有属性变为只读
type ReadonlyUser = Readonly<User>

// Pick - 选择部分属性
type UserBasicInfo = Pick<User, 'id' | 'name'>

// Omit - 排除部分属性
type UserWithoutEmail = Omit<User, 'email'>

// Record - 创建对象类型
type UserMap = Record<string, User>

// Extract - 提取联合类型中的部分
type StringOrNumber = string | number
type OnlyString = Extract<StringOrNumber, string>

// Exclude - 排除联合类型中的部分
type OnlyNumber = Exclude<StringOrNumber, string>
```

## 在 React 中使用 TypeScript

### 组件类型定义

```typescript
import React, { useState, useEffect } from 'react'

// 函数组件
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  )
}

// 泛型组件
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// 使用示例
interface User {
  id: number
  name: string
  email: string
}

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <List
      items={users}
      renderItem={user => (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
      keyExtractor={user => user.id.toString()}
    />
  )
}
```

### Hooks 类型定义

```typescript
// 自定义 Hook
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// 使用自定义 Hook
const UserProfile: React.FC = () => {
  const [user, setUser] = useLocalStorage<User>('user', {
    id: 0,
    name: '',
    email: ''
  })

  return (
    <div>
      <input
        value={user.name}
        onChange={e => setUser({ ...user, name: e.target.value })}
      />
    </div>
  )
}
```

## 在 Vue 中使用 TypeScript

### 组件类型定义

```typescript
import { defineComponent, ref, computed, PropType } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export default defineComponent({
  name: 'UserCard',

  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    showEmail: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const isHovered = ref(false)

    const displayName = computed(() => {
      return props.showEmail ? `${props.user.name} (${props.user.email})` : props.user.name
    })

    const handleMouseEnter = () => {
      isHovered.value = true
    }

    const handleMouseLeave = () => {
      isHovered.value = false
    }

    return {
      isHovered,
      displayName,
      handleMouseEnter,
      handleMouseLeave
    }
  }
})
```

### Composition API 类型

```typescript
import { ref, reactive, computed } from 'vue'

interface FormState {
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

export function useForm() {
  const form = reactive<FormState>({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const errors = reactive<FormErrors>({})

  const isValid = computed(() => {
    return Object.keys(errors).length === 0
  })

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validate = (): boolean => {
    let isValid = true

    if (!form.email) {
      errors.email = '邮箱不能为空'
      isValid = false
    } else if (!validateEmail(form.email)) {
      errors.email = '邮箱格式不正确'
      isValid = false
    } else {
      delete errors.email
    }

    if (!form.password) {
      errors.password = '密码不能为空'
      isValid = false
    } else if (form.password.length < 6) {
      errors.password = '密码至少6位'
      isValid = false
    } else {
      delete errors.password
    }

    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = '两次密码不一致'
      isValid = false
    } else {
      delete errors.confirmPassword
    }

    return isValid
  }

  const reset = (): void => {
    form.email = ''
    form.password = ''
    form.confirmPassword = ''
    Object.keys(errors).forEach(key => delete errors[key])
  }

  return {
    form,
    errors,
    isValid,
    validate,
    reset
  }
}
```

## API 请求类型定义

### 请求和响应类型

```typescript
// 请求参数类型
interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

// 响应数据类型
interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

interface AuthResponse {
  token: string
  user: User
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface PaginationParams {
  page: number
  pageSize: number
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// API 客户端
class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string): void {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })

    this.setToken(response.data.token)
    return response.data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    this.setToken(response.data.token)
    return response.data
  }

  async getUsers(
    params: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    const queryString = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString()
    }).toString()

    const response = await this.request<PaginatedResponse<User>>(
      `/users?${queryString}`
    )

    return response.data
  }
}

// 使用示例
const api = new ApiClient('https://api.example.com')

async function exampleUsage() {
  try {
    const auth = await api.login({
      email: 'user@example.com',
      password: 'password123'
    })

    console.log('Logged in as:', auth.user.name)

    const users = await api.getUsers({ page: 1, pageSize: 10 })
    console.log('Users:', users.items)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## 最佳实践

### 1. 严格模式配置

在 `tsconfig.json` 中启用严格模式：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2. 避免使用 any

```typescript
// 不好的做法
function processData(data: any) {
  return data.value
}

// 好的做法
interface Data {
  value: string
}

function processData(data: Data) {
  return data.value
}

// 或者使用泛型
function processData<T extends { value: string }>(data: T): string {
  return data.value
}
```

### 3. 使用类型守卫

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  )
}

function processValue(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase())
  } else if (isUser(value)) {
    console.log(value.name)
  }
}
```

### 4. 合理使用类型断言

```typescript
// 尽量避免类型断言
const element = document.getElementById('app') as HTMLElement

// 更好的方式：使用类型守卫
const element = document.getElementById('app')
if (element instanceof HTMLElement) {
  element.innerHTML = 'Hello'
}
```

### 5. 使用 JSDoc 增强文档

```typescript
/**
 * 计算两个数的和
 * @param a - 第一个数
 * @param b - 第二个数
 * @returns 两个数的和
 */
function add(a: number, b: number): number {
  return a + b
}

/**
 * 用户信息接口
 */
interface User {
  /** 用户ID */
  id: number
  /** 用户名 */
  name: string
  /** 用户邮箱 */
  email: string
}
```

## 总结

TypeScript 为前端项目带来了类型安全和更好的开发体验。通过合理使用类型系统、遵循最佳实践，我们可以构建更健壮、更易维护的前端应用。关键要点：

1. 启用严格模式，充分利用类型检查
2. 避免使用 any，使用更精确的类型
3. 合理使用泛型提高代码复用性
4. 使用类型守卫处理未知类型
5. 为 API 请求、组件等定义清晰的类型
6. 保持类型定义的简洁和可维护性
