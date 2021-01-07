<template>
    <div class="page bgc-grey full-height">
      <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
        左滑可删除，点击操作查看更多
      </van-notice-bar>
        <form action="/"><van-search placeholder="请输入姓名" v-model="listQuery.userName" @search="onSearch" /></form>
        <section class="list">
          <van-list
            v-model="listLoading"
            :finished="finished"
            finished-text="无更多数据"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="fetchData"
            >
            <van-cell-group>
              <template v-for="(item, index) in listData">
                <van-swipe-cell :key="index">
                  <van-cell is-link @click="showInfo(item)" center value="操作">
                    <div slot="title" class="flex-align-items">
                      <van-image class="full-img head" width="40" height="40" round :src="'data:image/jpeg;base64,' + item.file">
                          <!-- <template v-slot:loading>{{item.userName?item.userName.slice(-1):''}}</template> -->
                      </van-image>
                      {{item.userName}}
                    </div>
                    <!-- <van-icon slot="right-icon" name="more-o" style="line-height: inherit;"/> -->
                  </van-cell>

                  <template slot="right">
                    <van-button square type="danger" text="删除" style="height: 100%;" @click="handleDel(item.id, index)" />
                  </template>
                </van-swipe-cell>
              </template>
            </van-cell-group>
          </van-list>
        </section>
             <Popup v-model="ifShow" position="bottom">
          <!-- <span style="margin-left:90%;display:inline-block;line-height:1rem;" @click="closeDiv"><van-icon name="cross" size="1.5rem" style="margin-top:0.5rem"/></span> -->
          <Button size="large" @click="editUser">查看信息</Button>
          <Button size="large" @click="toExamine" >审核</Button>
          <Button size="large" @click="show = false">取消</Button>
      </Popup>
       <Popup v-model="hasCheck" position=top style="width:100vw;padding-bottom:5%">
        <label style="width:20vw;margin-left:40vw;line-height:2rem">成员审核</label>
        <!-- <div style="background-color: #fffbe8;color:#ed6a0c;font-size: 14px;padding:10px;" v-if="itemAll.type === 0">选择‘其他’可自定义时长，但必须填写数字，且以月为单位计算</div>
        <Cell required title="授权时长" v-if="itemAll.type === 0" :value="timelimit.valueName" @click="showtime = true"/>
        <van-fied required placeholder="请输入自定义时长" type="number" v-model="customTime" v-if="timelimit.valueNo && timelimit.valueNo==5"><div slot="button">个月</div></van-fied> -->
        <Cell title="审核状态" :border="false"/>
        <RadioGroup v-model="handleCheck" style="display:flex">
          <Radio :name= 1 style="margin-left:10%;line-height:40px">审核成功</Radio>
          <Radio :name= 0 style="margin-left:20%;line-height:40px">审核失败</Radio>
        </RadioGroup>
        <Cell title="分配通道" v-if="itemAll && itemAll.type === 1 && handleCheck=='1'" :value="localVal==''?'请选择':localVal" @click="showlocal = true" :border="false" />
        <div style="margin-top:15px;display: flex;justify-content: space-around;">
          <Button @click="cancelCheck" style="width:20vw;border-radius:8px;">取消</Button>
          <Button @click="finishedCheck" style="width:20vw;border-radius:8px;" type="info">确定</Button>
        </div>
              <Popup v-model="showtime" position="bottom" :close-on-click-overlay="false">
        <Picker
          :columns="timekinds"
          show-toolbar
          value-key="valueName"
          @cancel="showtime = false"
          @confirm="onConfirmtime"
        />
      </Popup>
      </Popup>

        <van-popup v-model="show">
          <div class="infobox">
            <van-cell-group>
                <van-cell title="姓名" :value="itemAll.userName" />
                <!-- <van-cell title="部门" value="xx部" /> -->
                <van-cell title="手机号" :value="itemAll.phone" />
                <van-cell title="同步状态" :value="itemAll.aiPower" />
            </van-cell-group>
            <div style="text-align:center">
              <!-- <van-button style="width:100%;" @click="toExamine" type="info">审核</van-button> -->
            </div>
          </div>
        </van-popup>
        <van-popup v-model="isAda" posinset="bottom">
          <div class="infobox">
            <van-button size=large @click="adaptInfo">修改信息</van-button>
            <van-button size=large  @click="setAdmin">设为管理员</van-button>
          </div>
        </van-popup>
        <van-popup v-model="isShow">
          <div class="infobox" style="height:150px">
            <van-fied label="姓名" v-model="item.userName"/>
            <van-fied label="手机号" :maxlength=11 typy="number" v-model="item.phone"/>
          </div>
          <div style="text-align:center">
            <van-button style="width:100%" @click="saveUpdate" type="info">保存</van-button>
          </div>
        </van-popup>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { SwipeCell, NoticeBar, Search, Field, Popup, Cell, Button, RadioGroup, Radio, Toast, Picker } from 'vant'
