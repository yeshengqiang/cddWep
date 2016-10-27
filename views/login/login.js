/**
 *  作者：yeshengqiang
 *	时间：2016-08-08
 *	描述：登录页面
 */
define(function(require){
	var app = require('../../app');

	app.controller('loginCrl',['$scope', '$rootScope','$location', 'url','$http',function($scope,$rootScope,$location,url,$http){

        //默认选中
        $scope.rememberPassword = true;
		//获取登录信息
		$scope.loginInfo=localStorage.getItem('loginInfo');
		if($scope.loginInfo!=null){
			$scope.loginInfo = JSON.parse($scope.loginInfo);

			$scope.username = $scope.loginInfo.loginname;
			$scope.password = $scope.loginInfo.password;
			$scope.rememberPassword = true;
		}
		//登录
		$scope.login = function(){
            var username = app.get('checkValue').isNull($scope.username);
            var password = app.get('checkValue').isNull($scope.password);
			if(!username.state){
				yMake.layer.msg('请输入用户名', {icon:2});
				return
			}
			if(!password.state){
				yMake.layer.msg('请输入密码', {icon:2});
				return
			}
			var loginInfo = {
                loginname:$scope.username,
				password:$scope.password
			};
            //保存信息
            if($scope.rememberPassword){
                //移除之前已经存在的，保存现在的新信息
                if(localStorage.getItem('loginInfo')){
                    localStorage.removeItem('loginInfo');
                }
                localStorage.setItem('loginInfo',JSON.stringify(loginInfo));
            }
            $http({
                method:"GET",
                url: url+'/user/login',
                params:{
                    "loginname":$scope.username,
                    "password":$scope.password
                }
            }).success(function(data){
                if(data.code=='0'){
                    //登陆信息保存在
                    sessionStorage.setItem('userInfo',JSON.stringify(data));
                    yMake.layer.msg(data.message,{icon:1});
                    if(data.data.type=='3'){
                        $location.path('/main/vipManagement');
                    }else{
                        $location.path('/main/baseInfo');
                    }
                }else if(data.code=='2'){
                    yMake.layer.msg(data.message, {icon:2});
                }else{
                    yMake.layer.msg(data.message, {icon:2});
                }
            }).error(function(){
                yMake.layer.msg('登录失败，请稍候重试！',{icon:2});
            });

		};
	}]);
});