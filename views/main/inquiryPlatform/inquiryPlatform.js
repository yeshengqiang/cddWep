/**
 *  作者：yeshengqiang
 *    时间：2016-08-08
 *    描述：询价平台
 */
define(function (require) {
    var app = require('../../../app');

    app.controller('inquiryPlatformCrl', ['$scope', 'url', '$http', function ($scope, url, $http) {
        //$scope.division = {"北京市": ["东城区", "延庆县"], "上海市": ["黄浦区", "南汇区", "奉贤区", "崇明县"], "天津市": ["和平区", "静海县", "蓟县"]};
        //获取所有的省
        $http.get(url+'/location/loadProvince').success(function(data){
            $scope.provinces = data.data;
        });
        //根据省id获取城市
        $scope.getCity = function(province){
            $scope.searchData.city = '';
            $scope.searchData.brandedcompanyid = '';
            $http.get(url+'/location/loadCity?id='+province).success(function(data){
                $scope.cities = data.data;
            })
        };


        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

        //分页
        var fetchFunction = function (page, callback) {
			var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            $http.post(url + '/storage/checkPrice', $.extend({}, page, $scope.searchData)).success(callback)
        };
        $scope.searchPaginator = app.get('Paginator').list(fetchFunction, 6);
        console.log($scope.searchPaginator);
        //下载
        $scope.download = function (fileName) {
            window.location.href = url + '/file/download?downloadType=2&path=' + fileName;
        };

        //查看仓库图片
        $scope.storageImgCheck = function (item) {

            //$('#demandNew').modal({backdrop: 'static', keyboard: false});
            //$scope.modalTitle = '仓库图片';
            $http.post(url + '/storage/lookImg?id=' + item.id).success(function (data) {
                $scope.img = data.data.split(",");
                yMake.an.mark($scope.img);

                yMake.layer.msg('查看成功!', {icon: '1', time: 2000});
            }).error(function () {
                yMake.layer.msg('查看失败!', {icon: '2', time: 2000});
            })
        };


        //查看资质
        $scope.companyImgCheck = function (item) {

            $http.post(url + '/user/certificate?id=' + item.wlcompanyid).success(function (data) {
                $scope.img = data.data.split(",");
                yMake.an.mark($scope.img);
                yMake.layer.msg('查看成功!', {icon: '1', time: 2000});
            }).error(function () {
                yMake.layer.msg('查看失败!', {icon: '2', time: 2000});
            })
        };
        yMake.fn.autoHeight('.bgWhite', 45);
    }]);
});
