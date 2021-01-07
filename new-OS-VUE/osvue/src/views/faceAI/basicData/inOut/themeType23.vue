
<template>
  <div class="app-container">
    <el-row :span="24">
      <el-col :span=" 4">
        <div class="tree-main">
          <div class="title">
            <el-button size="small" type="text">部门列表</el-button>
          </div>
          <el-scrollbar :style="{height: height + 'px'}">
            <el-tree
              :props="props"
              node-key="id"
              @node-click="nodeTreeClick"
              ref="tree"
              :load="loadNode" lazy>
              <span class="custom-tree-node" slot-scope="{ node }">
                <span>{{ node.label}}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="table-main">
          <Member :memberId="checkedId" :isTheme = "themeType"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { httpGet } from '@/utils/restful'
import { getAITreeData } from '@/api/url'
import Member from './member23.vue'
export default {
  computed: {
    ...mapGetters([
      'themeType'
    ])
  },
  components: {
    Member
  },
  data () {
    return {
      height: 0,
      props: {
        label: 'name',
        children: 'children'
      },
      checkedId: 0
    }
  },
  created () {
    this.getHeight()
  },
  methods: {
    getHeight () {
      this.height = document.documentElement.clientHeight - 100
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        httpGet(getAITreeData, {
          departmentId: this.$store.getters.departmentId
        }).then(res => {
          this.checkedId = res.data[0].dcCode + res.data[0].id + '-'
          setTimeout(() => {
            resolve(res.data)
          })
        }).catch(() => {})
      } else {
        httpGet(getAITreeData, {
          dcCode: node.data.dcCode + node.data.id + '-',
          departmentId: this.$store.getters.departmentId
        }).then(res => {
          if (res.data !== null) {
            if (node.data.id === parseInt(this.$store.getters.departmentId)) {
              res.data.push({
                dcCode: '-0',
                id: '',
                name: '未分配部门用户'
              })
              setTimeout(() => {
                resolve(res.data)
              })
            } else {
              setTimeout(() => {
                console.log(11111, res.data)
                resolve(res.data)
              })
            }
          } else {
            resolve([])
          }
        }).catch(() => {})
      }
    },
    // // 设置单选框
    // handleTreeClick (data, checked) {
    //   if (checked === true) {
    //     this.checkedId = data.dcCode + data.id + '-'
    //     this.$refs.tree.setCheckedNodes([data])
    //   }
    // },
    nodeTreeClick (data) {
      this.checkedId = data.dcCode + data.id + '-'
      this.$refs.tree.setCheckedNodes([data])
    }
  }
}
</script>
<style lang='scss' scoped>
.tree-main{
  padding: 10px;
  border-radius: 10px;
  background: white;
  margin-right: 20px;
}
.custom-tree-node{
  font-size: 14px;
}
.title{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}
</style>
