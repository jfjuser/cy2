webpackJsonp([49],{CO03:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n("myXI"),i=n("qTPs"),r={data:function(){return{}},created:function(){var e=this,t=Object(i.a)("u"),n=Object(i.a)("a"),r=Object(i.a)("o"),c=Object(i.a)("e"),a=Object(i.a)("d"),d={eventId:Number(c),advId:Number(n),userId:Number(r),departmentId:Number(a)};Object(i.d)(o.c,d).then(function(n){1===n.code?window.location.href=decodeURIComponent(t):(e.$vux.toast.text("链接已失效,请返回","bottom"),-1!==window.navigator.userAgent.toLowerCase().indexOf("micromessenger")?WeixinJSBridge.invoke("closeWindow",{},function(e){}):window.close())}).catch(function(){e.$vux.toast.text("系统错误,请返回","bottom"),-1!==window.navigator.userAgent.toLowerCase().indexOf("micromessenger")?WeixinJSBridge.invoke("closeWindow",{},function(e){}):window.close()})}},c={render:function(){var e=this.$createElement;return(this._self._c||e)("div")},staticRenderFns:[]};var a=n("C7Lr")(r,c,!1,function(e){n("QWxk")},"data-v-271d39ce",null);t.default=a.exports},QWxk:function(e,t){}});