<template>
  <div class="app-container">
    <div class="table-main">
      <el-form :rules="formRules" ref="dataform"  :model="form" autoCompete = "on" label-position="right" label-width="120px">
        <el-form-item label="相机名称" prop="tokenId">
          <el-select v-model = "form.tokenId">
            <el-option v-for="item in localList" :key="item.id"  :value = "item.id" :label="item.localName">
              <span style="float: left">{{item.localName}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{item.mac}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom:1.5rem" label="命令" prop="command">
          <el-input v-model="form.command" clearable style="width:300px"></el-input><el-button type="primary" style="margin-left:2rem" @click="saveOrder">寄存命令</el-button>
        </el-form-item>
        <div style="margin-left:4.5rem">
           <el-radio-group v-model="btnId">
            <div style="display:inline-block;width:30vw" v-for="item in arrOrder" :key=item.id>
              <el-radio style="margin-left:1.5rem;line-height:3.5rem" @click.native="clickBtn(item)" :label="item.content"></el-radio>
                <el-button @click.native="delBtn(item)" style="margin-left:1.5rem;background-color:#E6E6FA" icon="el-icon-delete" >
                </el-button>
            </div>
          </el-radio-group>
        </div>
        <el-form-item style="margin-top:3rem">
          <el-button :loading="loading" style="width:100px" type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPost, httpDelete } from '@/utils/restful'
import { getCamera, showCameraOrder, sendCommand } from '@/api/url'
export default {
  data () {
    return {
      form: {
        tokenId: undefined,
        command: undefined
      },
      formRules: {
        tokenId: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        command: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      btnId: undefined,
      loading: false,
      localList: [],
      arrOrder: []
    }
  },
  methods: {
    // 寄存命令
    saveOrder () {
      if (this.form.command !== undefined) {
        let saveObj = {
          type: 1,
          content: this.form.command
        }
        httpPost(showCameraOrder, saveObj).then((res) => {
          this.getOrder()
        }).catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          duration: 3000,
          message: '请先填写命令再预存！'
        })
      }
    },
    // 删除寄存
    delBtn (par) {
      httpDelete(showCameraOrder + '/' + par.id).then((res) => {
        this.getOrder()
      }).catch(() => {})
    },
    // 获取命令
    getOrder () {
      httpGet(showCameraOrder + '/' + 1).then((res) => {
        this.arrOrder = res.data
      }).catch(() => {})
    },
    getCameraList () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.localList = res.data
        }
      }).catch(() => {})
    },
    // 点击赋值
    clickBtn (it) {
      this.form.command = it.content
    },
    onSubmit () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.loading = true
          httpPost(sendCommand, this.form).then(res => {
            this.loading = false
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  },
  mounted () {
    this.getCameraList()
    this.getOrder()
  }
}
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}
</style>
