layui.use(['form', 'layer', 'upload', 'jquery'],
    function () {
        $ = layui.jquery;
        var form = layui.form,
            layer = layui.layer,
            upload = layui.upload;

        var selectHtml
        //初始化游戏关卡选择
        $.ajax({
            url: '/gameSceneDatas',
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
                    '           <select name="gameScenes" lay-verify="required" lay-filter="select">' +
                    '               <option value="">-----</option>'

                $.each(ret.data, function (inx, item) {
                    selectHtml +=
                        '<option value="' + item.id + '">' + item.gameSceneName + '</option>'
                })
                selectHtml +=
                    '           </select>' +
                    '       </div>'

                selectHtml +=
                    '</div>' +
                    '   <div class="layui-inline">' +
                    '       <label class="layui-form-label" style="width: 0px"></label>' +
                    '       <div class="layui-input-inline" style="width: 80px;">' +
                    '           <input value="删除" type="button" autocomplete="off" class="layui-btn layui-btn-danger" onclick="deleteRow(this)"/>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'

                //填充已有数据
                var gameId = getQueryVariable('gameId')
                console.log(gameId)
                $.ajax({
                    url: '/game/' + gameId,
                    type: 'get',
                    dataType: 'json',
                    success: (res) => {
                        console.log(res)
                        if (res.code > 0)
                            return layer.msg('加载数据失败', {icon: 2});
                        $('#gameName').val(res.data.gameName)
                        $.each(res.data.gameSceneDatas, function (ind, item) {
                            $('#addGames').append(selectHtml)
                            // form.render()
                            $('select').eq(ind).find('option[value=' + item.id + ']').attr("selected", true)
                        })
                        $('#test').attr('checked', res.data.test)
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

        $('#addGameBtn').click(function () {
            if (selectHtml)
                $('#addGames').append(selectHtml)
            else
                layer.msg("没有游戏关卡，请先新增游戏关卡", {icon: 0})
            form.render()
        })

        //form.render('select');
        form.on('select(select)', function (data) {
            console.log(data)
            let selects = $('select option:selected')
            if (data.value) {
                var cnt = 0
                selects.each(function (index) {
                    if ($(selects[index]).val() == data.value)
                        cnt++
                })
                if (cnt != 1) {
                    $(data.elem).find("option[value='']").prop("selected", true);
                    form.render('select')
                    layer.msg('该关卡已在游戏中存在！')
                }
            }
        });

        //监听多选框点击事件  主要是通过 lay-filter="switchTest"  来监听
        form.on('checkbox(switchTest)', function (data) {
            console.log( data );　　//打印当前选择的信息
            if( data.elem.checked){　　　　　　//判断当前多选框是选中还是取消选中
                layer.confirm("试玩游戏只有一个，如果配置此游戏为试玩游戏，若已配置其他试玩游戏将取消其他游戏为试玩游戏！",{
                    btn: ['确认']
                }, function (index) {
                    layer.close(index)
                });
            }
        });

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
                    url: '/game',
                    type: 'put',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(generateGameJson()),
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

function generateGameJson() {
    let selects = $('select option:selected')

    let game = {}; //声明一个对象
    let gameScenes = []
    game.id = getQueryVariable('gameId')
    game.gameName = $('#gameName').val()
    game.test = $('#test').prop('checked') == true
    selects.each(function (i) {
        gameScenes.push({
            id: $(selects[i]).val()
        })
    })
    game.gameSceneDatas = gameScenes
    console.log(game)
    return game
}


/**
 * 删除坐标
 * @param self 删除按钮
 */
function deleteRow(self, id) {
    if (!id) {
        $(self).parent().parent().parent().remove()
        layer.msg('删除成功');
    } else {
        $.ajax({
            url: '/diffsCoordinate/' + id,
            type: 'delete',
            dataType: 'json',
            complete: (res) => {
                console.log(res)
                $(self).parent().parent().parent().remove()
                layer.msg('删除成功');
            }
        })
    }
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
