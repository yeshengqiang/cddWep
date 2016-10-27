/**
 *  作者：yeshengqiang
 *    时间：2016-08-08
 *    描述：账户中心
 */
define(function (require) {
    var app = require('../../../app');
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


    app.controller('accountCenterCrl', ['$scope', 'url', '$http', '$rootScope','$state', function ($scope, url, $http,$rootScope,$state) {

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;               //(1:品牌，2：物流，3：后台)
        $scope.brand = false;                        //(物流)
        $scope.transport = false;                    //(品牌)
        $scope.parentTitle = '';                        //父标题
        if (role == 1) {
            $scope.parentTitle = '我的账单';     //我的账户(品牌)
            $scope.brand = true;
        } else if (role == 2) {
            $scope.parentTitle = '账户中心';     //账户中心(物流)
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

        //获取分页数据
        var currentCheck = function (page, callback) {
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            $http.post(url + '/bill/showPageList?loginname='+userInfo.data.loginname, $.extend({}, page,param)).success(callback);
        };
        $scope.bill = app.get('Paginator').list(currentCheck, 6);
        console.log($scope.bill);
        $scope.searchPaginator =$scope.bill;


        //获取所有的省
        $http.get(url + '/location/loadProvince').success(function (data) {
            $scope.provinces = data.data;
        });
        //根据省id获取城市
        $scope.getCity = function (province) {
            $scope.searchData.city = '';
            $http.get(url + '/location/loadCity?id=' + province).success(function (data) {
                $scope.cities = data.data;
            })
        };
        //本月应收款
        $http.get(url + '/bill/currenttotalsum?loginname=' + userInfo.data.loginname).success(function (data) {
            if (data.code == 0) {
                $scope.currenttotalsum = 0;
            }
            else {
                $scope.currenttotalsum = data.data;
            }
        });
        //累计应收款
        $http.get(url + '/bill/totalsum?loginname=' +userInfo.data.loginname).success(function (data) {
            if (data.code == 0) {
                $scope.totalsum = 0;
            }
            else {
                $scope.totalsum = data.data;
            }
        });

        //查看
        $scope.billCheck = function (type) {
            $state.go('main.accountCenter.accountCenterCheck',{'types':type});
        };

        // 导出
        $scope.downloadFile = function () {
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            param.starttime = param.starttime||'';
            param.endtime = param.endtime||'';
            param.type = param.type||'';

            layer.confirm("是否下载模板？",
                {btn : ['是','否']},function(){
                    window.location.href = url + '/bill/export?loginname=' +
                    userInfo.data.loginname+'&starttime='+param.starttime+
                    '&endtime='+param.endtime+
                    '&type='+param.type;

                    yMake.layer.msg("文件导出成功 ",{icon:1,time:1000});
                    layer.msg("",{time:1});
                });
        };
        yMake.fn.autoHeight('.bgWhite',45);
    }]);
});