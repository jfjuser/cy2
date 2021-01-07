<template>
   <div class="contaniner">
     <NavBar
        title="基本资料"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        @click-right="update"
        right-text="修改"
      />
      <div v-for="(item, index) in userData" :key=index>
        <CellGroup style="margin-top:1.2rem">
          <Cell title="姓名"  :value='item.userName' />
          <Cell title="电话" :value="item.phone" />
        </CellGroup>
        <CellGroup>
          <Cell title="公司" style="margin-top:1.2rem" :value="item.companyName" />
          <Cell title="部门" :value="item.depName" />
        </CellGroup>
      </div>
      <Popup v-model="isShow" position="top" style="width:100vw">
        <Field label="用户名" @blur="checkUser" clearable v-model="form.userName" :error-message="err.user"/>
        <Field label="手机号" @blur="checkPhone" clearable v-model="form.phone" :error-message="err.phone"/>
        <Field label="公司" disabled v-model="form.companyName"/>
        <div class="a">
        <Field label="部门" disabled @click="getDep" v-model="form.depName"/>
        </div>
        <Tag style="margin:1rem" mark plain type="primary">倘若已在考勤组且修改了部门，稍后请务必去更新考勤组</Tag>
        <div style="text-align:center">
          <Button style="margin: 1rem 0;width:60vw;border-radius: 8px" @click="updateData" type="info">确定</Button>
        </div>
      </Popup>
      <Popup v-model="isvisa" position=bottom>
        <RadioGroup v-model="cellId">
          <CellGroup>
            <Cell v-for="(item, index) in listDep" :key=index :title="item.departmentName" clickable @click="clickCell(item, index)">
              <Radio slot="right-icon" :name="index" />
            </Cell>
          </CellGroup>
        </RadioGroup>
      </Popup>
   </div>
</template>

<script>
import { NavBar, Tag, CellGroup, Cell, RadioGroup, Radio, Popup, Field, Button, Notify } from 'vant'
import { httpGet, httpPut } from '@/utils/restful'
import { returnDep, updateInfo } from '@/api/url'
import {mapActions, mapGetters} from 'vuex' // 引入vuex辅助函数
export default {
  name: 'mine',
  data () {
    return {
      cellId: undefined,
      form: {
        userName: '',
        phone: '',
        companyName: '',
        depName: ''
      },
      err: {
        user: '',
        phone: ''
      },
      isvisa: false,
      listDep: [],
      isShow: false,
      userData: [{
        userName: '暂无',
        phone: '暂无',
        companyName: '暂无',
        depName: '暂无'
      }]
    }
  },
  components: {
    NavBar,
    CellGroup,
    Cell,
    Popup,
    Field,
    Button,
    RadioGroup,
    Radio,
    Tag
  },
  computed: {
    ...mapGetters('user', [
      'userId',
      'userInfo',
      'active',
      'loginState'
    ])
  },
  mounted () {
    // let userData = JSON.parse(localStorage.getItem('userObj'))
    this.getUserInfo() // 首次获取用户信息
  },
  methods: {
    ...mapActions('user', ['SaveWxInfo', 'SaveUserId', 'SaveUserInfo', 'SaveActive']),
    // 获取用户信息
    getUserInfo () {
      let userData = this.userInfo
      if (userData === null) {
        this.userData = [{
          userName: '暂无',
          phone: '暂无',
          companyName: '暂无',
          depName: '暂无'
        }]
      } else {
        this.userData = [userData]
      }
    },
    onClickLeft () {
      this.$router.replace('/mySet/')
    },
    checkUser () {
      if (this.form.userName === '') {
        this.err.user = '不可为空'
      } else {
        this.err.user = ''
      }
    },
    checkPhone () {
      var reg = /^1[123456789]\d{9}$/
      if (!reg.test(this.form.phone)) {
        this.err.phone = '手机号输入有误'
      } else {
        this.err.phone = ''
      }
    },
    updateData () {
      let employeeUpdateInfoDto = {
        // id: Number(localStorage.getItem('userid')),
        id: this.userId,
        phone: this.form.phone,
        userName: this.form.userName,
        dutyCompanyId: this.form.dutyCompanyId
      }
      httpPut(updateInfo, employeeUpdateInfoDto).then((res) => {
        // console.log('更新用户信息请求结果：', res)

        Notify({
          type: 'success',
          message: res.message,
          duration: 3000
        })
        // localStorage.setItem('userObj', JSON.stringify(this.form))
        this.SaveUserInfo(this.form).then(() => { // 存储用户信息记录
          this.isShow = false
          // 更新完毕从新获取最新用户信息
          this.getUserInfo()
        })
        // window.location.reload()
      }).catch(() => {})
    },
    update () {
      this.form = JSON.parse(JSON.stringify(this.userData[0]))
      this.isShow = true
    },
    getDep () {
      this.isvisa = true
      httpGet(returnDep + '/' + this.form.companyName).then((res) => {
        if (res.data === null) {
          this.$notify('该公司下暂时没有建立部门类别')
        } else {
          console.log(res.data.departmentInfoList)
          this.listDep = res.data.departmentInfoList
          // this.form.companyId = res.data.companyId
        }
      }).catch(() => {})
    },
    clickCell (item, index) {
      this.form.depName = item.departmentName
      this.form.dutyCompanyId = item.departmentId
      // this.form.dutyCompanyId = item.departmentId
      this.cellId = index
      this.isvisa = false
    }
  }
}
</script>
<style scoped>
  .a >>> .van-field__control:disabled {
    color:#000
  }
</style>
<style lang="scss" scoped>
  .contaniner {
    background-color: rgb(249,249,251);
    min-height:100vh;
  }
</style>
