webpackJsonp([24],{"8xKl":function(t,e){},Zkv9:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=o("aA9S"),n=o.n(r),a=o("oast"),l=(Boolean,Boolean,Boolean,{name:"x-table",props:{fullBordered:Boolean,cellBordered:{type:Boolean,default:!0},contentBordered:{type:Boolean,default:!0}}}),s={render:function(){var t=this.$createElement;return(this._self._c||t)("table",{staticClass:"vux-table",class:{"vux-table-bordered":this.fullBordered,"vux-table-no-cell-bordered":!this.cellBordered,"vux-table-no-content-bordered":!this.contentBordered}},[this._t("default")],2)},staticRenderFns:[]};var c=o("C7Lr")(l,s,!1,function(t){o("8xKl")},null,null).exports,u=o("myXI"),i=o("qTPs"),d=o("SvN9"),v=(a.a,{name:"",components:{XButton:a.a,XTable:c},data:function(){return{listQuery:{offset:1,limit:10},userData:[]}},created:function(){this.getInformation()},methods:{forType:function(t){return 0===t?"非访客":1===t?"访客":2===t?"黑名单":void 0},forSex:function(t){return 1===t?"男":2===t?"女":void 0},forStatus:function(t){return 0===t?"失败":1===t?"审核成功":2===t?"审核中":void 0},getInformation:function(){var t=this;console.log(Object(d.d)()),Object(i.d)(u.e,n()(this.listQuery,{departmentId:Number(Object(d.c)().departmentId),dutyCompanyId:Number(localStorage.getItem("dutyCompanyId"))})).then(function(e){t.userData=e.data.rows}).catch(function(){})},backTo:function(){this.$router.go(-1)}}}),f={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("x-button",{staticStyle:{color:"#ee9900","font-size":"1rem"}},[t._v("历史录入")]),t._v(" "),o("x-table",{staticStyle:{"background-color":"#fff"},attrs:{"cell-bordered":!1}},[o("thead",[o("tr",[o("th",[t._v("姓名")]),t._v(" "),o("th",[t._v("电话")]),t._v(" "),o("th",[t._v("类型")]),t._v(" "),o("th",[t._v("状态")])])]),t._v(" "),o("tbody",t._l(t.userData,function(e,r){return o("tr",{key:r},[o("td",[t._v(t._s(e.userName))]),t._v(" "),o("td",[t._v(t._s(e.phone))]),t._v(" "),o("td",[t._v(t._s(t.forType(e.type)))]),t._v(" "),o("td",[t._v(t._s(t.forStatus(e.isCheck)))])])}),0)]),t._v(" "),o("div",{directives:[{name:"show",rawName:"v-show",value:t.userData.length<1,expression:"userData.length < 1"}],staticStyle:{"margin-top":"50px"}},[t._v("\n      暂无数据\n    ")]),t._v(" "),o("x-button",{staticStyle:{"background-color":"#ee9900","margin-top":"50px",color:"#fff","border-radius":"0"},nativeOn:{click:function(e){return t.backTo(e)}}},[t._v("返回继续添加")]),t._v(" "),o("p",{staticStyle:{"font-size":"0.7rem",color:"#3399ee","margin-top":"1.5rem"}},[t._v("注：该表格只做展示效果且最多十条，不可进行修改")]),t._v(" "),o("p",{staticStyle:{"font-size":"0.7rem",color:"#ee9900","margin-top":"1.5rem"}},[t._v("添加的访客不在该表中显示")])],1)},staticRenderFns:[]};var _=o("C7Lr")(v,f,!1,function(t){o("u0b/")},"data-v-7ed84be8",null);e.default=_.exports},"u0b/":function(t,e){}});