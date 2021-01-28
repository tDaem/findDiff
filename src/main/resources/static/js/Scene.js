// 表示游戏场景
// game表示游戏对象
// img表示场景使用的图片
function Scene(game, img) {
    this.game = game
    this.img = img
    this.webSocket = null
}

// 加载游戏场景
// append控制加载的位置，以便实现丰富的动画效果
// 如淡入淡出、上下滑动
Scene.prototype.load = function (append) {
    this.$ele = $('<img>').attr({
        src: this.img,
        zIndex: 8,
        width: '100%',
        height: '100%'
    })
    if (append) {
        this.$ele.appendTo(this.game.box)
    } else {
        this.$ele.prependTo(this.game.box)
    }

    // 让当前场景接收游戏中的点击事件
    // 让事件监听函数中的this指向当前场景，而不是标签元素
    this.game.clickListener = this.clickListener.bind(this)
}

// 表示点击事件监听函数，由子类负责实现
Scene.prototype.clickListener = function () {
}

// 卸载当前场景
Scene.prototype.unload = function () {
    this.$ele.remove()
}

/**
 * 连接服务器，有子类复写
 */
Scene.prototype.connect = function () {

}

function elePosition(oElement) {
    var x2 = 0;
    var y2 = 0;
    var width = oElement.offsetWidth;
    var height = oElement.offsetHeight;
    if (typeof (oElement.offsetParent) != 'undefined') {
        for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
            posX += oElement.offsetLeft;
            posY += oElement.offsetTop;
        }
        x2 = posX + width;
        y2 = posY + height;
        return {x: posX, y: posY, x2: x2, y2: y2};
    } else {
        x2 = oElement.x + width;
        y2 = oElement.y + height;
        return {x: oElement.x, y: oElement.y, x2: x2, y2: y2};
    }
}

