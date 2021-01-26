/**
 * 跳过按钮
 * @param box 放置的位置，即父元素
 * @param options 覆盖代码中的默认数据，实现样式自定义
 * @constructor
 */
function SkipButton(box, options) {
    // 调用父类构造函数
    // 使用别人构造函数构造自己的对象
    View.call(this, box, options)
    console.log(this)
}

// 构造原型链，实现继承
SkipButton.prototype = Object.create(View.prototype)
SkipButton.prototype.constructor = SkipButton

// 实现点击事件监听函数
SkipButton.prototype.show = function() {
    this.$ele = $('<span>', {
        on: {
            click: this.onClickListener//点击时回调
        }
    }).text('跳过')
        .css(this.options).prependTo(this.box)

    // 调用父类show方法
    View.prototype.show.call(this)
}

/**
 * 按钮点击事件的监听，一定要在show方法之前设置
 * @param onClickListener
 */
SkipButton.prototype.setOnClickListener = function (onClickListener){
    this.onClickListener = onClickListener
}

// 重写显示按钮方法
SkipButton.prototype.remove = function () {
    this.$ele.remove()
}


