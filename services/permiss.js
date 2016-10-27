/**
 *  作者：yeshengqiang
 *	时间：2016-08-12
 *	描述：权限
 */
define(function(require){
   var app = require('../app');

   app.directive('hasPermission',function(){
        return {
            link: function(scope, element, attrs) {
                   if(typeof attrs.hasPermission!=='string'){
                       throw new Error('必须是string类型!');
                       return;
                   }
                   var value = attrs.hasPermission.trim();
                   var notPermissionFlag = value[0] === '!';
                   if(notPermissionFlag) {
                       value = value.slice(1).trim();
                   }

                   function toggleVisibilityBasedOnPermission() {
                       var hasPermission = permissions.hasPermission(value);

                       if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)
                           element.show();
                       else
                           element.hide();
                   }
                   toggleVisibilityBasedOnPermission();
                   scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
               }
        };
   });
});