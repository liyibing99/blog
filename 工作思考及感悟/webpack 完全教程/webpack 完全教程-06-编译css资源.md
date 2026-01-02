# webpack 完全教程-06-编译css资源

## 编译css资源

`install`

```
$ npm install --save-dev style-loader css-loader
```

`webpack.config.js`

```
module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
```

创建css文件

```
$ touch style.css
```

编辑style.css

```
.demo {
    font-size: 20px;
}
```

编辑`entry.js`

```
import './style.css';

document.write('webpack编译css资源');
```

编辑`index.html`

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Webpack 完全教程</title>
</head>
<body>
  <p class="demo">用友网络FED团队</p>
  <script src="./bundle.js"></script>
</body>
</html>
```

运行

```
$ npm run dev
```



