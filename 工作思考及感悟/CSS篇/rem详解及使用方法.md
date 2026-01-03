# rem详解及使用方法

## 前面的

浏览器的默认字体高都是16px

## 使用%单位方便使用

css中的body中先全局声明font-size=62.5%，这里的%的算法和rem一样。 因为100%=16px，1px=6.25%，所以10px=62.5%，
这时的1rem=10px，所以12px=1.2rem。px与rem的转换通过10就可以得来，很方便了吧！

## 使用方法

rem是只相对于根元素htm的font-size，即只需要设置根元素的font-size，其它元素使用rem单位设置成相应的百分比即可；

例子：

```
 /*16px * 312.5% = 50px;*/
html{font-size: 312.5%;}

/*50px * 0.5 = 25px;*/
body{
    font-size: 0.5rem;
}
```

一般情况下，是这样子使用的：

```
html{font-size:62.5%;}  // 即10px
body{font-size:12px;font-size:1.2rem;} 
p{font-size:14px;font-size:1.4rem;}
```

## 优点

由于其他字体大小都是基于html的，所以在移动端做适配的时候，可以使用这样的方法

```
@media only screen and (min-width: 320px){
    html {
        font-size: 62.5% !important;
    }
}
@media only screen and (min-width: 640px){
    html {
        font-size: 125% !important;
    }
}
@media only screen and (min-width: 750px){
    html {
        font-size: 150% !important;
    }
}
@media only screen and (min-width: 1242px){
    html {
        font-size: 187.5% !important;
    }
}
```

这样子就能做到仅仅改变html的字体大小，让其他字体具有“响应式”啦。

