<template>
    <div class="page bgc-grey full-height ">
        <div class="box box-shadow">
            <van-cell-group>
                <van-field v-model.trim="form.leader" label="部门名称" placeholder="请输入部门名称" />
                <van-cell title="通道名称" is-link @click="dialogVisible = true" />
            </van-cell-group>
        </div>
        <div class="btnbox">
            <van-button type="info" block class="btn" @click="handleCreate" :loading="createLoading">完成</van-button>
        </div>
        <van-dialog v-model="dialogVisible" title="选择通道" close-on-popstate >
          <div class="text-c fc-grey nulldata" v-if="localList.length == 0">暂无通道</div>
            <van-checkbox-group v-model="form.aiTokenIds" class="radio-group" >
              <template v-for="(item, index) in localList">
                <van-checkbox :name="item.id" class="mar-b-10" :key="index">{{item.localName}}</van-checkbox>
              </template>
            </van-checkbox-group>
        </van-dialog>
    </div>
</template>

<script>
import { checkAICamera, workForaiDuyCompany } from '@/api/url'
import { CheckboxGroup, Checkbox } from 'vant'

export default {
  components: {
    'van-checkbox-group': CheckboxGroup,
    'van-checkbox': Checkbox
  },
  data () {
    return {
      form: {
        leader: '',
        aiTokenIds: [],
        departmentId: this.$store.getters.departmentId
      },
      localList: [],
      dialogVisible: false,
      createLoading: false
    }
  },
  mounted () {
    this.getCameraList()
  },
  methods: {
    // 获取所有的通道列表
    getCameraList () {
      this.$http.get(checkAICamera + '/' + this.$store.getters.departmentId).then(res => {
        if (res.data) {
          this.localList = res.data
        }
      }).catch(() => {})
    },
    handleCreate () {
      // console.log(this.form)
      const name = this.form.leader
      if (name === '') {
        return
      }
      if (this.form.aiTokenIds.length === 0) {
        this.$toast.fail('未选择通道')
        return
      }
      this.createLoading = true
      this.$http.post(workForaiDuyCompany, this.form)
        .then(res => {
          this.createLoading = false
          this.$dialog.confirm({
            closeOnPopstate: true,
            message: '添加成功',
            confirmButtonText: '继续添加',
            cancelButtonText: '返回'
          }).then(() => {
            this.clearForm()
          }).catch(() => { history.go(-1) })
        }).catch(() => {
          this.createLoading = false
        })
    },
    clearForm () {
      this.form.leader = ''
      this.form.aiTokenIds = []
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  overflow: hidden;
}
.box {
    border-radius: 10px;
    overflow: hidden;
    margin: 20px;
}
.btnbox {
    padding: 0 20px;
    .btn {
        border-radius: 5px;
    }
}
.radio-group {
  padding-left: 15px;
}
.nulldata {
  padding: 10px;
}
</style>
