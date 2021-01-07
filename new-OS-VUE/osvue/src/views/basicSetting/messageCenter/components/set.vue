<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>设置</span>
      </div>
      <el-row :gutter="40">
          <el-col class="box" :span="24" v-for="(item, index) in list" :key="item.typeId">
              <el-row :gutter="20">
                  <el-col :span="4">{{item.typeName}}</el-col>
                  <el-col :span="4"><el-checkbox :value="item.isYun === 1" label="站内" border @change.native="change(index, 1)"></el-checkbox></el-col>
                  <el-col :span="4"><el-checkbox :value="item.isEmail === 1" label="邮箱" border disabled @change="change(index, 2)"></el-checkbox></el-col>
                  <el-col :span="4"><el-checkbox :value="item.isPhone === 1" label="短信" border disabled @change.native="change(index, 3)"></el-checkbox></el-col>
                  <el-col :span="4"><el-checkbox :value="item.isWx === 1" label="公众号" border disabled @change.native="change(index, 4)"></el-checkbox></el-col>
              </el-row>
          </el-col>
          <el-col>
              <el-button type="primary" :loading="createLoading" @click="createData">保存</el-button>
          </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { httpGet, httpPost } from '@/utils/restful'
import { getNotifySetting, setNotifyConfig } from '@/api/url'
export default {
  name: 'Set',
  props: ['unicode'],
  data () {
    return {
      list: [],
      createLoading: false
    }
  },
  created () {
    this.getNotifySetting()
  },
  watch: {
    unicode (curVal, oldVal) {
      this.getNotifySetting()
    }
  },
  methods: {
    getNotifySetting () {
      httpGet(getNotifySetting).then(res => {
        this.list = res.data
      }).catch(() => {
      })
    },
    createData () {
      this.createLoading = true
      httpPost(setNotifyConfig, this.list).then((res) => {
        this.createLoading = false
        this.$message({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.createLoading = false
      })
    },
    change (index, type) {
      let temp = this.list[index]
      if (type === 1) {
        if (temp.isYun !== 1) {
          temp.isYun = 1
        } else {
          temp.isYun = 0
        }
      }
      if (type === 2) {
        if (temp.isEmail !== 1) {
          temp.isEmail = 1
        } else {
          temp.isEmail = 0
        }
      }
      if (type === 3) {
        if (temp.isPhone !== 1) {
          temp.isPhone = 1
        } else {
          temp.isPhone = 0
        }
      }
      if (type === 4) {
        if (temp.isWx !== 1) {
          temp.isWx = 1
        } else {
          temp.isWx = 0
        }
      }
      this.list[index] = temp
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
    margin-bottom: 20px;
}
</style>
