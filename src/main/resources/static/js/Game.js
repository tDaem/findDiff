// 整体游戏控制
function Game(box) {//初始化 将图片添加到main中 播放音乐 添加监听
    this.box = box
    // 创建音效对象，播放背景音乐
    this.audio = new Audio()
    this.audio.playMusic(true)

    // 监听点击事件
    this.listen()
    // 加载登录场景
    this.loadLoginScene()
    console.log(this);
}

/**
 * 左右布局
 * @type {{cursor: string, width: string, position: string, "min-width": string, height: string}}
 */
Game.prototype.LR = {
    'min-width': boxW,
    'width': boxW,
    'height': boxH,
    'cursor': 'pointer',
    position: 'relative'
}

/**
 * 上下布局参数
 * @type {{cursor: string, width: string, position: string, "min-width": string, height: string}}
 */
Game.prototype.UD = {
    'min-width': boxH,
    'width': boxH,
    'height': boxW,
    'cursor': 'pointer',
    'position': 'relative'
}

Game.prototype.listen = function () {//获取点击的在盒子上的坐标（距盒子左上角的距离 offsetX offsetY）并当成参数传递
    $(this.box).click(function (ev) {
        var x = ev.offsetX
        var y = ev.offsetY

        console.log('click x: %d, y: %d', x, y)

        this.audio.playClick()

        if (typeof this.clickListener == 'function') {//判断点击的发生后是不是一个函数 就是说是不是点击的有效元素
            this.clickListener(x, y)
        }
    }.bind(this))//将点击事件绑定在当前的场景上
}

Game.prototype.loadLoginScene = function (params) {//
    $(this.box).css(this.LR)
    var scene = new LoginScene(this, params)//登录场景
    scene.load()
}

Game.prototype.loadStartScene = function (prevScene, params) {//
    $(this.box).css(this.LR)
    var loading = dialog({
        content: "请稍后..."
    })
    loading.showModal()
    $.ajax({
        url: "/game/" + params.serial.game.id,
        type: 'get',
        timeout: 12000,
        dataType: 'json',
        success: ret => {
            loading.close().remove()
            console.log(ret)
            if (ret.code === 0 && ret.data) {
                //存在该序列号时进入相应的游戏
                console.log(ret.data)
                params.game = ret.data//游戏及关卡数据
                var scene = new StartScene(this)
                scene.load(prevScene, params)
            } else {
                //序列号输入错误时 弹出提示
                var d = dialog({
                    content: '没有找到该游戏序列号对应的游戏！'
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
            if (ret.status == 'timeout') {
                var d = dialog({
                    content: '请求超时，请检查网络！'
                });
                d.show();
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
            } else {
                var d = dialog({
                    content: '加载游戏失败请稍后尝试！'
                });
                d.show();
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
            }
        }
    })

}

//加载下一张图片
Game.prototype.loadGameScene = function (prevScene, params) {
    console.log(params)
    if (params.game && params.game.gameSceneDatas.length === 0) {
        dialog({
            title: "温馨提示",
            content: "游戏配置错误，请联系管理员！",
            okValue: '确定',
            ok: function () {
                return true
            }
        }).showModal()
        return
    }
    var scene = new GameScene(this, params)//游戏进行中的 传入场景数据
    scene.load(prevScene, params)
}

// 加载游戏完成的场景
Game.prototype.complete = function (params) {
    if (params && params.layout === 'TB') {
        $(this.box).css(this.TB)
    } else {
        $(this.box).css(this.LR)
    }
    var scene = new CompleteScene(this)
    scene.load(true, params)
}