import { lookMember, userAdmin, adaptNewInfo, checkAIMemeber, getAdd2Group } from '@/api/url'
import { checkDataArr, toNull } from '@/utils/formatter'
import { httpPut } from '@/utils/restful'
export default {
  components: {
    'van-swipe-cell': SwipeCell,
    'van-notice-bar': NoticeBar,
    'van-search': Search,
    'van-fied': Field,
    Popup,
    Cell,
    Button,
    RadioGroup,
    Radio,
    Picker
  },
  data () {
    return {
      ifShow: false,
      itemAll: '',
      id: '', // 选择的id
      show: false,
      isAda: false,
      isShow: false,
      listData: [],
      item: {},
      listQuery: {
        isCheck: 2,
        userName: '',
        offset: 1,
        limit: 15,
        departmentId: this.$store.getters.departmentId
      },
      finished: false,
      listLoading: false,
      error: false,
      infoData: {},
      showtime: false,
      timekinds: [
        {
          valueNo: 1,
          valueName: '一个月'
        }, {
          valueNo: 2,
          valueName: '三个月'
        }, {
          valueNo: 3,
          valueName: '六个月'
        }, {
          valueNo: 4,
          valueName: '一年'
        }, {
          valueNo: 5,
          valueName: '其他'
        }
      ],
      timelimit: {},
      customTime: '', // 自定义时长
      handleCheck: 1,
      hasCheck: false

    }
  },
  computed: {
    isData () {
      return checkDataArr(this.listData)
    }
  },
  methods: {
    ...mapActions('app', ['SaveReqAddAttendUser', 'SaveReqUserOutCompany', 'SaveListExitCompany']),
    editUser () {
      this.ifShow = false
      this.show = true
    },
    toExamine () {
      this.hasCheck = true
      this.ifShow = false
    },
    finishedCheck () {
      if (this.handleCheck === undefined) {
        Toast('请先选择审核的状态')
      } else {
        const data = {
          id: this.id,
          isCheck: this.handleCheck,
          departmentId: this.$store.getters.departmentId,
          customTime: '60',
          timelimit: '5',
          // timelimit: this.timelimit.valueNo ? this.timelimit.valueNo : '',
          channelId: this.channelId
        }
        httpPut(checkAIMemeber, data).then((res) => {
          Toast({
            duration: 4 * 1000,
            type: 'success',
            message: res.message
          })
          this.listQuery.offset = 1
          this.listData = []
          this.$http
            .get(getAdd2Group)
            .then(res => {
              if (res.data) {
                this.SaveReqAddAttendUser(res.data)
              }
            })
            .catch(() => {
            })
          this.fetchData()
        }).catch(() => {
        })
        this.ifShow = false
        this.hasCheck = false
        this.show = false
      }
    },
    cancelCheck () {
      this.hasCheck = false
      this.show = false
    },
    onConfirmtime (value, index) {
      this.timelimit = value
      this.showtime = false
    },
    showInfo (data) {
      this.id = data.id
      this.itemAll = data
      this.ifShow = true
    },
    saveUpdate () {
      this.$http.put(adaptNewInfo, this.item).then((res) => {
        console.log(res)
        this.$toast.success(res.message)
        this.isAda = false
        this.show = false
      }).catch(() => {})
    },
    adaptInfo () {
      this.item = JSON.parse(JSON.stringify(this.infoData))
      this.isShow = true
    },
    fetchData () {
      this.listQuery.userName = toNull(this.listQuery.userName)
      // console.log('检测需要的参数： ', this.listQuery)

      this.$http.post(`${lookMember}?offset=${this.listQuery.offset}&limit=${this.listQuery.limit}`, this.listQuery).then(res => {
        this.listQuery.offset = this.listQuery.offset + 1
        this.error = false
        if (res.data && res.data.rows) {
          this.listData = this.listData.concat(res.data.rows)
          // this.listData = res.data.rows

          this.listLoading = false
          if (res.data.rows.length < this.listQuery.limit) {
            this.finished = true
          }
        } else {
          this.listLoading = false
          this.finished = true
        }
      }).catch(() => {
        this.listLoading = false
        this.error = true
      })
    },
    onSearch () {
      this.listQuery.offset = 1
      this.listData = []
      this.fetchData()
    },
    setAdmin () {
      this.$dialog.confirm({
        closeOnPopstate: true,
        message: '确定将该用户设为管理员吗？'
      }).then(() => {
        console.log(this.infoData)
        this.$http.post(userAdmin, {
          aiUserId: this.infoData.id,
          departmentId: this.$store.getters.departmentId
        }).then((res) => {
          this.$toast.success(res.message)
          this.isShow = false
          this.isShow = false
        }).catch(() => {})
      }).catch(() => {})
    },
    handleDel (id, index) {
      this.$dialog.confirm({
        closeOnPopstate: true,
        message: '确定删除吗？'
      }).then(() => {
        const from = {
          ids: [id],
          departmentId: this.$store.getters.departmentId
        }
        const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
        this.$http.delete(lookMember, {data: from})
          .then(res => {
            ToastLoading.clear()
            this.listData.splice(index, 1)
            this.$toast.success('删除成功')
          }).catch(() => { ToastLoading.clear() })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.infobox {
  width: 300px;
}
.page /deep/ .van-popup {
  border-radius: 5px;
}
.list {
  .head {
    margin-right: 10px;
  }
}
</style>
