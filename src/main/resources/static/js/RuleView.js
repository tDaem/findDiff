// 输入框
// box 放置的位置，即父元素
// options 覆盖代码中的默认数据，实现样式自定义
function RuleView(scene, options) {
    this.scene = scene
    // 调用父类构造函数
    // 使用别人构造函数构造自己的对象
    View.call(this, this.scene.game.box, options)
    console.log(this)
}

// 构造原型链，实现继承
RuleView.prototype = Object.create(View.prototype)
RuleView.prototype.constructor = RuleView

// 实现点击事件监听函数
RuleView.prototype.show = function () {

    var html =
        '    <!--放置视频，或者文字-->' +
        '    <div style="margin: 8px;width: 70%;height: 75%;overflow: auto">' +
                (this.options.gameDescription.gameRule || '未配置游戏规则！') +
        '    </div>' +
        '    <div style="margin-top: 40px;text-align: center;width: 70%;">' +
        '       <button id="knowBtn" type="button" class="btn btn-success">已了解</button>' +
        '       <button id="unknowBtn" type="button" class="btn btn-info">不了解？试玩</button>' +
        '    </div>'

    this.$ele = $('<div>', {
        width: '100%',
        height: '100%'
    }).html(html)
        .css(this.options).appendTo(this.box)
        .attr("id", "rule")

    // 调用父类show方法
    View.prototype.show.call(this)
}

// 重写移除视图的方法
RuleView.prototype.remove = function () {
    this.$ele.remove()
}

