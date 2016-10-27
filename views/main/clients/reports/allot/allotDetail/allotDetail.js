/**
 * Created by chenl on 2016/8/29.
 */
/**
 *  作者：yeshengqiang
 *    时间：2016-08-09
 *    描述：调拨报表明细
 */
define(function (require) {
    var app = require('../../../../../../app');

    app.controller('allotDetailCrl', ['$scope', '$http', 'url', '$rootScope', function ($scope, $http, url, $rootScope) {
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

        var param = $rootScope.params;
        $http.post(url + '/delivery/checkMinute', $.extend({
                loginname: userInfo.data.loginname,
                fromplace: param.fromplace,
                type: 2
            }, $scope.searchData))
            .success(function (data) {
                $scope.searchPaginator = data;
            });


        yMake.fn.autoHeight('.bgWhite', 45)
    }]);
});


