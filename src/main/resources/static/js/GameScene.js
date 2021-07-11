// 找不同场景
// 找不同游戏数据
function GameScene(game, params) {
    this.map = new Map()
    this.params = params
    console.log(params)
    // 全部的游戏数据
    if (params.test) { //加载正式游戏关卡
        this.datas = params.testGame.gameSceneDatas
    } else {//加载试玩游戏关卡
        this.datas = params.game.gameSceneDatas
    }
    this.index = 0
    // 当前正在进行的游戏的数据
    this.data = this.datas[this.index]
    if (this.data.structure === 'UP_AND_DOWN') {
        $(game.box).css(game.UD)
    } else {
        $(game.box).css(game.LR)
    }
    this.diffIndex = 0

    //是否禁止点击时发送数据
    this.clickDisabled = false
    /**
     * 保存游戏数据
     * {
     *     start: false,//是否开始游戏时
     *     skip: false, //是否跳过
     *     diffIndex: 0,//第几处不同
     *     gameSceneData: {//当前游戏场景
     *         id: 1
     *     },
     *     serial: {//当前游戏序列号
     *         id: 2
     *     },
     *     time: new Date()//当前操作的时间
     *     hit: 是否命中不同点
     * }
     */
    this.records = []
    Scene.call(this, game, this.data.imgPath)
    console.log('map', this.map)
}


GameScene.prototype.records = []

// 构造原型链
GameScene.prototype = Object.create(Scene.prototype)
GameScene.prototype.constructor = GameScene

GameScene.prototype.initGame = function (prevScene) {
    this.differences = new Differences(this.game, this.data)
    this.fullScreenBtn = new FullScreenButton(this.game.box, {
        left: '0px',
        bottom: '-40px'
    })


    this.skipBtn = new SkipButton(this.game.box, {})

    this.confirmBtn = new ConfirmButton(this.game.box, {})
    // this.secondManager = new SecondManager(this.game.box, this.data.seconds)
    this.label = new Label(this.game.box, 0, {})

    this.skipBtn.setOnClickListener(this.skip.bind(this))//this指向当前场景
    this.confirmBtn.setOnClickListener(this.sendConfirmClick.bind(this)) //this指向当前场景

    // this.fullScreenBtn.show()
    this.skipBtn.show()
    this.confirmBtn.show()
    this.label.show()
    if (this.data.structure === 'UP_AND_DOWN') {
        $(this.game.box).css(this.game.UD)
        console.log(this.skipBtn)
        this.skipBtn.$ele.css({
            left: boxH,
            bottom: '0'
        })
    } else {
        $(this.game.box).css(this.game.LR)
        this.skipBtn.$ele.css({
            left: '752px',//800-48
            bottom: '-40px'
        })
        this.confirmBtn.$ele.css({
            left: '700px',//800-48*2 -4
            bottom: '-40px'
        })
    }
    // this.confirmBtn.show()
    // this.secondManager.show()
    // this.label.show()

    Scene.prototype.load.call(this)

    // 根据游戏数据设置数字标签的初始值及回调函数
    // 根据游戏数据设置倒计时的初始值及回调函数
    // this.label.set(this.pass.bind(this), this.data.fakeCnt || this.data.diffs.length)
    // this.secondManager.set(this.timeout.bind(this), this.data.seconds)

    // 将上一个场景淡出，动画结束后将上一个场景卸载
    // 同时开始倒计时
    if (!this.params.test) {
        prevScene.soloGameBtn.remove()
        prevScene.teamGameBtn.remove()
    } else {
        prevScene.ruleView.remove()
    }
    // prevScene.fullScreen.remove()
    prevScene.$ele.fadeOut(delayTime, () => {
        console.log('game scene loaded')
        prevScene.unload()
        // this.secondManager.start()
        this.records.push({
            roomNum: this.params.roomNum,
            start: true,//是否开始游戏时
            skip: false,//跳过
            diffIndex: this.diffIndex,//第几处不同
            gameSceneData: {//当前游戏场景
                id: this.data.id
            },
            serial: {//当前游戏序列号
                id: this.params.serial.id
            },
            time: new Date().getTime(),//当前操作的时间
            hit: false//是否命中不同点
        })
        console.log(this.records)
    })
}

