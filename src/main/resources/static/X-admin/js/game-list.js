layui.use(['laydate', 'form', 'jquery'], function () {
    $ = layui.jquery;
    var laydate = layui.laydate;
    var form = layui.form;


    initTable(form)


    // //执行一个laydate实例
    // laydate.render({
    //     elem: '#start' //指定元素
    // });
    //
    // //执行一个laydate实例
    // laydate.render({
    //     elem: '#end' //指定元素
    // });


});

function initTable(form) {
    $.ajax({
        url: '/games',
        type: 'get',
        dataType: 'json',
        success: (res) => {
            if (res.code > 0) {
                return layer.msg('获取列表失败！', {icon: 2});
            }
            let gameScenes = res.data
            $.each(gameScenes, function (i, v) {
                console.log(v)
                $('tbody').append('<tr>' +
                    '                            <td>' +
                    '                                <input type="checkbox" name="id" value="' + v.id + '" lay-skin="primary">' +
                    '                            </td>' +
                    '                            <td>' + v.gameName + '</td>' +
                    '                            <td class="td-manage">' +
                    '                                <a title="编辑" onclick="xadmin.open(\'编辑\',\'game-edit.html?gameId=' + v.id + '\',600,400)"' +
                    '                                   href="javascript:;">' +
                    '                                    <i class="layui-icon">&#xe642;</i>' +
                    '                                </a>' +
                    '                                <a title="关卡排序" onclick="xadmin.open(\'关卡排序\',\'game-scene-sort.html?gameId=' + v.id + '\',600,400)"' +
                    '                                   href="javascript:;">' +
                    '                                    <i class="layui-icon">&#x21c5;</i>' +
                    '                                </a>' +
                    '                                <a title="删除" onclick="game_del(this,' + v.id + ')" href="javascript:;">' +
                    '                                    <i class="layui-icon">&#xe640;</i>' +
                    '                                </a>' +
                    '                            </td>' +
                    '                        </tr>')
            })

            // 监听全选
            form.on('checkbox(checkall)', function (data) {

                if (data.elem.checked) {
                    $('tbody input').prop('checked', true);
                } else {
                    $('tbody input').prop('checked', false);
                }
                form.render('checkbox');
            });
            form.render()
        },
    })
}


/*关卡-删除*/
function game_del(obj, id) {
    layer.confirm('确认要删除吗？（删除此游戏将清空此游戏的游戏记录，如有必要请在数据维护中导出数据！）', function (index) {
        //发异步删除数据
        $.ajax({
            url: '/game/' + id,
            type: 'delete',
            dataType: 'json',
            success: (res) => {
                if (res.code > 0)
                    return layer.msg('删除失败！', {icon: 2});
                $(obj).parents("tr").remove();
                layer.msg('已删除!', {icon: 1, time: 1000});
            }
        })

    });
}

function delAll(argument) {
    var ids = [];

    // 获取选中的id
    $('tbody input').each(function (index, el) {
        if ($(this).prop('checked')) {
            ids.push($(this).val())
        }
    });
    console.log('ids:' + ids)
    layer.confirm('确认要删除吗？（删除此游戏将清空此游戏的游戏记录，如有必要请在数据维护中导出数据！）', function (index) {
        //捉到所有被选中的，发异步进行删除
        $.ajax({
            url: '/games',
            type: 'delete',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(ids),
            success: (res) => {
                console.log(res)
                if (res.code > 0)
                    return layer.msg('删除失败！', {icon: 2});
                layer.msg('删除成功', {icon: 1});
                $(".layui-form-checked").not('.header').parents('tr').remove();
            },
            error: () => {
                layer.msg('删除失败', {icon: 2});
            }
        })
    });
}


