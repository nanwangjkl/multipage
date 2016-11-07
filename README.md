# multipage

一个翻页HTML5模版，与其他模版不同的是这个模版并不是直接换页，而是跟随手指移动，并根据滑动距离决定如何换页。
## Device support 设备支持
Android和iOS主流设备均支持
## Usage 用法

```HTML5
<head>
    ...
    <!-- 引用multipage.min.css -->
	<link rel="stylesheet" type="text/css" href="multipage.min.css">
	...
</head>
<body>
    <!-- 翻到最上一页或者最下一页的提示 -->
    <span class="multipage-display-top-mark">已经是第一页</span>
    <span class="multipage-display-bottom-mark">已经是最后一页</span>
    <div class="multipage-display-panel">

        <!-- 将页面内容放置在multipage-display-page中 -->
        <div class="multipage-display-page">
            ...
        </div>

        <div class="multipage-display-page">
            ...
        </div>
    </div>

    <script src="//cdn.bootcss.com/zepto/1.2.0/zepto.min.js"></script>
    <script src="//cdn.bootcss.com/hammer.js/2.0.8/hammer.min.js"></script>
    <script src="multipage.min.js"></script>

    <!-- 初始化 -->
    <script type="text/javascript">
        $(document).ready(function(){
            Multipage.initPageSlide();
        });
    </script>
</body>
```

## Function 方法
|  Function  | Arguments  | Description                 |
|------------|------------|-----------------------------|
| prevPage   |            | 跳转到上一页                  |
| nextPage   |            | 跳转到下一页                  |
| jumpToPage | pageIndex | 跳转到参数指定的页，页索引从0开始 |
