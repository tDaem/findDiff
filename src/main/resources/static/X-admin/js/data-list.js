layui.use(['laydate', 'form', 'jquery', 'table'],
    function () {
        var laydate = layui.laydate,
            form = layui.form,
            table = layui.table,
            layer = layui.layer;
        $ = layui.jquery

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

        form.on('submit(search)',
            function (data) {
                console.log(data);
                //等效效果
                let loading = layer.load(0, {
                    shade: false,
                    time: 2 * 1000
                });
                $.ajax({
                    url: '/records?gameId=' + $('select option:selected').val(),
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: (ret) => {
                        console.log(ret)
                        if (ret.code > 0)
                            return layer.msg('获取数据失败')
                        var cols = []
                        var thead = ret.data.tHead
                        console.log(thead)
                        for (var item in thead) {
                            var field = item;  //key1,key2,key3...
                            var fieldObj = {
                                field: field,
                                title: thead[item]
                            }
                            cols.push(fieldObj);
                        }

                        table.render({
                            elem: '#records',
                            page: false,
                            toolbar: '#toolbarDemo',
                            defaultToolbar: ['exports'],
                            cols: [cols],
                            data: ret.data.tBody
                        });
                    },
                    complete: () => {
                        // loading.close()
                    }
                })
                return false;
            });

    });

/*用户-删除*/
function member_del(obj, id) {
    layer.confirm('确认要删除吗？',
        function (index) {
            //发异步删除数据
            $(obj).parents("tr").remove();
            layer.msg('已删除!', {
                icon: 1,
                time: 1000
            });
        });
}

function delAll(argument) {

    var data = tableCheck.getData();

    layer.confirm('确认要删除吗？' + data,
        function (index) {
            //捉到所有被选中的，发异步进行删除
            layer.msg('删除成功', {
                icon: 1
            });
            $(".layui-form-checked").not('.header').parents('tr').remove();
        });
}