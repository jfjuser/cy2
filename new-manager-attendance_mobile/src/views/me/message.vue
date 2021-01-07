<template>
  <div class="page bgc-grey full-height">
    <van-tabs v-model="myActive" color="#999">
      <van-tab title="加入公司申请">
           <joinCompanyMessage />
          </van-tab>
      <van-tab @click="ifAddAttends = true"  title="考勤组申请">
        <AddAttends />
        <!-- <QuitCompany v-if="index === 1" /> -->
      </van-tab>
    </van-tabs>
    <!-- <div class="nulldata text-c fc-grey" v-if="isData">无更多数据</div> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getAdd2Group } from '@/api/url'
import { checkDataArr } from '@/utils/formatter'
import AddAttends from './components/AddAttends'
import QuitCompany from './components/QuitCompany'
import joinCompanyMessage from './components/joinCompanyMessage'

export default {
  data () {
    return {
      myActive: 0,
      // msgOpt: [{ title: '考勤组申请' }, { title: '退出公司申请' }],
      show: false,
      err: '',
      form: {
        failReason: '',
        id: undefined,
        userId: undefined,
        isChekc: undefined
      },
      listData: [],
      index: null,
      ifAddAttends: false
    }
  },
  components: {
    AddAttends,
    QuitCompany,
    joinCompanyMessage
  },
  computed: {
    isData () {
      return checkDataArr(this.listData)
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    ...mapActions('app', ['SaveReqAddAttendUser', 'SaveReqUserOutCompany', 'SaveListExitCompany']),
    fetchData () {
      const ToastLoading = this.$toast.loading({
        mask: false,
        message: '加载中...',
        position: 'middle',
        duration: 0
      })
      this.$http
        .get(getAdd2Group)
        .then(res => {
          ToastLoading.clear()
          if (res.data) {
            this.SaveReqAddAttendUser(res.data)
            this.listData = res.data
          }
        })
        .catch(() => {
          ToastLoading.clear()
        })
    },
    handle (data, index) {
      this.form.id = data.id
      this.form.userId = data.userId
      this.index = index
      this.show = true
    }
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
    margin-top: 0;
  }
  .title {
    margin-bottom: 5px;
  }
}
</style>
