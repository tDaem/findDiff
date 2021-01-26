/**
 * 确定按钮
 * @param box 放置的位置，即父元素
 * @param options 覆盖代码中的默认数据，实现样式自定义
 * @constructor
 */
function ConfirmButton(box, options) {
    // 调用父类构造函数
    // 使用别人构造函数构造自己的对象
    View.call(this, box, options)
    console.log(this)
}

// 构造原型链，实现继承
ConfirmButton.prototype = Object.create(View.prototype)
ConfirmButton.prototype.constructor = SkipButton

// 实现点击事件监听函数
ConfirmButton.prototype.show = function () {
    this.$ele = $('<span>', {
        on: {
            click: this.onClickListener
        }
    }).text('确定')
        .css(this.options).prependTo(this.box)

    // 调用父类show方法
    View.prototype.show.call(this)
}

/**
 * 按钮点击事件的监听，一定要在show方法之前设置
 * @param onClickListener
 */
ConfirmButton.prototype.setOnClickListener = function (onClickListener){
    this.onClickListener = onClickListener
}

// 重写显示按钮方法
ConfirmButton.prototype.remove = function () {
    this.$ele.remove()
}


