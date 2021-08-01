// 总共找出了多少正确的不同
function TipLabel(box, options){
    this.box = box

    this.cnt = 0
    
    this.options = {
        position: 'absolute',
        left: '582px',
        bottom: '502px',
        fontSize: '20px',
        display: 'inline-block',
        color: 'white',
        backgroundColor: 'rgb(91, 192, 222)',
        height: '55px',
        paddingTop: '14px'
    }
    View.call(this, box, this.options)
}

TipLabel.prototype = Object.create(View.prototype)
TipLabel.prototype.constructor = TipLabel

// 把数字显示到页面上
TipLabel.prototype.show = function(){
    this.$ele = $('<span>').html('请点击下面这幅图片👇').css(this.options).prependTo(this.box)
}