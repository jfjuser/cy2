<template>
    <el-menu class="navbar" mode="horizontal">
        <!--控制侧边 -->
        <Hamburger class="hamburger-container"  :toggleClick="toggleSideBar" :isActive="sidebar.opened" />
        <!-- 面包屑导航 -->
        <breadcrumb class="breadcrumb-container"></breadcrumb>
        <!-- 侧边显示个人信息，和树级权限列表等 -->
        <div class="right-menu">
          <el-button type="text"   class="international right-menu-item department" style="color:#909399;font-size:14px;">
           {{depName}}
          </el-button>
          <!-- 根据部门名称搜索，并且跳转过去 默认以车场云可以 v-if="level === 1" 【 1 == 车场云 】 -->
          <el-autocomplete

            style="top: -0.875rem"
            v-model="departmentName"
            :fetch-suggestions="querySearchAsync"
            placeholder="部门名称"
            size="small"
            @select="getFun"
          >
           <template slot-scope="{ item }">
              <div style="width: 150px;" >{{ item.value || '' }}</div>
            </template>
          </el-autocomplete>
          <!-- <el-tooltip  placement="bottom">
            <div slot="content">
              <img :src="android" alt="Android二维码">
            </div>
            <el-button type="text"   class="international right-menu-item department" style="color:#909399">
              <i class="fa fa-android"></i>
            </el-button>
          </el-tooltip> -->
          <el-tooltip effect="dark" content="全屏" placement="bottom">
            <full-screen class="screenfull right-menu-item"></full-screen>
          </el-tooltip>
          <el-tooltip effect="dark" content="新版本帮助" placement="bottom" class="notify-box" v-if="showGuide">
            <guide-button><i class="el-icon-question pointer" id="question"></i></guide-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="消息中心" class="notify-box" placement="bottom">
              <!-- <el-badge is-dot style="color:#909399;height:40px;line-height:0;margin:0 8px; "> -->
                <!-- 原始路由： /basicSetting/messageCenter -->
                <router-link v-if="!isNotify" class="inlineBlock" :to="{name: 'messageCenter'}">
                  <i class="fa fa-bell-o"></i>
                </router-link>
              <!-- </el-badge> -->
              <el-badge v-if="isNotify" is-dot style="color:#909399;height:40px;line-height:0;margin:0 8px;">
                <!-- 原始路由： /basicSetting/messageCenter -->
                <router-link class="inlineBlock" :to="{name: 'messageCenter'}">
                  <i class="fa fa-bell-o"></i>
                </router-link>
              </el-badge>
          </el-tooltip>
          <el-tooltip v-if="showDep" effect="dark" content="部门切换" placement="bottom"  >
            <el-button type="text"   class="international right-menu-item department" style="color:#909399" @click="isShow = true">
              <i class="fa fa-skyatlas"></i> <span style="font-size: 14px;">部门切换</span>
            </el-button>
          </el-tooltip>
          <el-dropdown  class="avatar-container right-menu-item" >
            <div class="avatar-wrapper">
              <img class="user-avatar" :src="headPic">
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <router-link class="inlineBlock" to="/basicSetting/userInfo">
              <el-dropdown-item>
                 个人信息
              </el-dropdown-item>
              </router-link>
              <router-link class="inlineBlock" to="/basicSetting/modifyPassword">
              <el-dropdown-item>
                  修改密码
              </el-dropdown-item>
              </router-link>
              <router-link class="inlineBlock" to="/basicSetting/message">
              <el-dropdown-item>
                  我的建议
              </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
              <span @click="logout" style="display:block;">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 遮罩层 -->
        <Modal :isShow = "isShow" :toggleClick="clickModal"/>
        <!-- 固定位置 -->
        <transition name="show">
          <div class="fix-right" v-show="isShow" :style="{height: height + 'px'}">
            <el-scrollbar style="height: 100%">
              <el-tree :props="props" node-key="id" :expand-on-click-node="false" :default-expanded-keys="[0]" :load="loadNode" lazy>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span @click="getFun(node,data)">
                        <el-button type="text">
                          <!-- 更新前 -->
                          <!-- <i :class="isIconFormatter(node.icon)"></i> -->
                          <!-- 更新后 big-worm 2020年5月13日13:53:39 -->
                          <i :class="isIconFormatter(data.icon)"></i>
                        </el-button>
                        <span>{{ data.name }}</span>
                    </span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </transition>
    </el-menu>
