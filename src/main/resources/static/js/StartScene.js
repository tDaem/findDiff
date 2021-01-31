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
        okValue: "创建房间",
        ok: () => {
            return this.processCreateRoom(selectDialog)
        },
        cancelValue: "加入房间",
        cancel: () => {
            return this.processJoinRoom(selectDialog)
        }
    })
    selectDialog.showModal()
}

//处理创建多人房间逻辑
StartScene.prototype.processCreateRoom = function () {
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
                showRoomInfo()//展示房间信息
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
    var joinRoomDialog = dialog({
        title: "加入房间",
        content: contentHtml,
        okValue: "加入房间",
        ok: () => {
            var loading = dialog()
            var roomNum = $('#roomNum').val()
            if (roomNum.trim().length === 0){
                floatDialog('请输入房间号')
                return true
            }
            preDialog.close().remove()
            $.ajax({
                url: '/room/' + roomNum,
                type: 'get',
                timeout: 12000,
                dataType: 'json',
                success: ret => {
                    console.log(ret)
                    if (ret.code === 0 && ret.data) {
                        loading.close().remove()
                        console.log('load next scene...')
                        this.params.roomNum = ret.data//保存房间号
                        showRoomInfo()//展示房间信息
                    } else {
                        floatDialog(ret.msg)
                    }
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

var contentHtml = '' +
    '  <div class="form-inline">' +
    '    <label for="roomNum">房间号：</label>' +
    '    <input type="number" class="form-control" id="roomNum" placeholder="输入房间号...">' +
    '  </div>'

