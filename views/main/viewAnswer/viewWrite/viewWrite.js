/**
 * 作者：makaiqin
 * 时间：2016-08-10
 * 描述：意见填写
 */
define(function (require) {
    var app = require('../../../../app');

    app.controller('viewWriteCrl', ['$scope', '$rootScope', 'url', '$http', '$location', function ($scope, $rootScope, url, $http, $location) {
        //$scope.title = '意见填写';
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        var param = $rootScope.feedback;
        $scope.feedbackInfo = {};

        $scope.feedbackInfo.wlname = param.wlname;
        if (param.type == 1) {
            $scope.feedbackInfo.type = "类型1";
        } else if (param.type == 2) {
            $scope.feedbackInfo.type = "类型2";
        } else if (param.type == 3) {
            $scope.feedbackInfo.type = "类型2";
        }
        $scope.feedbackInfo.detail = param.detail;

        //保存
        $scope.save = function () {
            $scope.backInfo = {};
            $scope.backInfo.id=param.id;
            $scope.backInfo.reply=$scope.reply;
            var reply = app.get('checkValue').isNull($scope.backInfo.reply);
            if (!reply.state) {
                yMake.layer.msg('请输入回复信息', {icon: 0});
                return;
            }
            $http.post(url + "/suggestion/reply" ,$scope.backInfo).success(function (data) {
                $location.path('/main/viewAnswer');
                yMake.layer.msg('回复成功!', {icon: '1', time: 2000});
            }).error(function () {
                yMake.layer.msg('回复失败!', {icon: '2', time: 2000});
            });
        };

        //取消
        $scope.cancle = function () {
            //切记清空数据
            $scope.reply = {};
            $location.path('/main/viewAnswer');
        };

    }
    ]);
});
