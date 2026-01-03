# Less篇-模拟for循环生成css

## 定义一个for循环使用 range 和 each

Example:

```
each(range(4), {
  .col-@{value} {
    height: (@value * 50px);
  }
});
```

output

```
.col-1 {
  height: 50px;
}
.col-2 {
  height: 100px;
}
.col-3 {
  height: 150px;
}
.col-4 {
  height: 200px;
}
```

使用less语法，我们可以减少无意义的机械劳动。

