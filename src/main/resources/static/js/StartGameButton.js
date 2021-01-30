/**
 * 开始游戏按钮
 * @param box 放置的位置，即父元素
 * @param type 单人 多人
 * @param options 覆盖代码中的默认数据，实现样式自定义
 * @constructor
 */
function StartGameButton(box, type, options) {
    // 调用父类构造函数
    // 使用别人构造函数构造自己的对象
    this.type = type
    View.call(this, box, options)
    console.log(this)
}

// 构造原型链，实现继承
StartGameButton.prototype = Object.create(View.prototype)
StartGameButton.prototype.constructor = StartGameButton

// 实现点击事件监听函数
StartGameButton.prototype.show = function() {
    this.$ele = $('<span>', {
        on: {
            click: this.onClickListener//点击时回调
        }
    }).text(this.type ? "多人游戏" : "单人游戏")
        .css(this.options).appendTo(this.box)

    // 调用父类show方法
    View.prototype.show.call(this)
}

/**
 * 按钮点击事件的监听，一定要在show方法之前设置
 * @param onClickListener
 */
StartGameButton.prototype.setOnClickListener = function (onClickListener){
    this.onClickListener = onClickListener
}

// 重写显示按钮方法
StartGameButton.prototype.remove = function () {
    this.$ele.remove()
}


