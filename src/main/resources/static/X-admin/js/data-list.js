layui.config({
    base: '/layui_exts/', // 配置一个可访问地址
}).extend({
    excel: 'excel',
});
// layui.use(['excel'], function () {
//     layui.excel.exportExcel([[1, 2, 3]], '表格导出.xlsx', 'xlsx')
// })
layui.use(['laydate', 'form', 'jquery', 'table', 'excel'],
    function () {
        var laydate = layui.laydate,
            form = layui.form,
            table = layui.table,
            layer = layui.layer,
            excel = layui.excel;
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
                    time: 1200
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
                        for (var item in thead) {
                            var field = item;  //key1,key2,key3...
                            var fieldObj = {
                                field: field,
                                title: thead[item]
                            }
                            cols.push(fieldObj);
                        }
                        console.log(cols)
                        console.log(ret.data.tBody)
                        table.render({
                            elem: '#records',
                            page: false,
                            limit: ret.data.tBody.length,
                            toolbar: '#toolbarDemo',
                            defaultToolbar: ['print'],
                            cols: [cols],
                            data: ret.data.tBody
                        });

                        //监听头工具栏事件
                        table.on('toolbar(records)', function (obj) {
                            var checkStatus = table.checkStatus(obj.config.id),
                                data = checkStatus.data; //获取选中的数据
                            switch (obj.event) {
                                case 'export':
                                    exportFile('records')
                                    break;
                            }
                        });

                        /**
                         * by yutons
                         * Array.from() 非常方便的将一个类数组的集合 ==》 数组，直接使用数组身上的方法。例如：常用的map，foreach…
                         * 但是，问题来了，IE不识别Array.from这个方法。所以写了它兼容IE的写法。
                         */
                        if (!Array.from) {
                            Array.from = function (el) {
                                return Array.apply(this, el);
                            }
                        }

                        //表格导出
                        function exportFile(id) {
                            //根据传入tableID获取表头
                            var headers = $("div[lay-id=" + id + "] .layui-table-box table").get(0);
                            var htrs = Array.from(headers.querySelectorAll('tr'));
                            var titles = {};
                            for (var j = 0; j < htrs.length; j++) {
                                var hths = Array.from(htrs[j].querySelectorAll("th"));
                                for (var i = 0; i < hths.length; i++) {
                                    var clazz = hths[i].getAttributeNode('class').value;
                                    if (clazz != ' layui-table-col-special' && clazz != 'layui-hide') {
                                        //排除居左、具有、隐藏字段
                                        //修改:默认字段data-field+i,兼容部分数据表格中不存在data-field值的问题
                                        titles['data-field' + i] = hths[i].innerText;
                                    }
                                }
                            }
                            //根据传入tableID获取table内容
                            var bodys = $("div[lay-id=" + id + "] .layui-table-box table").get(1);
                            var btrs = Array.from(bodys.querySelectorAll("tr"))
                            var bodysArr = new Array();
                            for (var j = 0; j < btrs.length; j++) {
                                var contents = {};
                                var btds = Array.from(btrs[j].querySelectorAll("td"));
                                for (var i = 0; i < btds.length; i++) {
                                    for (var key in titles) {
                                        //修改:默认字段data-field+i,兼容部分数据表格中不存在data-field值的问题
                                        var field = 'data-field' + i;
                                        if (field === key) {
                                            //根据表头字段获取table内容字段
                                            contents[field] = btds[i].innerText;
                                        }
                                    }
                                }
                                bodysArr.push(contents)
                            }
                            //将标题行置顶添加到数组
                            bodysArr.unshift(titles);
                            //导出excel
                            excel.exportExcel({
                                sheet1: bodysArr
                            }, '测试数据' + new Date().toLocaleString() + '.xlsx', 'xlsx');
                        }
                    },
                    complete: () => {

                    }
                })
                return false;
            });

    });

function record_del() {
    layer.confirm('确认要清除吗？',
        function (index) {
            //发异步删除数据
            $.ajax({
                url: '/record?gameId=' + $('select option:selected').val(),
                type: 'delete',
                dataType: 'json',
                success: (res) => {
                    if (res.code > 0) {
                        return layer.msg('清除失败！', {icon: 2});
                    }
                    layer.open({
                        title: '提示',
                        closeBtn: 0,
                        shadeClose: false,
                        content: '已清除',
                        yes: function (index, layero) {
                            layer.close(index)
                        },
                        end: () => {
                            location.reload()
                        }
                    });
                },
                error: (res) => {
                    return layer.msg('清除失败！', {icon: 2});
                }
            })

        });
}

function delAllRecord() {

    layer.confirm('确认要删除所有数据吗？',
        function (index) {
            //捉到所有被选中的，发异步进行删除
            $.ajax({
                url: '/records',
                type: 'delete',
                dataType: 'json',
                success: (res) => {
                    if (res.code > 0) {
                        return layer.msg('清除失败！', {icon: 2});
                    }
                    layer.open({
                        title: '提示',
                        closeBtn: 0,
                        shadeClose: false,
                        content: '已清除',
                        yes: function (index, layero) {
                            layer.close(index)
                        },
                        end: () => {
                            location.reload()
                        }
                    });
                },
                error: (res) => {
                    return layer.msg('清除失败！', {icon: 2});
                }
            })

        });
}