// 游戏规则场景场景
function RuleScene(game, src, params) {
    src = src || 'images/login_bg.jpg'
    // 调用父类构造函数
    // 使用别人构造函数构造自己的对象
    Scene.call(this, game, src, params)
    console.log(this)
}

// 构造原型链，实现继承
RuleScene.prototype = Object.create(Scene.prototype)
RuleScene.prototype.constructor = RuleScene


// 实现点击事件监听函数
// 当点击开始按扭时移除全屏按扭并加载游戏场景
RuleScene.prototype.clickListener = function (x, y) {

}

/**
 * 已了解 进入开始界面
 */
RuleScene.prototype.knowBtnClick = function () {
    console.log('knowBtnClick', this.params)
    this.game.loadStartScene(this, this.params)
}

/**
 * 不了解，试玩
 */
RuleScene.prototype.unknowBtnClick = function () {
    console.log('unknowBtnClick', this.params)
    if (!this.params.testGame || this.params.testGame.gameSceneDatas.length === 0) {
        return layer.msg('未配置试玩游戏，或未配置试玩游戏关卡')
    }
    $.ajax({
        url: "/room",
        type: 'get',
        timeout: 12000,
        dataType: 'json',
        beforeSend: () => {
            this.layerIndex = layer.load(0, {shade: [0.5, '#393D49']});
        },
        success: ret => {
            console.log(ret)
            if (ret.code === 0 && ret.data) {
                this.params.roomNum = ret.data//保存房间号
                this.params.test = true
                this.game.loadGameScene(this, this.params)
            } else {
                return layer.msg('加载游戏失败！', {icon: 5});//失败的表情
            }
        },
        complete: () => {
            layer.close(this.layerIndex);
        }
    })

}


//
RuleScene.prototype.load = function (prevScene) {

    this.ruleView = new RuleView(this, {
        position: 'absolute',
        backgroundColor: "#FF000000",
        left: '0px',
        bottom: '0px',
        display: 'inline-block',
        padding: '8px',
        borderRadius: '6px',
        gameDescription: this.params.gameDescription
    })

    this.ruleView.show()

    $('#knowBtn').click(this.knowBtnClick.bind(this))
    $('#unknowBtn').click(this.unknowBtnClick.bind(this))

    // // 调用父类load方法
    Scene.prototype.load.call(this)

    // 将上一个场景淡出，动画结束后将上一个场景卸载
    prevScene.loginView.remove()
    prevScene.$ele.fadeOut(delayTime, () => {
            console.log('rule scene loaded')
            prevScene.unload()
        }
    )
}

