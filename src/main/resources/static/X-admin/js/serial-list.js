layui.use(['laydate', 'form', 'jquery'], function () {
    $ = layui.jquery;
    var laydate = layui.laydate;
    var form = layui.form;


    initTable(form)

});

function initTable(form) {
    $.ajax({
        url: '/serials',
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
                    '                            <td>' + v.serialNum + '</td>' +
                    '                            <td>' + (v.game ? v.game.gameName : '') + '</td>' +
                    '                            <td>' + (v.serialStatus === 'NOT_STARTED' ? '未使用' : '已使用') + '</td>' +
                    '                            <td class="td-manage">' +
                    '                                <a title="编辑" onclick="xadmin.open(\'编辑\',\'serial-edit.html?serialId=' + v.id + '\',600,400)"' +
                    '                                   href="javascript:;">' +
                    '                                    <i class="layui-icon">&#xe642;</i>' +
                    '                                </a>' +
                    '                                <a title="删除" onclick="serial_del(this,' + v.id + ')" href="javascript:;">' +
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
function serial_del(obj, id) {
    layer.confirm('确认要删除吗？(如果该序列号有游戏记录将会一并删除，如有需要请先导出数据！)', function (index) {
        //发异步删除数据
        $.ajax({
            url: '/serial/' + id,
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

function bindGames() {
    var ids = [];

    // 获取选中的id
    $('tbody input').each(function (index, el) {
        if ($(this).prop('checked')) {
            ids.push($(this).val())
        }
    });
    console.log('ids:' + ids)
    if (ids.length === 0)
        return layer.msg("请至少选择一个序号！",{icon: 5})
    console.log(ids)
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
                layer.msg("还没有正式游戏，请先新增游戏", {icon: 0})

            selectHtml = '<div>' +
                '   <div class="layui-inline">' +
                '       <div class="layui-input-inline">' +
                '           <select name="games" lay-verify="required">'
            $.each(ret.data, function (inx, item) {
                selectHtml +=
                    '<option value="' + item.id + '">' + item.gameName + '</option>'
            })
            selectHtml +=
                '</select>' +
                '       </div>'

            layer.open({
                title: '选择绑定的游戏',
                closeBtn: 0,
                shadeClose: true,
                content: selectHtml,
                yes: function(index, layero){
                    var gameId = $('select option:selected').val()
                    console.log(gameId)
                    $.ajax({
                        url: '/serials',
                        type: 'put',
                        data: {
                            serialIds: ids,
                            gameId: gameId
                        },
                        dataType: 'json',
                        success: (res) => {
                            if (res.code > 0)
                                return layer.msg('绑定失败！')
                            layer.close(index)
                            return layer.msg('绑定成功！')
                        }
                    })
                },
                end: () => {
                    location.reload()
                }
            });
        },
        complete: () => {
        }
    })
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
    layer.confirm('确认要删除吗？(如果该序列号有游戏记录将会一并删除，如有需要请先导出数据！)', function (index) {
        //捉到所有被选中的，发异步进行删除
        $.ajax({
            url: '/serials',
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


function resetSerial() {
    layer.confirm('此操作将会清空所有的游戏记录数据，并将序号重置为未使用状态，确定重置序号吗？', function (index) {
        $.ajax({
            url: '/resetSerials',
            type: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.code > 0)
                    return layer.msg('操作失败！', {icon: 2});
                layer.msg('重置成功', {icon: 1});
                location.reload()
            }
        })
    });

}