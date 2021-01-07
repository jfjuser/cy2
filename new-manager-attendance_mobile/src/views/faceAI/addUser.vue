<template>
  <!-- 人脸管理处 -->
  <div class="register-company">
    <!-- <p id="title" class="flex-center" v-html="getTitles"></p> -->
    <div class="register-wrap">
      <!-- 人脸录制 -->
      <div class="user-info">
        <div class="register-content">
          <!-- 注册基本信息 -->
          <div v-if="stepsType === 0" class="base-info">
            <!-- 上传图片 -->
            <UploadImg :foo.sync="photoType" :disable.sync="ifDisabled" @uploadFileImg="uploadFileImg" :status="status" :check="ifCheck"/>
            <!-- :validate-first="true" -->
            <van-form
              v-model="formData"
              :scroll-to-error="false"
              :validate-first="false"
              :rules="formRules"
              @submit="onSubmit"
              :submit-on-enter="true"
              :show-error="false"
              :show-error-message="true"
              :colon="true"
            >
            <!-- 是否跳过校验 -->
            <van-field name="radio" label="单选框">
  <template #input>
    <van-radio-group v-model="ifCheck" direction="horizontal" :disabled="ifDisabled">
      <van-radio name="1">不跳过验证</van-radio>
      <van-radio name="2">跳过验证</van-radio>
    </van-radio-group>
  </template>
</van-field>
              <!-- 用户地址 -->
              <!-- <van-field
                v-model="formData.addr"
                required
                name="addr"
                label="部门名称"
                placeholder="请输入公司名称"
                :rules="formRules.addr"
                type="text"
              /> -->
              <!-- 用户名 -->
              <van-field
                v-model="formData.userName"
                required
                name="userName"
                label="姓名"
                placeholder="请输入姓名"
                :rules="formRules.userName"
                type="text"
              />
              <!-- 手机号 -->
              <van-field
                v-model="formData.phone"
                required
                name="phoneNum"
                label="手机号码"
                placeholder="请输入手机号码"
                :rules="formRules.phone"
                type="number"
                maxlength="11"
              />
              <!-- 选择部门  placeholder="请输入部门"  -->
              <div class="company-wrap">
                <van-field
                  v-model="formData.dutyCompanyId"
                  required
                  name="dutyCompanyId"
                  label="部门"
                  :rules="formRules.dutyCompanyId"
                  type="text"
                >
                  <!-- companyList -->
                  <template #input>
                    <van-dropdown-menu  active-color="#ee0a24">
                      <van-dropdown-item @change="changeCompany" @open="isCompany" v-model="checkCompany" :options="companyList" />
                    </van-dropdown-menu>
                  </template>
                </van-field>
              </div>
              <!-- 韦根号 -->
              <van-field
                v-model="formData.wiegandCard"
                name="wiegandCard"
                label="韦根号"
                placeholder="请输入韦根号"
                :rules="formRules.wiegandCard"
                type="text"
              />

              <!-- 验证码 -->
              <!-- <div class="set-authCode flex-between">
                <van-field
                  v-model="formData.authCode"
                  name="authCode"
                  label="验证码"
                  placeholder="请输入验证码"
                  :rules="formRules.authCode"
                >
                </van-field>
                <van-button class="get-code" plain size="mini" type="info"
                  >获取验证码</van-button
                >
              </div> -->
              <div class="form-btn" style="margin: 16px;">
                <van-button
                  round
                  block
                  :loading="isLoading"
                  loading-text="正在提交..."
                  type="info"
                  native-type="submit"
                >
                  提交
                </van-button>
              </div>
            </van-form>
          </div>
          <!-- 人脸录制列表展示 -->
          <div v-if="stepsType === 1" class="face-user-list-admin">
            <userFaceListData></userFaceListData>
          </div>
          <!-- 人脸详情展示 -->
          <div v-if="stepsType === 2" class="datails-users-show">
            <DatailsForm></DatailsForm>
          </div>
        </div>
      </div>
      <!-- <van-button size="mini" class="toLogin-btn">切换登录页</van-button> -->
    </div>
  </div>
