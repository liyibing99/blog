# 在 less 中如何使用 CSS3 的 calc 属性

## 问题

less 中设置 calc(100% - 22px) 会编译成 calc(78%)

## 原因

出现这个问题的原因是less的运算方式和calc发生了冲突

## 解决方法

```
.test{
  width: calc(~"100% - 50px");
}

编译为

.test{
  width: calc(100% - 50px);
}
```

如果进行数值和变量之间的运算可以这样设置：

```
@diss = 50px;

.test{
  width: calc(~"100% - @{diss}")
}
```

## 结论

* less中 “~” 符号后面双引号里面的内容会被less编译忽略，而直接输出为css代码
* less中@和{}配合可以在字符串里面使用变量，很像es6里面的模板字符串 `${}`

