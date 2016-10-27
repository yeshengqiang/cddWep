/**
 *  作者：yeshengqiang
 *    时间：2016-08-08
 *    描述：账户中心
 */
define(function (require) {
    var app = require('../../../../app');
    //过滤器
    app.filter('typeFormat', function () {
        return function (inp) {
            //类型暂未给出
            var info = "";
            switch (inp) {
                case '1':
                    info = '仓储管理费';
                    break;
                case '2':
                    info = '配送费';
                    break;
                case '3':
                    info = '干线调拨费';
                    break;
                case '4':
                    info = '退货费';
                    break;
            }
            return info;
        };
    });

    //过滤器
    app.filter('statusFormat', function () {
        return function (inp) {
            var info = '';

            switch (inp) {
                case '0':
                    info = '未判断';
                    break;
                case '1':
                    info = '同意';
                    break;
                case '2':
                    info = '拒绝';
                    break;
            }
            return info;
        }
    });
    app.controller('accountCenterCheckCrl', ['$scope', 'url', '$http', '$rootScope','$state', function ($scope, url, $http, $rootScope,$state) {
        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;               //(1:品牌，2：物流，3：后台)
        $scope.parentTitle = '';                        //父标题
        $scope.childTitle = '';                           //子标题
        $scope.brand = false;
        $scope.transport = false;
        if (role == 1) {
            $scope.parentTitle = '我的账单';     //我的账户(品牌)
            $scope.childTitle = '我的账单明细';
            $scope.brand = true;
        } else if (role == 2) {
            $scope.parentTitle = '账户中心';     //账户中心(物流)
            $scope.childTitle = '账户中心明细';
            $scope.transport = true;
        }
        //条件
        $scope.division = [
            {value: 1, name: '仓储管理费'},
            {value: 2, name: '配送费'},
            {value: 3, name: '干线调拨费'},
            {value: 3, name: '退货费'}
        ];
        $scope.searchData = {};

        function billDetail() {
            var param = $rootScope.params;
            $http.post(url + '/bill/checkminnute', $.extend({
                    loginname: userInfo.data.loginname,
                    type: param.types
                }, $scope.searchData))
                .success(function (data) {
                    $scope.searchData = data;
                    console.log($scope.searchData);
                });
        }

        // 导出
        $scope.downloadFile = function () {

            window.location.href = url + '/bill/export?loginname=' + userInfo.data.loginname;
        };

        billDetail();
        //品牌判定
        $scope.decideBrand = function (item) {
            layer.confirm('判定', {
                btn: ['同意', '拒绝'] //按钮
            }, function () {
                layer.closeAll('dialog');
                item.brandedcompany_status = '1';
                $http.post(url + '/bill/setbrandedstatus', {
                    id: item.id,
                    brandedcompany_status:  item.brandedcompany_status
                }).success(function (data) {
                    if(data.code==1){
                        yMake.layer.msg('已确认账单无法修改', {icon: 2});
                        billDetail();
                    }else{
                        yMake.layer.msg('判定成功', {icon: 1});
                        billDetail();
                    }
                }).error(function () {
                    yMake.layer.msg('判定失败', {icon: 2});
                });
            }, function () {
                item.brandedcompany_status = '2';
                $http.post(url + '/bill/setbrandedstatus', {
                    id: item.id,
                    brandedcompany_status: item.brandedcompany_status
                }).success(function (data) {
                    if(data.code==1){
                        yMake.layer.msg('已确认账单无法修改', {icon: 2});
                        billDetail();
                    }else{
                        yMake.layer.msg('判定成功', {icon: 1});
                        billDetail();
                    }
                }).error(function () {
                    yMake.layer.msg('判定失败', {icon: 2});
                });
            });
        };

        //后退
        $scope.back = function(){
            $state.go('main.accountCenter');
        };
        //物流判定
        $scope.decideTransport = function (item) {
            layer.confirm('判定', {
                btn: ['同意', '拒绝'] //按钮
            }, function () {
                layer.closeAll('dialog');
                item.wlcompany_status = '1';
                $http.post(url + '/bill/setbrandedstatus', {
                    id: item.id,
                    wlcompany_status: item.wlcompany_status
                }).success(function (data) {
                    if(data.code==1){
                        yMake.layer.msg('已确认账单无法修改', {icon: 2});
                        billDetail();
                    }else{
                        yMake.layer.msg('判定成功', {icon: 1});
                        billDetail();
                    }
                }).error(function () {
                    yMake.layer.msg('判定失败', {icon: 2});
                });
            }, function () {
                item.wlcompany_status = '2';
                $http.post(url + '/bill/setbrandedstatus', {
                    id: item.id,
                    wlcompany_status: item.wlcompany_status
                }).success(function (data) {
                    if(data.code==1){
                        yMake.layer.msg('已确认账单无法修改', {icon: 2});
                        billDetail();
                    }else{
                        yMake.layer.msg('判定成功', {icon: 1});
                        billDetail();
                    }
                }).error(function () {
                    yMake.layer.msg('判定失败', {icon: 2});
                });
            });
        };
        yMake.fn.autoHeight('.bgWhite', 45);
    }]);
});