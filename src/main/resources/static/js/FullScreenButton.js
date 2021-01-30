// 全屏按扭
// box 全屏按扭放置的位置，即父元素
// options 覆盖代码中的默认数据，实现样式自定义
function FullScreenButton(box, options) {
    // 调用父类构造函数
    // 使用别人构造函数构造自己的对象
    View.call(this, box, options)
    console.log(this)
}

// 构造原型链，实现继承
FullScreenButton.prototype = Object.create(View.prototype)
FullScreenButton.prototype.constructor = FullScreenButton

// 实现点击事件监听函数
FullScreenButton.prototype.show = function() {
    this.$ele = $('<span>', {
        on: {
            click: function(){
                // fullscreen方法来自jquery.fullscreen插件
                // FullScreenButton.isFullScreen = !FullScreenButton.isFullScreen 给fullscreen赋相反的值
                // 上面赋值表达式的结果是 FullScreenButton.isFullScreen
                // this在事件处理函数中，表示激发事件的标签元素
                // FullScreen是全屏按扭的构造函数（类），整个页上只有一个构造函数
                // 即使页面上有多个全屏按扭（实例/对象），FullScreen仍然只有一个
                // $(document).fullScreen(FullScreenButton.isFullScreen = !FullScreenButton.isFullScreen)
                // 相当于下面2行代码：
                // FullScreenButton.isFullScreen = !FullScreenButton.isFullScreen
                // $(document).fullScreen(FullScreenButton.isFullScreen)

                $(document).fullScreen(FullScreenButton.isFullScreen = !FullScreenButton.isFullScreen)

                if(FullScreenButton.isFullScreen){
                    $(this).text('退出全屏')
                }
                else{
                    $(this).text('全屏')
                }
                return false
            }
        }
    }).text(FullScreenButton.isFullScreen ? '退出全屏' : '全屏')
        .css(this.options).prependTo(this.box)

    // 调用父类show方法
    View.prototype.show.call(this)
}

// 重写显示按钮方法
FullScreenButton.prototype.remove = function () {
    this.$ele.remove()
}