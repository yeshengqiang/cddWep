/**
 *  作者：yeshengqiang
 *    时间：2016-08-08
 *    描述：合同管理--新增合同
 */
define(function (require) {
    var app = require('../../../../app');

    app.controller('addClauseCrl', ['$scope', '$location', '$http', 'url', function ($scope, $location, $http, url) {

        //初始化
        $scope.addInfo = {pactscan: '', extrapact: ''};
        var urls = [];//资质文件路径
        $scope.uploadPhoto = function (index, type) {
            var img = $('#' + index);
            $('#up').modal({backdrop: 'static'});
            $('#upload').empty().append('<div id="zyUpload"></div>');
            $('#zyUpload').zyUpload({
                width: "100%",                 // 宽度
                height: "100%",                 // 宽度
                itemWidth: "140px",                 // 文件项的宽度
                itemHeight: "115px",                 // 文件项的高度
                url: url + "/file/upload?types=" + type,  // 上传文件的路径
                fileType: ["jpg", "png", "jpeg", "gif"],// 上传文件的类型
                fileSize: 51200000,                // 上传文件的大小
                multiple: true,                    // 是否可以多个文件上传
                dragDrop: true,                    // 是否可以拖动上传文件
                tailor: true,                    // 是否可以裁剪图片
                del: true,                    // 是否可以删除文件
                finishDel: false,  				  // 是否在上传文件完成后删除预览
                /* 外部获得的回调接口 */
                onSelect: function (selectFiles, allFiles) {    // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
                },
                onDelete: function (file, files) {
                },
                onSuccess: function (file, response) {
                    // 文件上传成功的回调方法
                    var fileName = JSON.parse(response).data, photoUrl = url + '/' + fileName, src = img.children().attr('src');
                    img.empty().append("<img src=" + photoUrl + " width='100%' height='100%'/>");
                    if (type == 1) {
                        $scope.addInfo.pactscan += photoUrl.replace(url, '') + ',';
                    } else {
                        $scope.addInfo.extrapact += photoUrl.replace(url, '') + ',';
                    }
                },
                onFailure: function (file, response) {          // 文件上传失败的回调方法
                },
                onComplete: function (response) {           	  // 上传完成的回调方法
                }
            })
        };

        //品牌公司下拉框
        $http.post(url + '/user/select2Combo', {type: 1}).success(function (data) {
            $scope.brandedname = data.data;
            for(var i = 0,ii = data.data.length; i < ii; i++){
                console.log(data.data[i].name);
            }

            console.log(data);
        });

        //物流公司下拉框
        $http.post(url + '/user/select2Combo', {type: 2}).success(function (data) {
            $scope.wlname = data.data;
        });

        //新增
        $scope.add = function () {
            //验证
            //app.get('checkValue')
            var parm = app.get('checkValue').searchData1($scope.addInfo);
            //新增接口
            $http.post(url + '/pact/add', parm).success(function (data) {
                $scope.addInfo = {};
                $location.path('/main/clauseManagement');
            }).error(function () {
                yMake.layer.msg('新增失败', {icon: 2});
            });

        };

        //取消
        $scope.cancel = function () {
            $scope.addInfo = {};
            $location.path('/main/clauseManagement');
        };

    }]);
});


