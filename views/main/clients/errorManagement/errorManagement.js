/**
 *  作者：cl
 *    时间：2016-08-10
 *    描述：差错管理
 */
define(function(require) {
    var app = require('../../../../app');
    //过滤器
    app.filter('statusFormat', function() {
        return function(inp) {
            var info = '';
            switch (inp) {
                case '0':
                    info = '未判定';
                    break;
                case '1':
                    info = '判定有错';
                    break;
                case '2':
                    info = '判定无错';
                    break;
            }
            return info;
        }
    });
    app.controller('errorManagementCrl', ['$scope', '$http', 'url', function($scope, $http, url) {
        //获取id的全局变量
        var getId;
        //获取非字典数据
        var decData = require('routes/data');
        $scope.searchData = {};
        //初始化
        $scope.mistake = {};
        $scope.mistake.type2 = $scope.searchData.type2 = '';
        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type; //(1:品牌，2：物流，3：后台)
        $scope.services = false; //服务项目(物流)
        $scope.demand = false; //仓配需求(品牌)
        $scope.backstage = false; //后台
        $scope.parentTitle = ''; //父标
        if (role == 1) {
            $scope.parentTitle = '我的服务商';
            $scope.demand = true;
            demFun();
        } else if (role == 2) {
            $scope.parentTitle = '我的客户';
            $scope.services = true;
            serFun();
        } else if (role == 3) {
            $scope.parentTitle = '品质中心';
            $scope.backstage = true;
            bacFun();
        }
        //一级
        $scope.firstdropdownItems = decData.firstData;
        //二级分类
        $scope.seconddropdownItems = decData.secoundData;
        //三级分类
        var threeData = decData.threeData;
        $scope.shooseSecond = function(id) {
            $scope.threedropdownItems = [];
            $scope.searchData.type3 = '';
            console.log(id);
            angular.forEach($scope.seconddropdownItems, function(item) {
                if (item.id == id) {
                    console.log(item.value);
                    $scope.searchData.type2 = item.value;
                }
            });
            angular.forEach(threeData, function(item) {
                if (item.pId == id) {
                    $scope.threedropdownItems.push(item);
                }
            });
        }
        console.log($scope.seconddropdownItems);
        //物流方法
        function serFun() {
            //物流的申述点击事件
            $scope.appeal = function(item) {
                getId = item.id;
                $scope.errorContent.a = item.description;
            };
            //下拉菜单
            $scope.selected = '';
            //ng-model="searchData.type2"
            //物流分页+查询
            var fetchFunction = function(page, callback) {
                var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url + '/mistake/showPageList?loginname=' + userInfo.data.loginname, $.extend({}, page, parm)).success(callback)
            };
            $scope.serData = app.get('Paginator').list(fetchFunction, 6);
            //物流的导出
            $scope.serExport = function() {
                var param = app.get('checkValue').dateRangeFormat($scope.searchData);
                param.starttime = param.starttime || '';
                param.endtime = param.endtime || '';
                param.type1 = param.type1 || '';
                param.type2 = param.type2 || '';
                param.type3 = param.type3 || '';
                window.location.href = url + '/mistake/export?starttime=' + param.starttime + '&endtime=' + param.endtime + '&type1=' + param.type1 + '&type2=' + param.type2 + 'type3=' + param.type3 + '&loginname=' + userInfo.data.loginname;
            };
            //取消按钮点击事件
            $scope.cancle = function() {
                //清空数据
                $scope.errorContent = {};
            };
            //物流的申诉--提交部分
            $scope.errorContent = {};
            $scope.addSer = function() {
                if (($scope.errorContent.a == undefined) || ($scope.errorContent.a == null && $scope.errorContent.b == undefined && $scope.errorContent.b == null)) {
                    yMake.layer.msg('所填内容不能为空!', {
                        icon: '2'
                    });
                    return;
                }
                $http.post(url + '/mistake/update', {
                    appealcontent: $scope.errorContent.b,
                    id: getId
                }).success(function(data) {
                    $scope.serData._load();
                    $scope.errorContent = {};
                    yMake.layer.msg('申诉成功!', {
                        icon: '1',
                        time: 2000
                    });
                }).error(function() {
                    yMake.layer.msg('申诉失败!', {
                        icon: '2',
                        time: 2000
                    });
                });
            };
        }
        $scope.searchData = {};
        //品牌方法
        function demFun() {
            //承运商id的获取
            var urls = []; //资质文件路径
            $http.post(url + '/location/loadDetailbyPact?loginname=' + userInfo.data.loginname).success(function(data) {
                $scope.itms = data.data;
            });
            //模拟数据
            //品牌分页+查询
            var fetchFunction = function(page, callback) {
                var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url + '/mistake/showPageList?loginname=' + userInfo.data.loginname, $.extend({}, page, parm)).success(callback)
            };
            $scope.demData = app.get('Paginator').list(fetchFunction, 6);
            //品牌的上报--打开模态框
            $scope.report = function(item) {
                $('#demandNew').modal('show');
                $scope.mistake = {};
            };
            //上传附件
            $scope.uploadPhoto = function(index) {
                var img = $('#' + index);
                $('#errorPhone').modal({
                    backdrop: 'static'
                });
                $('#upload').empty().append('<div id="zyUpload"></div>');
                $('#zyUpload').zyUpload({
                    width: "100%", // 宽度
                    height: "100%", // 宽度
                    itemWidth: "140px", // 文件项的宽度
                    itemHeight: "115px", // 文件项的高度
                    url: url + "/file/upload?types=1", // 上传文件的路径
                    fileType: ["jpg", "png", "jpeg", "gif"], // 上传文件的类型
                    fileSize: 51200000, // 上传文件的大小
                    multiple: true, // 是否可以多个文件上传
                    dragDrop: true, // 是否可以拖动上传文件
                    tailor: true, // 是否可以裁剪图片
                    del: true, // 是否可以删除文件
                    finishDel: false, // 是否在上传文件完成后删除预览
                    /* 外部获得的回调接口 */
                    onSelect: function(selectFiles, allFiles) { // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
                        if (allFiles.length > 1) {
                            yMake.layer.msg('只能选择一张图片进行上传!', {
                                icon: 0
                            });
                            return;
                        }
                    },
                    onDelete: function(file, files) {},
                    onSuccess: function(file, response) {
                        // 文件上传成功的回调方法
                        var fileName = JSON.parse(response).data,
                            photoUrl = url + '/' + fileName,
                            src = img.children().attr('src');
                        img.empty().append("<img src=" + photoUrl + " width='100%' height='100%'/>");
                        if (urls.length > 0 && urls.indexOf(fileName) != -1) {} else if (src != null) {
                            urls.splice(urls.indexOf(src.substring(src.lastIndexOf('upload'))), 1, fileName);
                        } else {
                            urls.push(fileName);
                        }
                    },
                    onFailure: function(file, response) { // 文件上传失败的回调方法
                    },
                    onComplete: function(response) { // 上传完成的回调方法
                    }
                });
            };
            //新增差错
            $scope.addMistake = function() {
                console.log($scope.mistake);
                $scope.mistake.mistakeImg = '';
                $scope.mistake.loginname = userInfo.data.loginname;
                console.log($scope.mistake);
                for (var i = 0, ii = urls.length; i < ii; i++) {
                    $scope.mistake.mistakeImg += urls[i] + ',';
                }
                $scope.mistake.mistakeImg = $scope.mistake.mistakeImg.replace(/\,$/, '');
                $http.post(url + '/mistake/add', $scope.mistake).success(function(data) {
                    yMake.layer.msg('上传成功！', {
                        icon: 1
                    });
                    $scope.demData._load();
                    $('#demandNew').modal('hide');
                    $scope.mistake = {};
                }).error(function() {
                    yMake.layer.msg('上传出错！', {
                        icon: 2
                    })
                })
            };
            //取消
            $scope.close = function(item) {
                //清空数据
                if (item == 1) {
                    $scope.mistake = {};
                    $('#demandNew').modal('hide');
                } else {
                    $('#demandDetail').modal('hide');
                }
            };
            $scope.demExport = function() {
                var param = app.get('checkValue').dateRangeFormat($scope.searchData);
                param.starttime = param.starttime || '';
                param.endtime = param.endtime || '';
                layer.confirm("是否导出数据？", {
                    btn: ['是', '否']
                }, function() {
                    window.location.href = url + '/mistake/export?starttime=' + param.starttime + '&param.endtime=' + param.endtime + '&loginname=' + userInfo.data.loginname;
                    yMake.layer.msg("导出总结文件成功 ", {
                        icon: 1,
                        time: 1000
                    });
                    layer.msg("", {
                        time: 1
                    });
                })
            };
            //查看详情
            $scope.detailShow = function(item) {
                $scope.detailInfo = {};
                $('#demandDetail').modal('show');
                console.log(item);
                $scope.detailInfo = item;
            };
        }
        //后台方法
        function bacFun() {
            //后台分页
            var fetchFunction = function(page, callback) {
                var param = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url + '/mistake/showPageList?loginname=' + userInfo.data.loginname, $.extend({}, page, param)).success(callback)
            };
            $scope.bacData = app.get('Paginator').list(fetchFunction, 6);
            //判定
            $scope.decide = function(item) {
                layer.confirm('判定', {
                    btn: ['有错', '无错'] //按钮
                }, function() {
                    layer.closeAll('dialog');
                    item.appeal = '1';
                    $http.post(url + '/mistake/updateAppeal', {
                        id: item.id,
                        appeal: item.appeal
                    }).success(function(data) {
                        yMake.layer.msg('判定成功', {
                            icon: 1
                        });
                        $scope.bacData._load();
                    }).error(function() {
                        yMake.layer.msg('判定失败', {
                            icon: 2
                        });
                    });
                }, function() {
                    item.appeal = '2';
                    $http.post(url + '/mistake/updateAppeal', {
                        id: item.id,
                        appeal: item.appeal
                    }).success(function(data) {
                        yMake.layer.msg('判定成功', {
                            icon: 1
                        });
                    }).error(function() {
                        yMake.layer.msg('判定失败', {
                            icon: 2
                        });
                    });
                });
            };
        }
        //后台的导出
        $scope.backExport = function() {
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            param.starttime = param.starttime || '';
            param.endtime = param.endtime || '';
            param.loginname = param.loginname || '';
            param.name = param.name || '';
            layer.confirm("是否导出数据？", {
                btn: ['是', '否']
            }, function() {
                window.location.href = url + '/mistake/backexport1?starttime=' + param.starttime + '&endtime=' + param.endtime + '&loginname=' + userInfo.data.loginname + '&name=' + param.name;
                yMake.layer.msg("文件导出成功 ", {
                    icon: 1,
                    time: 1000
                });
                layer.msg("", {
                    time: 1
                });
            });
        };
    }]);
});