</template>
<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import FullScreen from '@/components/FullScreen'
import Modal from '@/components/Modal'
import GuideButton from '@/components/GuideButton'
import { isIconFormatter } from '@/utils/formatter.js'
import { getDepartmentTree, getAllDepartment, getMsgTypeCount } from '@/api/url'
import { httpGet } from '@/utils/restful'
import headPic from '@/assets/headPic.gif'
import android from '@/assets/android.png'
export default {
  data () {
    return {
      isShow: false,
      isNotify: false,
      headPic: headPic,
      android: android,
      isIconFormatter: isIconFormatter,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      data: [],
      showDep: true,
      height: 0,
      departmentName: '',
      departmentList: [],
      timeout: null,
      setdepartmentName: []
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    Modal,
    FullScreen,
    GuideButton
  },
  computed: {
    // 局部扩展store
    ...mapGetters([
      'sidebar',
      'level',
      'depName',
      'type',
      'version'
    ]),
    showGuide () {
      return this.type === 1 && this.$route.name === 'home' && this.version === 1
    }
  },
  mounted () {
    this.getHeight()
  },
  created () {
    this.getMsgTypeCount()
  },
  methods: {
    currentAallName (node) {
      var newName = ''
      if (Object.prototype.toString.call(node.pidName) === '[object Array]') {
        node.pidName.unshift(node.value)
        node.pidName.reverse()
        // console.log('数据类型：', node.pidName)
        newName = node.pidName.join(' / ')
      } else {
        newName = node.value
      }
      // console.log(1111111111111, newName)

      return newName
    },
    getHeight () {
      this.height = document.documentElement.clientHeight - 50
    },
    toggleSideBar () {
      // 侧边显示
      this.$store.dispatch('ToggleSideBar')
    },
    clickModal () {
      this.isShow = false
    },
    logout () {
      // 前端退出
      this.$store.dispatch('WebLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    loadNode (node, resolve) {
      let self = this
      if (node.level === 0) {
        httpGet(getDepartmentTree + '/0').then(res => {
          // console.log('获取部门树： ', res)

          if (res.data[0].leaf) {
            self.showDep = false
            resolve([])
          } else {
            setTimeout(() => {
              resolve(res.data)
            }, 500)
          }
        }).catch(() => {})
      } else {
        httpGet(getDepartmentTree + '/' + node.data.id).then(res => {
          // console.log('获取部门树ssssssss： ', res)
          if (res.data == null) {
            resolve([])
          } else {
            resolve(res.data)
          }
        }).catch(() => {})
      }
    },
    // 获取是否有未读的消息
    getMsgTypeCount () {
      this.isNotify = false
      httpGet(getMsgTypeCount).then(res => {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].notReadCount != null && res.data[i].notReadCount > 0) {
            this.isNotify = true
            break
          }
        }
      }).catch(() => {
      })
    },
    // 当前部门名称序列映射
    deparmentNameSerialize (node) {
      var value = 'label'
      var getParent = 'parent'
      return new Promise((resolve, reject) => {
        // console.log(node)
        if (node[value]) {
          this.setdepartmentName.unshift(node[value])
          if (node[getParent]) {
            // console.log(node[getParent])
            this.deparmentNameSerialize(node[getParent]) // 进行递归遍历
          }
        }
        // console.log(nameArr)
        return resolve()
      })
    },
    // 获取功能区
    async getFun (node, data) {
      let getId = null
      let name = ''
      let self = this
      // console.log('当前是搜索：', node, data)
      if (data && data.id) { // data有开始部门名称序列化
        getId = data.id
        this.setdepartmentName = [] // 每次选择清空数组
        await this.deparmentNameSerialize(node).then(() => { // 组件树形序列化
          this.setdepartmentName.splice(0, 1)
          name = this.setdepartmentName.join(' / ')
        // console.log('序列化好的部门名称：', , this.setdepartmentName)
        })
      } else if (node && node.id && !data) { // 根据部门名称查询 序列化
        let newName = '' // 记录部门序列化名称
        // console.log('数据类型： ', Object.prototype.toString.call(node.pidName))
        if (Object.prototype.toString.call(node.pidName) === '[object Array]') {
          node.pidName.unshift(node.value)
          node.pidName.reverse()
          // console.log('数据类型：', node.pidName)

          newName = node.pidName.join(' / ')
        } else if (Object.prototype.toString.call(node.pidName) === '[object String]') {
          if (node.pidName) {
            newName += node.pidName + ' / '
          }
          newName += node.value
        }

        // console.log(newName)

        getId = node.id
        name = newName
      } else {
        return false
      }
      let loading = this.$loading({
        lock: true,
        text: '加载中权限中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      // console.log('序列化好的部门名称：', name)
      // console.log(getId)
      if (getId / 1 === -1) {
        loading.close()
        this.departmentName = ''
        return
      }
      self.$store.dispatch('SetDepartmentId', getId).then(() => {
        self.$store.dispatch('GenerateRoutes').then(() => {
          self.$store.dispatch('SetDepName', name).then(() => {
            this.$router.addRoutes(self.$store.getters.addRouters)
            if (this.$router.history.current.name === 'home') {
              this.$router.push({ path: '/basicSetting/modifyPassword' })
              // alert('已跳转成功。。。。')
              setTimeout(() => {
                this.$router.push({ path: '/home' })
                this.departmentName = ''
                loading.close()
              }, 500)
            } else {
              // alert('跳转失败。。。。')
              this.$router.push({ path: '/home' })
              loading.close()
            }
          }).catch(() => {
            // console.log('错误吗：1', err)

            loading.close()
          })
        }).catch((err) => {
          // console.log('错误吗：2', err)
          this.$message({
            showClose: true,
            message: `当前用户，${err}, 或者部门id不匹配! `,
            type: 'warning',
            duration: 3000
          })
          setTimeout(() => {
            this.departmentName = ''
            loading.close()
          }, 500)
          // loading.close()
        })
      }).catch(() => {
        // console.log('错误吗：3', err)
        loading.close()
      })
    },
    // 查询所有的部门
    querySearchAsync (queryString, cb) {
      // console.log('查询所有的部门', queryString)

      let list = []
      if (queryString === '' || queryString === '暂无数据') {
        list = []
        cb(list)
      } else {
        // console.log('搜索部门设定。。： ', getAllDepartment, {departmentName: queryString})
        httpGet(getAllDepartment, {departmentName: queryString})
          .then(res => {
            // console.log('测测测', res)

            if (res.code === 1) {
              if (res.data === null) {
                list = [{id: -1, value: '暂无数据'}]
              } else {
                list = res.data
                // console.log('查询到的部门列表： ', list)
              }
            } else {
              list = [{id: -1, value: '暂无数据'}]
            }
            cb(list)
          }).catch(() => {})
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  // 滑动动画
  @keyframes show {
      from {
          opacity: 0;
          right: -300px;
      }
      to {
          opacity: 1;
          right: 0px;
      }
  }
  @keyframes hide {
      from  {
          opacity: 1;
          right: 0px;
      }
      to {
          opacity: 0;
          right: -300px;
      }
  }
  .show-enter-active {
      animation: show .6s;
  }
  .show-leave-active {
      animation: hide .6s;
  }
  .show-enter, .show-leave-to {
      opacity: 0;
  }
  // 侧边固定
  .fix-right{
    width: 350px;
    position: fixed;
    top: 50px;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 999999999;
    padding: 15px;
  }
  .hamburger-container {
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .department-tree-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .international{
      vertical-align: top;
      padding: 18px 0px !important;
      font-size: 18px;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
// 部门树
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.notify-box {
  color: rgb(144, 147, 153);
  height: 40px;
  line-height: 0;
  margin: 0px 8px;
  display: inline-block;
  vertical-align: middle;
}
</style>
