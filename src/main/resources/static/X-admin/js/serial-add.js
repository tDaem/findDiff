layui.use(['form', 'layer', 'upload', 'jquery'],
    function () {
        $ = layui.jquery;
        var form = layui.form,
            layer = layui.layer,
            upload = layui.upload;

        var selectHtml

        $.ajax({
            url: '/games',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            success: (ret) => {
                console.log(ret)
                if (ret.code > 0)
                    return layer.msg('获取游戏列表失败', {icon: 0})
                if (ret.data.length === 0)
                    layer.msg("还没有游戏，请先新增游戏", {icon: 0})

                selectHtml = '<div>' +
                '   <div class="layui-inline">' +
                '       <div class="layui-input-inline">' +
                '           <select name="gams" lay-verify="required">'

                $.each(ret.data, function (inx, item) {
                    selectHtml +=
                                '<option value="' + item.id + '">' + item.gameName + '</option>'
                })

                selectHtml +=
                            '</select>' +
                '       </div>'

                $('#game').append(selectHtml)
            },
            complete: () => {
                // loading.close()
                form.render()
            }
        })

        //监听提交
        form.on('submit(add)',
            function (data) {
                console.log(data);
                //等效效果
                let loading = layer.load(0, {
                    shade: false,
                    time: 2 * 1000
                });
                $.ajax({
                    url: '/serial',
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(generateSerialJson()),
                    success: (ret) => {
                        console.log(ret)
                        if (ret.code > 0)
                            return layer.msg('新增失败')
                        layer.alert("增加成功", {
                                icon: 6
                            },
                            function () {
                                //关闭当前frame
                                xadmin.close();
                                // 可以对父窗口进行刷新
                                xadmin.father_reload();
                            });
                    },
                    complete: () => {
                        // loading.close()
                    }
                })
                return false;
            });

    });


/**
 * 生成游戏关卡提交到后台的json数据
 * @returns {{}}
 */
function generateSerialJson() {
    let selects = $('select option:selected')//所有X坐标

    let serial = {}; //声明一个对象
    let game = {}
    serial.serialNum = $('#serialNum').val()
    game.id = $(selects[0]).val()
    serial.game = game
    console.log(serial)
    return serial
}

