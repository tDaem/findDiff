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


var defaultLoginDesc = '您好!欢迎您参与本次游戏，为了确保本次游戏顺利进行，接下来请在右侧登录框中按要求填写信息;登录之后，请结合文字和视频，认真听清游戏规则,如果没有明白规则，请举手示意，请务必确保清楚游戏规则后再开始。'
var defaultGameRule = '此次游戏为“找不同”，正式游戏共包括多组图片，每组两张，每组的两张图片均存在5处不同。本次游戏会根据你最终共找出的不同个数给予奖励，请务必仔细比较各组中的两张图片，务必尽最大努力找出两张图片中的不同之处。\n' +
    '\n' +
    '当你每找到一处不同时，请在图片上点击你所找到的不同之处，点击后，两张图片上会在你所点击的地方出现红色圈圈，然后请你在屏幕下方点击“确定”按钮，系统自动做出判断，如果系统判断你点击的是正确的，红色圈圈会继续留在屏幕上，如果系统判断你点击的是错误的，则红色圈圈会消失；再请你继续寻找下一处不同，完成游戏。\n' +
    '\n' +
    '值得注意的是，每组图片均有5处不同，在你5处不同全找到之后，系统会自动进入下组图片，当你已经完全尽自己最大能力和努力完成，也可选择“跳过”关卡，进入下组图片。游戏图片全完成之后，即结束游戏。\n'