</template>
<script>
import UploadImg from '@/components/uploadImg'
import DatailsForm from './components/DatailsForm'
import userFaceListData from './components/userFaceListData'
// import { getLocalStorage, setLocalStorage } from '@/utils/localStore'
// import { mapGetters, mapMutations } from 'vuex'
import { ApiAddFaceUser, getAllDepartment } from '@/api/url'
import {mapActions, mapMutations, mapGetters} from 'vuex'
export default {
  name: 'RegisterCompany',
  components: {
    UploadImg,
    DatailsForm,
    userFaceListData
  },
  data () {
    // 手机号码验证
    let phoneRules = phone => {
      let regExp = /^[1]([3-9])[0-9]{9}$/
      // console.log(regExp.test(phone))
      if (typeof Number(phone) !== 'number') {
        return false
      } else if (!regExp.test(phone)) {
        return false
      } else if (phone.length > 11) {
        return false
      } else if (phone.length < 11) {
        return false
      }
      return true
    }
    return {
      photoType: undefined,
      ifDisabled: false, // 判断是否需要禁用单选框
      ifCheck: '1', // 是否跳过校验 1为不跳过 2为跳过
      checkCompany: 0,
      status: false,
      title: '',
      isLoading: false,
      formData: {
        addr: '', // 用户地址
        userName: '', // 用户名
        phone: '', // 手机号
        photoName: '', // 照片名
        photo: '', // 照片密匙
        wiegandCard: '', // 韦根号
        photoAbb: '', //
        feature: '', // 图片数据
        departmentId: this.$store.getters.departmentId || '', // 部门Id
        dutyCompanyId: '', // 部门选择
        type: '0' // 用户类型 默认为 0 （0： 用户；1：访客）
      },
      formRules: {
        addr: [{ required: true, message: '请输入公司名称' }],
        userName: [{ required: true, message: '请输入用户名' }],
        phone: [
          { required: true, message: '请输入手机号码' },
          {
            trigger: 'onBlur',
            validator: phoneRules,
            message: '请输入正确的11位手机号码'
          }
        ],
        wiegandCard: [{ required: false, message: '请输入韦根号' }],
        dutyCompanyId: [{ required: false, message: '请选择部门' }]
        // authCode: [{ required: true, message: '请输入验证码' }]
      },
      // 公司部门列表
      companyList: []
    }
  },
  async created () {
    this.SET_USER_FACE_STEPS(1) // 进来默认是走 => 人脸列表管理
    await this.getCompanyAll() // 获取当前公司下的所有部门
    if (this.companyList && this.companyList.length > 0) {
      this.formData.dutyCompanyId = this.companyList[this.checkCompany].id // 默认获取首个id
    }
    // console.log('所有公司数据', this.companyList)
  },
  computed: {
    ...mapGetters('userFaceAdmin', [
      'userFaceAdmin',
      'userFaceSteps'
    ]),
    // 计算状态类型变化
    stepsType () {
      return this.userFaceSteps
    },
    // 设置标题
    getTitles () {
      switch (this.stepsType) {
        case 0:
          return '人脸录制管理'
        case 1:
          return '人脸列表管理'
        case 2:
          return '人脸详情管理'
      }
    }
  },
  methods: {
    ...mapActions('userFaceAdmin', [
      'SetDatailsFormData'
    ]),
    ...mapMutations('userFaceAdmin', [
      'SET_USER_FACE_STEPS'
    ]),
    isCompany () {
      // if (this.companyList <= 0) {
      //   this.$toast({
      //     type: 'fail',
      //     message: '当前部门为空，\n 请为公司添加部门！',
      //     duration: 3000
      //   })
      // }
    },
    // 用户已选择部门
    changeCompany (company) {
      this.formData.dutyCompanyId = this.companyList[company].id // 切换id
    },
    async getCompanyAll () {
      // console.log('开始获取部门')
      const listQuery = {
        offset: 1,
        limit: 100000,
        departmentId: this.$store.getters.departmentId
      }
      await this.$http.get(getAllDepartment, {params: listQuery}).then(res => {
        if (res.data && res.data.rows) {
          const rows = Object.freeze(res.data.rows)
          // console.log('部门所有数据：', rows)
          if (rows.length >= 1) {
            rows.forEach((item, index) => {
              this.companyList[index] = {}
              this.$set(this.companyList, index, {})
              this.$set(this.companyList[index], 'text', item.leader)
              this.$set(this.companyList[index], 'value', index)
              this.$set(this.companyList[index], 'id', item.id)
              this.$set(this.companyList[index], 'data', item.item)
              // this.companyList[index].text = item.leader
              // this.companyList[index].value = index
              // this.companyList[index].id = item.id
              // this.companyList[index].data = item
            })
          }
        }
      }).catch((err) => {
        return this.$toast.fail(err)
      })
    },
    // 取得user合格照片
    uploadFileImg (userImg) {
      this.formData = Object.assign({}, this.formData, userImg)
      console.log(this.formData)
      this.status = false
    },
    isUserPermission () {
      // eslint-disable-next-line
      let { addr, userName, phone, photo } = this.formData;
      if (!photo) {
        return this.$toast.fail('请先上传照片！')
      } else if (
        userName !== '' &&
        phone !== '' &&
        photo !== ''
      ) {
        return true
      } else {
        return false
      }
    },
    // 添加人脸数据提交
    onSubmit (e) {
      let _this = this
      if (this.isUserPermission()) {
        _this.isLoading = true
        // 检测当前用户是否已经录制过人脸
        // 发起录制人脸请求
        console.log('请求数据。。。', _this.formData)
        _this.$http.post(ApiAddFaceUser, {..._this.formData, photoType: this.photoType}).then(res => {
          _this.$toast.success('提交成功！')
          // console.log('添加成功。。', _this.formData)
          _this.isLoading = false
          setTimeout(() => {
            _this.$dialog
              .confirm({
                title: '人脸录制成功',
                message: '是否继续添加/录制'
              })
              .then(res => {
                _this.initUserFaceForm() // 初始化
              })
              .catch(() => {
                // 不添加则返回人脸列表
                _this.initUserFaceForm() // 初始化
                this.SET_USER_FACE_STEPS(1) // 返回
              })
          }, 500)
        }).catch(err => {
          _this.isLoading = false
          _this.$toast.fail(err)
          console.log('添加失败信息： ', err)
        })
        // ----------------------end-------------------
      } else {
        this.isLoading = false
        this.$Toast.fail('请完善信息！')
      }
    },
    // 初始化表单数据
    initUserFaceForm () {
      // console.log('初始化数据。。。')
      this.status = true
      this.formData = {
        addr: '', // 用户地址
        userName: '', // 用户名
        phone: '', // 手机号
        wiegandCard: '', // 韦根号
        departmentId: this.$store.getters.departmentId || '', // 部门Id
        dutyCompanyId: this.companyList[this.checkCompany].id, // 部门选择
        type: '0' // 用户类型 默认为 0 （0： 用户；1：访客）
      }
    }
  },
  watch: {
    // 监听路由是否是 faceAI
    '$route.path' (newValue, oldValue) {
      // console.log(newValue, oldValue)
      let reg = /faceAI/gi
      if (!reg.test(newValue)) {
        this.SET_USER_FACE_STEPS(1)
      }
    }

  }
}
</script>
<style lang="scss" scoped>
#title {
  position: fixed;
  z-index: 1111111;
  top: 0;
  left: 0;
  width: 100%;
  font-size: 0.4rem;
  height: 1rem;
  background: #f1f1f1;
  color: rgb(87, 87, 87);
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
}
.flex-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.register-wrap,
.user-info,
.register-content,
.face-user-list-admin {
  width: 100%;
  height: 100%;
  // margin-top: 1.5rem;
  // margin-bottom: 1rem !important;
  background: #fff;
}
.overflow-nowrap {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-right: 0.5rem;
}
.register-company >>> {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  color: #666;
  .van-cell__title.van-field__label {
    display: flex;
    justify-content: flex-end;
    padding-right: 0.5rem;
  }

  .register-wrap {
    .steps-wrap {
      width: 100%;
      height: auto;
    }
  }
  .form-btn {
    padding: 0 1rem !important;
    margin-top: 1rem !important;
  }
  .get-code {
    padding: 0.1rem;
    width: 3rem;
  }
}
.company-wrap >>> {
  box-sizing: border-box;
  border-bottom: 0.02667rem solid #ebedf0;
  .van-dropdown-menu {
    width: 100%;
    height: 0.8rem;
    .van-dropdown-menu__bar {
      height: 100%;
    }
    .van-dropdown-menu__title{
      width: 90%;
      padding: 0 .5rem;
      text-align: center;
      display: block;
    }
  }
  .van-dropdown-menu__item {
    background-color: #fff;
    justify-content: flex-end;
    .van-dropdown-menu__title {
      right: 1rem;
    }
  }
}
.toLogin-btn {
  display: block;
  margin: auto;
  margin-top: 2rem;
  padding: 0.1rem 0.5rem;
  border: none;
  border-bottom: 1px solid #999;
  color: #666;
}
.face-user-list-admin {
  margin: auto;
  text-align: center;
  width: 100%;
}
.datails-users-show{
  height: 100%;
}
</style>
