/**
 *  作者：cl
 *  时间：2016-08-10
 *  描述：投诉管理
 */
define(function(require) {
    var app = require('../../../../../app');
    app.filter('tFormat', function() {
        return function(inp) {
            var info = "";
            switch (inp) {
                case '1':
                    info = '服务';
                    break;
                case '2':
                    info = '安全';
                    break;
                case '3':
                    info = '操作';
                    break;
                case '4':
                    info = '其他';
                    break;
            }
            return info;
        };
    });
    app.controller('complaintDetailCrl', ['$scope', '$http', 'url', function($scope, $http, url) {
        //$scope.title='投诉明细';
        $scope.searchData = {};
        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取分页数据
        var currentCheck = function(page, callback) {
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            $http.post(url + '/complaint/showPageList?loginname=' + userInfo.data.loginname, $.extend({}, page, param)).success(callback);
        };
        $scope.complaintDetail = app.get('Paginator').list(currentCheck, 6);
        //导出
        $scope.downloadFile = function() {
            var teamInfo = {
                //brandedcompanyid: $scope.brandedcompanyid,
                //city: $scope.city,
                //province: $scope.province
            };
            layer.confirm("是否下载模板？", {
                btn: ['是', '否']
            }, function() {
                window.location.href = url + '/team/export?teamInfo=' + JSON.stringify(teamInfo);
                yMake.layer.msg("导出总结文件成功 ", {
                    icon: 1,
                    time: 1000
                });
                layer.msg("", {
                    time: 1
                });
            });
        };
        //查看详情
        $scope.lookSome = function(item) {
            $('#complaintDetail').modal('show');
            $scope.detailInfo = item;
        };
        yMake.fn.autoHeight('.bgWhite', 45);
    }]);
});