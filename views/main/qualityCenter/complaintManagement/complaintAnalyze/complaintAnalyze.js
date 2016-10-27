/**
 *  作者：cl
 *    时间：2016-08-10
 *    描述：差错管理
 */
define(function (require) {
    var app = require('../../../../../app');

    app.controller('complaintAnalyzeCrl', ['$scope', '$http', 'url', function ($scope, $http, url) {
        $scope.title = '投诉数据分析';

        //初始化
        $scope.searchData = {};

        //获取分页数据
        var currentCheck = function (page, callback) {
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            console.log(param);
            $http.post(url + '/complaint/query2Tj', $.extend({}, page, param)).success(callback);
        };
        $scope.complaintAnalyze = app.get('Paginator').list(currentCheck, 6);
        console.log($scope.complaintAnalyze );
        //导出
        $scope.downloadFile = function () {
            var teamInfo = {
                //brandedcompanyid: $scope.brandedcompanyid,
                //city: $scope.city,
                //province: $scope.province
            };
            layer.confirm("是否下载模板？",
                {btn: ['是', '否']}, function () {
                    window.location.href = url + '/complaint/export2Tj?teamInfo=' + JSON.stringify(teamInfo);
                    yMake.layer.msg("导出总结文件成功 ", {icon: 1, time: 1000});
                    layer.msg("", {time: 1});
                });

        };
        yMake.fn.autoHeight('.bgWhite', 45);
    }]);
});