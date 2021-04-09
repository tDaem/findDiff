layui.config({
    base: '/plugin/soul-table/ext/'
}).extend({
    soulTable: 'soulTable'
})
layui.use(['table', 'form', 'jquery', 'soulTable'], function () {
    $ = layui.jquery;
    var form = layui.form;
    var table = layui.table;
    var soulTable = layui.soulTable;

    table.render({
        elem: '#gameSceneData',
        url: '/gameSceneDatasByGameId?gameId=' + getQueryVariable('gameId'),
        cellMinWidth: 80,
        page: false,
        rowDrag: {/*trigger: 'row',*/ done: function (obj) {
                // 完成时（松开时）触发
                // 如果拖动前和拖动后无变化，则不会触发此方法
                // console.log(obj.row) // 当前行数据
                console.log(obj.cache) // 改动后全表数据
                // console.log(obj.oldIndex) // 原来的数据索引
                // console.log(obj.newIndex) // 改动后数据索引
                var params = []//排序后的游戏关卡
                for (let i = 0; i < obj.cache.length; i++) {
                    var item = {}
                    var gameGameSceneDataUPK = {}
                    gameGameSceneDataUPK.gameId = getQueryVariable('gameId')
                    gameGameSceneDataUPK.gameSceneDataId = obj.cache[i].id
                    item.gameGameSceneDataUPK = gameGameSceneDataUPK
                    item.orderId = i
                    params.push(item)
                }
                console.log(params)
                $.ajax({
                    url: "/gameGameSceneDatas",
                    type: "post",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(params),
                    success: (ret) => {
                        console.log(ret)
                        if (ret.code > 0 && ret.data)
                            return layer.msg('排序失败！')
                    },
                    complete: () => {
                        // loading.close()
                    }
                })
            }
        },
        cols: [[
            {field: 'id', sort: false, hide: true},
            {field: 'gameSceneName', title: '关卡名', sort: false}
        ]],
        done: function () {
            soulTable.render(this)
        },

    })


});

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

