webpackJsonp([5],{"+wZe":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEiUlEQVRYR8VXW2wUZRT+zuzODLalGy8IWBNvVERjoAYDEqDszKbVxGAtPpgQeNAH31qknSHRaDaaIN2pUJvwhg/eoomhIAEFy8zSGhtjiIqJQhBB0SJNxNjSVmZmd46Z7YW9tZ1elHmb+f//+75z5pz/nEO4wQ/dYH4EF9D+qRy2b1pH4CcI/BgxFjKhAow0EfWBcckDvmbB+yw1uLgL8YecIMYFEiC1Jp8h9vYCdHsQUDAuM7jB0dWPp9o/uYC24wslh/YR0ZM+EIP/AtNBAvaD8bNdRr0YFEmGcweIKkFcx4x6Itw8sh9HHNF7HttifRMJmVBAOGHWhIg+AHAbwL96jBY3EtmHF1a6k1oV/0ESyy4/J3j0Mgh3Avgzzbw5paufFztXVEDYSG4QwBYBxMAnzhA9i3j02lTuzFmPJ+dJpfwRAU8xwJ7nqakdsWQ+RqGA3WaFlMIpIrrVA9pdTWmcFnHeZtGw3hKABma+4oSxHNvV3uwtBQJkw+wCaD0zH3Y0ZSPId8IsHmaSjORBImwEo8vWlQ0TCpAM82kCdYD5kj0cqUR85fAsqK8fjZ8skUv7zwJUweB6R1MPjC3meEA2rJ8ALPGIt7rN6ntzQj4KIiasrQLhHQDnbE2pLBAgvtlVJXjpb/yItzX17rkkH8OSDfMXgO7yhNAjblP1t/73cQ9IhvUKAa954DZXU1+csYCd3Qsk0T1CjEFbV5VsHDFhtglEjQy86mjK6zkCZMPqBBBLEx5PNSvHZiRgd88tUvralwQ8wODvHU1dno0TbrVqQ4yjYJi2rsTyPXDaPwjBW2o3xc5OW8CuzogkCF8Q0cNgvmiHsSY/5eQWaykEnGHgjKMpy/IEmP0EKrc9qRw71l6dlgCfPCQkCVQF5vN2GOvzyTN47V+Vy/ZwP4MHHE2N5ApIWANEmG/LJRE0rB7IFiAZ5ocArXCEUA2aqn/LEbc3WSYNe93j5BKvmfDu39UZkUOhv5lx1dGV8jwB5o9EtKzYL5AT1jEQagBcsF3vUbwUu5IRET9ZIpUO+Ff2qozlk5EDGP8FzKcdXX0wNwhHSdLMtQWFIye4cMrxpHX4x3XlUvYDd20Qcp/sehByp62rvkFF0pCxx9WV7QUxkEmvVPdohPcQyI+T2qDkPp5omHsE0LaiaSgmkisEYv9yuGBryr1Fg3Bn9wJZTPX4t2VmPYDbs3FkwzoP4B6PqcrVo9/leMB/kRPWORDuY9AWR4u+X1REIrlIAp8g4nm2yKsmazZyLqFWc4vA9G6mkdGVEQOyf4H/IrVa9cTYD3CvPRS5/z8pRoRNTrPSUVRAxgvj5RiHHC1aNzfl2Do00tZxt62p1dmemaIhmWVd8ANv7P4P2pBk0qXleFQQBHO0JetwhmjzrFsykJLSoify4ypYU8p80RPwhjs/8vb/0pSOqyzSlhPoABgdmWgW3N9RIpE8yBUQsATMdQzaNCdteU4tyAwm3A5gcdHULPz4BzM3zn4wyQbOHc1WE2MRkz8psd+29oFoZDQj7+icj2YBrZ7RtkCz4YyQAx76FzTfOD/Dk2FJAAAAAElFTkSuQmCC"},"31hx":function(t,e,r){var i=r("UgCK");function o(t){this.mode=i.MODE_8BIT_BYTE,this.data=t}o.prototype={getLength:function(t){return this.data.length},write:function(t){for(var e=0;e<this.data.length;e++)t.put(this.data.charCodeAt(e),8)}},t.exports=o},BWYb:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=r("MDSg"),o=r.n(i),n=r("N4bT"),s=r.n(n);String,Number,String,String,String,String;var a={name:"qrcode",props:{value:String,size:{type:Number,default:160},level:{type:String,default:"L"},bgColor:{type:String,default:"#FFFFFF"},fgColor:{type:String,default:"#000000"},type:{type:String,default:"img"}},mounted:function(){var t=this;this.$nextTick(function(){t.render()})},data:function(){return{imgData:""}},watch:{value:function(){this.render()},size:function(){this.render()},level:function(){this.render()},bgColor:function(){this.render()},fgColor:function(){this.render()}},methods:{render:function(){var t=this;if(void 0!==this.value){var e=new o.a(-1,s.a[this.level]);e.addData(function(t){var e,r,i,o;for(e="",i=t.length,r=0;r<i;r++)(o=t.charCodeAt(r))>=1&&o<=127?e+=t.charAt(r):o>2047?(e+=String.fromCharCode(224|o>>12&15),e+=String.fromCharCode(128|o>>6&63),e+=String.fromCharCode(128|o>>0&63)):(e+=String.fromCharCode(192|o>>6&31),e+=String.fromCharCode(128|o>>0&63));return e}(this.value)),e.make();var r=this.$refs.canvas,i=r.getContext("2d"),n=e.modules,a=this.size/n.length,u=this.size/n.length,h=(window.devicePixelRatio||1)/function(t){return t.webkitBackingStorePixelRatio||t.mozBackingStorePixelRatio||t.msBackingStorePixelRatio||t.oBackingStorePixelRatio||t.backingStorePixelRatio||1}(i);r.height=r.width=this.size*h,i.scale(h,h),n.forEach(function(e,r){e.forEach(function(e,o){i.fillStyle=e?t.fgColor:t.bgColor;var n=Math.ceil((o+1)*a)-Math.floor(o*a),s=Math.ceil((r+1)*u)-Math.floor(r*u);i.fillRect(Math.round(o*a),Math.round(r*u),n,s)})}),"img"===this.type&&(this.imgData=r.toDataURL("image/png"))}}}};var u={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("canvas",{directives:[{name:"show",rawName:"v-show",value:"canvas"===t.type,expression:"type === 'canvas'"}],ref:"canvas",style:{height:t.size+"px",width:t.size+"px"},attrs:{height:t.size,width:t.size}}),t._v(" "),"img"===t.type?r("img",{style:{height:t.size+"px",width:t.size+"px"},attrs:{src:t.imgData}}):t._e()])},staticRenderFns:[]},h=r("C7Lr")(a,u,!1,null,null,null).exports,l=r("Lwa1"),f=r.n(l),g=r("ZYi9"),c=r.n(g),d=r("+wZe"),m=r.n(d),v=r("myXI"),p=r("qTPs");document.title="关注";document.title="关注";var A={components:{Qrcode:h},data:function(){return{wxFollow:f.a,iconNot:c.a,iconYes:m.a,info:{appId:"",followUrl:"",openId:"",plate:"",isFollow:!1,payUrl:""},createCode:"",isNotTip:!1,tipImg:c.a}},mounted:function(){this.info=this.$route.query.info},methods:{goPay:function(){var t=this;this.info&&this.info.payUrl&&""!==this.info.payUrl?this.isNotTip?Object(p.d)(v.k,this.info).then(function(e){window.location.href=t.info.payUrl}).catch(function(){window.location.href=t.info.payUrl}):window.location.href=this.info.payUrl:this.$vux.toast.text("识别失败，请退出重试","bottom")},goFollow:function(){this.info&&this.info.followUrl&&""!==this.info.followUrl?window.location.href=this.info.followUrl:this.$vux.toast.text("识别失败，请退出重试","bottom")},tipSetting:function(){this.isNotTip=!this.isNotTip,this.isNotTip?this.tipImg=this.iconYes:this.tipImg=this.iconNot}}},w={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"main_body"},[r("div",{staticClass:"fun"},[r("p",{staticClass:"fun_title"},[t._v("欢迎使用! 长按关注")]),t._v(" "),"wx915008be9bda881b"===t.info.appId?r("img",{staticClass:"fun_follow",attrs:{src:t.wxFollow}}):t._e(),t._v(" "),"wx915008be9bda881b"!==t.info.appId?r("qrcode",{staticClass:"fun-follow-other",attrs:{size:"150",value:t.info.followUrl,type:"img"}}):t._e(),t._v(" "),t._m(0)],1),t._v(" "),r("div",{staticStyle:{clear:"both"}}),t._v(" "),r("div",{staticClass:"tip-plate"},[t._v("--　"+t._s(t.info.plate)+"　--")]),t._v(" "),r("div",{staticClass:"btn",on:{click:t.goPay}},[t._v("去支付")]),t._v(" "),r("div",{staticClass:"btn_tip",on:{click:t.tipSetting}},[r("div",{staticClass:"btn_tip_img"},[r("img",{attrs:{src:t.tipImg}})]),t._v(" "),t._m(1)])])},staticRenderFns:[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ul",{staticClass:"fun_list"},[r("li",[t._v("预付停车费")]),t._v(" "),r("li",[t._v("月卡续费")]),t._v(" "),r("li",[t._v("领取优惠券")]),t._v(" "),r("li",[t._v("获取停车记录")]),t._v(" "),r("li",[t._v("更多")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("span",{staticClass:"btn_tip_text"},[this._v("7天内不再提醒")])])}]};var C=r("C7Lr")(A,w,!1,function(t){r("DIJK")},"data-v-d1d5e130",null);e.default=C.exports},DIJK:function(t,e){},INo5:function(t,e,r){var i=r("eq6M");function o(t,e){if(void 0==t.length)throw new Error(t.length+"/"+e);for(var r=0;r<t.length&&0==t[r];)r++;this.num=new Array(t.length-r+e);for(var i=0;i<t.length-r;i++)this.num[i]=t[i+r]}o.prototype={get:function(t){return this.num[t]},getLength:function(){return this.num.length},multiply:function(t){for(var e=new Array(this.getLength()+t.getLength()-1),r=0;r<this.getLength();r++)for(var n=0;n<t.getLength();n++)e[r+n]^=i.gexp(i.glog(this.get(r))+i.glog(t.get(n)));return new o(e,0)},mod:function(t){if(this.getLength()-t.getLength()<0)return this;for(var e=i.glog(this.get(0))-i.glog(t.get(0)),r=new Array(this.getLength()),n=0;n<this.getLength();n++)r[n]=this.get(n);for(n=0;n<t.getLength();n++)r[n]^=i.gexp(i.glog(t.get(n))+e);return new o(r,0).mod(t)}},t.exports=o},Lwa1:function(t,e,r){t.exports=r.p+"static/img/wx_follow.6637c5f.jpg"},MDSg:function(t,e,r){var i=r("31hx"),o=r("c5qG"),n=r("ap/J"),s=r("praC"),a=r("INo5");function u(t,e){this.typeNumber=t,this.errorCorrectLevel=e,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}var h=u.prototype;h.addData=function(t){var e=new i(t);this.dataList.push(e),this.dataCache=null},h.isDark=function(t,e){if(t<0||this.moduleCount<=t||e<0||this.moduleCount<=e)throw new Error(t+","+e);return this.modules[t][e]},h.getModuleCount=function(){return this.moduleCount},h.make=function(){if(this.typeNumber<1){var t=1;for(t=1;t<40;t++){for(var e=o.getRSBlocks(t,this.errorCorrectLevel),r=new n,i=0,a=0;a<e.length;a++)i+=e[a].dataCount;for(a=0;a<this.dataList.length;a++){var u=this.dataList[a];r.put(u.mode,4),r.put(u.getLength(),s.getLengthInBits(u.mode,t)),u.write(r)}if(r.getLengthInBits()<=8*i)break}this.typeNumber=t}this.makeImpl(!1,this.getBestMaskPattern())},h.makeImpl=function(t,e){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var r=0;r<this.moduleCount;r++){this.modules[r]=new Array(this.moduleCount);for(var i=0;i<this.moduleCount;i++)this.modules[r][i]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(t,e),this.typeNumber>=7&&this.setupTypeNumber(t),null==this.dataCache&&(this.dataCache=u.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,e)},h.setupPositionProbePattern=function(t,e){for(var r=-1;r<=7;r++)if(!(t+r<=-1||this.moduleCount<=t+r))for(var i=-1;i<=7;i++)e+i<=-1||this.moduleCount<=e+i||(this.modules[t+r][e+i]=0<=r&&r<=6&&(0==i||6==i)||0<=i&&i<=6&&(0==r||6==r)||2<=r&&r<=4&&2<=i&&i<=4)},h.getBestMaskPattern=function(){for(var t=0,e=0,r=0;r<8;r++){this.makeImpl(!0,r);var i=s.getLostPoint(this);(0==r||t>i)&&(t=i,e=r)}return e},h.createMovieClip=function(t,e,r){var i=t.createEmptyMovieClip(e,r);this.make();for(var o=0;o<this.modules.length;o++)for(var n=1*o,s=0;s<this.modules[o].length;s++){var a=1*s;this.modules[o][s]&&(i.beginFill(0,100),i.moveTo(a,n),i.lineTo(a+1,n),i.lineTo(a+1,n+1),i.lineTo(a,n+1),i.endFill())}return i},h.setupTimingPattern=function(){for(var t=8;t<this.moduleCount-8;t++)null==this.modules[t][6]&&(this.modules[t][6]=t%2==0);for(var e=8;e<this.moduleCount-8;e++)null==this.modules[6][e]&&(this.modules[6][e]=e%2==0)},h.setupPositionAdjustPattern=function(){for(var t=s.getPatternPosition(this.typeNumber),e=0;e<t.length;e++)for(var r=0;r<t.length;r++){var i=t[e],o=t[r];if(null==this.modules[i][o])for(var n=-2;n<=2;n++)for(var a=-2;a<=2;a++)this.modules[i+n][o+a]=-2==n||2==n||-2==a||2==a||0==n&&0==a}},h.setupTypeNumber=function(t){for(var e=s.getBCHTypeNumber(this.typeNumber),r=0;r<18;r++){var i=!t&&1==(e>>r&1);this.modules[Math.floor(r/3)][r%3+this.moduleCount-8-3]=i}for(r=0;r<18;r++){i=!t&&1==(e>>r&1);this.modules[r%3+this.moduleCount-8-3][Math.floor(r/3)]=i}},h.setupTypeInfo=function(t,e){for(var r=this.errorCorrectLevel<<3|e,i=s.getBCHTypeInfo(r),o=0;o<15;o++){var n=!t&&1==(i>>o&1);o<6?this.modules[o][8]=n:o<8?this.modules[o+1][8]=n:this.modules[this.moduleCount-15+o][8]=n}for(o=0;o<15;o++){n=!t&&1==(i>>o&1);o<8?this.modules[8][this.moduleCount-o-1]=n:o<9?this.modules[8][15-o-1+1]=n:this.modules[8][15-o-1]=n}this.modules[this.moduleCount-8][8]=!t},h.mapData=function(t,e){for(var r=-1,i=this.moduleCount-1,o=7,n=0,a=this.moduleCount-1;a>0;a-=2)for(6==a&&a--;;){for(var u=0;u<2;u++)if(null==this.modules[i][a-u]){var h=!1;n<t.length&&(h=1==(t[n]>>>o&1)),s.getMask(e,i,a-u)&&(h=!h),this.modules[i][a-u]=h,-1==--o&&(n++,o=7)}if((i+=r)<0||this.moduleCount<=i){i-=r,r=-r;break}}},u.PAD0=236,u.PAD1=17,u.createData=function(t,e,r){for(var i=o.getRSBlocks(t,e),a=new n,h=0;h<r.length;h++){var l=r[h];a.put(l.mode,4),a.put(l.getLength(),s.getLengthInBits(l.mode,t)),l.write(a)}var f=0;for(h=0;h<i.length;h++)f+=i[h].dataCount;if(a.getLengthInBits()>8*f)throw new Error("code length overflow. ("+a.getLengthInBits()+">"+8*f+")");for(a.getLengthInBits()+4<=8*f&&a.put(0,4);a.getLengthInBits()%8!=0;)a.putBit(!1);for(;!(a.getLengthInBits()>=8*f||(a.put(u.PAD0,8),a.getLengthInBits()>=8*f));)a.put(u.PAD1,8);return u.createBytes(a,i)},u.createBytes=function(t,e){for(var r=0,i=0,o=0,n=new Array(e.length),u=new Array(e.length),h=0;h<e.length;h++){var l=e[h].dataCount,f=e[h].totalCount-l;i=Math.max(i,l),o=Math.max(o,f),n[h]=new Array(l);for(var g=0;g<n[h].length;g++)n[h][g]=255&t.buffer[g+r];r+=l;var c=s.getErrorCorrectPolynomial(f),d=new a(n[h],c.getLength()-1).mod(c);u[h]=new Array(c.getLength()-1);for(g=0;g<u[h].length;g++){var m=g+d.getLength()-u[h].length;u[h][g]=m>=0?d.get(m):0}}var v=0;for(g=0;g<e.length;g++)v+=e[g].totalCount;var p=new Array(v),A=0;for(g=0;g<i;g++)for(h=0;h<e.length;h++)g<n[h].length&&(p[A++]=n[h][g]);for(g=0;g<o;g++)for(h=0;h<e.length;h++)g<u[h].length&&(p[A++]=u[h][g]);return p},t.exports=u},N4bT:function(t,e){t.exports={L:1,M:0,Q:3,H:2}},UgCK:function(t,e){t.exports={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8}},ZYi9:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADhUlEQVRYR8WXS2wcRRCG/392jYEQEMKapau5QOyIcIFwggMQwFhCQgEcDojkRO4YJdwQHOAAB0JQJG5wQiAkhMNTPMzLHDnwuBBEHgicrvGuDBIJQtiMp1Bbu7C7XsdLdpz0bTTVXV9VV3f/RZznwfPsH30DmNmwqt5C8m4zu5lkzcw8yWUAdTNTkl+Z2QciMktyqZ/g+gLIsuwBM3sRQNrPogDmST7inHtjPfszAtTr9Vqe5y+RvCcuZGa/knyL5HRRFMeHhoYCY6hLS5IkyaiZ3Wdmu0he3nT8fqVS2Vur1eprgawJEEKYIPkqgBEAPwN41jn3Msm/zxSVmV2QZdnDZvY4yasALJjZbu/9x73m9QTIsmyHmX0GrNTI2865B0n+tV462/+b2YVZlr0O4N6YPJJ3Ouc+715jFcDCwoJfXFz8juQVAA6JyNT/cdxtq6ovAJiK2zc8PHz9yMhIaLdZBaCqswBuNbP3RGQnSRsEwMyoqrFudgKYFZEdawKo6v0ApptHakxE/hzEeWvu3NzcRUmSHCXpAUyKyOHWv44MhBCi0SiAPSISC7C0oap7ALxiZse892OrAEII20l+DeAnEbmmNM9tC6nqCQBXm9mN3vtv4q9/M5Bl2RNm9hSA50Vk/wYBHACwj+STzrmnOwBCCDMkx81swns/sxEAIYRxkjNm9qn3frwDQFWPALi2Wq2OpWl6bCMAGo3GaJ7nRwH8ICLbugF+B3ApgE1lVX93EPPz85uKovgDwCkRuawb4BSAzdVqdXOaptGo9NFoNC7J8/w0gNMiEoP9rwhV9XsA287RFhwRkeu6AT4CMGFmd3nvPyk9fACtIgQwIyITax3DAyLy2EYAqOpzAPb3PIaNRuOGPM/j5XBCRLZsEEA8XVuq1er2NE2/7chA/FDVFYPm+/1amRAhhIea+uK4iMTrfmV0vAWqOgngTTOLSmdrWcdRVS82sx+bj9EuEZnuCdDMQus5fsd7H8XEwCOE8G5T1n0pIre1L7ieIDkoIvsGIVDVgwAe7VuQRGdZlt0e7+vmFk0753aXIMnucM590R1Mv6L0FwDPnDNR2qLsIct/I3m4JcsrlcrJJEmiMpfl5eWtRVFEWT5ZiixvT1VsTIqiOETS9VMPZpYlSTI1cGPS7qyrNbuJ5JXNTiluY2w8FEBszT4svTXrJ+qztemrNzzbxfuZ9w8EC8gwOtU98AAAAABJRU5ErkJggg=="},"ap/J":function(t,e){function r(){this.buffer=new Array,this.length=0}r.prototype={get:function(t){var e=Math.floor(t/8);return 1==(this.buffer[e]>>>7-t%8&1)},put:function(t,e){for(var r=0;r<e;r++)this.putBit(1==(t>>>e-r-1&1))},getLengthInBits:function(){return this.length},putBit:function(t){var e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}},t.exports=r},c5qG:function(t,e,r){var i=r("N4bT");function o(t,e){this.totalCount=t,this.dataCount=e}o.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],o.getRSBlocks=function(t,e){var r=o.getRsBlockTable(t,e);if(void 0==r)throw new Error("bad rs block @ typeNumber:"+t+"/errorCorrectLevel:"+e);for(var i=r.length/3,n=new Array,s=0;s<i;s++)for(var a=r[3*s+0],u=r[3*s+1],h=r[3*s+2],l=0;l<a;l++)n.push(new o(u,h));return n},o.getRsBlockTable=function(t,e){switch(e){case i.L:return o.RS_BLOCK_TABLE[4*(t-1)+0];case i.M:return o.RS_BLOCK_TABLE[4*(t-1)+1];case i.Q:return o.RS_BLOCK_TABLE[4*(t-1)+2];case i.H:return o.RS_BLOCK_TABLE[4*(t-1)+3];default:return}},t.exports=o},eq6M:function(t,e){for(var r={glog:function(t){if(t<1)throw new Error("glog("+t+")");return r.LOG_TABLE[t]},gexp:function(t){for(;t<0;)t+=255;for(;t>=256;)t-=255;return r.EXP_TABLE[t]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},i=0;i<8;i++)r.EXP_TABLE[i]=1<<i;for(i=8;i<256;i++)r.EXP_TABLE[i]=r.EXP_TABLE[i-4]^r.EXP_TABLE[i-5]^r.EXP_TABLE[i-6]^r.EXP_TABLE[i-8];for(i=0;i<255;i++)r.LOG_TABLE[r.EXP_TABLE[i]]=i;t.exports=r},praC:function(t,e,r){var i=r("UgCK"),o=r("INo5"),n=r("eq6M"),s=0,a=1,u=2,h=3,l=4,f=5,g=6,c=7,d={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(t){for(var e=t<<10;d.getBCHDigit(e)-d.getBCHDigit(d.G15)>=0;)e^=d.G15<<d.getBCHDigit(e)-d.getBCHDigit(d.G15);return(t<<10|e)^d.G15_MASK},getBCHTypeNumber:function(t){for(var e=t<<12;d.getBCHDigit(e)-d.getBCHDigit(d.G18)>=0;)e^=d.G18<<d.getBCHDigit(e)-d.getBCHDigit(d.G18);return t<<12|e},getBCHDigit:function(t){for(var e=0;0!=t;)e++,t>>>=1;return e},getPatternPosition:function(t){return d.PATTERN_POSITION_TABLE[t-1]},getMask:function(t,e,r){switch(t){case s:return(e+r)%2==0;case a:return e%2==0;case u:return r%3==0;case h:return(e+r)%3==0;case l:return(Math.floor(e/2)+Math.floor(r/3))%2==0;case f:return e*r%2+e*r%3==0;case g:return(e*r%2+e*r%3)%2==0;case c:return(e*r%3+(e+r)%2)%2==0;default:throw new Error("bad maskPattern:"+t)}},getErrorCorrectPolynomial:function(t){for(var e=new o([1],0),r=0;r<t;r++)e=e.multiply(new o([1,n.gexp(r)],0));return e},getLengthInBits:function(t,e){if(1<=e&&e<10)switch(t){case i.MODE_NUMBER:return 10;case i.MODE_ALPHA_NUM:return 9;case i.MODE_8BIT_BYTE:case i.MODE_KANJI:return 8;default:throw new Error("mode:"+t)}else if(e<27)switch(t){case i.MODE_NUMBER:return 12;case i.MODE_ALPHA_NUM:return 11;case i.MODE_8BIT_BYTE:return 16;case i.MODE_KANJI:return 10;default:throw new Error("mode:"+t)}else{if(!(e<41))throw new Error("type:"+e);switch(t){case i.MODE_NUMBER:return 14;case i.MODE_ALPHA_NUM:return 13;case i.MODE_8BIT_BYTE:return 16;case i.MODE_KANJI:return 12;default:throw new Error("mode:"+t)}}},getLostPoint:function(t){for(var e=t.getModuleCount(),r=0,i=0;i<e;i++)for(var o=0;o<e;o++){for(var n=0,s=t.isDark(i,o),a=-1;a<=1;a++)if(!(i+a<0||e<=i+a))for(var u=-1;u<=1;u++)o+u<0||e<=o+u||0==a&&0==u||s==t.isDark(i+a,o+u)&&n++;n>5&&(r+=3+n-5)}for(i=0;i<e-1;i++)for(o=0;o<e-1;o++){var h=0;t.isDark(i,o)&&h++,t.isDark(i+1,o)&&h++,t.isDark(i,o+1)&&h++,t.isDark(i+1,o+1)&&h++,0!=h&&4!=h||(r+=3)}for(i=0;i<e;i++)for(o=0;o<e-6;o++)t.isDark(i,o)&&!t.isDark(i,o+1)&&t.isDark(i,o+2)&&t.isDark(i,o+3)&&t.isDark(i,o+4)&&!t.isDark(i,o+5)&&t.isDark(i,o+6)&&(r+=40);for(o=0;o<e;o++)for(i=0;i<e-6;i++)t.isDark(i,o)&&!t.isDark(i+1,o)&&t.isDark(i+2,o)&&t.isDark(i+3,o)&&t.isDark(i+4,o)&&!t.isDark(i+5,o)&&t.isDark(i+6,o)&&(r+=40);var l=0;for(o=0;o<e;o++)for(i=0;i<e;i++)t.isDark(i,o)&&l++;return r+=10*(Math.abs(100*l/e/e-50)/5)}};t.exports=d}});