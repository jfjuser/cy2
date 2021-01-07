<template>
    <div class="page bgc-grey full-height">
         <van-cell center title="修改申请">
          <van-switch v-model="achecked" slot="right-icon" size="24" />
        </van-cell>
        <van-cell center title="补卡申请">
          <van-switch v-model="checked" slot="right-icon" size="24" />
        </van-cell>
        <van-cell title="选择部门" is-link :value="depaVal" @click="showPicker = true" />
        <div class="nulldata text-c fc-grey" v-if="isData">无更多数据</div>
        <section class="list" v-if="checked">
          <span>补卡申请</span>
          <div class="card bgc box-shadow flex-align-items flex-jc-between" v-for="(item, index) in listData" :key="index" @click="golink(item)">
              <div class="title">
                  <p style="margin-bottom:5px">{{item.aiUserName}} <span class="fc-dark">[补卡申请]</span></p>
                  <p class="fc-grey">{{timeFormatter(item.createAt)}}</p>
              </div>
              <div class="fc-red" v-if="item.isCheck === 0">待审核</div>
              <div class="fc-blue" v-if="item.isCheck === 1">已同意</div>
              <div class="fc-grey" v-if="item.isCheck === 2">不同意</div>
          </div>
        </section>
         <section class="list" v-if="achecked">
           <span>修改信息</span>
          <div class="card bgc box-shadow flex-align-items flex-jc-between" v-for="(item, index) in applyArr" :key="index" @click="golinks(item)">
              <div class="title">
                  <p style="margin-bottom:5px">{{item.userName}} <span class="fc-dark">[修改申请]</span></p>
                  <p class="fc-grey">{{item.phone}}</p>
              </div>
              <div class="fc-red">待审核</div>
              <!-- <van-popup v-model="isShow" position="bottom" safe-area-inset-bottom>
                <div>
                  <van-cell-group>
                      <van-cell title="申请人" :value="item.userName" />
                      <van-cell title="手机号" :value="item.phone" />
                  </van-cell-group>
                 <van-radio-group v-model="radio">
                  <van-cell-group>
                    <van-cell title="拒绝" clickable @click="clickIt(item)">
                      <van-radio slot="right-icon" :name="0" />
                    </van-cell>
                    <van-cell title="同意" clickable @click="clickIt(item)">
                      <van-radio slot="right-icon" :name="1" />
                    </van-cell>
                  </van-cell-group>
                </van-radio-group>
                </div>
                  <div class="bottom flex-jc-around">
                    <van-button  round @click="isShow = false">取消</van-button>
                    <van-button type="info" round @click="onConfirm">确定</van-button>
                  </div>
              </van-popup> -->
          </div>
        </section>
        <van-popup v-model="showPicker" position="bottom" safe-area-inset-bottom>
          <van-picker
            show-toolbar
            :columns="columns"
            value-key="leader"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
    </div>
</template>

<script>
import { Picker, Switch, Dialog, Radio, RadioGroup } from 'vant'
import { getPunchInList, showNewUser, superUserCheck, getAllDepartment } from '@/api/url'
import { timeFormatter, checkDataArr } from '@/utils/formatter'
import { Session } from '@/utils/storage'
export default {
  components: {
    [Picker.name]: Picker,
    [Switch.name]: Switch,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup
  },
  data () {
    return {
      timeFormatter,
      radio: undefined,
      isShow: false,
      checked: true,
      achecked: true,
      listData: [],
      applyArr: [],
      imgUrl: '',
      depaVal: '',
      depaId: undefined,
      showPicker: false,
      columns: []
    }
  },
  computed: {
    isData () {
      return checkDataArr(this.listData) && checkDataArr(this.applyArr)
    }
  },
  created () {
    this.isFirstEnter = true
    this.fetchDepaData()
    this.fetchInfo()
  },
  // mounted () {
  //   this.$nextTick(() => {
  //     this.$dialog.alert({
  //       closeOnPopstate: true,
  //       message: '补卡申请，可点击查看和管理员工的补卡申请，支持审核功能',
  //       confirmButtonText: '知道了，不再提醒'
  //     })
  //   })
  // },
  methods: {
    golink (data) {
      Session.set('PunchInImgUrl', 'data:image/jpg;base64,' + data.file, false)
      data.file = ''
      this.$router.push('/punchInDetail/?data=' + encodeURI(JSON.stringify(data)))
    },
    clickIt (it) {
      console.log(it)
    },
    golinks (it) {
      Dialog.confirm({
        title: '审核',
        message: '你确定同意该用户的修改信息申请吗？',
        cancelButtonText: '拒绝',
        confirmButtonText: '同意',
        closeOnClickOverlay: true,
        closeOnPopstate: true
      }).then(() => {
        // on confirm
        this.$http.get(superUserCheck + '/' + it.aiUserId + '/1').then((res) => {
          this.$toast.success('成功')
          this.fetchInfo()
        }).catch(() => {})
      }).catch(() => {
        this.$http.get(superUserCheck + '/' + it.aiUserId + '/0').then((res) => {
          this.$toast('你已拒绝了用户的申请')
          this.fetchInfo()
        }).catch(() => {})
        // on cancel
      })
    },
    fetchInfo () {
      this.$http.get(showNewUser + '/' + this.$store.getters.departmentId).then((res) => {
        this.applyArr = res.data
      }).catch(() => {})
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.$http.get(getPunchInList + '/' + this.depaId).then(res => {
        ToastLoading.clear()
        if (res.data) {
          this.listData = res.data
        }
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    onConfirm (value, index) {
      console.log(value)
      this.depaId = value.id
      this.fetchData()
      this.depaVal = value.leader
      this.showPicker = false
    },
    fetchDepaData () {
      const listQuery = {
        offset: 1,
        limit: 1000,
        departmentId: this.$store.getters.departmentId
      }
      this.$http.get(getAllDepartment, {params: listQuery}).then(res => {
        if (res.data && res.data.rows) {
          const rows = Object.freeze(res.data.rows)
          this.columns = rows
          if (rows.length >= 1) {
            this.onConfirm(rows[0])
          }
        }
      }).catch(() => {

      })
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.listData = []
      this.applyArr = []
      this.fetchData()
      this.fetchInfo()
    }
    this.isFirstEnter = false
  }
}
</script>

<style lang="scss" scoped>
.nulldata {
  line-height: 50px;
  font-size: 14px;
}
.list {
    padding: 15px;
}
.card {
    padding: 10px 15px;
    border-radius: 10px;
    margin-top: 15px;
    &:first-child {
        margin-top: 0
    }
    .title {
        margin-bottom: 5px;
    }
}
</style>
