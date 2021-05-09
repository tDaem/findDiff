// 输入框
// box 放置的位置，即父元素
// options 覆盖代码中的默认数据，实现样式自定义
function LoginView(scene, options) {
    this.scene = scene
    // 调用父类构造函数
    // 使用别人构造函数构造自己的对象
    View.call(this, this.scene.game.box, options)
    console.log(this)
}

// 构造原型链，实现继承
LoginView.prototype = Object.create(View.prototype)
LoginView.prototype.constructor = LoginView

// 实现点击事件监听函数
LoginView.prototype.show = function () {

    var html =
        '    <!--放置视频，或者文字-->' +
        '    <div class="float-left"; style="">' +
        '        <p>' + (this.options.gameDescription.loginDescription || '未配置登录页描述！') + '</p>' +
        '    </div>' +
        '    <div class="float-right">' +
        '        <form>' +
        '            <table>' +
        '                <!--游戏id-->' +
        '                <tr>' +
        '                    <td class="text-right"><label for="id" class="control-label">游戏id：</label></td>' +
        '                    <td><input type="text" class="form-control" id="id" placeholder="游戏id"></td>' +
        '                </tr>' +
        '                <tr>' +
        '                    <td class="text-right"><label for="serial" class="control-label">游戏序号：</label></td>' +
        '                    <td><input type="text" class="form-control" id="serial" placeholder="游戏序号"></td>' +
        '                </tr>' +
        '                <tr>' +
        '                    <td></td>' +
        '                    <td class="text-right">' +
        '                        <button id="loginBtn" type="button" class="btn btn-primary btn-block">登录</button>' +
        '                    </td>' +
        '                </tr>' +
        '            </table>' +
        '        </form>' +
        '    </div>'

    this.$ele = $('<div>', {
        width: '100%',
        height: '100%'
    }).html(html)
        .css(this.options).appendTo(this.box)
        .attr("id", "info")

    // 调用父类show方法
    View.prototype.show.call(this)
}

// 重写移除视图的方法
LoginView.prototype.remove = function () {
    this.$ele.remove()
}

