/**
 *  作者：yeshengqiang
 *    时间：2016-08-08
 *    描述：忘记密码
 */
define(function (require) {
    var app = require('../../app');

    app.controller('forgetCrl', ['$scope', '$location', '$state', 'url', '$http',function ($scope, $location, $state,url,$http) {

        //登录
        $scope.forget = function () {
            if ($scope.username == '' || $scope.username == null) {
                yMake.layer.msg('请输入账号',{icon:0});
                return;
            }
            if ($scope.email == '' || $scope.email == null) {
                yMake.layer.msg('请输入邮箱',{icon:0});
                return;
            } else {
                var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
                if (!reg.test($scope.email)) {
                    yMake.layer.msg('邮箱格式不正确',{icon:0});
                    return;
                }
            }
            $http.post(url + '/user/resetpwd',{loginname:$scope.username,email:$scope.email}).success(function(data) {
            if (data.code=='0') {
                yMake.layer.msg(data.message,{icon:0});
            }else if(data.code=='1'){

                yMake.layer.msg(data.message,{icon:0});
            }

            $location.path('/login');
            }).error(function(){
                yMake.layer.msg('找回密码失败，请重试',{icon:0});

            });
        };
    }]);
});