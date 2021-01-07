"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _router = require("@/router");

var _CloudMaintainRouterMap = require("@/router/modules/CloudMaintainRouterMap.js");

var _IframeRouterMap = require("@/router/modules/IframeRouterMap.js");

var _ParkCenterRouterMap = require("@/router/modules/ParkCenterRouterMap.js");

var _PermissionRouterMap = require("@/router/modules/PermissionRouterMap.js");

var _InOutRouterMap = require("@/router/modules/InOutRouterMap.js");

var _PayManageRouterMap = require("@/router/modules/PayManageRouterMap");

var _RemoteUpgradeRouterMap = require("@/router/modules/RemoteUpgradeRouterMap");

var _DepartmentRouterMap = require("@/router/modules/DepartmentRouterMap");

var _BoxRouterMap = require("@/router/modules/BoxRouterMap");

var _DeviceManageRouterMap = require("@/router/modules/DeviceManageRouterMap");

var _FunctionOpenRouterMap = require("@/router/modules/FunctionOpenRouterMap");

var _TicketManageRouterMap = require("@/router/modules/TicketManageRouterMap");

var _CameraManageRouterMap = require("@/router/modules/CameraManageRouterMap.js");

var _cameraMaintainRouterMap = require("@/router/modules/faceAI/cameraMaintainRouterMap.js");

var _faceDistinguishRouterMap = require("@/router/modules/faceAI/faceDistinguishRouterMap.js");

var _basicDataRouterMap = require("@/router/modules/faceAI/basicDataRouterMap");

var _remoteMaintainRouterMap = require("@/router/modules/faceAI/remoteMaintainRouterMap");

var _attendRouterMap = require("@/router/modules/faceAI/attendRouterMap");

var _attendCountRouterMap = require("@/router/modules/faceAI/attendCountRouterMap");

var _afterServiceRouterMap = require("@/router/modules/afterService/afterServiceRouterMap");

var _statistcsRouterMap = require("@/router/modules/statistcsRouterMap");

var _vipRouterMap = require("@/router/modules/faceAI/vipRouterMap");

var _CloudPlatformDataStatisRouterMap = _interopRequireDefault(require("@/router/modules/CloudPlatformDataStatisRouterMap"));

var _restful = require("@/utils/restful");

var _url = require("@/api/url");

var _cookie = require("@/utils/cookie");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function filtAsyncRouter(asyncRouterMap, permissionList) {
  var realRouters = []; // console.log(asyncRouterMap, permissionList)

  asyncRouterMap.forEach(function (v, index) {
    for (var i = 0; i < permissionList.length; i++) {
      var item = permissionList[i]; // console.log('测试：', item)
      // 判断一级目录名称是否相同,解决切换部门没改子菜单bug

      if (item.name === v.meta.title) {
        if (item.children && item.children.length > 0) {
          if (item.name === '平台维护') v.children = _CloudMaintainRouterMap.CloudMaintainRouterMap;
          if (item.name === '平台监控') v.children = _IframeRouterMap.IframeRouterMap;
          if (item.name === '部门管理') v.children = _DepartmentRouterMap.DepartmentRouterMap;
          if (item.name === '远程升级') v.children = _RemoteUpgradeRouterMap.RemoteUpgradeRouterMap;
          if (item.name === '相机管理') v.children = _CameraManageRouterMap.CameraManageRouterMap;
          if (item.name === '盒子模式') v.children = _BoxRouterMap.BoxRouterMap;
          if (item.name === '权限管理') v.children = _PermissionRouterMap.PermissionRouterMap;
          if (item.name === '进出管理') v.children = _InOutRouterMap.InOutRouterMap;
          if (item.name === '电子支付') v.children = _PayManageRouterMap.PayManageRouterMap;
          if (item.name === '电子优惠券') v.children = _TicketManageRouterMap.TicketManageRouterMap;
          if (item.name === '车场数据') v.children = _ParkCenterRouterMap.ParkCenterRouterMap;
          if (item.name === '设备管理') v.children = _DeviceManageRouterMap.DeviceManageRouterMap;
          if (item.name === '扩展功能') v.children = _FunctionOpenRouterMap.FunctionOpenRouterMap; // ------------------------- 人脸 ------------------------\\

          if (item.name === '相机维护') v.children = _cameraMaintainRouterMap.cameraMaintainRouterMap;
          if (item.name === '人脸识别') v.children = _faceDistinguishRouterMap.faceDistinguishRouterMap;
          if (item.name === '基础数据') v.children = _basicDataRouterMap.basicDataRouterMap;
          if (item.name === '远程维护') v.children = _remoteMaintainRouterMap.remoteMaintainRouterMap;
          if (item.name === '考勤管理') v.children = _attendRouterMap.attendRouterMap;
          if (item.name === '考勤统计') v.children = _attendCountRouterMap.attendCountRouterMap; // 高级功能

          if (item.name === '高级功能') v.children = _vipRouterMap.vipRouterMap; // 广告

          if (item.name === '统计模块') v.children = _statistcsRouterMap.statistcsRouterMap; // 售后服务

          if (item.name === '售后服务') v.children = _afterServiceRouterMap.AfterServiceRouterMap;
          if (item.name === '云平台数据统计') v.children = _CloudPlatformDataStatisRouterMap["default"]; // 云平台数据统计
          // if (item.name === '考勤管理') {
          //   let fff = -1
          //   item.children.forEach((item1, index1) => {
          //     if (item1.name === '考勤申请消息') {
          //       fff = index1
          //     }
          //   })
          //   if (fff < 0) {
          //     item.children.push({
          //       name: '考勤申请消息',
          //       roles: []
          //     })
          //   }
          // }

          v.children = filtAsyncRouter(v.children, item.children);
        }

        if (item.roles) {
          v.meta.roles = item.roles;
        } else {
          v.meta.roles = [];
        }

        realRouters.push(v);
        break;
      }
    }
  });
  return realRouters;
}