/**
 * 重写load方法，添加全屏按扭、倒计时、数字标签
 * @param prevScene 上一个游戏场景
 */
GameScene.prototype.load = function (prevScene, params) {
    console.log(params)
    this.params = params
    this.connect(prevScene)
    this.initGame(prevScene)

}

/***
 * 连接服务器
 * @param prevScene
 */
GameScene.prototype.connect = function () {
    //建立长连接
    if ('WebSocket' in window) {
        if (!Scene.webSocket) {
            var Ip = window.location.host
            Scene.webSocket = new WebSocket("ws://" + Ip + "/game/" + this.params.roomNum + "?gameName=" + this.params.gameId + "&serialNum=" + this.params.serial.serialNum);
        }
    } else {
        alert('当前浏览器不支持WebSocket！')
        return
    }
    Scene.webSocket.onopen = () => {
        console.log("进入房间...")
    }
    Scene.webSocket.onmessage = (ret) => {
        console.log("收到服务端消息")
        console.log(ret.data)
        var msg = JSON.parse(ret.data)
        if (msg.code === 0) {
            if (msg.data.messageType === 'TIP') {
                //弹出消息，进入游戏
                console.log(msg.data.data)
            } else if (msg.data.messageType === 'DATA') {
                if (msg.data.data === 'next') {//跳过这一关
                    this.next()
                } else if (msg.data.data && msg.data.data.confirm) {//点击的是确定
                    this.confirm(msg.data.data)
                } else {
                    //处理数据
                    this.processData(msg.data.data)
                }

            } else {
                console.log("游戏异常！")
            }
        }
    }
    Scene.webSocket.onclose = () => {
        console.log("连接已关闭...")
        Scene.webSocket = null
    }
    Scene.webSocket.onerror = () => {
        console.log("连接错误...")
    }
}

/**
 * 处理坐标数据 （主要负责花圈）
 */
GameScene.prototype.processData = function (clickData) {
    if (!clickData)
        return
    console.log(clickData)
    let boxWidth = $(this.game.box).width();
    let boxHeight = $(this.game.box).height();
    if (this.data.structure === 'LEFT_AND_RIGHT') {//左右结构的图片
        if (clickData.x < boxWidth / 2) {
            clickData.x = clickData.x + boxWidth / 2
        }
    } else {//上下结构的图片
        if (clickData.y < boxHeight / 2) {
            clickData.y = clickData.y + boxHeight / 2
        }
    }

    //直接画圆
    var flag = boxWidth > boxHeight
    var left = clickData.x - radius
    var top = clickData.y - radius
    var left_1
    var top_1
    if (flag) {
        left_1 = clickData.x - radius - boxWidth / 2
        top_1 = clickData.y - radius
    } else {
        left_1 = clickData.x - radius
        top_1 = clickData.y - radius - boxHeight / 2
    }
    //记录坐标，用于点击确定是判断是否点中用
    // this.x = clickData.x
    // this.y = clickData.y

    //当前点击正在显示的圆圈（为错误时擦除用）
    var diffDiv = this.differences.show(clickData, left, top)
    //对称部分也同时画圈
    var diffDiv1 = this.differences.show(clickData, left_1, top_1)

    this.map.set(clickData.serialId,
        {
            x: clickData.x,//点击的坐标
            y: clickData.y,
            diffDivs: [diffDiv, diffDiv1]//显示的圆圈
        })

    console.log(this.map)
    //此时不在处理点击事件
    if (clickData.serialId === this.params.serial.id) this.clickDisabled = true
    //点击确定的时候检查坐标
    // if (this.differences.check(clickData.x, clickData.y)) {
    //     record.start = false
    //     record.diffIndex = ++this.diffIndex
    //     record.hit = true
    //     //蓝底变色
    // } else {
    //     var flag = boxWidth > boxHeight
    //     var errorLeft = clickData.x - radius
    //     var errorTop = clickData.y - radius
    //     var errorLeft_1
    //     var errorTop_1
    //     if (flag) {
    //         errorLeft_1 = clickData.x - radius - boxWidth / 2
    //         errorTop_1 = clickData.y - radius
    //     } else {
    //         errorLeft_1 = clickData.x - radius
    //         errorTop_1 = clickData.y - radius - boxHeight / 2
    //     }
    //
    //     this.differences.show(null, errorLeft, errorTop)
    //     //对称部分也同时画圈
    //     this.differences.show(null, errorLeft_1, errorTop_1)
    //
    //     //需要记录的数据
    //     record.start = false
    //     record.hit = false
    // }
    //
    // if (this.data.diffsCoordinates.length === this.diffIndex)
    //     setTimeout(() => {
    //         this.next()
    //     }, 1000)
}

