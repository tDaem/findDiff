layui.use(['laydate', 'form', 'jquery'], function () {
    $ = layui.jquery;
    var laydate = layui.laydate;
    var form = layui.form;


    initTable(form)


    //执行一个laydate实例
    laydate.render({
        elem: '#start' //指定元素
    });

    //执行一个laydate实例
    laydate.render({
        elem: '#end' //指定元素
    });


});

function initTable(form) {
    $.ajax({
        url: '/gameSceneDatas',
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
                    '                            <td>' + v.gameSceneName + '</td>' +
                    '                            <td class="td-status">' +
                    '                                <span class="layui-btn layui-btn-normal layui-btn-mini">预览</span>' +
                    '                            </td>' +
                    '                            <td class="td-manage">' +
                    '                                <a title="编辑" onclick="xadmin.open(\'编辑\',\'game-scene-edit.html?gameSceneId=' + v.id + '\',600,400)"' +
                    '                                   href="javascript:;">' +
                    '                                    <i class="layui-icon">&#xe642;</i>' +
                    '                                </a>' +
                    '                                <a title="删除" onclick="gameScene_del(this,' + v.id + ')" href="javascript:;">' +
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
function gameScene_del(obj, id) {
    layer.confirm('确认要删除吗？', function (index) {
        //发异步删除数据
        $.ajax({
            url: '/gameSceneData/' + id,
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
    layer.confirm('确认要删除吗？', function (index) {
        //捉到所有被选中的，发异步进行删除
        $.ajax({
            url: '/gameSceneDatas',
            type: 'post',
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


