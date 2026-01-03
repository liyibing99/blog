# css3 transition 笔记

## transition 属性值

css 动画 transition是过渡的意思，元素从一种样式组件改变到另外一种效果

* transition-prototype 需要过渡的属性，默认值all。必输
* transition-during 持续时间，默认值0。 必输
* transition-timing-function 速度曲线,默认值ease
* transition-delay 多长时间后执行过渡，默认值0

## transition-timing-function

transition 的另外三个值比较明了，唯独这个略显神秘。 它的取值范围如下：

* linear 匀速 （cubic-bezier(0,0,1,1)）
* ease 匀加速-匀减速 （cubic-bezier(0.25,0.1,0.25,1)）
* ease-in 匀加速 （ubic-bezier(0.42,0,1,1)）
* ease-out 匀减速 （cubic-bezier(0,0,0.58,1)）  
  -ease-in-out 加速-减速 （cubic-bezier(0.42,0,0.58,1)）
* cubic-bezir(n,n,n,n)  n取值去0-1

ease-in-out 与 ease 很类似，只是速度曲线不一样，具体表现在贝塞尔值不同

## 实例讲解

```
<style
div
{
      width:100px;
      transition:width 2s;
}

div:hover
{
      width:300px;
}
</style>
```

当鼠标hover到div上 这个div的width花2s时间以ease的曲线延长到300px。

## transition 可接受多个属性值

```
<style
div
{
      width:100px;
      height:50px;
      transition:width 2s,height 2s;
}

div:hover
{
      height: 100px;
      width:300px;
}
</style>
```

## transform 属性

```
<style
div
{
     width:100px;
     height:100px;
     transition:width 2s, height 2s,transform 2s;
}

div:hover
{
       width:200px;
       height:200px;
       transform:rotate(180deg);
}
</style>
```

transform 如width一样是属性，定义元素旋转缩放，移动和倾斜。

transform：transform-function

transform-function 取值参见与 http://www.w3school.com.cn/cssref/pr_transform.asp

因transform 这个神奇的属性 transition可以轻松模拟许多有意思的动画