// 重写点击监听函数（记录数据）
GameScene.prototype.clickListener = function (x, y) {
    if (!this.clickDisabled) {
        //需要记录的数据
        this.record = {
            roomNum: this.params.roomNum,
            start: false,//是否开始游戏时
            skip: false,//跳过
            diffIndex: this.diffIndex,//第几处不同
            gameSceneData: {//当前游戏场景
                id: this.data.id
            },
            serial: {//当前游戏序列号
                id: this.params.serial.id
            },
            time: new Date().getTime(),//当前操作的时间
            hit: false//是否命中不同点
        }
        console.log('game scene click!')
        Scene.webSocket.send(JSON.stringify({
            serialId: this.params.serial.id,
            x: x,
            y: y
        }))
    } else {
        //提示需要点击确定
        console.log("请点击确定按钮提交数据！")
        floatDialog("请先点击确定按钮！")
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
    // this.label.set(this.pass.bind(this), this.data.fakeCnt || this.data.diffs.length)
    // this.secondManager.set(this.timeout.bind(this), this.data.seconds)
    this.differences.reset()
    this.records = []
    this.diffIndex = 0
    // 从超时场景返回时需要再次将游戏的点击监听函数切换成游戏场景的监听函数
    this.game.clickListener = this.clickListener.bind(this)

    // if (start) this.secondManager.start()
}

/**
 * 发送确认按钮点击事件
 */
GameScene.prototype.sendConfirmClick = function () {
    console.log('map', this.map)
    var diffData = this.map.get(this.params.serial.id);//点击的数据（坐标+圆圈）
    if (!diffData) {//进入下一关时，确保点击确定无反应
        floatDialog("请寻找不同处！")
    } else {
        var hit = this.differences.check(diffData.x, diffData.y);
        Scene.webSocket.send(JSON.stringify({
            confirm: 'confirm',//发送点击了确定按钮
            serialId: this.params.serial.id,//哪个玩家
            hit: hit//是否命中
        }))
    }
    return false
}
/**
 * 点击确认返回消息时的方法
 * @param x 点击的坐标x
 * @param y 点击的坐标y
 * @returns {boolean}
 */
GameScene.prototype.confirm = function (data) {

    var serialId = data.serialId
    var hit = data.hit
    if (!hit) {
        let diffData = this.map.get(serialId)
        diffData.diffDivs[0].remove()
        diffData.diffDivs[1].remove()
    } else {
        ++this.diffIndex //命中索引+1
        this.label.increaseCnt()//找出不同数+1
    }
    if (this.params.serial.id === serialId) {
        this.record.diffIndex = this.diffIndex
        this.record.start = false
        this.record.hit = hit
        this.records.push(this.record)//如果是自己点击的
    }
    this.map.delete(serialId)

    if (serialId === this.params.serial.id) this.clickDisabled = false;
    //如果全部找出来 则进入下一关
    if (this.data.diffsCoordinates.length === this.diffIndex)
        setTimeout(() => {
            this.next()
        }, 250)
}

/**
 * 浮动的提醒消息
 * @param msg
 * @param delay 延时多少秒后消失,默认0.5s
 */
var floatDialog = function (msg, delay) {
    var d = dialog({
        content: msg
    });
    d.show();
    setTimeout(function () {
        d.close().remove();
    }, 250 || delay);
}

/**
 * 点击跳过按钮时执行的方法
 */
GameScene.prototype.skip = function () {
    if (this.clickDisabled || this.map.size > 0) {
        //提示 你已经点击了一处，但没有点击确定！
        console.log("你已经点击了一处，但还没有点击确定！")
        floatDialog("已经点击了一处，但还没有点击确定！")
    } else {
        var option = {
            title: '温馨提示',
            content: '确定跳过这一关吗？',
            okValue: '确定',
            ok: function () {
                this.records.push({
                    roomNum: this.params.roomNum,
                    start: false,//是否开始游戏时
                    skip: true,//跳过
                    diffIndex: this.diffIndex,//第几处不同
                    gameSceneData: {//当前游戏场景
                        id: this.data.id
                    },
                    serial: {//当前游戏序列号
                        id: this.params.serial.id
                    },
                    time: new Date().getTime(),//当前操作的时间
                    hit: false//是否命中不同点
                })
                console.log(this.records)
                //发送消息
                Scene.webSocket.send('next')
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
    return false
}
/**
 * 延迟一段时间后再次调用（preview没有传）
 * 判断是否还有游戏数据，如果有就加载下一个游戏数据
 * 没有就通关
 */
GameScene.prototype.next = function () {
    this.saveRecord(this.records)

    if (++this.index < this.datas.length) {
        this.data = this.datas[this.index]
        var ele = this.$ele
        // 将原图片淡出
        ele.fadeOut(delayTime, () => {
            // this.secondManager.start()
            ele.remove()
            if (this.data.structure === 'UP_AND_DOWN') {
                $(this.game.box).css(this.game.UD)
                console.log(this.skipBtn)
                this.skipBtn.$ele.css({
                    left: '505px',
                    bottom: '0'
                })
                this.confirmBtn.$ele.css({
                    left: '505px',
                    bottom: '68px'
                })
            } else {
                $(this.game.box).css(this.game.LR)
                this.skipBtn.$ele.css({
                    left: '752px',
                    bottom: '-40px'
                })
                this.confirmBtn.$ele.css({
                    left: '700px',
                    bottom: '-40px'
                })
            }
            // 添加下一个“不同”的图片到页面上
            this.$ele = $('<img>').attr('src', this.data.imgPath).prependTo(this.game.box)


        })

        this.reset()

        this.differences = new Differences(this.game, this.data)

        this.records.push({
            roomNum: this.params.roomNum,
            start: true,//是否开始游戏时
            skip: false,//跳过
            diffIndex: this.diffIndex,//第几处不同
            gameSceneData: {//当前游戏场景
                id: this.data.id
            },
            serial: {//当前游戏序列号
                id: this.params.serial.id
            },
            time: new Date().getTime(),//当前操作的时间
            hit: false//是否命中不同点
        })
    } else {
        this.differences.reset()
        if (this.params.test) {
            layer.msg('试玩结束')
            setTimeout(() => {
                this.params.test = false
                Scene.webSocket = null
                this.game.loadStartScene(this, this.params)
            }, 500)
        } else {
            this.params.findCnt = this.label.cnt
            this.game.complete(this.params)
        }

    }
}

//过关时的方法
GameScene.prototype.pass = function (label, preview) {
    if (preview) {
        // 当数字标签上的数字变为0时立即调用
        // 停止倒计时，播放音效
        // this.secondManager.stop()

        if (this.index < this.datas.length - 1) {
            this.game.audio.playPass()
        } else {
            if (this.params.test) {
                layer.msg('试玩结束')
                setTimeout(() => {
                    this.params.test = false
                    Scene.webSocket = null
                    this.game.loadStartScene(this, this.params)
                }, 500)
            } else {
                this.game.audio.playComplete()
            }
        }
        return;
    }


    this.next()
}

/**
 * 保存记录到后台
 * @param records
 */
GameScene.prototype.saveRecord = function (records) {
    if (this.params.test) return //如果是试玩游戏  放弃保存数据
    console.log(JSON.stringify(records))
    $.ajax({
        url: "/record",
        type: 'post',
        timeout: 12000,
        dataType: 'json',
        data: JSON.stringify(records),
        contentType: 'application/json;charset=UTF-8',
        success: ret => {
            console.log(ret)
            if (ret.code === 0 && ret.data) {
                //忽略
            } else {
                floatDialog('数据保存失败')
            }
        },
        error: ret => {
            console.log(ret)
            floatDialog('与服务器通讯失败，数据可能丢失！')
        }
    })
}