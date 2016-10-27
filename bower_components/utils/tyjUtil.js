'use strict';
define([], function () {



    function _jsonClone(jsonObject){
        if(typeof jsonObject =='object'){
            var cloneItem={};
            for(var key in jsonObject){
                cloneItem[key]=jsonObject[key];
                //console.log(key+"---"+jsonObject[key]);
            }

            return cloneItem;
        }
        else{
            return jsonObject;
        }
}

    var tyjUtil={
        /**
         * JSON克隆
         * @param jsonObject 传递要克隆的json对象
         * @returns tyjUtil
         */
        jsonClone:function(jsonObject){
            if(jsonObject.length&&jsonObject.length>0){
                var arr=[];
                for(var i=0;i<jsonObject.length;i++){
                    arr.push(_jsonClone(jsonObject[i]));
                }
                return arr;
            }
            else{
                return _jsonClone(jsonObject);
            }
        },
        /**
         * 生成UUID
         * @returns UUID
         */
        uuid:function() {
            function _p8(s) {
                var p = (Math.random().toString(16)+"000000000").substr(2,8);
                return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },

        //判断是否为数组
        isArray: function isArray(obj){
            return (typeof obj=='object')&&obj.constructor==Array;
        }
    };

    return tyjUtil;
});
