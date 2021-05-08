// 登录场景
function LoginScene(game, src, params) {
    src = src || 'images/login_bg.jpg'
    // 调用父类构造函数
    // 使用别人构造函数构造自己的对象
    Scene.call(this, game, src, params)
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

LoginScene.prototype.loginBtnClick = function () {
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
    var loading = dialog({
        content: "登陆中..."
    });
    loading.showModal()
    //发起请求
    $.ajax({//根据序列号登录
        url: "/serial",
        type: 'get',
        timeout: 12000,
        data: {
            userName: gameId,
            serialNum: serialNum
        },
        dataType: 'json',
        success: ret => {
            loading.close().remove()
            console.log(ret)
            if (ret.code === 0 && ret.data && ret.data.game && ret.data.game.id) {
                //序列号校验
                //存在该序列号时进入相应的游戏
                console.log(ret.data)
                if (ret.data.serialStatus !== 'NOT_STARTED'){
                    floatDialog('该游戏序号已被使用')
                    return
                }
                changeSerialStatus(serialNum, 'IN_PROGRESS')
                // this.game.loadStartScene(this,{
                //     gameId: gameId,
                //     serial: ret.data
                // })
                this.params.gameId = gameId //游戏昵称
                this.params.serial = ret.data
                this.game.loadRuleScene(this,this.params)

            } else {
                //序列号输入错误时 弹出提示
                var d = dialog({
                    content: '没有找到该游戏序列号,或该游戏序列号没有匹配的游戏！'
                });
                d.show();
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
            }
        },
        error: ret => {
            loading.close().remove()
            console.log(ret)
            if (ret.status == 'timeout'){
                var d = dialog({
                    content: '请求超时，请检查网络！'
                });
                d.show();
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
            }else {
                var d = dialog({
                    content: '登陆失败，请稍后尝试！'
                });
                d.show();
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
            }
        }
    });
}

/**
 * 开始游戏后改变序列号的状态为已开始游戏
 * @param serialId
 */
function changeSerialStatus(serialNum, status) {
    console.log(serial)
    $.ajax({
        url: '/updateStatus?serialNum=' + serialNum + "&serialStatus=" + status,
        type: 'put',
        dataType: 'json',
        success: (res) => {
            if (res.code > 0) {
                floatDialog('与服务器通信失败，数据可能无法保存！请确认网络环境')
            }
        },
        error: (ret) => {
            floatDialog('与服务器通信失败，数据可能无法保存！请确认网络环境')
        }
    })
}

//
LoginScene.prototype.load = function (prevScene) {

    this.loginView = new LoginView(this, {
        position: 'absolute',
        backgroundColor: "#FF000000",
        left: '0px',
        bottom: '0px',
        display: 'inline-block',
        padding: '8px',
        borderRadius: '6px',
        gameDescription: this.params.gameDescription
    })

    this.loginView.show()

    $('#loginBtn').click(this.loginBtnClick.bind(this))

    // 调用父类load方法
    Scene.prototype.load.call(this)
}

