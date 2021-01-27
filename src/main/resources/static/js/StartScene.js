// 开始场景
function StartScene(game, src){
    src = src || 'images/0.jpg'
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
StartScene.prototype.clickListener = function(x, y){
    if(x > 643 && x < 858 && y > 334 && y < 418){  
        this.fullScreen.remove()
        this.game.loadGameScene(this)
    }
}

// 重写场景加载方法，添加全屏按扭
StartScene.prototype.load = function(prevScene){

    this.fullScreen = new FullScreenButton(this.game.box, {
        left: 'auto',
        right: '20px',
        zIndex: 9
    })
    this.fullScreen.show()

    // 调用父类load方法
    Scene.prototype.load.call(this)

    // 将上一个场景淡出，动画结束后将上一个场景卸载
    prevScene.loginView.remove()
    prevScene.$ele.fadeOut(1500, function () {
        console.log('start scene loaded')
        prevScene.unload()
    }.bind(this))
}