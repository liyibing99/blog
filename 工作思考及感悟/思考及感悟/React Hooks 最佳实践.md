# React Hooks 最佳实践

React Hooks 自 React 16.8 引入以来，彻底改变了我们编写 React 组件的方式。Hooks 让我们能够在函数组件中使用状态和其他 React 特性，而不需要编写类组件。本文将深入探讨 React Hooks 的最佳实践，帮助你编写更优雅、更高效的 React 代码。

## Hooks 基础回顾

### 常用 Hooks

React 提供了多个内置 Hooks，每个都有其特定的用途：

- **useState**：管理组件状态
- **useEffect**：处理副作用
- **useContext**：访问 Context
- **useReducer**：管理复杂状态
- **useCallback**：缓存回调函数
- **useMemo**：缓存计算结果
- **useRef**：访问 DOM 或保存可变值
- **useLayoutEffect**：同步执行副作用
- **useImperativeHandle**：自定义 ref 暴露
- **useDebugValue**：调试自定义 Hook

## Hooks 使用规则

### 规则 1：只在函数组件中调用 Hooks

```javascript
function MyComponent() {
  const [count, setCount] = useState(0)
  return <div>{count}</div>
}

class MyComponent extends React.Component {
  render() {
    const [count, setCount] = useState(0) // 错误！不能在类组件中使用 Hooks
    return <div>{count}</div>
  }
}
```

### 规则 2：只在顶层调用 Hooks

```javascript
function MyComponent() {
  const [count, setCount] = useState(0)

  if (count > 0) {
    const [name, setName] = useState('') // 错误！不能在条件语句中使用 Hooks
  }

  for (let i = 0; i < 10; i++) {
    useEffect(() => {
      console.log(i)
    }) // 错误！不能在循环中使用 Hooks
  }

  return <div>{count}</div>
}
```

## 最佳实践

### 1. 合理使用 useState

#### 命名规范

```javascript
const [count, setCount] = useState(0)
const [user, setUser] = useState(null)
const [isLoading, setIsLoading] = useState(false)
```

#### 函数式更新

```javascript
const [count, setCount] = useState(0)

const increment = () => {
  setCount(count + 1) // 基于当前值更新
}

const incrementSafe = () => {
  setCount(prevCount => prevCount + 1) // 函数式更新，更安全
}
```

#### 惰性初始化

```javascript
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation()
  return initialState
})
```

#### 状态结构设计

```javascript
// 不推荐：多个独立状态
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [age, setAge] = useState(0)

// 推荐：合并相关状态
const [user, setUser] = useState({
  firstName: '',
  lastName: '',
  age: 0
})

// 更新时使用展开运算符
setUser(prev => ({
  ...prev,
  firstName: 'John'
}))
```

### 2. 正确使用 useEffect

#### 依赖数组

```javascript
useEffect(() => {
  document.title = `Count: ${count}`
}, [count]) // 只有当 count 变化时才重新执行

useEffect(() => {
  const subscription = props.source.subscribe()
  return () => {
    subscription.unsubscribe()
  }
}, [props.source]) // 确保依赖数组包含所有外部变量
```

#### 清理副作用

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Timer tick')
  }, 1000)

  return () => {
    clearInterval(timer) // 清理定时器
  }
}, [])
```

#### 只在挂载时执行

```javascript
useEffect(() => {
  console.log('Component mounted')
}, []) // 空依赖数组，只在挂载时执行一次
```

#### 避免无限循环

```javascript
function MyComponent() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData().then(result => {
      setData(result)
    })
  }, [data]) // 错误！会导致无限循环

  useEffect(() => {
    fetchData().then(result => {
      setData(result)
    })
  }, []) // 正确！只在挂载时执行
}
```

### 3. 使用 useCallback 优化性能

```javascript
function ParentComponent() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount(prev => prev + 1)
  }, []) // 空依赖数组，函数不会重新创建

  const handleReset = useCallback(() => {
    setCount(0)
  }, [])

  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <button onClick={handleReset}>Reset</button>
    </div>
  )
}
```

### 4. 使用 useMemo 缓存计算结果

```javascript
function ExpensiveComponent({ items }) {
  const expensiveValue = useMemo(() => {
    return items.filter(item => item.active).map(item => item.value * 2)
  }, [items]) // 只有当 items 变化时才重新计算

  return <div>{expensiveValue}</div>
}
```

### 5. 使用 useRef 保存可变值

```javascript
function TimerComponent() {
  const [count, setCount] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  const stopTimer = () => {
    clearInterval(timerRef.current)
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={stopTimer}>Stop</button>
    </div>
  )
}
```

### 6. 使用 useReducer 管理复杂状态

```javascript
const initialState = {
  loading: false,
  data: null,
  error: null
}

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

