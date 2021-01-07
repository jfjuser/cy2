<template>
    <div>
        <header class="header bgc" v-if="showDep">
            <span>{{depName}}</span>
            <span class="fc-grey right" @click="showPopup = true"><van-icon name="exchange" />切换部门</span>
        </header>
        <section>
          <component :is="current"></component>
        </section>
        <van-popup v-model="showPopup" position="right" closeable :lazy-render="false" class="depar-popup" >
            <van-cell title="选择部门" />
            <el-tree :props="props" node-key="id" :default-expanded-keys="[0]" :load="loadNode" lazy>
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <span @click="getFun(data)">
                        <i :class="isIconFormatter(data.icon)" style="color: #409eff;"></i>
                        <span>{{ node.label}}</span>
                    </span>
                </div>
            </el-tree>
        </van-popup>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CloudHome from './cloudHome/index'
import ParkHome from './parkHome/index'
import BusinessHome from './businessHome/index'
import MuckHome from './muckHome/index'
import { Icon, Popup, Cell, Dialog } from 'vant'
import { Tree } from 'element-ui'
import { isIconFormatter } from '@/utils/formatter.js'
import { getDepartmentTree } from '@/api/url'
import { httpGet } from '@/utils/restful'
export default {
  components: {
    [Icon.name]: Icon,
    [Tree.name]: Tree,
    [Popup.name]: Popup,
    [Cell.name]: Cell,
    CloudHome,
    ParkHome,
    BusinessHome,
    MuckHome
  },
  data () {
    return {
      current: '',
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      isIconFormatter: isIconFormatter,
      showDep: true,
      showPopup: false
    }
  },
  computed: {
    ...mapGetters([
      'level',
      'depName',
      'type',
      'departmentTypeId'
    ])
  },
  created () {
    document.body.scrollTop = 0
    // type = 0 车场级别
    if (this.type === 0) {
      // 判断是不是渣土的 100044车场 100071代理商
      if (this.departmentTypeId === 100044 || this.departmentTypeId === 100071) {
        this.current = 'MuckHome'
      } else {
        this.level === 1 ? this.current = 'CloudHome' : (this.level === 2 ? this.current = 'CloudHome' : this.level === 3 ? this.current = 'ParkHome' : this.current = 'BusinessHome')
      }
    } else {
      // 否则不给进
      Dialog.alert({
        message: '不支持该账号登录，请重新登录'
      }).then(() => {
        this.$store.dispatch('WebLogOut').then(() => {
          location.reload()
        })
      })
    }
  },
  methods: {
    loadNode (node, resolve) {
      let self = this
      if (node.level === 0) {
        httpGet(getDepartmentTree + '/0').then(res => {
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
          if (res.data == null) {
            resolve([])
          } else {
            resolve(res.data)
          }
        }).catch(() => {})
      }
    },
    // 切换部门
    getFun (data) {
      if (data.id === -1) {
        return
      }
      Dialog.confirm({
        title: '提示',
        message: `是否切换到${data.name}`
      }).then(async () => {
        let self = this
        const loading = this.$toast.loading({
          message: '加载权限中...',
          position: 'middle',
          overlay: true,
          duration: 0
        })

        let name = ''
        if (data.name) {
          name = data.name
        }
        if (data.value) {
          name = data.value
        }
        try {
          await self.$store.dispatch('SetDepartmentId', data.id)
          await self.$store.dispatch('GenerateRoutes')
          await self.$store.dispatch('SetDepName', name)
          this.$router.addRoutes(self.$store.getters.addRouters)
          location.reload() // 刷新
          loading.clear()
        } catch (error) {
          loading.clear()
        }
      }).catch(() => {
        // on cancel
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    .right {
        display: flex;
        align-items: center;
    }
}
.depar-popup {
    width: 85%;
    height: 100%;
    /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
        font-size: 14px;
    }
    /deep/ .el-tree-node__content {
        height: 30px;
    }
    .custom-tree-node {
        font-size: 14px;
    }
}
</style>
