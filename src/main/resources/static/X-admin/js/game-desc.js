layui.use(['layer', 'jquery', 'layedit'], function () {
    let layedit = layui.layedit;
    let loginDescIndex = layedit.build('loginDesc', {
        hideTool: [
            'link' //超链接
            , 'unlink' //清除链接
            , 'face' //表情
            , 'image' //插入图片
            , 'help' //帮助
        ]
    }); //建立编辑器
    let gameRuleIndex = layedit.build('gameRule', {
        hideTool: [
            'link' //超链接
            , 'unlink' //清除链接
            , 'face' //表情
            , 'image' //插入图片
            , 'help' //帮助
        ]
    }); //建立编辑器

    $.ajax({
        url: '/game-description',
        type: 'get',
        beforeSend: function () {
            this.layerIndex = layer.load(0, {shade: [0.5, '#393D49']});
        },
        success: function (ret) {
            if (ret.code > 0) {
                return layer.msg(ret.msg, {icon: 5});//失败的表情
            } else {
                var gameDesc = ret.data
                if (!gameDesc) {
                    /**
                     * 设置编辑器内容
                     * @param {[type]} index 编辑器索引
                     * @param {[type]} content 要设置的内容
                     * @param {[type]} flag 是否追加模式
                     */
                    layedit.setContent(loginDescIndex, defaultLoginDesc, false);
                    layedit.setContent(gameRuleIndex, defaultGameRule, false);
                } else {
                    layedit.setContent(loginDescIndex, gameDesc.loginDescription || defaultLoginDesc, false);
                    layedit.setContent(gameRuleIndex, gameDesc.gameRule || defaultGameRule, false);
                }
            }
        },
        complete: function () {
            layer.close(this.layerIndex);
        },
    });

    $('#gameDescSave').click(function () {
        var gameDesc = {}
        gameDesc.id = 1 //默认只有一个配置  id写死
        gameDesc.loginDescription = layedit.getContent(loginDescIndex)
        gameDesc.gameRule = layedit.getContent(gameRuleIndex)
        console.log('gameDesc', gameDesc)
        $.ajax({
            url: '/game-description',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(gameDesc),
            beforeSend: function () {
                this.layerSaveIndex = layer.load(0, {shade: [0.5, '#393D49']});
            },
            success: function (ret) {
                if (ret.code > 0) {
                    return layer.msg(ret.msg, {icon: 5});//失败的表情
                }
                layer.msg('保存成功', {
                    icon: 6,//成功的表情
                    time: 1000 //1秒关闭（如果不配置，默认是3秒）
                }, function () {
                    location.reload();
                })
            },
            complete: function () {
                layer.close(this.layerSaveIndex);
            },
        });
    })

})


var defaultLoginDesc = ''
var defaultGameRule = ''
