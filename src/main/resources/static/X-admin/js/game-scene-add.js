layui.use(['form', 'layer', 'upload', 'jquery'],
    function () {
        $ = layui.jquery;
        var form = layui.form,
            layer = layui.layer,
            upload = layui.upload;

        //普通图片上传
        var uploadInst = upload.render({
            elem: '#L_image',
            url: '/upload/', //改成您自己的上传接口
            accept: 'images',
            acceptMime: 'image/*',
            before: function (obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) {
                    $('#img').attr('src', result); //图片链接（base64）
                    $('#img').on('click', function previewImg() {
                        var img = new Image();
                        img.src = result;
                        var width, height
                        img.onload = () => {
                            if (img.width > img.height) {
                                width = boxW
                                height = boxH
                            } else {
                                width = boxH
                                height = boxW
                            }
                            var imgHtml = "<img id='testImg' style='width: " + width + ";height: " + height + ";' src='" + result + "' />";
                            //弹出层
                            layer.open({
                                type: 1,
                                shade: 0.8,
                                offset: 'auto',
                                area: [width, height],
                                shadeClose: true,//点击外围关闭弹窗
                                scrollbar: false,//不现实滚动条
                                title: "图片预览", //不显示标题
                                content: imgHtml, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                                cancel: function () {
                                    //layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', { time: 5000, icon: 6 });
                                }
                            });
                            $('#testImg').click(function (ev) {
                                var x = ev.offsetX
                                var y = ev.offsetY
                                layer.msg("X=" + x + "\nY=" + y);
                            })
                        }
                    })
                });
            },
            done: function (res) {
                console.log(res)
                //如果上传失败
                if (res.code > 0) {
                    return layer.msg('上传失败', {icon: 2});
                } else {
                    $('input[name=imgPath]').val(res.data)
                }
            },
            error: function () {
                //演示失败状态，并实现重传
                var demoText = $('#demoText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
            }
        });

        //增加坐标的点击事件
        $('#addCoordinate').click(function () {
            $('#diffsCoordinates').append(diffHtml)
        })

        //表单验证
        form.verify({
            imgPath: function (value, item) {
                console.log(value)
                if (value.length === 0) {
                    return '请选择一张图片';
                }
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
                    url: '/gameSceneData',
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(generateGameSceneJson()),
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
function generateGameSceneJson() {
    let Xs = $('input[name=X]')//所有X坐标
    let Ys = $('input[name=Y]')//所有Y坐标

    let gameScene = {}; //声明一个对象
    let diffsCoordinates = []
    gameScene.gameSceneName = $('#L_name').val()
    gameScene.imgPath = $('#imgPath').val()
    Xs.each(function (i) {
        diffsCoordinates.push({
            x: $(Xs[i]).val(),
            y: $(Ys[i]).val()
        })
    })
    gameScene.diffsCoordinates = diffsCoordinates
    console.log(gameScene)
    return gameScene
}

/**
 * 删除坐标
 * @param self 删除按钮
 */
function deleteRow(self) {
    $(self).parent().parent().parent().remove()
}

var diffHtml = '<div>' +
    '                       <div class="layui-inline">' +
    '                            <label class="layui-form-label" style="width: 10px">X：</label>' +
    '                            <div class="layui-input-inline" style="width: 80px;">' +
    '                                <input lay-verify="required" type="number" name="X" autocomplete="off" class="layui-input">' +
    '                            </div>' +
    '                        </div>' +
    '                        <div class="layui-inline">' +
    '                            <label class="layui-form-label" style="width: 10px">Y：</label>' +
    '                            <div class="layui-input-inline" style="width: 80px;">' +
    '                                <input lay-verify="required" type="number" name="Y" autocomplete="off" class="layui-input">' +
    '                            </div>' +
    '                        </div>' +
    '                        <div class="layui-inline">' +
    '                            <label class="layui-form-label" style="width: 0px"></label>' +
    '                            <div class="layui-input-inline" style="width: 80px;height: 38px;">' +
    '                                <input value="删除" type="button" autocomplete="off" class="layui-btn layui-btn-danger" onclick="deleteRow(this)"/>' +
    '                            </div>' +
    '                        </div>' +
    '                    </div>'