var permission = {
  state: {
    routers: _router.constantRouterMap,
    addRouters: [],
    level: 0,
    type: 0,
    departmentTypeId: 0,
    depName: (0, _cookie.getDepName)(),
    themeType: 0
  },
  mutations: {
    SET_ROUTERS: function SET_ROUTERS(state, addRouter) {
      // 动态添加的路由
      state.addRouters = addRouter; // 最终的路由

      state.routers = [].concat(_toConsumableArray(_router.constantRouterMap), _toConsumableArray(addRouter));
    },
    SET_LEVEL: function SET_LEVEL(state, level) {
      state.level = level;
    },
    SET_TYPE: function SET_TYPE(state, type) {
      state.type = type;
    },
    SET_DEPARTMENTTYPEID: function SET_DEPARTMENTTYPEID(state, departmentTypeId) {
      state.departmentTypeId = departmentTypeId;
    },
    SET_DEPNAME: function SET_DEPNAME(state, depName) {
      state.depName = depName;
    },
    SET_THEMETYPE: function SET_THEMETYPE(state, themeType) {
      state.themeType = themeType;
    }
  },
  actions: {
    GenerateRoutes: function GenerateRoutes(_ref) {
      var _this = this;

      var commit = _ref.commit;
      return new Promise(function (resolve, reject) {
        // console.log('请求路由权限地址： ', getFunction + this.getters.departmentId)
        (0, _restful.httpGet)(_url.getFunction + _this.getters.departmentId).then(function (res) {
          console.log('查看当前用户路由权限： ', res);
          var addRoutes;

          if (res.data === null || res.data.list === null) {
            // eslint-disable-next-line
            reject('暂未分配权限');
          } else {
            addRoutes = filtAsyncRouter(_router.asyncRouterMap, res.data.list).concat(_router.Router404); // console.log('最终路由数据：', addRoutes)
            // 设置完整路由

            commit('SET_ROUTERS', addRoutes); // 设置平台类型

            commit('SET_TYPE', res.data.type); // 设置级别

            commit('SET_LEVEL', res.data.level); // 部门类别

            commit('SET_DEPARTMENTTYPEID', res.data.departmentTypeId); // 设置人脸

            commit('SET_THEMETYPE', res.data.themeType);
            (0, _cookie.setLoginType)(res.data.level);
            resolve();
          }
        })["catch"](function (err) {
          reject(err);
        });
      });
    },
    // 移除路由  恢复默认
    RemoveRouters: function RemoveRouters(_ref2) {
      var commit = _ref2.commit;
      return new Promise(function (resolve) {
        commit('SET_ROUTERS', []);
        resolve();
      });
    },
    // 设置部门名称
    SetDepName: function SetDepName(_ref3, depName) {
      var commit = _ref3.commit;
      return new Promise(function (resolve) {
        (0, _cookie.setDepName)(depName);
        commit('SET_DEPNAME', depName);
        resolve();
      });
    }
  }
};
var _default = permission;
exports["default"] = _default;