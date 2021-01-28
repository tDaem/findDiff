// 找不同场景
// 找不同游戏数据
function GameScene(game, datas) {
    // 全部的游戏数据
    this.datas = datas
    this.index = 0
    // 当前正在进行的游戏的数据
    this.data = datas[this.index]

    Scene.call(this, game, this.data.src)
    console.log(this)
}

// 构造原型链
GameScene.prototype = Object.create(Scene.prototype)
GameScene.prototype.constructor = GameScene

GameScene.prototype.initGame = function (prevScene) {
    this.differences = new Differences(this.game, this.data)
    this.fullScreenBtn = new FullScreenButton(this.game.box)
    this.skipBtn = new SkipButton(this.game.box, {
        left: '825px',
        bottom: '9px'
    })
    this.confirmBtn = new ConfirmButton(this.game.box, {
        left: '825px',
        bottom: '54px'
    })
    this.secondManager = new SecondManager(this.game.box, this.data.seconds)
    this.label = new Label(this.game.box, this.data.fakeCnt || this.data.diffs.length)

    this.skipBtn.setOnClickListener(this.skip.bind(this))//this指向当前场景
    this.confirmBtn.setOnClickListener(this.confirm.bind(this)) //this指向当前场景

    this.fullScreenBtn.show()
    this.skipBtn.show()
    this.confirmBtn.show()
    this.secondManager.show()
    this.label.show()

    Scene.prototype.load.call(this)

    // 根据游戏数据设置数字标签的初始值及回调函数
    // 根据游戏数据设置倒计时的初始值及回调函数
    this.label.set(this.pass.bind(this), this.data.fakeCnt || this.data.diffs.length)
    this.secondManager.set(this.timeout.bind(this), this.data.seconds)

    // 将上一个场景淡出，动画结束后将上一个场景卸载
    // 同时开始倒计时
    prevScene.soloGameBtn.remove()
    prevScene.teamGameBtn.remove()
    prevScene.fullScreen.remove()
    prevScene.$ele.fadeOut(1500, () => {
        console.log('game scene loaded')
        prevScene.unload()
        this.secondManager.start()
    })
}

/**
 * 处理坐标数据
 */
GameScene.prototype.processData = function () {

}

/**
 * 重写load方法，添加全屏按扭、倒计时、数字标签
 * @param prevScene 上一个游戏场景
 */
GameScene.prototype.load = function (prevScene, params) {
    console.log(params)
    this.params = params
    //建立长连接
    if ('WebSocket' in window) {
        this.webSocket = new WebSocket("ws://localhost:8090/websocket/" + params.roomNum + "/" + "Ghy8kilY");
    } else {
        alert('当前浏览器不支持WebSocket！')
    }
    this.webSocket.onopen = () => {
        console.log("进入房间...")
        this.initGame(prevScene)
    }
    this.webSocket.onmessage = (ret) => {
        console.log(ret.data)
        console.log(this)
        var msg = JSON.parse(ret.data)
        if (msg.code === 0) {
            if (msg.data.messageType === 'TIP') {
                //弹出消息，进入游戏
                console.log(msg.data.data)
            } else if (ret.data.messageType === 'DATA') {
                //处理数据
                this.processData()
            }
        }
    }
    this.webSocket.onclose = () => {
        console.log("连接已关闭...")
        this.webSocket = null
    }
    this.webSocket.onerror = () => {
        console.log("连接错误...")
    }
}

// 重写点击监听函数
GameScene.prototype.clickListener = function (x, y) {
    console.log('game scene click!')

    if (this.differences.check(x, y)) {
        this.label.decrease()
        this.webSocket.send(JSON.stringify({
            x: x,
            y: y
        }))
    }
}

/**
 * 处理游戏超时的方法
 */
GameScene.prototype.timeout = function () {
    this.game.audio.playTimeout()
    var scene = new TimeoutScene(this.game, this)
    scene.load(true)
}

/**
 * 点击重玩时重置游戏场景
 * @param start
 */
GameScene.prototype.reset = function (start) {
    this.label.set(this.pass.bind(this), this.data.fakeCnt || this.data.diffs.length)
    this.secondManager.set(this.timeout.bind(this), this.data.seconds)
    this.differences.reset()

    // 从超时场景返回时需要再次将游戏的点击监听函数切换成游戏场景的监听函数
    this.game.clickListener = this.clickListener.bind(this)

    if (start) this.secondManager.start()
}

/**
 * 点击确认时的方法
 */
GameScene.prototype.confirm = function () {
    if (this.data.fakeCnt && this.data.diffs.length < this.data.fakeCnt || this.label.value > 0) {
        var option = {
            title: '温馨提示',
            content: '还有' + (this.label.value) + '处不同未找到!',
            okValue: '确定',
            ok: function () {
                return true
            }
        }
        dialog(option)
            .width(200)
            .showModal()
    } else {
        this.pass()
    }
}

/**
 * 点击跳过按钮时执行的方法
 */
GameScene.prototype.skip = function () {
    var option = {
        title: '温馨提示',
        content: '确定跳过这一关吗？',
        okValue: '确定',
        ok: function () {
            this.next()
            return true;
        }.bind(this),//修改this指向
        cancelValue: '取消',
        cancel: function () {
        }
    }
    //先提示是否跳过
    dialog(option)
        .width(200)
        .showModal();
}
/**
 * 延迟一段时间后再次调用（preview没有传）
 * 判断是否还有游戏数据，如果有就加载下一个游戏数据
 * 没有就通关
 */
GameScene.prototype.next = function () {
    if (++this.index < this.datas.length) {
        this.data = this.datas[this.index]

        var ele = this.$ele
        // 添加下一个“不同”的图片到页面上
        this.$ele = $('<img>').attr('src', this.data.src).prependTo(this.game.box)
        // 将原图片淡出
        ele.fadeOut(1500, function () {
            this.secondManager.start()
            ele.remove()
        }.bind(this))

        this.reset()

        this.differences = new Differences(this.game, this.data)
    } else {
        this.differences.reset()
        this.game.complete()
    }
}

//过关时的方法
GameScene.prototype.pass = function (label, preview) {
    if (preview) {
        // 当数字标签上的数字变为0时立即调用
        // 停止倒计时，播放音效
        this.secondManager.stop()

        if (this.index < this.datas.length - 1) {
            this.game.audio.playPass()
        } else {
            this.game.audio.playComplete()
        }

        return;
    }


    this.next()
}