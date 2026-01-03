# flex 布局在移动端的兼容性问题

现阶段，使用 flexbox 弹性布局模式来进行布局，感觉真的很爽。最起码一个最简单的水平垂直居中的问题就可以很快搞定，但由于兼容性所带来的阵痛也是让人非常烦躁的，正好，前段时间我就遇到这个问题。真是“挖坑一时爽，填坑火葬场”。

## 基本使用

display: flex;  
align-items: center;  
justify-content: center;  
flex-direction: column;

## 从 CANIUSE 看兼容性

![630e9ce0-feb2-4295-982b-0084aaa62b11](https://cloud.githubusercontent.com/assets/8686869/25786863/2af84642-33ce-11e7-80ad-0f967b96f3f9.png)

## 一些方案

1. 一开始看到的是 [flex.css](https://github.com/lzxb/flex.css)，但这个不是主流趋势和方案，算是解决问题的奇淫技巧。（PS：希望作者看到别喷我）
2. 基于现有的 hack 方案去一个个写兼容，这种写起来很累，得不偿失。
3. 基于工具去进行 hack ，自动构建编译，比如 autoprefixer。

以上，是我目前看到的方案，在一个规范还没完全没浏览器支持的时候，为难的还是我们。尽管这个新的规范很好用。

## 实践

基于 gulp 构建，结合 gulp-autoprefixer .

```
gulp.task('styles', function() {
  return gulp.src(paths.styles)
    // Pass in options to the task
    .pipe(autoprefixer({
      "browsers": [
        "last 2 versions",
        "Firefox >= 20",
        "iOS 7",
        "> 5%"
      ]
    }))
    .pipe(uglifyCSS())
    .pipe(gulp.dest('public/static'));
});
```

这个是示例代码。

构建后的效果：

```
display:-webkit-box;
display:-webkit-flex;
display:-moz-box;
display:-ms-flexbox;
display:flex;
-webkit-box-align:center;
-webkit-align-items:center;
-moz-box-align:center;
-ms-flex-align:center;
align-items:center;
-webkit-box-pack:center;
-webkit-justify-content:center;
-moz-box-pack:center;
-ms-flex-pack:center;
justify-content:center;
```

