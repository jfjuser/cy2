<template>
    <el-menu class="navbar" mode="horizontal">
        <span style="padding-left:10px;">门禁考勤管理系统</span>

        <div class="right-menu">
          <el-button type="text"  class="international right-menu-item department-name" style="color:#909399;font-size:14px;">
            <router-link to="/basicSetting/teamInfo">{{departmentName}}</router-link>
          </el-button>
          <el-tooltip effect="dark" content="全屏" placement="bottom">
            <full-screen class="screenfull right-menu-item"></full-screen>
          </el-tooltip>
          <el-tooltip effect="dark" content="帮助引导" placement="bottom" class="notify-box" v-if="showGuide">
            <guide-button><i class="el-icon-question pointer" id="question"></i></guide-button>
          </el-tooltip>
          <!-- <el-tooltip v-if="showDep" effect="dark" content="部门管理" placement="bottom"  >
            <el-button type="text"   class="international right-menu-item department" style="color:#909399" @click="isShow = true">
              <i class="fa fa-skyatlas"></i>
            </el-button>
          </el-tooltip> -->
          <el-dropdown  class="avatar-container right-menu-item" >
            <div class="avatar-wrapper">
              <el-avatar shape="square" icon="el-icon-user-solid"></el-avatar>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <router-link class="inlineBlock" to="/basicSetting/userInfo">
              <el-dropdown-item>
                 个人信息
              </el-dropdown-item>
              </router-link>
              <router-link class="inlineBlock" to="/basicSetting/teamInfo">
              <el-dropdown-item>
                 团队/公司信息
              </el-dropdown-item>
              </router-link>
              <router-link class="inlineBlock" to="/basicSetting/modifyPassword">
              <el-dropdown-item>
                  修改密码
              </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
              <span @click="logout" style="display:block;">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 遮罩层 -->
        <!-- <Modal :isShow = "isShow" :toggleClick="clickModal"/> -->
        <!-- 固定位置 -->
        <!-- <transition name="show">
          <div class="fix-right" v-show="isShow" :style="{height: height + 'px'}">
            <el-scrollbar style="height: 100%">
              <el-tree :props="props" node-key="id" :expand-on-click-node="false" :default-expanded-keys="[0]" :load="loadNode" lazy>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span @click="getFun(data)">
                        <el-button type="text">
                          <i :class="isIconFormatter(node.icon)"></i>
                        </el-button>
                        <span>{{ node.label}}</span>
                    </span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </transition> -->
    </el-menu>
</template>
<script>
import { mapGetters } from 'vuex'
import FullScreen from '@/components/FullScreen'
import Modal from '@/components/Modal'
import GuideButton from '@/components/GuideButton'
// import { isIconFormatter } from '@/utils/formatter.js'
// import { getDepartmentTree } from '@/api/url'
// import { httpGet } from '@/utils/restful'
export default {
  data () {
    return {
      // isShow: false,
      // isIconFormatter: isIconFormatter,
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
      // props: {
      //   label: 'name',
      //   children: 'children',
      //   isLeaf: 'leaf'
      // },
      // showDep: true,
      // height: 0,
      // timeout: null
    }
  },
  components: {
    Modal,
    FullScreen,
    GuideButton
  },
  computed: {
    // 局部扩展store
    ...mapGetters([
      // 'level',
      // 'depName'
      'departmentName'
    ]),
    showGuide () {
      return this.$route.name === 'home'
    }
  },
  mounted () {
    // this.getHeight()
  },
  methods: {
    // getHeight () {
    //   this.height = document.documentElement.clientHeight - 50
    // },
    // clickModal () {
    //   this.isShow = false
    // },
    logout () {
      // 前端退出
      this.$store.dispatch('WebLogOut')
      this.$router.replace('/login')
    }
    // loadNode (node, resolve) {
    //   let self = this
    //   if (node.level === 0) {
    //     httpGet(getDepartmentTree + '/0').then(res => {
    //       if (res.data[0].leaf) {
    //         self.showDep = false
    //         resolve([])
    //       } else {
    //         setTimeout(() => {
    //           resolve(res.data)
    //         }, 500)
    //       }
    //     }).catch(() => {})
    //   } else {
    //     httpGet(getDepartmentTree + '/' + node.data.id).then(res => {
    //       if (res.data == null) {
    //         resolve([])
    //       } else {
    //         resolve(res.data)
    //       }
    //     }).catch(() => {})
    //   }
    // },
    // 获取功能区
    // getFun (data) {
    //   if (data.id === -1) {
    //     return false
    //   } else {
    //     let self = this
    //     let loading = this.$loading({
    //       lock: true,
    //       text: '加载中权限中...',
    //       spinner: 'el-icon-loading',
    //       background: 'rgba(0, 0, 0, 0.7)'
    //     })
    //     let name = ''
    //     if (data.name) {
    //       name = data.name
    //     }
    //     if (data.value) {
    //       name = data.value
    //     }
    //     self.$store.dispatch('SetDepartmentId', data.id).then(() => {
    //       self.$store.dispatch('GenerateRoutes').then(() => {
    //         self.$store.dispatch('SetDepName', name).then(() => {
    //           // this.$router.addRoutes(self.$store.getters.addRouters)
    //           if (this.$router.history.current.name === 'home') {
    //             this.$router.push({ path: '/basicSetting/modifyPassword' })
    //             setTimeout(() => {
    //               this.$router.push({ path: '/home' })
    //               loading.close()
    //             }, 500)
    //           } else {
    //             this.$router.push({ path: '/home' })
    //             loading.close()
    //           }
    //         }).catch(() => {
    //           loading.close()
    //         })
    //       }).catch(() => {
    //         loading.close()
    //       })
    //     }).catch(() => {
    //       loading.close()
    //     })
    //   }
    // }
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
    width: 300px;
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
