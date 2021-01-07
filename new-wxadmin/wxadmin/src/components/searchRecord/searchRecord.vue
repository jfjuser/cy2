<template>
  <div class="container1">
      <NavBar
        title="进出记录"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <RadioGroup v-model="listQuery.aiUserId" style="background-color:#fff">
        <Radio :name="1" class="radioCss">普通用户</Radio>
        <Radio :name="-1" class="radioCss">陌生用户</Radio>
        <Radio :name="-2" class="radioCss">黑名单</Radio>
      </RadioGroup>
      <Field
          label="开始时间"
          v-model="listQuery.beginTime"
          placeholder="请选择"
          @focus="showDate"
          visible-item-count="count"
          readonly
          />
      <Field
        label="结束时间"
        v-model="listQuery.endTime"
        placeholder="请选择"
        @focus="pushEnd"
        readonly
        />
      <Popup v-model="isDate" style="width:80vw;height:45vh">
        <DatetimePicker
          v-model="currentDate"
          type="date"
          :formatter=formatter
          @confirm="saveValue"
          @cancel="closeStart"
          style="dateTable"
        />
      </Popup>
      <Popup v-model="isEnd" style="width:80vw;height:45vh">
        <DatetimePicker
          v-model="currentDate"
          type="date"
          :formatter=formatter
          @confirm="getValue"
          @cancel="closeEnd"
        />
      </Popup>
      <Field
      class="searchInput"
      v-model="listQuery.localName"
              placeholder="请输入通道名称"
            />
         <Search
            v-model="listQuery.userName"
            placeholder="姓名"
            show-action
            @search="onSearch"
          >
            <Button slot="action" @click="onSearch" type="info" size="small">搜索</Button>
          </Search>
          <Button type="info" v-if="share.includes('同步脱机记录')" style="margin-left:0.5rem" @click="offLine">同步脱机记录</Button>
          <Popup v-model="isOffLine" position=top style="width:94vw;height:auto">
            <Field
              required
              placeholder="请选择相机"
              disabled
            />
            <CheckboxGroup v-model="ids">
              <Checkbox v-for="(item, index) in cameraList"
              style="line-height:2.5rem;margin-left:1rem"
              :name="item.id" :key=index>{{item.localName}}</Checkbox>
            </CheckboxGroup>
            <Button type="info" style="width:50vw;margin-left:22vw;border-radius:7px;
            margin-top:1rem;margin-bottom:1rem" :loading="syncLoading" @click="asyncRecord">确定</Button>
          </Popup>
       <!-- <Search
            v-model="value"
            placeholder="请输入搜索关键词"
            show-action
            shape="round"
            background="#6495ED"
            @search="onSearch"
          >
            <div slot="action" @click="onSearch">搜索</div>
          </Search> -->
      <h3 style="margin-left:0.75rem;margin-bottom:0">记录列表</h3>
        <div style="background-color:rgb(238,238,238)">
          <PullRefresh  v-model="isLoading" @refresh="fresh">
            <div>
              <div v-for="(item, index) in userData" :key="index">
                <van-cell-group style="margin-bottom:1.5rem">
                  <van-cell title="姓名" :value="item.userName"/>
                  <van-cell title="电话" :value="item.phone"/>
                  <van-cell title="通道名称" :value="item.localName"/>
                  <van-cell title="进出状态" :value="inOutStatusFormatter(item.type)"/>
                  <van-cell title="进出时间" :value="timeFormatter(item.inOutTime)"/>
                  <div style="text-align:right;">
                    <span v-show="share.includes('查看图片')" style="display:block;margin-right:0.5rem;line-height:2.5rem;color:#1E90FF;" @click="checkPic(item)">查看图片</span>
                  </div>
                </van-cell-group>
              </div>
            </div>
            <div style="width:100%;height:22rem;text-align:center" v-show="isImg">
              <img src="@/assets/noData (2).png" class="nothingImg">
            </div>
          </PullRefresh>
          <Popup v-model="dialogFormImage" style="width:100%;height:60vh;padding:0">
            <img :src="picUrl" style="width:100%;height:60vh;display:block"/>
          </Popup>
          <div style="line-height:4rem" id="asd" v-show="!isImg">
            <Pagination
              v-model="listQuery.offset"
              :page-count="Math.ceil(total/10)"
              :total-items = 'total'
              mode="simple"
              @change="seePage"
            >
            </Pagination>
         </div>
      </div>
  </div>
