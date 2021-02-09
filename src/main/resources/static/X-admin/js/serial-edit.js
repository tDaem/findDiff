layui.use(['form', 'layer', 'upload', 'jquery'],
    function () {
        $ = layui.jquery;
        var form = layui.form,
            layer = layui.layer,
            upload = layui.upload;

        var selectHtml
        //初始化游戏关卡选择
        $.ajax({
            url: '/games',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            success: (ret) => {
                console.log(ret)
                if (ret.code > 0)
                    return layer.msg('获取游戏关卡列表失败', {icon: 0})
                if (ret.data.length === 0)
                    layer.msg("没有游戏关卡，请先新增游戏关卡", {icon: 0})

                selectHtml =
                    '<div>' +
                    '   <div class="layui-inline">' +
                    '       <div class="layui-input-inline">' +
                    '           <select name="games" lay-verify="required">'
                $.each(ret.data, function (inx, item) {
                    selectHtml += '<option value="' + item.id + '">' + item.gameName + '</option>'
                })
                selectHtml +=
                    '           </select>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'

                //填充已有数据
                var serialId = getQueryVariable('serialId')
                console.log(serialId)
                $.ajax({
                    url: '/serial/' + serialId,
                    type: 'get',
                    dataType: 'json',
                    success: (res) => {
                        console.log(res)
                        if (res.code > 0)
                            return layer.msg('加载数据失败', {icon: 2});
                        $('#serialNum').val(res.data.serialNum)

                        $('#game').append(selectHtml)
                        if (res.data.game)
                            $('option[value=' + res.data.game.id + ']').attr("selected", true)
                        form.render()
                    },
                    error: (res) => {
                        console.log(res)
                        return layer.msg('加载数据失败', {icon: 2});
                    }
                })
            },
            complete: () => {
                // loading.close()
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
                    type: 'put',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(generateSerialJson()),
                    success: (ret) => {
                        console.log(ret)
                        if (ret.code > 0)
                            return layer.msg('更新失败')
                        layer.alert("更新成功", {
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

function generateSerialJson() {
    let selects = $('select option:selected')

    let serial = {}; //声明一个对象
    let game = {}
    serial.id = getQueryVariable('serialId')
    serial.serialNum = $('#serialNum').val()
    game.id = $(selects[0]).val()
    serial.game = game
    console.log(serial)
    return serial
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}
