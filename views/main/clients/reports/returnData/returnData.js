/**
 *  作者：yeshengqiang
 *	时间：2016-08-09
 *	描述：退货数据
 */
define(function(require){
    var app = require('../../../../../app');

    app.controller('returnDataCrl',['$scope','$http','url','$location',function($scope,$http,url,$location){

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.services = false;                        //服务项目(物流)
        $scope.demand = false;                          //仓配需求(品牌)
        $scope.parentTitle = '';                        //父标题
        if(role==1){
            $scope.parentTitle = '我的服务商';
            $scope.demand = true;
        }else if(role==2){
            $scope.parentTitle = '我的客户';
            $scope.services = true;
        }

        $scope.searchData={};
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
        //分页查询
        function load (){
            var currentCheck = function(page,callback){
                var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url+'/delivery/showPageList', $.extend({loginname:userInfo.data.loginname,type:3},page,parm)).success(callback);
            };
            $scope.deliveries = app.get('Paginator').list(currentCheck,6);
        }
        load();
        $scope.loadDetail = function (id) {
            $location.path('/main/clients/reports/returnData/returnDataDetail/'+id)
        };

        //导出点击事件
        $scope.downloadFile=function(){
			var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            param.fromplace = param.fromplace||'';
            layer.confirm("是否下载模板？",
                {btn : ['是','否']},function(){
                    layer.closeAll('dialog');
                    window.location.href=url +"/delivery/export?type=3&loginname="+userInfo.data.loginname+'&fromplace='+param.fromplace;
                    yMake.layer.msg("导出文件成功 ",{icon:1,time:1000});
                })
        };
        /*$('#dateRange').daterangepicker({
            singleDatePicker: false,
            //timePicker: true, //是否启用时间选择
            timePickerIncrement: 1, //分钟选择的间隔
            format: 'YY-MM-DD', //返回值的格式
            timePicker12Hour: true, //采用24小时计时制
            locale : {
                applyLabel: '确定',
                cancelLabel: '取消',
                format:'YYYY-MM-DD',
                separator: '/'
            }
        });*/
        yMake.fn.autoHeight('.bgWhite',45)
    }]);
});