function DataComponent() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchData = async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message })
    }
  }

  return (
    <div>
      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
      {state.data && <pre>{JSON.stringify(state.data, null, 2)}</pre>}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  )
}
```

### 7. 自定义 Hooks

#### 提取可复用逻辑

```javascript
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

function MyComponent() {
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>Width: {width}</p>
      <p>Height: {height}</p>
    </div>
  )
}
```

#### 自定义 Hook 命名规范

```javascript
// 好的自定义 Hook 名称
function useLocalStorage(key, initialValue) { }
function useFetch(url) { }
function useToggle(initialValue) { }
function useDebounce(value, delay) { }

// 不好的自定义 Hook 名称
function getLocalStorage() { }
function fetchData() { }
function toggle() { }
```

### 8. 使用 Context API 管理全局状态

```javascript
const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

function ThemedComponent() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}
```

### 9. 性能优化技巧

#### 使用 React.memo

```javascript
const ExpensiveChild = React.memo(({ data, onClick }) => {
  console.log('Child rendered')
  return <div onClick={onClick}>{data}</div>
})

function ParentComponent() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState('Hello')

  const handleClick = useCallback(() => {
    console.log('Clicked')
  }, [])

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild data={data} onClick={handleClick} />
    </div>
  )
}
```

#### 避免不必要的重新渲染

```javascript
function ParentComponent() {
  const [items, setItems] = useState([1, 2, 3])

  const addItem = () => {
    setItems(prev => [...prev, prev.length + 1])
  }

  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      {items.map(item => (
        <ChildComponent key={item} value={item} />
      ))}
    </div>
  )
}
```

### 10. 错误处理

```javascript
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (error) => {
      setHasError(true)
      console.error('Error caught:', error)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return <div>Something went wrong!</div>
  }

  return children
}

function MyComponent() {
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
      } catch (err) {
        setError(err.message)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  return <div>Content</div>
}
```

## 常见陷阱

### 1. 闭包陷阱

```javascript
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count) // 总是打印 0
    }, 1000)

    return () => clearInterval(timer)
  }, []) // 空依赖数组导致 count 永远是初始值

  // 正确做法
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        console.log(prev) // 打印正确的值
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])
}
```

### 2. 依赖数组遗漏

```javascript
function MyComponent({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, []) // 错误：userId 不在依赖数组中

  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId]) // 正确
}
```

### 3. 过度使用 useCallback 和 useMemo

```javascript
function MyComponent() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount(prev => prev + 1)
  }, []) // 对于简单函数，可能不需要 useCallback

  return <button onClick={handleClick}>{count}</button>
}
```

## 测试 Hooks

```javascript
import { renderHook, act } from '@testing-library/react-hooks'

test('useCounter increments count', () => {
  const { result } = renderHook(() => useCounter())

  expect(result.current.count).toBe(0)

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})
```

## 总结

React Hooks 为函数组件提供了强大的能力，但需要遵循一定的规则和最佳实践：

1. 遵循 Hooks 使用规则
2. 合理使用 useState 和 useEffect
3. 使用 useCallback 和 useMemo 优化性能
4. 提取自定义 Hooks 复用逻辑
5. 使用 Context 管理全局状态
6. 注意常见的陷阱和错误
7. 编写可测试的 Hooks

通过遵循这些最佳实践，你可以编写出更清晰、更高效、更易维护的 React 代码。