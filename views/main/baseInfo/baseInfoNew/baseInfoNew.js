/**
 *  作者：yeshengqiang
 *    时间：2016-08-08
 *    描述：基础信息
 */
define(function(require) {
    var app = require('../../../../app');
    app.controller('baseInfoNewCrl', ['$scope', 'url', '$http', '$location', function($scope, url, $http, $location) {
        $scope.title = '新增服务项目';
        var titleInfo = '新增', //新增还是修改标题
            userInfo = JSON.parse(sessionStorage.getItem('userInfo')), //用户信息
            tabList = $('#tabList'), //菜单列表
            addOrUpdate = 'add', //新增还是修改地址
            serviceProject = JSON.parse(sessionStorage.getItem('serviceProject')), //跳转状态
            checkValue = app.get('checkValue'); //验证
        if (serviceProject.item != null) {
            $scope.title = '修改服务项目';
            titleInfo = '修改';
            addOrUpdate = 'update';
        }
        switch (serviceProject.type) {
            case 0:
                tabList.find('a[href="#storage"]').tab('show');
                if (serviceProject.item != null) {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.storage = serviceProject.item;
                            console.log($scope.storage);
                            var file1 = serviceProject.item.storageform;
                            var fileType = file1.substring(file1.lastIndexOf('.') + 1);
                            var fileName = file1.substring(file1.lastIndexOf('upload') + 10);
                            if (fileType == 'exe' || fileType == 'xlsx' || fileType == 'xls') {
                                $('#file1').empty().append("<img src='bower_components/zyupload/lib/images/fileType/xls1.png' width='100%' height='100%'/>")
                            } else if (fileType == 'txt') {
                                $('#file1').empty().append("<img src='bower_components/zyupload/lib/images/fileType/txt1.png' width='100%' height='100%'/>")
                            }
                            $scope.fileTitle1 = fileName;
                            var img1 = $('#img1'),
                                img2 = $('#img2'),
                                img3 = $('#img3'),
                                img4 = $('#img4'),
                                arr = $scope.storage.storageimg.split(',');
                            if (arr[0] != null) img1.empty().append('<img src="' + url + '/' + arr[0] + '" width="100%" height="100%"/>');
                            if (arr[1] != null) img2.empty().append('<img src="' + url + '/' + arr[1] + '" width="100%" height="100%"/>');
                            if (arr[2] != null) img3.empty().append('<img src="' + url + '/' + arr[2] + '" width="100%" height="100%"/>');
                            if (arr[3] != null) img4.empty().append('<img src="' + url + '/' + arr[3] + '" width="100%" height="100%"/>');
                        });
                    }, 100);
                }
                break;
            case 1:
                tabList.find('a[href="#city"]').tab('show');
                if (serviceProject.item != null) {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.cityDelivery = serviceProject.item || {};
                            console.log($scope.cityDelivery);
                            var file2 = (serviceProject.item || {}).trunkimg;
                            var fileType = file2.substring(file2.lastIndexOf('.') + 1);
                            var fileName = file2.substring(file2.lastIndexOf('upload') + 10);
                            if (fileType == 'exe' || fileType == 'xlsx' || fileType == 'xls') {
                                $('#file2').empty().append("<img src='bower_components/zyupload/lib/images/fileType/xls1.png' width='100%' height='100%'/>")
                            } else if (fileType == 'txt') {
                                $('#file2').empty().append("<img src='bower_components/zyupload/lib/images/fileType/txt1.png' width='100%' height='100%'/>")
                            }
                            $scope.fileTitle2 = fileName;
                            if ($scope.cityDelivery.delivery != null && $scope.cityDelivery.delivery != '') {
                                var arr = $scope.cityDelivery.delivery.split('~');
                                $scope.cityDelivery.deliveryStart = arr[0];
                                $scope.cityDelivery.deliveryEnd = arr[1];
                            }
                        });
                    }, 100);
                }
                break;
            case 2:
                tabList.find('a[href="#trunk"]').tab('show');
                if (serviceProject.item != null) {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.trunkLine = serviceProject.item || {};
                            console.log($scope.trunkLine);
                            console.log($scope.trunkLine.trunkimg);
                            var file3 = (serviceProject.item || {}).trunkimg;
                            var fileType = file3.substring(file3.lastIndexOf('.') + 1);
                            var fileName = file3.substring(file3.lastIndexOf('upload') + 10);
                            if (fileType == 'exe' || fileType == 'xlsx' || fileType == 'xls') {
                                $('#file3').empty().append("<img src='bower_components/zyupload/lib/images/fileType/xls1.png' width='100%' height='100%'/>")
                            } else if (fileType == 'txt') {
                                $('#file3').empty().append("<img src='bower_components/zyupload/lib/images/fileType/txt1.png' width='100%' height='100%'/>")
                            }
                            $scope.fileTitle3 = fileName;
                            if ($scope.trunkLine.delivery != null && $scope.trunkLine.delivery != '') {
                                var arr = $scope.trunkLine.delivery.split('~');
                                $scope.trunkLine.deliveryStart = arr[0];
                                $scope.trunkLine.deliveryEnd = arr[1];
                            }
                        });
                    }, 100);
                }
                break;
            default:
                return;
        }
        $scope.tabChange = function() {
            $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                // 获取已激活的标签页的名称
                var activeTab = $(e.target).text();
                // 获取前一个激活的标签页的名称
                //var previousTab = $(e.relatedTarget).text();
                if (activeTab == '仓储服务') {
                    sessionStorage.setItem('serviceProject', JSON.stringify({
                        type: 0
                    }));
                } else if (activeTab == '城配服务') {
                    sessionStorage.setItem('serviceProject', JSON.stringify({
                        type: 1
                    }));
                } else if (activeTab == '干线服务') {
                    sessionStorage.setItem('serviceProject', JSON.stringify({
                        type: 2
                    }));
                }
            });
        };
        /*setTimeout(function () {
         $scope.tabChange();
         },1000);*/
        //添加图片
        var urls = []; //资质文件路径
        $scope.uploadPhoto = function(index) {
            var img = $('#' + index);
            $scope.titles = '上传图片';
            $('#uploadFile').modal({
                backdrop: 'static'
            });
            $('#upload').empty().append('<div id="zyUpload"></div>');
            $("#zyUpload").zyUpload({
                width: "100%", // 宽度
                height: "100%", // 宽度
                itemWidth: "140px", // 文件项的宽度
                itemHeight: "115px", // 文件项的高度
                url: url + "/file/upload", // 上传文件的路径
                fileType: ["jpg", "png"], // 上传文件的类型
                fileSize: 51200000, // 上传文件的大小
                multiple: true, // 是否可以多个文件上传
                dragDrop: true, // 是否可以拖动上传文件
                tailor: true, // 是否可以裁剪图片
                del: true, // 是否可以删除文件
                finishDel: false, // 是否在上传文件完成后删除预览
                /* 外部获得的回调接口 */
                onSelect: function(selectFiles, allFiles) { // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
                    console.info("当前选择了以下文件：");
                    console.info(selectFiles);
                },
                onDelete: function(file, files) { // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
                    console.info("当前删除了此文件：");
                    console.info(file.name);
                },
                onSuccess: function(file, response) { // 文件上传成功的回调方法
                    // 文件上传成功的回调方法
                    var fileName = JSON.parse(response).data,
                        photoUrl = url + '/' + fileName,
                        src = img.children().attr('src');
                    if (index == 'storage') {
                        $scope.storage.storageform = fileName;
                        return;
                    } else if (index == 'city') {
                        $scope.cityDelivery.trunkimg = fileName;
                        return;
                    } else if (index == 'trunkLine') {
                        $scope.trunkLine.trunkimg = fileName;
                        return;
                    }
                    img.empty().append("<img src=" + photoUrl + " width='100%' height='100%'/>");
                    /*else if(index=='carInfoFile1'){
                     $scope.cityDelivery.trunkimg = fileName;
                     }else if(index=='carInfoFile0'){
                     $scope.trunkLine.trunkimg = fileName;
                     }else{
                     if (urls.length > 0 && urls.indexOf(fileName) != -1) {

                     } else if (src != null) {
                     urls.splice(urls.indexOf(src.substring(src.lastIndexOf('upload'))), 1, fileName)
                     } else {
                     urls.push(fileName)
                     }
                     img.empty().append("<img src=" + photoUrl + " width='100%' height='100%'/>");
                     }*/
                },
                onFailure: function(file, response) { // 文件上传失败的回调方法
                    console.info("此文件上传失败：");
                    console.info(file.name);
                },
                onComplete: function(response) { // 上传完成的回调方法
                    console.info("文件上传完成");
                    console.info(response);
                }
            });
        };
        //上传文件
        $scope.uploadFile = function(index) {
            $scope.titles = '上传文件';
            //var img = $('#'+index);
            $('#uploadFile').modal({
                backdrop: 'static'
            });
            $('#upload').empty().append('<div id="zyUpload"></div>');
            $("#zyUpload").zyUpload({
                width: "100%", // 宽度
                height: "100%", // 宽度
                itemWidth: "140px", // 文件项的宽度
                itemHeight: "115px", // 文件项的高度
                url: url + "/file/upload", // 上传文件的路径
                fileType: ["txt", "xls", "doc", "xlsx"], // 上传文件的类型
                fileSize: 51200000, // 上传文件的大小
                multiple: true, // 是否可以多个文件上传
                dragDrop: true, // 是否可以拖动上传文件
                tailor: true, // 是否可以裁剪图片
                del: true, // 是否可以删除文件
                finishDel: false, // 是否在上传文件完成后删除预览
                /* 外部获得的回调接口 */
                onSelect: function(selectFiles, allFiles) { // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
                    console.info("当前选择了以下文件：");
                    console.info(selectFiles);
                },
                onDelete: function(file, files) { // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
                    console.info("当前删除了此文件：");
                    console.info(file.name);
                },
                onSuccess: function(file, response) { // 文件上传成功的回调方法
                    // 文件上传成功的回调方法
                    var fileName = JSON.parse(response).data;
                    if (index == 'storage') {
                        $scope.storage.storageform = fileName;
                        fileName = fileName.substring(fileName.lastIndexOf('upload') + 10);
                        var fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
                        if (fileType == 'exe' || fileType == 'xlsx' || fileType == 'xls') {
                            $('#file1').empty().append("<img src='bower_components/zyupload/lib/images/fileType/xls1.png' width='100%' height='100%'/>")
                        } else if (fileType == 'txt') {
                            $('#file1').empty().append("<img src='bower_components/zyupload/lib/images/fileType/txt1.png' width='100%' height='100%'/>")
                        }
                        $scope.$apply(function() {
                            $scope.fileTitle1 = fileName;
                        });
                        //return;
                    } else if (index == 'city') {
                        $scope.cityDelivery.trunkimg = fileName;
                        fileName = fileName.substring(fileName.lastIndexOf('upload') + 10);
                        var fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
                        if (fileType == 'exe' || fileType == 'xlsx' || fileType == 'xls') {
                            $('#file2').empty().append("<img src='bower_components/zyupload/lib/images/fileType/xls1.png' width='100%' height='100%'/>")
                        } else if (fileType == 'txt') {
                            $('#file2').empty().append("<img src='bower_components/zyupload/lib/images/fileType/txt1.png' width='100%' height='100%'/>")
                        }
                        $scope.$apply(function() {
                            $scope.fileTitle2 = fileName;
                        });
                        //return;
                    } else if (index == 'trunkLine') {
                        $scope.trunkLine.trunkimg = fileName;
                        fileName = fileName.substring(fileName.lastIndexOf('upload') + 10);
                        var fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
                        if (fileType == 'exe' || fileType == 'xlsx' || fileType == 'xls') {
                            $('#file3').empty().append("<img src='bower_components/zyupload/lib/images/fileType/xls1.png' width='100%' height='100%'/>")
                        } else if (fileType == 'txt') {
                            $('#file3').empty().append("<img src='bower_components/zyupload/lib/images/fileType/txt1.png' width='100%' height='100%'/>")
                        }
                        $scope.$apply(function() {
                            $scope.fileTitle3 = fileName;
                        });
                    }
                },
                onFailure: function(file, response) { // 文件上传失败的回调方法
                    console.info("此文件上传失败：");
                    console.info(file.name);
                },
                onComplete: function(response) { // 上传完成的回调方法
                    console.info("文件上传完成");
                    console.info(response);
                }
            });
        };
        //获取所有的省
        $http.get(url + '/location/loadProvince').success(function(data) {
            $scope.provinces = data.data;
        });
        //根据省id获取城市
        $scope.getCity = function(province) {
            $http.get(url + '/location/loadCity?id=' + province).success(function(data) {
                $scope.cities = data.data;
            })
        };
        //新增仓储服务
        $scope.storage = {};
        $scope.addStorage = function() {
            if (checkValue.isObjNull($scope.storage)) {
                yMake.layer.msg('请先填写信息！', {
                    icon: 2
                });
                return;
            }
            if (!checkValue.isNull($scope.storage.storagecost)) {
                yMake.layer.msg('请输入仓储管理费', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.storage.location)) {
                yMake.layer.msg('请输入地址', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.storage.area)) {
                yMake.layer.msg('请输入服务面积', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.storage.stevedore)) {
                yMake.layer.msg('请输入装卸费', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.storage.operatecost)) {
                yMake.layer.msg('请输入操作费', {
                    icon: 2
                });
                return
            } else if (!checkValue.isTel($scope.storage.phone, true)) {
                yMake.layer.msg('请输入联系方式', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.storage.returncost)) {
                yMake.layer.msg('请输入退货费', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.storage.storageform)) {
                yMake.layer.msg('请输入仓库考察表费', {
                    icon: 2
                });
                return
            }
            $scope.storage.loginname = userInfo.data.loginname;
            //$scope.storage.storageimg = urls.join(',');
            urls = [];
            var img1 = getImgSrc('#img1'),
                img2 = getImgSrc('#img2'),
                img3 = getImgSrc('#img3'),
                img4 = getImgSrc('#img4');
            if (img1 != null) urls.push(img1);
            if (img2 != null) urls.push(img2);
            if (img3 != null) urls.push(img3);
            if (img4 != null) urls.push(img4);
            $scope.storage.storageimg = urls.join(',');
            $http.post(url + '/storage/' + addOrUpdate, $scope.storage).success(function(data) {
                if (data.code == 0) {
                    yMake.layer.msg(titleInfo + '仓储服务成功！', {
                        icon: 1
                    });
                    //$scope.storage = {};
                    $location.path('main/baseInfo');
                } else {
                    yMake.layer.msg(titleInfo + '仓储服务失败！', {
                        icon: 2
                    })
                }
            }).error(function() {
                yMake.layer.msg(titleInfo + '仓储服务出错！', {
                    icon: 2
                })
            })
        };
        //新增城配服务
        $scope.cityDelivery = {};
        $scope.addCityDelivery = function() {
            if (!checkValue.isNull($scope.cityDelivery.deliveryStart)) {
                yMake.layer.msg('请输入日配送量', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.cityDelivery.deliveryEnd)) {
                yMake.layer.msg('请输入日配送量', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.cityDelivery.minniment)) {
                yMake.layer.msg('请输入起送量', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.cityDelivery.truckno)) {
                yMake.layer.msg('请输入自有车辆', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.cityDelivery.price)) {
                yMake.layer.msg('请输入单价', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.cityDelivery.extracost)) {
                yMake.layer.msg('请输入多点费', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.cityDelivery.trunkimg)) {
                yMake.layer.msg('请输入车辆信息图', {
                    icon: 2
                });
                return
            }
            $scope.cityDelivery.type = 1;
            $scope.cityDelivery.delivery = $scope.cityDelivery.deliveryStart + '~' + $scope.cityDelivery.deliveryEnd;
            $scope.cityDelivery.loginname = userInfo.data.loginname;
            $http.post(url + '/dryline/' + addOrUpdate, $scope.cityDelivery).success(function(data) {
                if (data.code == 0) {
                    yMake.layer.msg(titleInfo + '城配服务成功！', {
                        icon: 1
                    });
                    $scope.cityDelivery = {};
                    $location.path('main/baseInfo');
                } else {
                    yMake.layer.msg(titleInfo + '城配服务失败！', {
                        icon: 2
                    })
                }
            }).error(function() {
                yMake.layer.msg(titleInfo + '城配服务出错！', {
                    icon: 2
                })
            })
        };
        //新增干线服务
        $scope.trunkLine = {};
        $scope.addTrunkLine = function() {
            if (!checkValue.isNull($scope.trunkLine.deliveryStart)) {
                yMake.layer.msg('请输入日配送量', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.trunkLine.deliveryEnd)) {
                yMake.layer.msg('请输入日配送量', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.trunkLine.minniment)) {
                yMake.layer.msg('请输入起送量', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.trunkLine.truckno)) {
                yMake.layer.msg('请输入自有车辆', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.trunkLine.price)) {
                yMake.layer.msg('请输入单价', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.trunkLine.extracost)) {
                yMake.layer.msg('请输入多点费', {
                    icon: 2
                });
                return
            } else if (!checkValue.isNull($scope.trunkLine.trunkimg)) {
                yMake.layer.msg('请输入车辆信息图', {
                    icon: 2
                });
                return
            }
            $scope.trunkLine.type = 0;
            $scope.trunkLine.delivery = $scope.trunkLine.deliveryStart + '~' + $scope.trunkLine.deliveryEnd;
            $scope.trunkLine.loginname = userInfo.data.loginname;
            $http.post(url + '/dryline/' + addOrUpdate, $scope.trunkLine).success(function(data) {
                if (data.code == 0) {
                    yMake.layer.msg(titleInfo + '干线服务成功！', {
                        icon: 1
                    });
                    $scope.trunkLine = {};
                    $location.path('main/baseInfo');
                } else {
                    yMake.layer.msg(titleInfo + '干线服务失败！', {
                        icon: 2
                    })
                }
            }).error(function() {
                yMake.layer.msg(titleInfo + '干线服务出错！', {
                    icon: 2
                })
            })
        };
        //取消
        $scope.cancel = function() {
            //sessionStorage.removeItem('serviceProject');
            $location.path('main/baseInfo');
        };
        //放大图片
        $scope.zoomInp = function() {
            var src1 = $('#img1').find('img').attr('src');
            var src2 = $('#img2').find('img').attr('src');
            var src3 = $('#img3').find('img').attr('src');
            var src4 = $('#img4').find('img').attr('src');
            var src = [];
            src.push(src1);
            src.push(src2);
            src.push(src3);
            src.push(src4);
            console.log(src);
            //arguments[1] == null ? src = src : src = url + arguments[1];
            if (src == null || src == '') {
                yMake.layer.msg('暂无图片', {
                    icon: 0
                });
                return;
            }
            yMake.an.mark(src, url + '/upload');
        };
        //获取图片路径
        function getImgSrc(selector) {
            var src = $(selector).find('img').attr('src'),
                projectName = url.substr(url.lastIndexOf('/'));
            if (src == '' || src == null) {
                return;
            }
            src = src.substr(src.indexOf(projectName) + projectName.length + 1);
            return src;
        }
        //获取浏览器的高度
        //yMake.fn.autoHeight('.bgWhite',45);
    }]);
});