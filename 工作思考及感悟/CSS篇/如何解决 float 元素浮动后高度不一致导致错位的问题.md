# 如何解决 float 元素浮动后高度不一致导致错位的问题

## 浮动带来的问题

当 N 个元素浮动后，会导致错位的问题。一般给元素一个固定的 height 就没有这个现象。下面与大家分享下当高度不一致时的解决方法。

## 问题现象

如图，设置 8 个元素向左浮动，会看到从第 7 个元素开始，产生错位。

![image](https://user-images.githubusercontent.com/33412781/71345380-2e4cc680-25a0-11ea-82c3-232e92ecae09.png)

## 解决方案

给换行开始的第一个元素 `clear:left;` 即可

例如：三列布局应该是第4个，7个... 加 `clear:left;`

```
.width-percent-33:nth-child(3n+1) {
    clear: left;
}
```

正常效果： ![image](https://user-images.githubusercontent.com/33412781/71351189-049a9c00-25ae-11ea-9078-c193084c32a7.png)

## 深入理解 CSS clear 属性

* [准确理解CSS clear:left/right的含义及实际用途](https://www.zhangxinxu.com/wordpress/2014/06/understand-css-clear-left-right-and-use/)

