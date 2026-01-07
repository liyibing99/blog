# 前端工程化之 CI/CD 实践

随着前端项目规模的不断增长，手动构建、测试和部署已经无法满足现代开发的需求。持续集成和持续部署（CI/CD）作为前端工程化的重要组成部分，能够显著提升开发效率和代码质量。本文将介绍前端项目 CI/CD 的实践方案。

## CI/CD 概述

### 什么是 CI/CD

- **CI（Continuous Integration，持续集成）**：开发人员频繁地提交代码到共享仓库，每次提交都会自动触发构建和测试，确保代码质量。

- **CD（Continuous Deployment，持续部署）**：通过自动化的方式将代码部署到生产环境，实现快速、可靠的发布。

### CI/CD 的好处

1. **快速反馈**：及时发现和修复问题
2. **自动化流程**：减少人工操作，降低错误率
3. **提高质量**：自动化测试确保代码质量
4. **加速发布**：自动化部署缩短发布周期
5. **团队协作**：统一的流程和标准

## 常用的 CI/CD 工具

### 1. GitHub Actions

GitHub Actions 是 GitHub 提供的 CI/CD 服务，与 GitHub 仓库深度集成，使用简单且功能强大。

### 2. GitLab CI/CD

GitLab 自带的 CI/CD 功能，配置简单，与 GitLab 仓库无缝集成。

### 3. Jenkins

老牌的 CI/CD 工具，功能强大，插件丰富，但配置相对复杂。

### 4. CircleCI

专注于 CI/CD 的云服务，配置简单，性能优秀。

## GitHub Actions 实践

### 基本配置

在项目根目录创建 `.github/workflows/ci.yml` 文件：

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-${{ matrix.node-version }}
          path: dist/
```

### 完整的 CI/CD 流程

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18.x'

jobs:
  # 代码质量检查
  quality:
    name: Code Quality
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier check
        run: npm run format:check

      - name: Run TypeScript type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:unit

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  # E2E 测试
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build project
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  # 构建和部署
  build-and-deploy:
    name: Build and Deploy
    needs: [quality, e2e]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 代码质量检查

### ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }]
  }
}
```

### Prettier 配置

```javascript
// .prettierrc.js
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  arrowParens: 'avoid',
  endOfLine: 'lf'
}
```

### Husky 和 lint-staged

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,less}": [
      "stylelint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## 自动化测试

### 单元测试配置

```javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
```

### E2E 测试配置

```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'npm run preview',
    port: 3000,
    reuseExistingServer: !process.env.CI
  }
})
```

## 构建优化

### Vite 构建配置

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['element-plus']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 环境变量管理

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=My App (Dev)
```

```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=My App
```

```typescript
// src/config/env.ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appTitle: import.meta.env.VITE_APP_TITLE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
}
```

## 部署策略

### 1. 静态站点部署

部署到 Vercel：

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

部署到 Netlify：

```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v2.0
  with:
    publish-dir: './dist'
    production-branch: main
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy from GitHub Actions"
    enable-pull-request-comment: true
    enable-commit-comment: true
    overwrites-pull-request-comment: true
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### 2. Docker 容器化部署

创建 Dockerfile：

```dockerfile
# 多阶段构建
# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Nginx 配置：

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

GitHub Actions 部署到 Docker Hub：

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v2

- name: Login to Docker Hub
  uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Build and push
  uses: docker/build-push-action@v4
  with:
    context: .
    push: true
    tags: ${{ secrets.DOCKER_USERNAME }}/my-app:latest
    cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/my-app:buildcache
    cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/my-app:buildcache,mode=max
```

### 3. Kubernetes 部署

创建 Kubernetes 配置文件：

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-app
  labels:
    app: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: myregistry/frontend-app:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

GitHub Actions 部署到 Kubernetes：

```yaml
- name: Set up kubectl
  uses: azure/setup-kubectl@v3

- name: Configure kubectl
  run: |
    echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
    export KUBECONFIG=kubeconfig

- name: Deploy to Kubernetes
  run: |
    kubectl apply -f deployment.yaml
    kubectl rollout status deployment/frontend-app
```

## 监控和日志

### 性能监控

集成 Sentry 进行错误监控：

```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

export function initSentry(app) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        tracingOrigins: ['localhost', 'api.example.com']
      })
    ],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE
  })
}
```

### 日志收集

```typescript
// src/utils/logger.ts
class Logger {
  private isDevelopment = import.meta.env.DEV

  info(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data)
    }
  }

  warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data)
  }

  error(message: string, error?: Error | any) {
    console.error(`[ERROR] ${message}`, error)
    Sentry.captureException(error)
  }
}

export const logger = new Logger()
```

## 最佳实践

### 1. 分支策略

采用 Git Flow 工作流：

- `main`：生产环境代码
- `develop`：开发环境代码
- `feature/*`：功能分支
- `release/*`：发布分支
- `hotfix/*`：紧急修复分支

### 2. 代码审查

设置代码审查规则：

```yaml
- name: Code Review Check
  uses: actions/github-script@v6
  with:
    script: |
      const pullRequest = context.payload.pull_request;
      const reviews = await github.rest.pulls.listReviews({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pullRequest.number
      });

      const approvedReviews = reviews.data.filter(review => review.state === 'APPROVED');
      if (approvedReviews.length < 2) {
        core.setFailed('需要至少 2 个代码审查批准');
      }
```

### 3. 版本管理

使用语义化版本：

```yaml
- name: Bump version
  run: |
    npm version patch -m "chore(release): %s [skip ci]"
    git push --follow-tags
```

### 4. 回滚策略

```yaml
- name: Deploy to Production
  id: deploy
  uses: amondnet/vercel-action@v25

- name: Rollback on failure
  if: failure()
  run: |
    echo "Deployment failed, rolling back..."
    # 执行回滚操作
```

## 总结

前端 CI/CD 实践能够显著提升开发效率和代码质量。通过合理配置自动化流程，我们可以：

1. 自动化代码质量检查，确保代码规范
2. 自动化测试，及时发现和修复问题
3. 自动化构建和部署，加速发布周期
4. 实现多环境部署，提高系统稳定性
5. 集成监控和日志，快速定位问题

在实际项目中，应根据团队规模和项目特点选择合适的 CI/CD 工具和策略，持续优化和改进流程。