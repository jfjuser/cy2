webpackJsonp([20],{"4yZE":function(t,A,e){"use strict";Object.defineProperty(A,"__esModule",{value:!0});var a=e("SvN9"),s=e("AQir"),i={components:{},data:function(){return{}},mounted:function(){},methods:{handleUser:function(){this.$router.push({path:"/faceAI/userModel/bind/zhLogin/"})},handleVisitor:function(){var t=new Date,A=new Date(t.getTime()+864e5);this.$router.push({path:"/faceAI/userModel/bind/addUser/",query:{id:Object(a.d)().faceUserId,depId:Object(a.c)().departmentId,type:1,ot:Object(s.h)(A),et:Object(s.b)(t)}})}}},o={render:function(){var t=this,A=t.$createElement,e=t._self._c||A;return e("div",{staticClass:"box"},[e("div",{staticClass:"box-body body",on:{click:t.handleUser}},[t._m(0),t._v(" "),e("div",{staticClass:"box-title"},[t._v("非访客")]),t._v(" "),e("div",{staticClass:"box-remark"},[t._v("长期有效")])]),t._v(" "),e("div",{staticClass:"box-body body2",on:{click:t.handleVisitor}},[t._m(1),t._v(" "),e("div",{staticClass:"box-title"},[t._v("访客")]),t._v(" "),e("div",{staticClass:"box-remark"},[t._v("临时性来访人员添加")])])])},staticRenderFns:[function(){var t=this.$createElement,A=this._self._c||t;return A("div",{staticClass:"box-img"},[A("img",{staticClass:"img1",attrs:{src:e("LAt0")}})])},function(){var t=this.$createElement,A=this._self._c||t;return A("div",{staticClass:"box-img"},[A("img",{staticClass:"img2",attrs:{src:e("kOH2")}})])}]};var r=e("C7Lr")(i,o,!1,function(t){e("Jyeb")},"data-v-5e16e713",null);A.default=r.exports},Jyeb:function(t,A){},LAt0:function(t,A){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFLElEQVRYR9WWe1BUVRzHv+fuXmRX2RVHSQfHMuQxaU5hZQhl5GA6YyGDFoLOoJLiBAqljgIp6oiOqYT4ylLKB+YD85UlOpmNGaajGbvIpOALF9llH7iPu697b7MXXYUWuDg743T/uXPP7/6+v8/5nd/5nUPwjB/yjOPj/wUw8kVFOC3FMp6QCQQIMhqczQQI5oHz4MladbPtaHczKjoDoyKDEglH9klpaY+Qfn3QeF8Hq8UNlgV6BEjgcLjAcaRMpbPN6A6EKIA3owJfoNgAtVQqkbMcB/CtIaxWN9yuhx8ACAF4HnNUWttWsRCiAGIjFbvBIw0g4HkexBPJB0BrUN6s0jK9AXBiILoEGDkECimlMNI0TfWUyzD85SH47dyVDgEI4cGxJFFsPXQJEBvZK57w1C88CL5YmYOXogZjzrwi3Glo+s8SeKgEAA6r1TpmsV8yEBeumDIkfFC5nXFi59fLhYW+e68Jiwo24HpdY5sa8ASUy2hYbc4KtY6Z5BeA2HBF6pL8WXt2n1Rh1NhkOFgO70ZHoK5OhR/L90H1dy0sD6xCLFlQEKZMjMP2XT8dUuuYZD8BKBO+XPNZ5SVtEDJn5Xg1fz59HNeqryA393PvmLqmGrfP78XCvJJv1TrbdL8AeJrPpKT4f14Zk4TRCamgpbSge/XiSbiaruO1CVneOKcrD+HO2QMo/uZooUprW+YXAI9IXKTSkDd/RnDPAYPAujlhG0aHPwfSYsKVmwYwTpcQS06xyFlcCsbuTrqmtx32H0CEYm9wsCLl4J613h7gEbdrm9vEyF2+Axcu1bB2lulzw4AH/gMIV0wBRcoL82fj7dgRXt0nAaxOFxIm53la4a8qHRMvJriwbcX8GDMQMkqu1A8aGCLbsG4RlIpegpsXgBBk5W/F5eobnlacpdbZNonRFQ0g1EGEcq3nnTp53IX0aYn7pLSECACEQGcy534wtZAQQtLcdtt7tWbo/Q7wpGBDZYnG7SYDCM+BsbgQ9dECUZn0BdVtx+zsjLdWpb+xy2FzP28xmAGK4GidLTE7p/CY5yQSO/NH/4kCyMzPDK3XoeRcVV2Sk3FSpu/TWmvAaARPCEaWXEWDlUVcX2ldZAg9c0tp2VmxIJ0C8Px+SXreHycOVzePbbE4QTc0Crqa71IgC5TCabEIcw4r+hMmjgKl06OHw46MMWENKaOVEaM+LGa6AukU4P152dXH1fphHhHPPYC+fU/Q250/HhOiQ2E3mYTvASvOwwUK1P1mUHa7MDbu1f7MsQP75U8NwN8sC6Q+PtV2BowDEr0Ba/KzkTs1SdD2gFEJaZBo9SB2Bwj/uAyKpg3LWLB08/bOIDrMwCdL53+6+XfNuiedeacLtKYJ6dOSsW3J3Nbl0BsxMCULRG+ExNx6Kj56MhPCakq3lA19KoCJOfPOHFHp3vEFMDo+Bqe2rRZMF67dQMzcpSAGIyQPj+VHPvFD+zkqj1QEPhVATMacxqpbLf3bO0s0TRgxPApVezcKph0nzmDm+m2Q3m0E4druwhBFAO5dPt1pnXVoDE2e7ta0OCTtAUiLGX0DaDSdqxBMi74qx5qdByHV+m5+69NHvJ5dUHypoyz4BFhRWjB4yZH6el9OPMuit9kC48XjgjmlsBgHfzgJyuZ7x61MHV6ycPnGxzeZdqI+ATKXLUiuqm/xVq9MrgykpLQ3G823NKSmfJWJddoVWVsqJLV/1RLqoRLPsXBbjd4r+fjo0O0FRZtmdysDXe1df9pFtWJ/Bmyv9S9q+iM/l+9ZQQAAAABJRU5ErkJggg=="},kOH2:function(t,A){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFXklEQVRYR9WWe0xTVxzHz7m3ve0tLbQTdIIIblJ8ph2UggJSq5tTl6nbXFiCLEazLLr5RIkxZmMOEZhzjsRt2QaLZCYap5lT56a2BQRbWyqjECRDCZRXeZRKbS993bNcNh3DVorBmJ2/7j339/ic3/d3fzkQPOMFn3F+8L8EgHJ5RgqN4SsAAmIAUCiAsBVCdEZ/Q10x0YpOuAKyZOVJCME7/hIhhEoNOvVmAAAKFmRCAEnJiiwAsfIpojCzy+UOve+kwphEHDbLOWOa0HKno38WDcC2Wq2q5CkBKGtmvzgjvOzo3ggIMaHH62vD7e3DHAKLYxJ+cvxS7YWqBoFBq5476QDxqamCGTxR64XyQoRhMPxBAraj3Q0AIP5+R9RbO77tN3dZ5Xq9picYiKAlSEpSSMXxMadLP88dOa1/AAByis7+UXnrz60Grbp6UgHk8mXiefEx5785khP/OIDdxT/VVRrvbKrVqoyTCgDAevy9zaKqkkM7Fo0BcDF9+GBv12dnDDcMpmU6nW5okgEASF3yasFvp4oy2Tgr1p8EiEb3V7xfcu7qlUvZwSRnbILuAcY4MTF9+uoVaWX7t2/IABBwmT22w+wBALGZ52Pl6trvLxpWN+iuWZ4KABNUJlsanyCNKy86sEVAksQcBuC+g2o6fqqSd/qqcaXxhqYl2OQTrsAIQLJyg4DP3X/ko62WusYWNzXYY50+VRhx9sqtiOa23iN6reqHpwYgkykW7N6z7at6k4nY8e5KIiw0RMrMASflvnv4pNEmkUrtRYXHdhkMmoZgIcbtgQS5UhkmCt/CIXgi+73ehRWq8wSEMCTvYIExYU6kk/DY6MpGqyA/P08CABhOy1h1l+SH13lcTjbltKn4JDqh0Wi8gYACAkgWKaME7JCj8xOWxpA8vpwJMDTYV32sePtzPJKcC3xe73DuxgGEAEkWlnIAi81xOqnbmdm5PWGiKAVj7/N56jvbTV1Oh7XYeFOl8gfhFyA2VsGNjA65Jkt9LQbD8KgHjggBHxf26g8d3JfC7LlK8tSAcrI5ewvTmPfdOQd0vff48wAAgn+TIbqzw6SlbF1ZN29Wto6F8Asgky/dmZj6eiZJhoycfPQadtobcre/OTRzZvRi9xcHqoDXC4mcgjRzR1fNzj1feki+KGOsD0JooKVJfVmvvZoVFIDilfXnpLKX1wbSzdp3u7bs6+IFroMf1iOvD+fmHZdkb/yglsajEyEEeMpCn15rwpNG+/d0N1Wofi0fkWb08luBdZnbKmNeWJAeCMDtpureWCWxpVwui4SIZrVk5XZ+Wnw6nE1w5xJsuue7fV7ijBprPF/FehjDNthd0WGpfbu+pqZ3XIA167eqZ8VJHqEd7WhurWsonWYLwwFAm/rDrTjxvJT5nibxVmQuR8LOPjhYcIL1MIat31xhbjWtM5muD44LsDhj1bmk1DVKCGBooCr4vN42WdvlTgig7SI3cTaOs8SBbJnmNbfqNNc1Py8PSoIEeUZ69Mz5+bPE0oAyjPwFlOP3gf5BEYvN/Y/eY5NYB9p+GbA0n9JrNT8GBcAYJSUrN8bOfik7Kka8BACIBTqdpbvPDSH850b0qJXD3lfeZa7D9Fr1I38AY/3YSZgoV6ydEhFVMGdheiSGYX7lCARAI7rHarljslrbqvlcOj/QNBx3FEulCiHJ5308bXpsWmS0GBEcMg5AOHIbZtZoAJr29bldVPOQrR3arN2NGPIc9jd8xm1Cf+VWKBQsO4UpIUCZPIFwKo8XitM0ElIOJ+Z2O2y0b7ifBrAJIqizs4a1zdXV9kCyPRFAMMGexGZcCZ4k6ER8njnAXzt4ND8Hw/WsAAAAAElFTkSuQmCC"}});