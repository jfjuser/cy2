webpackJsonp([43],{SHQC:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var n=e("myXI"),s=e("qTPs"),r=e("AQir"),i={data:function(){return{params:{departmentId:void 0,departmentName:"请稍后...",errInfo:void 0,channelId:void 0,plate:void 0,payType:8},isCanIn:"noCanIn",tips:""}},created:function(){this.params.departmentId=Object(r.d)("dep"),this.params.channelId=Object(r.d)("code"),this.params.departmentId?this.fetchData():this.$vux.toast.text("二维码已经失效","bottom")},methods:{fetchData:function(){var t=this,a=this,e=localStorage.getItem("plate"),r=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/,i=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;Object(s.d)(n.R+"/"+a.params.departmentId).then(function(n){r.test(t.plate)||i.test(t.plate)?a.params.plate=e:a.params.plate=n.data.plate,a.params.departmentName=n.data.departmentName,a.isCanIn="canIn",a.tips=""}).catch(function(t){a.isCanIn="noCanIn",a.tips="tips",a.params.departmentName=t})},init:function(){var t=this,a=this;"noCanIn"!==a.isCanIn&&this.params.plate&&(a.isCanIn="noCanIn",a.params.departmentName="正在请求入场...",a.tips="",Object(s.d)(n.S,this.params).then(function(e){0===e.state?(a.params.departmentName=e.errmsg,a.tips="tips",a.isCanIn="canIn"):2===e.state?(localStorage.setItem("plate",t.params.plate),t.$router.push({path:"/ospay/pp/",query:{dep:t.departmentId,scene:t.payScene,code:t.$route.query.code}})):(localStorage.setItem("plate",t.params.plate),t.$router.push({path:"/ospay/np/success/"}))}).catch(function(e){t.$vux.toast.text(e,"bottom"),a.isCanIn="canIn"}))}}},p={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"container",attrs:{id:"app"}},[e("router-view",{directives:[{name:"wechat-title",rawName:"v-wechat-title",value:t.$route.meta.title,expression:"$route.meta.title"}]}),t._v(" "),e("div",{staticClass:"park-name",class:t.tips},[t._v(t._s(t.params.departmentName))]),t._v(" "),e("div",{staticClass:"error"},[t._v(t._s(t.params.errInfo))]),t._v(" "),e("div",{staticClass:"btnIn",class:t.isCanIn,on:{click:t.init}},[t._v("请求入场")]),t._v(" "),t._m(0)],1)},staticRenderFns:[function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"instruction"},[a("p",[this._v("使用同一手机APP在出口处扫码即可缴费出场")])])}]};var c=e("C7Lr")(i,p,!1,function(t){e("vHyz")},"data-v-479d5ebf",null);a.default=c.exports},vHyz:function(t,a){}});