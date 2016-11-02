/**
 *  作者：yeshengqiang
 *	时间：2016-08-23
 *	描述：理赔管理
 */
define(function(require){
	var app = require('../../../../app');

	//过滤器
	app.filter('statusFormat',function(){
		return function(inp){
			var info = '';
			switch (inp){
				case '1':
					info = '未支付';
					break;
				case '2':
					info = '已支付';
					break;
			}
			return info;
		}
	});

	app.controller('claimManagementCrl',['$scope','$http','url',function($scope,$http,url){

		//查看
		$scope.lookSome=function(item){
			$scope.khrequest={};
			$scope.khrequest.a=item.sbdate;
			$scope.khrequest.b=item.type;
			$scope.khrequest.c=item.wlname;
			$scope.khrequest.d=item.brandedname;
			$scope.khrequest.e=item.claimno;
			$scope.khrequest.f=item.status;
			$scope.khrequest.g=item.bill;
			$scope.khrequest.h=item.value;
		};

		var check = app.get('checkValue');

		//初始化
		$scope.searchData = {};
        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.services = false;                        //服务项目(物流)
        $scope.demand = false;                          //仓配需求(品牌)
		$scope.backTitle = false;                       //品质中心(后台)
        $scope.parentTitle = '';                        //父标题
        $scope.title = '';                              //子标题
        if(role==1){
			$scope.parentTitle = '我的服务商';
			$scope.title = '保险理赔';
            $scope.services = true;
			//获取分页数据
			var currentCheck = function (page, callback) {
                console.log($scope.searchData);
				var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
				$http.post(url + '/claim/showPageList?loginname='+userInfo.data.loginname, $.extend({},page, parm)).success(callback);
			};
			$scope.projectItem = app.get('Paginator').list(currentCheck, 6);
			console.log('图片');
			console.log($scope.projectItem);

			//文件名
			var fileName;
			//文件路径
			var fileUrl;

			var addItem = {};
			//上传
			$scope.uploadFiles = function (item,index) {
				console.log(1321321);
				addItem = item;
				
				var img = $('#' + index);

				$('#uploadPhoto').modal({backdrop: 'static'});
				$('#upload').empty().append('<div id="zyUpload"></div>');
				$("#zyUpload").zyUpload({
					width: "100%",                 // 宽度
					height: "100%",                 // 宽度
					itemWidth: "140px",                 // 文件项的宽度
					itemHeight: "115px",                 // 文件项的高度
					url: url + "/file/upload?type=1",  // 上传文件的路径
					fileType: ["jpg", "png", "txt", "xlsx", "exe", "pdf", "doc"],// 上传文件的类型
					fileSize: 51200000,                // 上传文件的大小
					multiple: true,                    // 是否可以多个文件上传
					dragDrop: true,                    // 是否可以拖动上传文件
					tailor: true,                    // 是否可以裁剪图片
					del: true,                    // 是否可以删除文件
					finishDel: false,  				  // 是否在上传文件完成后删除预览
					/* 外部获得的回调接口 */
					onSelect: function (selectFiles, allFiles) {    // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
					},
					onDelete: function (file, files) {              // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
					},
					onSuccess: function (file, response) {          // 文件上传成功的回调方法
						fileUrl = JSON.parse(response).data;
						fileName = fileUrl.substring(fileUrl.lastIndexOf('upload') + 10);
						var fileType = fileUrl.substring(fileUrl.lastIndexOf('.') + 1);
						$scope.fileTitle = fileName;
						$scope.$apply(function () {
							$scope.projectItem.certificate = fileUrl;
						});
					},
					onFailure: function (file, response) {          // 文件上传失败的回调方法
						console.info("此文件上传失败：");
					},
					onComplete: function (response) {           	  // 上传完成的回调方法
						console.info("文件上传完成");
					
					}
				});
			};

			//确定
			$scope.savePage=function(){

				$scope.upInfo = {};
				$scope.upInfo.certificate = fileUrl;
				$scope.upInfo.id = addItem.id || '';
				$scope.upInfo.value = $scope.menoyValue;
				console.log($scope.upInfo);
				if(!check.isNull($scope.upInfo.value).state){
					yMake.layer.msg("请输入货物价值 ", {icon: 2, time: 1000});
					return;
				}else if(!check.isNull($scope.upInfo.certificate).state){
					yMake.layer.msg("请上传理赔文件 ", {icon: 2, time: 1000});
					return;
				}
				$http.post(url+'/claim/upload',$scope.upInfo).success(function(data){
					yMake.layer.msg("文件上传成功 ", {icon: 1, time: 1000});
					$scope.upInfo = {};
					$('#uploadPhoto').modal('hide');
					layer.closeAll();
				})
			}


			//下载
			$scope.download = function (fileName) {
				layer.confirm("是否下载文件？",
					{btn: ['是', '否']}, function () {
						window.location.href = url + '/file/download?downloadType=2&path=' + fileName;
						yMake.layer.msg("文件下载成功 ", {icon: 1, time: 1000});
						layer.msg("", {time: 1});
					})
			};

        }else if(role==2){
			$scope.parentTitle = '我的客户';
			$scope.title = '理赔管理';
			$scope.demand = true;
			//获取分页数据
			var currentCheck = function (page, callback) {
				var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
				$http.post(url + '/claim/showPageList?loginname='+userInfo.data.loginname, $.extend({},page, parm)).success(callback);
			};
			$scope.projectItem = app.get('Paginator').list(currentCheck, 6);
			console.log($scope.projectItem);
			//导出点击事件
			$scope.outMessage=function(){
				window.location.href=url+'/claim/export1';
			};
			//下载
			$scope.download = function (fileName) {
				layer.confirm("是否下载文件？",
					{btn: ['是', '否']}, function () {
						window.location.href = url + '/file/download?downloadType=2&path=' + fileName;
						yMake.layer.msg("文件下载成功 ", {icon: 1, time: 1000});
						layer.msg("", {time: 1});
					})
			};
		}else if(role==3){
			$scope.parentTitle = '品质中心';
			$scope.title = '理赔管理';
			$scope.backTitle = true;
			//获取分页数据
			var currentCheck = function (page, callback) {
				var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
				$http.post(url + '/claim/showPageList?loginname='+userInfo.data.loginname, $.extend({}, page, parm)).success(callback);
			};
			$scope.projectItem = app.get('Paginator').list(currentCheck, 6);
			console.log($scope.projectItem);


		}

		//修改状态
		$scope.changeState = function(item){
			var claim = {};
			claim.id = item.id ||'';
			var info = '';
			if(item.status == 1){
				info = '已支付';
				claim.status = 2;
			}else{
				info = '未支付';
				claim.status = 1;
			}
			layer.confirm("是否修改索赔状态为"+info+"？",
					{btn: ['确定', '取消']}, function () {
						//1 未支付 2.已支付
						layer.closeAll();
						$http.post(url+'/claim/changeState',claim).success(function(){
							yMake.layer.msg("修改成功! ",{icon:1,time:1000});
							$scope.projectItem._load();
						}).error(function(){
							yMake.layer.msg("修改失败! ",{icon:2,time:1000});
						});
					});
		};

		//导出点击事件
		$scope.outMessage=function(){
			 var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            param.starttime = param.starttime||'';
            param.endtime = param.endtime||'';
            param.type = param.type||'';

			layer.confirm("是否导出数据？",
				{btn : ['是','否']},function(){
					window.location.href=url +"/claim/export1?loginname="+userInfo.data.loginname+'&starttime='+param.starttime+
                    '&endtime='+param.endtime+
                    '&type='+param.type;
					yMake.layer.msg("文件导出成功 ",{icon:1,time:1000});
					layer.msg("",{time:1});
				})
		};
		//下拉菜单
		$scope.selected ='';
		$scope.dropdownItems=[
			{name:'1', value:'1'},
			{name:'2', value:'2'},
			{name:'3', value:'3'},
			{name:'4', value:'4'},
			{name:'5', value:'5'}
			];

		$scope.dropdownProvince=[
			'北京','湖北','浙江','江苏'
		];

		//yMake.fn.autoHeight('.bgWhite',45);
	}]);

});