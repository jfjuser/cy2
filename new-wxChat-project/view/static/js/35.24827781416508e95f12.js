webpackJsonp([35],{UviZ:function(t,s){},rMp3:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a=e("SvN9"),i=e("myXI"),n=e("AQir"),o=e("qTPs"),l=e("mzrL"),c=e.n(l),r={name:"",data:function(){return{steps:0,success:c.a,departmentId:Object(a.c)().departmentId||"",userId:Object(a.g)().id||"",queryLs:{offset:1,limit:1,departmentId:Object(a.c)().departmentId||""},userInfo:null,userInfoList:[],openLoading:!1,total:7,userInfoData:[{id:34,userId:52993,userName:"王泽敏",phone:"13778031361",email:null,localId:13366,localName:"一期东门道闸入口02",date:Object(n.a)(1594445372e3),departmentId:8279}]}},created:function(){if(this.$vux.loading.show({text:"正在加载..."}),Object(a.g)().id&&Object(a.g)().token)this.openDisDoor(),this.userInfo=Object(a.g)(),this.userInfo.uickName=Object(a.h)().nickName,this.getPassageWay();else{var t=this.$route.query;this.$router.replace({path:this.$route.path,query:t}),this.getPassageWay(),this.$vux.loading.hide()}},methods:{openDisDoor:function(){var t=this;console.log("用户信息： ",this.userInfo),Object(o.c)(i.g,this.queryLs,{}).then(function(s){if(s&&s.data&&s.data.rows.length>0){var e=s.data.rows[0].id;Object(o.c)(i.Q+e+"/"+t.departmentId+"/"+t.userId).then(function(s){console.log("数据信息： ",s),1===s.code?(t.userInfoList=[{label:"用户名称",value:t.userInfo.uickName},{label:"公司名称",value:t.userInfo.leader},{label:"地址",value:t.userInfo.addr}],t.steps=1,t.$vux.toast.text(s.message,"bottom")):t.$vux.toast.text(s.message,"bottom"),t.$vux.loading.hide()})}else t.$vux.loading.hide(),t.$vux.toast.text("相机数据为空！","bottom");console.log("请求成功： ",s)}).catch(function(s){t.$vux.loading.hide(),console.log("error",s)})},openDoorLog:function(){var t=this;console.log("导出记录"),this.openLoading=!0,Object(o.c)(i.P+this.departmentId+"/"+this.userId).then(function(s){console.log("查询成功！",s),t.openLoading=!1,t.steps=2}).catch(function(s){console.log("查询失败：",s),t.openLoading=!1})}}},d={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",[1===t.steps?e("div",{staticClass:"success-open"},[e("div",{staticClass:"stateImg"},[e("h2",[t._v("开闸成功")]),t._v(" "),e("img",{staticClass:"stateIcon",attrs:{src:t.success,alt:""}})]),t._v(" "),e("group",[e("cell",{attrs:{title:"用户信息"}}),t._v(" "),e("cell-form-preview",{attrs:{list:t.userInfoList}})],1),t._v(" "),e("x-button",{attrs:{type:"primary",text:"查询开闸记录","show-loading":t.openLoading},nativeOn:{click:function(s){return s.preventDefault(),t.openDoorLog(s)}}})],1):2===t.steps?e("div",{staticClass:"open-door-data"},[e("group",[e("h2",[t._v("开闸记录")]),t._v(" "),t._l(t.userInfoData,function(s,a){return e("div",{key:a,staticClass:"user-list"},[t.userInfoData.length>0?e("div",{},[e("div",{staticClass:"list-item"},[e("span",{staticClass:"l-title"},[t._v("用户名称：")]),e("span",{staticClass:"r-msg"},[t._v(t._s(s.userName))])]),t._v(" "),e("div",{staticClass:"list-item"},[e("span",{staticClass:"l-title"},[t._v("手机号：")]),e("span",{staticClass:"r-msg"},[t._v(t._s(s.phone))])]),t._v(" "),e("div",{staticClass:"list-item"},[e("span",{staticClass:"l-title"},[t._v("邮箱：")]),e("span",{staticClass:"r-msg"},[t._v(t._s(s.email))])]),t._v(" "),e("div",{staticClass:"list-item"},[e("span",{staticClass:"l-title"},[t._v("相机ID：")]),e("span",{staticClass:"r-msg"},[t._v(t._s(s.localId))])]),t._v(" "),e("div",{staticClass:"list-item"},[e("span",{staticClass:"l-title"},[t._v("通道名称：")]),e("span",{staticClass:"r-msg"},[t._v(t._s(s.localName))])]),t._v(" "),e("div",{staticClass:"list-item"},[e("span",{staticClass:"l-title"},[t._v("开闸时间：")]),e("span",{staticClass:"r-msg"},[t._v(t._s(s.date))])]),t._v(" "),e("div",{staticClass:"list-item"},[e("span",{staticClass:"l-title"},[t._v("部门ID：")]),e("span",{staticClass:"r-msg"},[t._v(t._s(s.departmentId))])])]):t._e()])})],2)],1):t._e()])},staticRenderFns:[]};var u=e("C7Lr")(r,d,!1,function(t){e("UviZ")},"data-v-cc505e6c",null);s.default=u.exports}});