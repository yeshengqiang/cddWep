/**
 *  作者：yeshengqiang
 *	时间：2016-08-12
 *	描述：获取联动
 */
define(function(require){
    var app = require('../app');

    app.service('linkage',['$http','url','$q','$cacheFactory',function($http,url,$q,$cacheFactory){
       var linkage = {};

        //获取所有的省
        linkage.getProvince = function(){
            var deferred = $q.defer();
            $http.get(url+'/location/loadProvince',{cache: true}).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        };
        //从缓存里面读取数据
        /*linkage.getFromCache = function(){
            var $httpDefaultCache = $cacheFactory.get($http);
            //获取省
            var cacheDate = $httpDefaultCache.get(url+'/location/loadProvince');
            if(!cacheDate){
                $scope.provinces
            }
        };*/
    }]);
});