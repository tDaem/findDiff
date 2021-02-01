// 开始场景
function StartScene(game, src) {
    src = src || 'images/start_bg.jpg'
    // 调用父类构造函数
    // 使用别人构造函数构造自己的对象
    Scene.call(this, game, src)
    console.log(this)
}

// 构造原型链，实现继承
// StartScene.prototype = new Scene(Scene.prototype)
StartScene.prototype = Object.create(Scene.prototype)
StartScene.prototype.constructor = StartScene

// 实现点击事件监听函数
// 当点击开始按扭时移除全屏按扭并加载游戏场景
StartScene.prototype.clickListener = function (x, y) {
    //分单人游戏和多人游戏情况
    // if (x > 643 && x < 858 && y > 334 && y < 418) {
    //     //请求网络加载游戏数据
    //     this.fullScreen.remove()
    //     this.game.loadGameScene(this)
    // }
}

// 重写场景加载方法，添加全屏按扭
StartScene.prototype.load = function (prevScene, params) {
    console.log(params)
    this.params = params
    //全屏按钮
    this.fullScreen = new FullScreenButton(this.game.box, {
        left: '0px',
        bottom: '-40px',
        zIndex: 9
    })
    //单人游戏按钮
    this.soloGameBtn = new StartGameButton(this.game.box, false, {
        position: 'absolute',
        left: '630px',
        bottom: '225px',
        fontSize: '28px',
        fontcolor: '#fefefe',
        backgroundColor: '#FFCC01',
        display: 'inline-block',
        padding: '8px',
        borderRadius: '6px',
    })
    //多人游戏按钮
    this.teamGameBtn = new StartGameButton(this.game.box, true, {
        position: 'absolute',
        left: '630px',
        bottom: '110px',
        fontSize: '28px',
        fontcolor: '#fefefe',
        backgroundColor: '#FFCC01',
        display: 'inline-block',
        padding: '8px',
        borderRadius: '6px',
    })

    this.soloGameBtn.setOnClickListener(this.soloGameBtnClick.bind(this))
    this.teamGameBtn.setOnClickListener(this.teamGameBtnClick.bind(this))

    this.soloGameBtn.show()

    this.teamGameBtn.show()

    // this.fullScreen.show()

    // 调用父类load方法
    Scene.prototype.load.call(this)

    // 将上一个场景淡出，动画结束后将上一个场景卸载
    prevScene.loginView.remove()
    prevScene.$ele.fadeOut(delayTime, () => {
            console.log('start scene loaded')
            prevScene.unload()
        }
    )
}

/**
 * 单人游戏按钮点击事件
 */
StartScene.prototype.soloGameBtnClick = function () {
    this.game.loadGameScene(this, this.params)
}

/**
 * 多人游戏按钮点击事件
 */
StartScene.prototype.teamGameBtnClick = function () {
    var selectDialog = dialog({
        title: "游戏方式",
        content: "请选择游戏模式",
        button: [
            {
                id: 'join',
                value: '加入房间',
                callback: () => {
                    this.processJoinRoom(selectDialog)
                    return false;
                }
            },
            {
                id: 'create',
                value: "创建房间",
                callback: () => {
                    this.processCreateRoom(selectDialog)
                    return false;
                }
            }]
    })
    selectDialog.showModal()
}

//处理创建多人房间逻辑
StartScene.prototype.processCreateRoom = function (preDialog) {
    preDialog.close().remove()
    var loading = dialog({
        content: "正在创建房间..."
    })
    loading.showModal()
    $.ajax({
        url: "/room",
        type: 'get',
        timeout: 12000,
        dataType: 'json',
        success: ret => {
            console.log(ret)
            loading.close().remove()
            if (ret.code === 0 && ret.data) {
                console.log('load next scene...')
                this.params.roomNum = ret.data//保存房间号
                this.connect()
            } else {
                floatDialog('创建房间失败，请稍后重试！')
            }
        },
        error: ret => {
            console.log(ret)
            loading.close().remove()
            if (ret.status == 'timeout') {
                floatDialog('请求超时，请检查网络！')
            } else {
                floatDialog('服务器异常！')
            }
        }
    })
    return false
}

