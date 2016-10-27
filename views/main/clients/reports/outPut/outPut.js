/**
 *  作者：yeshengqiang
 *    时间：2016-08-09
 *    描述：出入库报表
 */
define(function (require) {
    var app = require('../../../../../app');
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
    app.controller('outPutCrl', ['$scope', 'url', '$http', '$rootScope','$state',function ($scope, url, $http,$rootScope,$state) {
        //条件
        $scope.division = [
            {value: 1, name: '入库'},
            {value: 2, name: '出库'}
        ];
        $scope.searchData = {};

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.transport = false;                        //(物流)
        $scope.brand = false;                          //(品牌)
        $scope.parentTitle = '';                        //父标题
        if (role == 1) {
            $scope.parentTitle = '我的服务商';
            $scope.brand = true;
        } else if (role == 2) {
            $scope.parentTitle = '我的客户';
            $scope.transport = true;
        }

        //日报表查询分页
        $scope.searchData = {};
        var currentCheck = function (page, callback) {
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            $http.post(url + '/outinput/showPageListD', $.extend({}, page, param)).success(callback);
        };
        $scope.searchDadilyPaginator = app.get('Paginator').list(currentCheck, 6);
        console.log($scope.searchDadilyPaginator);
        //月报表查询
        var currentCheck = function (page, callback) {
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            $http.post(url + '/outinput/showPageListM', $.extend({}, page, param)).success(callback);

        };
        $scope.searchMonthlyPaginator = app.get('Paginator').list(currentCheck, 6);
        console.log($scope.searchMonthlyPaginator);
        //状态
        var state = 1;
        $scope.changeState1 = function () {
            state = 1;
            $scope.searchDadilyPaginator._load();
        };
        $scope.changeState2 = function () {
            state = 2;
            $scope.searchMonthlyPaginator._load();
        };
        //搜索

        $scope.search = function () {
            //日报表查询分页
            if($scope.searchData.types==''||$scope.searchData.types==null){
                yMake.layer.msg('请补全搜索类型',{icon:2});
                return;
            }
                switch (+state) {
                    case 1:
                        $scope.searchDadilyPaginator._load();
                        break;
                    default:
                        $scope.searchMonthlyPaginator._load();
                        break;
                }
        };

        //导出
        $scope.downloadFile = function () {
            if($scope.searchData.types==''||$scope.searchData.types==null){
                yMake.layer.msg('请选择出入库类型',{icon:2});
                return;
            }
			var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            param.starttime = param.starttime||'';
            param.endtime = param.endtime||'';
            param.storagename = param.storagename||'';
            layer.confirm("是否下载模板？",
                {btn : ['是','否']},function(){
                    window.location.href = url + '/outinput/export?type=' + '1'+'&starttime='+param.starttime+'&endtime='+param.endtime+'&storagename='+param.storagename;
                    yMake.layer.msg("文件导出成功 ",{icon:1,time:1000});
                    layer.msg("",{time:1});
                });
        };
        //查看日报表明细
        $scope.dailyCheck = function (shdate) {
            $state.go('main.clients.reports.outPut.outPutDailyCheck',{'shdate':shdate});
        };
        //查看月报表明细
        $scope.monthlyCheck = function (m) {
            $state.go('main.clients.reports.outPut.outPutMonthlyCheck',{'m':m});
        };


    }]);
});