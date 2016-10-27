/**
 *  作者：yeshengqiang
 *	时间：2016-08-09
 *	描述：时效数据
 */
define(function(require){
    var app = require('../../../../../app');

    app.controller('agingDataCrl',['$scope','url','$http',function($scope,url,$http){

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.demand = false;                          //仓配需求(品牌)
        $scope.services = false;                        //服务项目(物流)
        $scope.backManage = false;                      //后台管理(后台)
        $scope.parentTitle = '';                        //一级父标题
        $scope.fatherTitle = '';                        //二级父标题
        $scope.title = '';                              //子标题
        $scope.searchData = {};                         //定义对象 前后台传值
        //1 品牌   我的服务商   运营报表   时效数据
        //2 物流   我的客户  运营报表  时效数据
        //3 后台   品质中心  时效管理
        if(role==1){
            $scope.parentTitle ='我的服务商';
            $scope.fatherTitle ='运营报表';
            $scope.title ='时效数据';
            $scope.demand = true;
            //获取分页数据
            var currentCheck = function (page, callback) {
                var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url + '/efficiency/showPageList?loginname='+userInfo.data.loginname, $.extend({}, page, parm)).success(callback);
            };
            $scope.projectItem = app.get('Paginator').list(currentCheck, 6);
            //导出点击事件
            $scope.outMessage=function(){
				var param = app.get('checkValue').dateRangeFormat($scope.searchData);
				param.starttime = param.starttime||'';
				param.endtime = param.endtime||'';
				param.awb = param.awb||'';
                layer.confirm("是否导出文件？",
                    {btn : ['是','否']},function(){
                        window.location.href=url+'/efficiency/export?loginname='+userInfo.data.loginname+'&starttime='+param.starttime+'&endtime='+param.endtime+'&awb='+param.awb;
                        yMake.layer.msg("导出总结文件成功 ",{icon:1,time:1000});
                        layer.msg("",{time:1});
                    })

            };

        }else if(role==2){
            $scope.parentTitle = '我的客户';
            $scope.fatherTitle ='运营报表';
            $scope.title ='时效数据';
            $scope.services = true;
            //获取分页数据
            var currentCheck = function (page, callback) {
                var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url + '/efficiency/showPageList?loginname='+userInfo.data.loginname, $.extend({}, page, parm)).success(callback);
            };
            $scope.projectItem = app.get('Paginator').list(currentCheck, 6);
            //导出点击事件
            $scope.outMessage=function(){
                layer.confirm("是否下载模板？",
                    {btn : ['是','否']},function(){
                        window.location.href=url+'/efficiency/export?loginname='+userInfo.data.loginname+'&starttime='+param.starttime+'&endtime='+param.endtime+'&awb='+param.awb;
                        yMake.layer.msg("文件导出成功 ",{icon:1,time:1000});
                        layer.msg("",{time:1});
                    });

            };

        }else if(role==3){
            $scope.parentTitle ='品质中心';
            $scope.title ='时效管理';
            $scope.backManage = true;
            //获取分页数据
            var currentCheck = function (page, callback) {
                var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url + '/efficiency/showPageList', $.extend({}, page, parm)).success(callback);
            };
            $scope.projectItem = app.get('Paginator').list(currentCheck, 6);
            //导出点击事件
            $scope.outMessage=function(){
                layer.confirm("是否下载模板？",
                    {btn : ['是','否']},function(){
                        window.location.href=url+'/efficiency/export';
                        yMake.layer.msg("导出总结文件成功 ",{icon:1,time:1000});
                        layer.msg("",{time:1});
                    })


            };

        }

        //获取所有的省
        $http.get(url+'/location/loadProvince').success(function(data){
            $scope.provinces = data.data;
        });
        //根据省id获取城市
        $scope.getCity = function(province){
            $scope.searchData.city = '';
            $http.get(url+'/location/loadCity?id='+province).success(function(data){
                $scope.cities = data.data;
            })
        };
        //根据城市获取第三方
        $scope.getEnterprise = function(city){
            //$scope.searchData.brandedcompanyid = '';
            $http.get(url+'/location/loadDetail?city='+city+'&loginname='+userInfo.data.loginname).success(function(data){
                $scope.division = data.data;
            })
        };

        //导出
        $scope.downloadFile=function(){
            layer.confirm("是否下载模板？",
                {btn : ['是','否']},function(){
                    window.location.href=url +"/efficiency/export?loginname="+userInfo.data.loginname;
                    yMake.layer.msg("导出总结文件成功 ",{icon:1,time:1000});
                    layer.msg("",{time:1});
                })
        };

        //yMake.fn.autoHeight('.bgWhite',45);
    }]);
});