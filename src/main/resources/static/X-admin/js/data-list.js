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
                            return layer.msg('获取失败失败')

                        for(var p in ret.data){
                            cols.push()
                        }

                        table.render({
                            elem: '#records',
                            page: true //开启分页
                            , toolbar: '#tabletoolbar'
                            , defaultToolbar: []
                            , cols: [[ //表头
                                {title: '序号', type: 'numbers', rowspan: 2}
                                , {field: 'date', title: '时间', align: 'center', sort: 'true', rowspan: 2, width: 150}
                                , {title: '产出品种', align: 'center', colspan: cols.length}
                                , {field: 'total', title: '合计', align: 'center', sort: 'true', rowspan: 2, width: 100}]
                                , cols]
                            , done: function (res, curr, count) {
                                var tablemaindom = $("table[id=tablelist]").next().find(".layui-table-body.layui-table-main");
                                $.each(res.data, function (index, value) {
                                    var total = 0;
                                    //开始组装数据 这里是给单元格赋值
                                    $.each(value.listinfo, function (indexinfo, valueinfo) {
                                        tablemaindom.find("tr[data-index=" + value.LAY_TABLE_INDEX + "]").find(
                                            "td[data-field=" + valueinfo.productid + "]").find(
                                            "div").text(valueinfo.outputplanvalue);
                                        total += valueinfo.outputplanvalue;
                                    });
                                    //合计
                                    tablemaindom.find("tr[data-index=" + value.LAY_TABLE_INDEX + "]").find(
                                        "td[data-field=total]").find(
                                        "div").text(total);
                                });

                            }
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