//处理加入多人房间逻辑
StartScene.prototype.processJoinRoom = function (preDialog) {
    preDialog.close().remove()
    var joinRoomDialog = dialog({
        title: "加入房间",
        content: contentHtml,
        okValue: "加入房间",
        ok: () => {
            var loading = dialog()
            var roomNum = $('#roomNum').val()
            if (roomNum.trim().length === 0) {
                floatDialog('请输入房间号')
                return false
            }
            $.ajax({
                url: '/room/' + roomNum,
                type: 'get',
                timeout: 12000,
                dataType: 'json',
                success: ret => {
                    console.log(ret)
                    if (ret.code === 0 && ret.data) {
                        console.log('load next scene...')
                        this.params.roomNum = ret.data//保存房间号
                        this.connect()
                    } else {
                        floatDialog(ret.msg)
                    }
                    loading.close().remove()
                },
                error: ret => {
                    loading.close().remove()
                    console.log(ret)
                    if (ret.status == 'timeout') {
                        floatDialog('请求超时，请检查网络！')
                    } else {
                        floatDialog('服务器异常！')
                    }
                }
            })
        },
        cancelValue: "取消",
        cancel: () => {

        }
    })
    joinRoomDialog.showModal()
    return false
}

/**
 * 浮动的提醒消息 2秒后移除
 * @param msg
 */
var floatDialog = function (msg) {
    var d = dialog({
        content: msg
    });
    d.show();
    setTimeout(function () {
        d.close().remove();
    }, 2000);
}

StartScene.prototype.connect = function () {
    var loading = dialog()
    loading.showModal()
    //建立长连接
    if ('WebSocket' in window) {
        if (!this.webSocket)
            this.webSocket = new WebSocket("ws://localhost:8090/game/" + this.params.roomNum + "?gameName=" + this.params.gameId + "&serialNum=" + this.params.serial.serialNum + "&mutilPlay=true");
    } else {
        loading.close().remove()
        alert('当前浏览器不支持WebSocket！')
        return
    }
    this.webSocket.onopen = () => {
        console.log("进入房间...")
        loading.close().remove()
        this.roomDialog = dialog({
            width: '300px',
            okValue: '开始游戏',
            ok: () => {
                //todo
            },
            cancelValue: '退出',
            cancel: () => {
                console.log("关闭连接")
                this.webSocket.close()
            }
        })
        this.roomDialog.showModal()

    }
    this.webSocket.onmessage = (ret) => {
        console.log("收到服务端消息")
        console.log(ret.data)
        var msg = JSON.parse(ret.data)
        if (msg.code === 0) {
            if (msg.data.messageType === 'TIP') {
                //弹出消息，进入游戏
                console.log(msg.data.data)
            } else if (msg.data.messageType === 'DATA') {
                //处理数据
                this.updateRoomInfo(msg.data.data)
            } else {
                console.log("游戏异常！")
            }
        }
    }
    this.webSocket.onclose = () => {
        console.log("连接已关闭...")
        this.webSocket = null
    }
    this.webSocket.onerror = () => {
        floatDialog('连接服务器错误...')
    }
}


StartScene.prototype.updateRoomInfo = function (roomInfo) {
    var roomContentHtml = createRoomHtml(roomInfo);
    this.roomDialog.title('房间号：' + this.params.roomNum)
    this.roomDialog.content(roomContentHtml)
}

function createRoomHtml(roomInfo) {
    var data = ''
    roomInfo.forEach((v, i) => {
        data += '' +
            '<tr>' +
            '   <th scope="row">' + (i + 1) + '</th>' +
            '   <td>' + v + '</td>' +
            '</tr>'
    })
    return '' +
        '<table class="table table-striped">' +
        '  <thead>' +
        '        <tr>' +
        '          <th>#</th>' +
        '          <th>游戏id</th>' +
        '        </tr>' +
        '      </thead>' +
        '      <tbody>' +
        data +
        '      </tbody>' +
        '</table>'
}

var contentHtml = '' +
    '  <div class="form-inline">' +
    '    <label for="roomNum">房间号：</label>' +
    '    <input type="number" class="form-control" id="roomNum" placeholder="输入房间号...">' +
    '  </div>'

