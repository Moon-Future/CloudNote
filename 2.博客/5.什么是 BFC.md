## 什么是 BFC ？

BFC，全名是 Block Formatting Context，称为块级格式化上下文，是 CSS 中的一种渲染机制。是一个拥有独立渲染区域的盒子(也可以理解为结界)，规定了内部元素如何布局，并且盒子内部元素与外部元素互不影响。

这么多文字看起来可能有些抽象，现在用一个 js 函数来描述它，我们声明一个名为 bfc 的函数，因为函数作用域的原因，其中所有变量都在此声明并运行，不会影响函数外的变量。

```js
var box = 1;
function bfc() {
    var box = "2";
    console.log(box);
}
bfc(); //2
console.log(box) //1
```

那么，我们可以这样理解：所谓的 BFC 是 css 的一个作用域？

## BFC 的产生

由于 js 可以使用函数和其它方法实现块级作用域，css 也可以通过某种方式实现 BFC。  
BFC 官方文档有这样一段话：

>Floats, absolutely positioned elements, block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes, and block boxes with 'overflow' other than 'visible' (except when that value has been propagated to the viewport) establish new block formatting contexts for their contents.

从该描述中可以看到，以下方法可以创建新的块级执行上下文（BFC）：

- body 根元素 (html)
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值 (hidden、auto、scroll)


## BFC 布局规则

这里说的 Box 都是块级元素

**1. 内部的块级元素会在垂直方向，一个接一个地放置。**  
正如每个块级元素在 body 根元素下都是占据一行，一个一个垂直方向排列。

**2. Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠**  

```html
<style type="text/css">
  .top {
    width:100px;
    height:100px;
    background:blue;
    margin-bottom: 30px;
  }
  .bottom {
    width:100px;
    height:100px;
    background:red;
    margin-top: 20px;
  }
</style>
<body>
  <div class="top"></div>
  <div class="bottom"></div>
</body>
```

因为两个相邻 Box 元素 .top、.bottom 在同一个 body 下面，所以 .top 的下边距和 .bottom 的上边距重叠，重叠后的边距值为：

- 两个相邻的外边距都是正数时，折叠结果是它们两者之间较大的值
- 两个相邻的外边距都是负数时，折叠结果是它们两者之间较小的值
- 两个外边距一正一负时，折叠结果是两者的相加的和

![边距重叠-1](http://qiniu.cdn.cl8023.com/BFC/BFC-1.jpg)

**【防止垂直 margin 重叠】** 为解决边距重叠问题，只需要将 .top 或 .bottom 放在不同的 BFC 即可，我们这里将 .bottom 外再包裹一层容器，并将该容器产生一个 BFC

```html
<style type="text/css">
  .top {
    width:100px;
    height:100px;
    background:blue;
    margin-bottom: 30px;
  }
  .bottom {
    width:100px;
    height:100px;
    background:red;
    margin-top: 20px;
  }
  .wrap {
    overflow: auto;
  }
</style>
<body>
  <div class="top"></div>
  <div class="wrap">
    <div class="bottom"></div>
  </div>
</body>
```

![边距重叠-2](http://qiniu.cdn.cl8023.com/BFC/BFC-2.jpg)

**3. BFC 内部每个 Box 的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的排版来说，否则相反)。即使存在浮动也是如此。**  

![边距重叠-3](http://qiniu.cdn.cl8023.com/BFC/BFC-3.jpg)

如果给元素加浮动，并且没有清除浮动的话，父 Box 不会将内部浮动 Box 包裹，但还是在父 Box 的范围之内，左浮是子 Box 的左边接触父 Box 的 border box 的左边，右浮是子 Box 接触父 Box 的 border box 右边，除非设置 margin 来撑开距离，否则一直是这个规则。

**4. BFC 的区域不会与 float box 重叠。**  

```html
<style type="text/css">
  .aside {
    width: 100px;
    height: 100px;
    background: blue;
    float: left;
  }
  .main {
    width: 200px;
    height: 200px;
    background: red;
  }
</style>
<body>
  <div class="aside"></div>
  <div class="main"></div>
</body>
```

![边距重叠-4](http://qiniu.cdn.cl8023.com/BFC/BFC-4.jpg)

.aside 浮动后脱离包含块的文档流，与 .main 重叠。

**【自适应两栏布局】** 将 .main 设置产生 BFC 后，.main 和 .aside 会分开，BFC 的区域不会与 float box 重叠。如果 .main 不设置宽度，将会自适应 body 的宽度，从而实现自适应两栏布局。

```html
<style type="text/css">
  .aside {
    width: 100px;
    height: 100px;
    background: blue;
    float: left;
  }
  .main {
    width: 200px;
    height: 200px;
    background: red;
    overflow: auto;
  }
</style>
<body>
  <div class="aside"></div>
  <div class="main"></div>
</body>
```

![边距重叠-5](http://qiniu.cdn.cl8023.com/BFC/BFC-5.jpg)

![边距重叠-6](http://qiniu.cdn.cl8023.com/BFC/BFC-6.gif)

**5. BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。**

- BFC 外部和内部的元素不会相互影响 ，所以 BFC 外部存在浮动时，不会影响其内部 Box 的布局，BFC 通过溢出隐藏不与浮动有重叠
- 当 BFC 内部有浮动时，为不影响外部元素的布局，计算 BFC 高度时要考虑浮动元素的高度

**6. 计算 BFC 的高度时，浮动元素也参与计算**

```html
<style type="text/css">
  .wrap {
    border: 2px solid blue;
  }
  .child {
    width: 200px;
    height: 200px;
    background: red;
    float: left;
  }
</style>
<body>
  <div class="wrap">
    <div class="child"></div>
  </div>
</body>
```

![边距重叠-7](http://qiniu.cdn.cl8023.com/BFC/BFC-7.jpg)

因为 .child 元素设置了 float，脱离文档流，并且其包含块不是 BFC，所以高度没有被撑开，只显示了包含块的上下边框。

**【清除内部浮动】** 将父元素 .wrap 设置产生 BFC 后，因为计算 BFC 的高度时，浮动元素也参与计算，所以父元素高度被撑开。

```html
<style type="text/css">
  .wrap {
    border: 2px solid blue;
    overflow: auto;
  }
  .child {
    width: 200px;
    height: 200px;
    background: red;
    float: left;
  }
</style>
<body>
  <div class="wrap">
    <div class="child"></div>
  </div>
</body>
```

![边距重叠-8](http://qiniu.cdn.cl8023.com/BFC/BFC-8.jpg)

## BFC 有什么用？

1. 防止垂直 margin 重叠 【布局规则 2】
2. 自适应两栏布局       【布局规则 4】
3. 清除内部浮动         【布局规则 6】