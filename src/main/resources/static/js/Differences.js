// 管理每一张图片上的“不同”数据
// 画圈及管理圆圈

function Differences(game, data) {
    this.game = game
    this.diffs = data.diffs
}

// 判断x,y坐标点是否在“不同”数据中
Differences.prototype.check = function (x, y) {
    // 循环每一个“不同”数据
    for (var i = 0; i < this.diffs.length; i++) {
        var diff = this.diffs[i]

        // 防止画多个圈
        if (diff.showed) continue
        // 如果“不同”已经画在页面上，则跳过下面的代码，
        // 继续循环下一个不同！

        // 计算“不同”区域
        var left = diff.center.x - radius
        var right = diff.center.x + radius
        var top = diff.center.y - radius
        var bottom = diff.center.y + radius

        if (x > left && x < right && y > top && y < bottom) {
            // 如果坐标点中“不同”，使用相关数据画圈
            var left_1 = diff.center.x - radius - $(this.game.box).width() / 2
            var top_1 = diff.center.y - radius
            this.show(diff, left, top)
            //左边也同时画圈
            this.show(diff, left_1, top_1)
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
    if (diff) {
        diff.showed = true
    } else {
        setTimeout(() => {
            diffDiv.remove()
        }, delayTime)
    }
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
