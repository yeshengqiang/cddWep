/**
 *  作者：yeshengqiang
 *    时间：2016-08-09
 *    描述：配送报表
 */
define(function (require) {
    var app = require('../../../../app');

    app.controller('reportsCrl', ['$scope', 'url', '$http', '$location', function ($scope, url, $http, $location) {

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
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

        //获取所有的省
        $http.get(url + '/location/loadProvince').success(function (data) {
            $scope.provinces = data.data;
        });
        //根据省得id获取城市
        $scope.getCity = function (province) {
            $scope.searchData.city = '';
            $http.get(url + '/location/loadCity?id=' + province).success(function (data) {
                $scope.cities = data.data;
            })
        };


        $scope.getEnterprise = function (city) {
            //$scope.searchData.brandedcompanyid = '';
            $http.get(url + '/location/loadDetail?city=' + city + '&loginname=' + userInfo.data.loginname).success(function (data) {
                $scope.division = data.data;
            })
        };

        //初始化
        $scope.searchData = {};
        //分页查询
        var currentCheck = function (page, callback) {
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            $http.post(url + '/delivery/showPageList', $.extend({
                loginname: userInfo.data.loginname,
                type: 1
            }, page, param)).success(callback);
        };
        $scope.reports = app.get('Paginator').list(currentCheck, 6);

        //导出
        $scope.downloadFile = function () {
			 var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            param.fromplace = param.fromplace||'';
            layer.confirm("是否导出文件？",
                {btn: ['是', '否']}, function () {
                    window.location.href=url +'/delivery/export?loginname='+userInfo.data.loginname+'&type=1'+'&fromplace='+param.fromplace;
                    yMake.layer.msg("文件导出成功 ", {icon: 1, time: 1000});
                    layer.msg("", {time: 1});

                })
        };

        //查看明细
        $scope.loadDetail = function (id) {
            $location.path('main/clients/reports/reportsDetail/' + id)
        };
        yMake.fn.autoHeight('.bgWhite', 45)
    }]);
});
