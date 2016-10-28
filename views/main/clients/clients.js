/**
 *  作者：yeshengqiang
 *    时间：2016-08-09
 *    描述：服务团队
 */
define(function (require) {
    var app = require('../../../app');

    app.controller('clientsCrl', ['$scope', 'url', '$http', '$location', function ($scope, url, $http, $location) {

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;               //(1:品牌，2：物流，3：后台)
        $scope.services = false;                        //服务项目(物流)
        $scope.demand = false;                          //仓配需求(品牌)
        $scope.parentTitle = '';                        //父标题
        if (role == 1) {
            $scope.parentTitle = '我的服务商';
            $scope.demand = true;
        } else if (role == 2) {
            $scope.parentTitle = '我的客户';
            $scope.services = true;
        }
        $scope.searchData = {};
        //获取所有的省
        $http.get(url + '/location/loadProvince').success(function (data) {
            $scope.provinces = data.data;
        });
        //根据省id获取城市
        $scope.getCity = function (province) {
            $scope.searchData.city = '';
            $scope.searchData.brandedcompanyid = '';
            $http.get(url + '/location/loadCity?id=' + province).success(function (data) {
                $scope.cities = data.data;
            })
        };

        //获取第三方名称
        $scope.getEnterprise = function (city) {
            $scope.searchData.brandedcompanyid = '';
            $http.get(url + '/location/loadDetail?city=' + city + '&loginname=' + userInfo.data.loginname).success(function (data) {
                $scope.enterprises = data.data;
            })
        };


        var currentCheck = function (page, callback) {
            $http.post(url + '/team/showPageList?loginname='+userInfo.data.loginname, $.extend({}, page, $scope.searchData)).success(callback);
        };
        $scope.teams = app.get('Paginator').list(currentCheck, 6);
        /**
         * 导入
         */
        $scope.exportFile = function () {
            //var brandedcompanyid = $('#brandedcompanyid').val();
            //if(brandedcompanyid==''||brandedcompanyid==null||
            //    $scope.cities==''||$scope.cities==null||
            //    $scope.provinces==''||$scope.provinces==null){
            //    yMake.layer.msg('请补全搜索条件',{icon:2});
            //    return;
            //}
            $('#export').modal({backdrop: 'static', keyboard: false});
            $('#upload').empty().append('<div id="zyUpload"></div>');
            $("#zyUpload").zyUpload({
                width: "100%",                 // 宽度
                height: "100%",                 // 宽度
                itemWidth: "140px",                 // 文件项的宽度
                itemHeight: "115px",                 // 文件项的高度
                url: url + "/team/importexcel?loginname="+userInfo.data.loginname+"&cityId="+$scope.searchData.city+"&provinceId="+$scope.searchData.province+"&companyId="+$scope.searchData.brandedcompanyid,  // 上传文件的路径
                fileType: ["xls", "xlsx"],// 上传文件的类型
                fileSize: 51200000,                // 上传文件的大小
                multiple: true,                    // 是否可以多个文件上传
                dragDrop: true,                    // 是否可以拖动上传文件
                tailor: true,                    // 是否可以裁剪图片
                del: true,                    // 是否可以删除文件
                finishDel: false,  				  // 是否在上传文件完成后删除预览
                //paramKey:'types',
                //paramValue:'2',
                /* 外部获得的回调接口 */
                onSelect: function (selectFiles, allFiles) {    // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
                    console.info("当前选择了以下文件：");
                    console.info(selectFiles);
                },
                onDelete: function (file, files) {              // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
                    console.info("当前删除了此文件：");
                    console.info(file.name);
                },
                onSuccess: function (file, response) {          // 文件上传成功的回调方法
                    $('#export').modal('hide');
					var currentCheck = function (page, callback) {
					$http.post(url + '/team/showPageList?loginname='+userInfo.data.loginname, $.extend({}, page, $scope.searchData)).success(callback);
        };
        $scope.teams = app.get('Paginator').list(currentCheck, 6);
                    yMake.layer.msg('导入成功！', {icon: 1})
                },
                onFailure: function (file, response) {          // 文件上传失败的回调方法
                    console.info("此文件上传失败：");
                    console.info(file.name);
                },
                onComplete: function (response) {           	  // 上传完成的回调方法
                    console.info("文件上传完成");
                    console.info(response);
                }
            });
        };
        $scope.brandedcompanyid = '';
        //导出
        $scope.downloadFile = function () {
            var teamInfo = {
                brandedcompanyid: $scope.searchData.brandedcompanyid,
                city: $scope.searchData.city,
                province: $scope.searchData.province
            };
           // var ck = app.get('checkValue');

            //if(!ck.isNull(teamInfo.province).state||
                //!ck.isNull(teamInfo.city).state||
                //!ck.isNull(teamInfo.brandedcompanyid).state){
                //yMake.layer.msg('请补全搜索条件',{icon:2});
              //  return;
            //}
            layer.confirm("是否下载模板？",
                {btn: ['是', '否']}, function () {
                    window.location.href = url + '/team/export?teamInfo=' + JSON.stringify(teamInfo)+'&loginname='+userInfo.data.loginname;
                    yMake.layer.msg("文件导出成功 ", {icon: 1, time: 1000});
                    layer.msg("", {time: 1});
                })
        };
        //模版下载
        $scope.downloadModel = function () {
            layer.confirm("是否下载模板？",
                {btn: ['是', '否']}, function () {
                    window.location.href = url + '/file/download?path=upload/team.xlsx';
                    yMake.layer.msg("文件导出成功 ", {icon: 1, time: 1000});
                    layer.msg("", {time: 1});
                })

        };
    }]);
});