</template>
<script>
import { DatetimePicker, Popup, Dialog, CheckboxGroup, Checkbox, RadioGroup, Radio, Field, NavBar, Toast, Cell, Pagination, CellGroup, Button, Search, PullRefresh } from 'vant'
import { timeFormatterSort, inOutStatusFormatter, timeFormatter } from '@/utils/formatter.js'
import { httpGet, httpPut, httpPost } from '@/utils/restful'
import { getAIInOut, getAIPic, checkAILinuxCamera, syncAIInOut } from '@/api/url'
// , getAIPic, checkAILinuxCamera, syncAIInOut
// , httpPut, httpPost
// inOutStatusFormatter, isShowColumnFormatter, timeFormatter,
export default {
  name: 'searchRecord',
  components: {
    NavBar,
    Search,
    'van-cell': Cell,
    'van-dialog': Dialog,
    'van-cell-group': CellGroup,
    Button,
    RadioGroup,
    CheckboxGroup,
    Checkbox,
    Radio,
    PullRefresh,
    Pagination,
    DatetimePicker,
    Popup,
    Field,
    Dialog
  },
  data () {
    return {
      activeName: '0',
      isOffLine: false,
      cameraList: [],
      ids: [],
      isLoad: false,
      dialogFormImage: false,
      currentDate: new Date(),
      isShow: false,
      isDate: false,
      isEnd: false,
      inOutStatusFormatter: inOutStatusFormatter,
      timeFormatter: timeFormatter,
      syncLoading: false,
      isLoading: false,
      listLoading: true,
      isImg: true,
      share: [],
      picUrl: '',
      value: '',
      listQuery: {
        offset: 1,
        limit: 10,
        aiUserId: 1,
        localName: undefined,
        beginTime: undefined,
        endTime: undefined,
        userName: undefined,
        time: undefined
      },
      userData: [],
      total: null
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/indexPage/')
    },
    closeStart () {
      this.isDate = false
    },
    offLine () {
      this.isOffLine = true
      httpGet(checkAILinuxCamera + this.$store.getters.departmentId)
        .then((res) => {
          this.cameraList = res.data
        }).catch(() => {})
    },
    closeEnd () {
      this.isEnd = false
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    showDate () {
      this.isDate = true
    },
    pushEnd () {
      this.isEnd = true
    },
    // 确定选择时间
    saveValue (value) {
      this.listQuery.beginTime = this.tanslate(value)
      this.listQuery.time = this.tanslate(value).substring(0, 7)
      this.isDate = false
    },
    // 同步脱机记录
    asyncRecord () {
      if (this.ids.length > 0) {
        this.syncLoading = true
        httpPost(syncAIInOut, { ids: this.ids })
          .then(res => {
            Toast.success(res.message)
            this.isOffLine = false
            this.syncLoading = false
            this.fetchData()
          }).catch(() => {
            this.syncLoading = false
          })
      } else {
        Toast.fail('相机不可为空')
      }
    },
    getValue (value) {
      this.listQuery.endTime = this.tanslate(value)
      this.isEnd = false
    },
    tanslate (d) {
      const newDate = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
      return newDate
    },
    formatter (type, value) {
      if (type === 'year') {
        return value + '年'
      } else if (type === 'month') {
        return value + '月'
      }
      return value
    },
    checkPic (item) {
      let partitionAt = item.inOutTime
      // console.log(item.id)
      // const toast = Toast.loading({
      //   duration: 0, // 持续展示 toast
      //   forbidClick: true, // 禁用背景点击
      //   loadingType: 'spinner',
      //   message: '倒计时 8 秒'
      // })
      // let second = 8
      // const timer = setInterval(() => {
      //   second--
      //   if (second) {
      //     toast.message = `倒计时 ${second} 秒`
      //   } else {
      //     clearInterval(timer)
      //     Toast.clear()
      //   }
      // }, 1000)
      httpPut(getAIPic + item.id + '/' + partitionAt).then(res => {
        this.picUrl = 'data:image/jpeg;base64,' + res.data
        Toast.success(res.message)
        this.dialogFormImage = true
        // this.fullLoading.close()
      }).catch((err) => {
        // this.fullLoading.close()
        Toast.fail(err)
      })
    },
    // 刷新
    fresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        aiUserId: this.listQuery.aiUserId,
        dcCode: this.memberId,
        beginTime: timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59'
        // userName: undefined
      }
      this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      setTimeout(() => {
        this.fetchData()
        Toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    // 分页
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    filterArr () {
      // this.$store.getters.permissionFun
      JSON.parse(window.sessionStorage.getItem('list')).map(item => {
        if (item.name === '基础数据') {
          item.children.map(it => {
            if (it.name === '进出记录') {
              this.share = it.roles
            }
          })
        }
      })
    },
    // 获取数据
    fetchData () {
      let self = this
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAIInOut, this.listQuery).then(res => {
        if (res.data === null) {
          self.userData = []
          self.total = 0
          this.isImg = true
        } else {
          self.userData = res.data.rows
          self.total = res.data.total
          this.isImg = false
        }
        self.listLoading = false
        console.log(res)
      }).catch(() => {
        self.listLoading = false
      })
    }
  },
  created () {
    console.log(this.$store.getters.permissionFun)
    // 开始时间
    this.listQuery.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
    // 结束时间
    this.listQuery.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
    this.time = [this.listQuery.beginTime, this.listQuery.endTime]
  },
  prop: {
    memberId: {
      required: true
    }
  },
  watch: {
    memberId (curVal, oldVal) {
      this.detail = []
      if (curVal !== 0) {
        this.listQuery.dcCode = curVal
        this.fetchData()
      }
    }
  },
  mounted () {
    this.listQuery.dcCode = this.memberId
    if (this.listQuery.dcCode !== 0) {
      this.fetchData()
    }
    this.filterArr()
  }
}
</script>
<style scoped>
#asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:rgb(14,105,254)
}
</style>
<style lang="scss" scoped>
.container1{
    height: 100vh;
    background-color: rgb(238,238,238);
}
.radioCss{
  display: inline-block;
  line-height:2.5rem;
  font-size: 0.8rem;
  margin-left: 1.5rem;
}
.content-div{
  margin-bottom: 1rem;
  border-radius:9px;
  color:#000;
  border:1px solid Gainsboro;
  background-color: #fff;
}
.btn-details{
  width: 5rem;;
  height:1.8rem;
  line-height: 1.8rem;
  font-size: 0.55rem;
  border-radius: 0.55rem;
  color:#fff;
  margin-left: 75%;
  margin-bottom: 0.4rem;
//   letter-spacing: 0.2rem;
}
.nothingImg{
  max-width: 260px;
  max-height: 300px;
}
</style>
