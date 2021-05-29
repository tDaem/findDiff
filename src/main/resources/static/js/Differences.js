// 管理每一张图片上的“不同”数据
// 画圈及管理圆圈

function Differences(game, data) {
    console.log(game)
    console.log(data)
    this.game = game
    this.diffs = data.diffsCoordinates
}

// 判断x,y坐标点是否在“不同”数据中
Differences.prototype.check = function (x, y, noDraw) {
    // 循环每一个“不同”数据
    for (var i = 0; i < this.diffs.length; i++) {
        var diff = this.diffs[i]

        // 防止画多个圈
        if (diff.showed) continue
        // 如果“不同”已经画在页面上，则跳过下面的代码，
        // 继续循环下一个不同！

        // 计算“不同”区域  除以二的目的确保圆圈包含检测圆
        var left = diff.x - radius/3
        var right = diff.x + radius/3
        var top = diff.y - radius/3
        var bottom = diff.y + radius/3

        if (x > left && x < right && y > top && y < bottom) {
            if (!noDraw){
                // 如果坐标点中“不同”，使用相关数据画圈
                // var flag = $(this.game.box).width() > $(this.game.box).height()
                // var left_1
                // var top_1
                // if (flag){
                //     left_1 = diff.x - radius - $(this.game.box).width() / 2
                //     top_1 = diff.y - radius
                // }else {
                //     left_1 = diff.x - radius
                //     top_1 = diff.y - radius - $(this.game.box).height() / 2
                // }

                // this.show(diff, left, top)
                // //左边也同时画圈
                // this.show(diff, left_1, top_1)
            }
            return true
        }
    }
    return false
}

// 画圈
Differences.prototype.show = function (diff, left, top) {
    var diffDiv = $('<div class="diff">')
    diffDiv.css({
        width: radius * 2 + 'px',
        height: radius * 2 + 'px',
        position: 'absolute',
        left: left + 'px',
        top: top + 'px',
        border: '5px solid red',
        borderRadius: '50%',
        animation: 's 1s'
    }).appendTo(this.game.box).show('')
    diffDiv.click(function () {
            console.log("阻止事件")
            return false
        }
    )
    // if (diff) {
    //     diff.showed = true
    // }
    return diffDiv
}

// 重置
Differences.prototype.reset = function () {
    // 重置游戏数据
    this.diffs.forEach(function (diff) {
        diff.showed = false
    })

    // 移除页面上的圆圈
    $(this.game.box).find('.diff').remove()
}
