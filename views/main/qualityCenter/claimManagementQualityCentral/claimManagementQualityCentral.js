/**
 *  作者：yeshengqiang
 *	时间：2016-08-08
 *	描述：早安1919
 */
define(function(require){
	var app = require('../../../../app');

	app.controller('claimManagementQualityCentralCrl',['$scope','$http','url',function($scope,$http,url){

		$scope.searchData = {};
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
		//分页
		//$scope.searchData.starttime=new Date();
		function load(){
			var fetchFunction = function(page,callback){
				var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
				$http.post(url+'/paper/showPageList', $.extend({},page,parm)).success(callback)
			};
			$scope.claim = app.get('Paginator').list(fetchFunction,6);
		}
		load();
		//下载
		$scope.down = function (item) {
			layer.confirm("是否下载文件？",
				{btn : ['是','否']},function(){
					window.location.href = url + '/file/download?downloadType=2&path=' + item.content;
					yMake.layer.msg("文件下载成功 ",{icon:1,time:1000});
					layer.msg("",{time:1});
				})

		};

		//导出
		$scope.downloadFile = function(){
			var teamInfo = {
				//brandedcompanyid: $scope.brandedcompanyid,
				//city: $scope.city,
				//province: $scope.province
			};
			layer.confirm("是否下载模板？",
				{btn : ['是','否']},function(){
                    window.location.href = url+'/team/export?teamInfo='+JSON.stringify(teamInfo);
					yMake.layer.msg("文件导出成功 ",{icon:1,time:1000});
					layer.msg("",{time:1});
				})

		};

		//新增1919
		$scope.newClaim = function(){
			$('#claimNew').modal({backdrop:'static',keyboard:false});
			$scope.uploadPhoto();
		};
        //上传文件
		$scope.uploadPhoto = function(index){
			$('#upload').empty().append('<div id="zyUpload"></div>');
			$('#zyUpload').zyUpload({
				width            :   "100%",                 // 宽度
				height           :   "100%",                 // 宽度
				itemWidth: "140px",                 // 文件项的宽度
				itemHeight: "115px",                 // 文件项的高度
				url: url+"/file/upload",  // 上传文件的路径
				fileType: ["jpg", "png", "jpeg", "gif",'doc','docx','pdf','xls','xlsx'],// 上传文件的类型
				fileSize: 51200000,                // 上传文件的大小
				multiple: true,                    // 是否可以多个文件上传
				dragDrop: true,                    // 是否可以拖动上传文件
				tailor: true,                    // 是否可以裁剪图片
				del: true,                    // 是否可以删除文件
				finishDel: false,  				  // 是否在上传文件完成后删除预览
				/* 外部获得的回调接口 */
				onSelect: function (selectFiles, allFiles) {    // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
				},
				onDelete: function (file, files) {
				},
				onSuccess: function (file, response) {
					$http.get(url+'/paper/add?content='+JSON.parse(response).data).success(function(data){
						if(data.code==0){
							yMake.layer.msg('新增成功',{icon:1});
							$('#claimNew').modal('hide');
							load();
						}
					}).error(function (){
						yMake.layer.msg('新增出错');
					})
				},
				onFailure: function (file, response) {          // 文件上传失败的回调方法
				},
				onComplete: function (response) {           	  // 上传完成的回调方法
				}
			})
		};
		//yMake.fn.autoHeight('.bgWhite',45);
	}]);

});