/**
 *  作者：yeshengqiang
 *    时间：2016-08-08
 *    描述：客户需求
 */
define(function (require) {
    var app = require('../../../app');

    app.controller('customerCrl', ['$scope', '$http', 'url', function ($scope, $http, url) {

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;               //(1:品牌，2：物流，3：后台)

        //获取所有的省
        $http.get(url+'/location/loadProvince').success(function(data){
            $scope.provinces = data.data;
        });
        //根据省id获取城市
        $scope.getCity = function(province){
            $scope.searchData.city = '';
            $http.get(url+'/location/loadCity?id='+province).success(function(data){
                $scope.cities = data.data;
            })
        };

        $scope.searchData={};
        //获取分页数据
        var currentCheck = function (page, callback) {
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            $http.post(url + '/khrequest/showPageList?loginname='+userInfo.data.loginname, $.extend({},page, param)).success(callback);
        };
        $scope.projectItem = app.get('Paginator').list(currentCheck, 6);


        yMake.fn.autoHeight('.bgWhite', 45);
    }]);
});