# CSS中规则@media的用法

## CSS中@规则是由@符号开始的，例如[@import](https://github.com/import)，[@page](https://github.com/page)等。

[@media](https://github.com/media)就是其中的一个规则。  
[@media](https://github.com/media)可以让你根据不同的屏幕大小而使用不同的样式，这可以使得不需要js代码就能实现响应式布局。  
不过[@media](https://github.com/media)只能用于较新的浏览器，对于老式的IE，不支持。下面是[@media](https://github.com/media)
支持的浏览器。  
![wkiol1s0jyxg0tnmaabm5ac6nug635](https://cloud.githubusercontent.com/assets/21334770/18620488/4ebb28d0-7e46-11e6-8c1c-b0fb19ee9fd9.jpg)

[@media](https://github.com/media)的语法比较简单，一眼就能看懂。  
[@media](https://github.com/media) mediatype and|not|only (media feature) {  
CSS-Code;  
}  
可以参考[http://www.w3cschool.cc/cssref/css3-pr-mediaquery.html值的说明。](http://www.w3cschool.cc/cssref/css3-pr-mediaquery.html%E5%80%BC%E7%9A%84%E8%AF%B4%E6%98%8E%E3%80%82)  
其中mediatype就是媒体类型，可以包括好多种，最常用的就是screen，其他多数已经作废。  
media feature就定义了这个media设备的一些特征，简单的说就是媒体满足什么条件，常用的就是max-width，min-width。
通过指定屏幕的大小，而采用不同的样式。  
举个例子演示如何用@media规则实现响应式布局。  
![rq b22 u4p_ np1 8n5a](https://cloud.githubusercontent.com/assets/21334770/18620601/773f8042-7e48-11e6-8b02-8ff9a6773506.png)  
![n7xkq 8b6oku3dn9p2a8g 5](https://cloud.githubusercontent.com/assets/21334770/18620553/8feb1f26-7e47-11e6-9057-dce3b66eb05a.png)  
![v43e ed j_uv e7_c hp5h](https://cloud.githubusercontent.com/assets/21334770/18620555/92aa6988-7e47-11e6-9865-93ba680650da.png)

@media only screen and (min- 620px) and (max-width: 930px)  
@media only screen and (max- 620px)  
上述2个规则，当屏幕宽度在620px以下，和620px-930px，使用的contain样式是不同的。  
截图：  
当浏览器宽度在1024px的情况下，显示效果如下：  
![wkiom1s0jlybx2vwaaa5n3vxi00269](https://cloud.githubusercontent.com/assets/21334770/18620595/51f9eb60-7e48-11e6-9683-a46c175c3cf4.jpg)

当浏览器宽度在680px的情况下，显示如下：  
![wkiom1s0jlzr8jd9aabl7rduu3w939](https://cloud.githubusercontent.com/assets/21334770/18620581/ffec58da-7e47-11e6-8ca6-b3e0574549ca.jpg)  
当浏览器宽度在480px的情况下，显示如下：  
![wkiom1s0jlyxshr9aabvphcbc60083](https://cloud.githubusercontent.com/assets/21334770/18620590/26435a9c-7e48-11e6-992a-95b528a47957.jpg)

