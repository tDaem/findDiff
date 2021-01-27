// 登录场景
function LoginScene(game, src) {
    src = src || 'images/login_bg.png'
    // 调用父类构造函数
    // 使用别人构造函数构造自己的对象
    Scene.call(this, game, src)
    console.log(this)
}

// 构造原型链，实现继承
// StartScene.prototype = new Scene(Scene.prototype)
LoginScene.prototype = Object.create(Scene.prototype)
LoginScene.prototype.constructor = LoginScene


// 实现点击事件监听函数
// 当点击开始按扭时移除全屏按扭并加载游戏场景
LoginScene.prototype.clickListener = function (x, y) {

}

LoginScene.prototype.loginBtnClickListener = function(){
    var gameId = $('#id').val();
    var serialNum = $('#serial').val();
    console.log('gameId: ' + gameId)
    console.log('serial: ' + serialNum)
    if (gameId.trim() === '') {
        dialog({
            title: '温馨提示',
            content: '请输入游戏id！',
            okValue: '确定',
            ok: function () {
                return true
            }
        }).width(200)
            .showModal()
        return
    }
    if (serialNum.trim() === '') {
        dialog({
            title: '温馨提示',
            content: '请输入游戏序号！',
            okValue: '确定',
            ok: function () {
                return true
            }
        }).width(200)
            .showModal()
        return;
    }
    //发起请求时，占位空间按
    var loading = dialog({});
    loading.showModal()
    var that = this
    //发起请求
    $.ajax({
        url: "/serial",
        type: 'get',
        data: {
            serialNum: serialNum
        },
        dataType: 'json',
        success: function (ret) {
            loading.close().remove()
            console.log(ret)
            if (ret.code === 0 && ret.data) {
                //存在该序列号时进入相应的游戏
                console.log(that)
                that.remove()
                that.scene.game.loadStartScene(this)
                that.scene.unload()
            } else {
                //序列号输入错误时 弹出提示
                var d = dialog({
                    content: '没有找到该游戏序列号！'
                });
                d.show();
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
            }
        },
        error: function (ret) {
            loading.close().remove()
            console.log(ret)
            var d = dialog({
                content: '服务器异常，请联系作者！'
            });
            d.show();
            setTimeout(function () {
                d.close().remove();
            }, 2000);
        }
    });
}

// 重写场景加载方法，添加全屏按扭
LoginScene.prototype.load = function (prevScene) {

    this.loginView = new LoginView(this, {
        position: 'absolute',
        backgroundColor: "#FF000000",
        left: '0px',
        bottom: '0px',
        display: 'inline-block',
        padding: '8px',
        borderRadius: '6px'
    })

    this.fullScreen = new FullScreenButton(this.game.box, {
        left: 'auto',
        right: '20px',
        zIndex: 9
    })
    this.loginView.show()
    this.fullScreen.show()

    // 调用父类load方法
    Scene.prototype.load.call(this)
}