// 总共找出了多少正确的不同
function Label(box, options){
    this.box = box

    this.cnt = 0
    
    this.options = {
        position: 'absolute',
        left: '0px',
        bottom: '502px',
        fontSize: '20px',
        display: 'inline-block',
        color: 'white',
        backgroundColor: 'rgb(91, 192, 222)'
    }
    View.call(this, box, this.options)
}

Label.prototype = Object.create(View.prototype)
Label.prototype.constructor = Label

// 把数字显示到页面上
Label.prototype.show = function(){
    this.$ele = $('<span>').html('累计已找出 <b style="color: rgb(94,43,170); font-size: 26px"> ' + this.cnt + ' </b> 处不同！').css(this.options).prependTo(this.box)
}

// 更新数字 即点击正确后+1
Label.prototype.increaseCnt = function(){
    this.$ele.html('累计已找出 <b style="color: rgb(94,43,170); font-size: 26px"> ' + (++this.cnt) + ' </b> 处不同！')
}