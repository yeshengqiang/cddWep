/**
 *  作者：yeshengqiang
 *    时间：2016-08-09
 *    描述：出入库报表
 */
define(function (require) {
    var app = require('../../../../../../app');
    //过滤器
    app.filter('typeFormat', function () {
        return function (inp) {
            //类型暂未给出
            var info = "";
            switch (inp) {
                case '1':
                    info = '入库';
                    break;
                case '2':
                    info = '出库';
                    break;
            }
            return info;
        };
    });

    app.controller('outPutDailyCheckCrl', ['$scope', 'url', '$http', '$rootScope', function ($scope, url, $http, $rootScope) {

        $scope.searchData = {};

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.parentTitle = '';                        //父标题
        if (role == 1) {
            $scope.parentTitle = '我的服务商';
        } else if (role == 2) {
            $scope.parentTitle = '我的客户';
        }

        var param = $rootScope.params;
        $http.post(url + '/outinput/checkMinute?shdate', $.extend({shdate: param.shdate}, $scope.searchData))
            .success(function (data) {
                $scope.searchData = data;
            });


        //yMake.fn.autoHeight('.bgWhite',45);
    }]);
});