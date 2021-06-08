/**
 * 自定义视图
 * @param box
 * @param options
 * @constructor
 */
function View(box, options) {
    this.box = box
    this.options = $.extend({
        position: 'absolute',
        left: '10px',
        bottom: '26px',
        fontSize: '16px',
        backgroundColor: '#ffcc01',
        display: 'inline-block',
        padding: '8px',
        borderRadius: '6px',
        zIndex: 9999    //视图置于最上层
    }, options)
}

/**
 * 视图如何去展示，由子类实现
 */
View.prototype.show = function () {
}


/**
 * 卸载当前视图，由子类实现
 */
View.prototype.remove = function () {
}

