<template>
  <div class="container">
    <NavBar
      title="加入考勤"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="selectAttendance-wrap" style="margin-top:0.5rem">
      <Field required v-model="form.workName"
        :error-message="err.name" label="考勤组名称"
        @blur="checkCompany"
        disabled
        @click="showGroup"
        placeholder="点我选择..." />
    </div>
     <Popup v-model="isShow" position=top>
      <RadioGroup v-model="cellId">
        <CellGroup>
          <Cell v-for="(item, index) in attendArr" :key=index :title="item.name" clickable @click="clickCell(item)">
            <Radio slot="right-icon" :name="item.id" />
          </Cell>
        </CellGroup>
      </RadioGroup>
    </Popup>
    <div>
      <Field required v-model="form.reason"
      autosize type="textarea" label="申请理由"
      @blur="checkReason"
      :error-message="err.reason" placeholder="请输入申请理由..." />
    </div>
    <Button type="info" class="btn" @click="queAdd" size=large>确定</Button>
  </div>
</template>

<script>
import { addAttendGroup, returnGroup } from '@/api/url'
import { httpPost, httpGet } from '@/utils/restful'
import { NavBar, Field, Button, Popup, CellGroup, RadioGroup, Cell, Radio } from 'vant'
import { mapGetters, mapActions } from 'vuex' // 引入vuex辅助函数 mapActions
export default {
  name: 'addAttend',
  data () {
    return {
      number: 0,
      form: {
        workName: '',
        workCheckGroupId: undefined,
        reason: ''
      },
      isShow: false,
      attendArr: [],
      cellId: undefined,
      err: {
        name: '',
        reason: ''
      }
    }
  },
  created () {
    // 原始配置
    // this.userId = Number(localStorage.getItem('userid'))
    // console.log('本地id;;;', this.userId)

    if (process.env.NODE_ENV === 'development') {
      // C_admin 12865
      // 大虫子测试 16482
      // 215, 207
      this.SaveUserId(193186)
    }
  },
  computed: {
    ...mapGetters('user', [
      'userId'
    ])
  },
  methods: {
    ...mapActions('user', ['SaveUserId', 'SaveActive']),
    checkCompany () {
      if (this.form.workName === '') {
        this.err.name = '名称不可为空'
      } else {
        this.err.name = ''
      }
    },
    // 聚焦考勤输入，获取考勤组
    showGroup () {
      console.log('开始请求获取考勤组数据', returnGroup + '/' + this.userId)

      httpGet(returnGroup + '/' + this.userId).then((res) => {
        console.log('获取考勤组信息...', res)

        if (res.data && res.data.length > 0) {
          this.attendArr = res.data
          this.isShow = true
        } else {
          this.$notify({
            type: 'warning',
            duration: 3000,
            message: '暂无考勤组，无法加入'
          })
        }
      }).catch(() => {
      })
    },
    // 选择考勤组
    clickCell (item) {
      this.form.workCheckGroupId = item.id
      this.form.workName = item.name
      this.isShow = false
    },
    checkReason () {
      if (this.form.reason === '') {
        this.err.reason = '理由不可为空'
      } else {
        this.err.reason = ''
      }
    },
    onClickLeft () {
      this.$router.replace('/addInfo/')
    },
    queAdd () {
      if (this.form.attendName !== '' && this.form.reason !== '') {
        let form = {
          workCheckGroupId: this.form.workCheckGroupId,
          remarks: this.form.reason,
          userId: this.userId
        }
        httpPost(addAttendGroup, form).then((res) => {
          // console.log('添加成功信息', res)

          this.$notify({
            type: 'success',
            duration: 3000,
            message: res.message
          })
          // 原始...
          // this.$router.replace({
          //   name: 'addInfo',
          //   params: {
          //     tag: 2
          //   }
          // })

          // 新的配置...
          this.SaveActive(2).then(() => { // 添加成功 继续下一步
            this.$router.replace({name: 'addInfo'})
          })
        }).catch(() => {})
      } else {
        this.$notify('请填写完整的信息')
      }
    }
  },
  components: {
    NavBar,
    Field,
    Button,
    Popup,
    CellGroup,
    RadioGroup,
    Cell,
    Radio
  }
}
</script>
<style scoped>
.ast >>> .van-field__control:disabled {
  color:#000
}
</style>
<style lang="scss" scoped>
  .container{
    background-color: rgb(248,248,248);
    min-height:100vh;
  }
  .btn{
    width:90vw;
    border-radius:5px;
    margin-left:5vw;
    margin-top:2rem
  }
  .selectAttendance-wrap{
    border-bottom: 1px solid #eee;
  }
</style>
