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
    this.game.loadStartScene(this, params)
}

/**
 * 不了解，试玩
 */
RuleScene.prototype.unknowBtnClick = function () {

}



//
LoginScene.prototype.load = function (prevScene) {

    // this.loginView = new LoginView(this, {
    //     position: 'absolute',
    //     backgroundColor: "#FF000000",
    //     left: '0px',
    //     bottom: '0px',
    //     display: 'inline-block',
    //     padding: '8px',
    //     borderRadius: '6px'
    // })
    //
    // this.loginView.show()
    //
    // $('#loginBtn').click(this.loginBtnClick.bind(this))
    //
    // // 调用父类load方法
    Scene.prototype.load.call(this)
}

