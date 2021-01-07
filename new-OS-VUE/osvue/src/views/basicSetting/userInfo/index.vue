<template>
  <div class="app-container">
    <div class="table-main">
      <el-form :rules="formRules" ref="dataform"  :model="form" autoCompete = "on" label-position="right" label-width="120px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName"></el-input>
          <span class="text">
            不可修改。一般用于后台登录名称
          </span>
        </el-form-item>
        <div v-if="form.isAdmin === 1">
          <el-form-item label="LOGO">
            <el-button @click="seeLogo">查看</el-button>
          </el-form-item>
        </div>
        <el-form-item label="性别" >
          <template>
            <el-radio-group v-model="form.sex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  type="email" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="resume">
          <el-input type="textarea" v-model="form.resume"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="onSubmit">确认修改</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="LOGO上传" :visible.sync="LogoVisible" width="30%">
        <img style="width: 300px; height: 100px;" :src="imgUrl">
        <input id="file" type="file" style="opacity:0"  @change="uploadPic()">
        <img style="width: 150px; height: 50px;" :src="imgUrl">
        <p class="remarks">备注：点击第一张图片即可上传文件, 图片大小不能超过500kb</p>
        <p class="remarks">建议尺寸150px*50px</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="LogoVisible = false">取消</el-button>
          <el-button type="primary" :loading="uploadLoading" @click="changeLogo">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// getUserInfo,updateUser,
// import { seeLogo, setLogo } from '@/api/login.js'
import { checkPhone, checkEmail } from '@/utils/validator.js'
import { getUserInfo, updateUser, seeLogo, setLogo } from '@/api/url.js'
import { httpGet, httpPut, httpPost } from '@/utils/restful.js'
import noPic from '@/assets/noPic.gif'
export default {
  data () {
    return {
      focusPlate: false,
      LogoVisible: false,
      uploadLoading: false,
      form: {
        id: undefined,
        userName: undefined,
        sex: undefined,
        phone: undefined,
        email: undefined,
        resume: undefined
      },
      formRules: {
        phone: [
          {validator: checkPhone, trigger: 'blur', message: '请输入正确的手机号码'}
        ],
        email: [
          {validator: checkEmail, trigger: 'blur', message: '请输入正确的邮箱地址'}
        ]
      },
      loading: false,
      imgUrl: noPic
    }
  },
  methods: {
    getUserInfo () {
      httpGet(getUserInfo + this.$store.getters.userId).then(res => {
        this.form = Object.assign({}, res.data)
      }).catch(() => {})
    },
    onSubmit () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.loading = true
          httpPut(updateUser, this.form).then(res => {
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
    },
    // 查看LOGO
    seeLogo () {
      httpGet(seeLogo + this.$store.getters.departmentId)
        .then(res => {
          if (res.data !== null) {
            this.imgUrl = 'data:image/jpg;base64,' + res.data
          } else {
            this.imgUrl = noPic
          }
          this.LogoVisible = true
        }).catch(() => {})
    },
    // 设置logo
    uploadPic () {
      let file = document.getElementById('file').files[0]
      if (file.size > 500 * 1024) {
        this.$message.warning('请按照规定进行上传')
      } else {
        this.imgUrl = this.getPicUrl(file)
      }
    },
    // 获取url的链接地址
    getPicUrl (file) {
      let url = null
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    // 保存Logo
    changeLogo () {
      let file = document.getElementById('file').files[0]
      if (file === undefined) {
        this.$message.warn('请先上传文件，在进行保存')
      } else {
        this.uploadLoading = true
        let formData = new window.FormData()
        formData.append('pic', file)
        formData.append('id', this.$store.getters.departmentId)
        const config = {
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        httpPost(setLogo, formData, config)
          .then(res => {
            this.uploadLoading = false
            this.LogoVisible = false
            this.$message.success(res.message)
          }).catch(() => {})
      }
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}
.el-input{
    width: auto;
}
.text{
    color: grey;
}
#file{
  opacity: 0;
  display: block;
  margin-top: -100px;
  width: 300px;
  height: 100px;
}
.remarks{
  color: red;
}
.el-dialog__body{
  width: 200px !important;
  height: 200px !important;
  border-radius: 50% !important;
}
</style>
