// $(document).ready(function(){
// 	Multipage.initPageSlide();
// });

var Multipage = {
    // 初始化页面滑动效果
    currentPage: 0,
    pageCount: $(".multipage-display-page").length,
    winHeight: $(window).height(),
    initPageSlide: function() {
        var that = this;

        $(".multipage-display-page").each(function() {
            var targetPage = this;
            // 添加hammer事件
            var hammertime = new Hammer(this);
            hammertime.add(new Hammer.Pan({threshold: 0, pointers: 0}));
            // threshold表示识别拖动事件的最短距离，默认是10，设定为0保证更顺滑的拖动效果

            // pos：当前页面的位置
            var pos = {
                x: 0,
                y: 0
            };
            hammertime.on('panstart panmove', function(ev) {
                if (ev.type == 'panstart') {
                    _x = pos.x || 0;
                    _y = pos.y || 0;
                }
                pos.x = _x + ev.deltaX;
                pos.y = _y + ev.deltaY;

                // 拖动某个页面的时候，上下两个页面要跟着一起拖动。
                // 450是窗口的高度，正式代码需要获取window的高度。
                // y值为正代表向下，负值代表向上
                that.updatePos(0, pos.y, targetPage);
                that.updatePos(0, pos.y + that.winHeight, $(targetPage).next()[0]);
                that.updatePos(0, pos.y - that.winHeight, $(targetPage).prev()[0]);
            });
            hammertime.on('panend', function(ev) {
                // 一次拖动结束之后的处理事件
                if (pos.y < -50 && $(targetPage).next().length !== 0) {
                    // 当y小于-50时，换下一页，下一页移动到0,0的位置，本页移动到0,-450的位置，上一页复位
                    // 如果没有下一页，本页归位
                    that.updateAni(0, 0 - that.winHeight, targetPage);
                    that.updateAni(0, 0, $(targetPage).next()[0]);
                    that.updatePos(0, 0 - that.winHeight, $(targetPage).prev()[0]);
                    pos.x = 0;
                    pos.y = 0;

                    setTimeout(function() {
                        this.setNextPageAni(targetPage);
                    }.bind(that), 300);

                    that.currentPage++;

                } else if (pos.y > 50 && $(targetPage).prev().length !== 0) {
                    // 当y大于50时，换上一页，上一页移动到0,0的位置，本页移动到0,450的位置，下一页复位
                    // 如果没有上一页，本页归位
                    that.updateAni(0, that.winHeight, targetPage);
                    that.updateAni(0, 0, $(targetPage).prev()[0]);
                    that.updatePos(0, that.winHeight, $(targetPage).next()[0]);
                    pos.x = 0;
                    pos.y = 0;

                    setTimeout(function() {
                        this.setPrevPageAni(targetPage);
                    }.bind(that), 300);

                    that.currentPage--;

                } else {
                    // 拖动距离没有超过阈值，全部归位
                    that.updateAni(0, 0, targetPage);
                    that.updateAni(0, that.winHeight, $(targetPage).next()[0]);
                    that.updateAni(0, 0 - that.winHeight, $(targetPage).prev()[0]);
                    pos.x = 0;
                    pos.y = 0;
                }
            });
        });

        // 让除第一个页面之外的所有页面都放置在窗口下方
        $(".multipage-display-page").each(function(index) {
            if (index > 0) {
                that.updatePos(0, that.winHeight, this);
            }
        });

        $('.multipage-display-page:first-child').addClass('multipage-active');
    },

    // 无动画更新页面位置的方法
    updatePos: function(x, y, obj) {
        if (obj) {
            var value = ['translate3d(' + x + 'px, ' + y + 'px, 0)'];
            obj.style.webkitTransition = 'none';
            obj.style.mozTransition = 'none';
            obj.style.transition = 'none';
            obj.style.webkitTransform = value;
            obj.style.mozTransform = value;
            obj.style.transform = value;
        }
    },

    // 有动画更新页面位置的方法
    updateAni: function(x, y, obj) {
        if (obj) {
            var value = ['translate3d(' + x + 'px, ' + y + 'px, 0)'];
            obj.style.webkitTransition = 'all 0.3s';
            obj.style.mozTransition = 'all 0.3s';
            obj.style.transition = 'all 0.3s';
            obj.style.webkitTransform = value;
            obj.style.mozTransform = value;
            obj.style.transform = value;
        }
    },

    // 更新下一页的页内动画
    setNextPageAni: function(targetPage) {
        var nextPage = $(targetPage).removeClass('multipage-active').next().addClass('multipage-active')[0];
		var $nextAni = $(nextPage).find('.multipage-animate');
    },

    setPrevPageAni: function(targetPage) {
        var lastpage = $(targetPage).removeClass('multipage-active').prev().addClass('multipage-active')[0];
		var $lastAni = $(lastpage).find('.multipage-animate');
    },

    nextPage: function() {
        if (this.currentPage >= (this.pageCount - 1)) {
            return;
        }
        var targetPage = $(".multipage-display-page")[this.currentPage];
        this.updateAni(0, 0 - this.winHeight, targetPage);
        this.updateAni(0, 0, $(targetPage).next().get()[0]);
        this.updatePos(0, 0 - this.winHeight, $(targetPage).prev().get()[0]);

        setTimeout(function() {
            this.setNextPageAni(targetPage);
        }.bind(this), 300);

        this.currentPage++;
    },

    prevPage: function() {
        if (this.currentPage <= 0) {
            return;
        }
        var targetPage = $(".multipage-display-page")[this.currentPage];
        this.updateAni(0, this.winHeight, targetPage);
        this.updateAni(0, 0, $(targetPage).prev().get()[0]);
        this.updatePos(0, this.winHeight, $(targetPage).next().get()[0]);

        setTimeout(function() {
            this.setPrevPageAni(targetPage);
        }.bind(this), 300);

        this.currentPage--;
    },

    jumpToPage: function(pageNum) {
        if (pageNum < 0 || pageNum >= this.pageCount || pageNum === this.currentPage) {
            return;
        }

        var pageSet = $(".multipage-display-page");
        if (pageNum < this.currentPage) {
            var pageSlice = pageSet.slice(pageNum + 1, this.currentPage)
            for (var i = 0; i < pageSlice.length; i++) {
                this.updatePos(0, this.winHeight, pageSlice[i]);
            }

            this.updateAni(0, this.winHeight, pageSet[this.currentPage]);
            this.updateAni(0, 0, pageSet[pageNum]);

            this.currentPage = pageNum;

            setTimeout(function() {
                $(pageSet[this.currentPage]).removeClass('multipage-active')
                $(pageSet[pageNum]).addClass('multipage-active');
            }, 300);
        } else {
            var pageSlice = pageSet.slice(this.currentPage + 1, pageNum)
            for (var i = 0; i < pageSlice.length; i++) {
                this.updatePos(0, 0 - this.winHeight, pageSlice[i]);
            }

            this.updateAni(0, 0 - this.winHeight, pageSet[this.currentPage]);
            this.updateAni(0, 0, pageSet[pageNum]);

            this.currentPage = pageNum;

            setTimeout(function() {
                $(pageSet[this.currentPage]).removeClass('multipage-active')
                $(pageSet[pageNum]).addClass('multipage-active');
            }, 300);
        }
    }

}
