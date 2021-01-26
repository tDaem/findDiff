$(document).ready(function () {
    init()
    window.onresize = resize
})

function init() {
    resize()
}

/**
 * 窗口大小调整时
 */
function resize() {
    var bodyWidth = $(document.body).width()//窗口文档的宽
    var windowHeight = $(window).height()//窗口文档的高
    console.log('offsetRight=' + offsetRight)
    console.log('offsetTop=' + offsetTop)
    var tableWidth = $('table').width()//表格宽
    var tableHeight = $('table').height()//表格高
    console.log('tableWidth=' + tableWidth)
    console.log('tableHeight=' + tableHeight)
    var offsetRight = 3 / 2 * (bodyWidth / 4 - tableWidth / 2)
    var offsetTop = (windowHeight / 2 - tableHeight / 2) / 2
    $('div form').css({'position': 'relative', 'right': offsetRight, 'top': offsetTop})
    $('div p').css({
        'width': 2 / 3 * offsetRight,
        'position': 'relative',
        'left': offsetRight,
        'top': offsetTop,
        'min-width': '200px'
    })
}