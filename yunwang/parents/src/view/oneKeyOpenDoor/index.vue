<template>
  <div>
    <!-- <div v-transfer-dom>
      <x-dialog v-model="isShowcarms"></x-dialog>
    </div> -->
    <div class="check-carams" v-if="steps === 0">
      <h3>请选择开闸通道:</h3>
      <group>
        <!-- <cell :class="currentIndex === index ? 'activesBtn' : ''" v-for="(check, index) in selectCarmas" :key="index"  :title="check.title" :value="check.id" @touchstart.native="userSelect(check.id, index)">
        </cell> -->
        <div :class="currentIndex == index ? 'activesBtn' : ''" v-for="(check, index) in gateOpeningChannel" :key="check.id" @click="userSelect(check.localId, index)">
        {{check.localName}}</div>
      </group>
      <XButton  type='primary' class="openButtons" @click.native="oneKeyOpenDoor">
        一键开闸
      </XButton>
      <div class="box-bind-manager-on" @click="selectUsers">查询用户记录</div>
    </div>
    <!--  v-if="steps === 1" -->
    <div class="success-open" v-if="steps === 1">
      <div class="stateImg">
        <h2>{{ openMessage }}</h2>
        <img :src="iconType" alt="" class="stateIcon" />
      </div>
      <group>
        <cell title="用户信息"></cell>
        <cell-form-preview :list="userInfoList"></cell-form-preview>
      </group>
      <XButton
        v-if="isOpenDoorLog"
        type="primary"
        text="查询开闸记录"
        @click.native.prevent="openDoorLog"
        :show-loading="openLoading"
      ></XButton>
      <div class="box-bind-manager-on" @click="selectUsers">前往开闸</div>
    </div>
    <!-- v-else-if="steps === 2" -->
    <div class="open-door-data" v-else-if="steps === 2">
        <!-- 开闸记录card区域 -->
            <scroller :on-infinite="infinite" ref="myscroller" noDataText="没有数据了">
                      <div class="group-title">
          <h2>开闸记录</h2>
          <span style="">一共 {{ total }} 条记录</span>
        </div>
        <div
          class="user-list"
          v-for="(item, index) in userInfoData"
          :key="index"
        >
          <div class="">
            <div class="list-item">
              <span class="l-title">用户名称：</span
              ><span class="r-msg">{{ item.userName }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">手机号：</span
              ><span class="r-msg">{{ item.phone }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">邮箱：</span
              ><span class="r-msg">{{ item.email }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">相机ID：</span
              ><span class="r-msg">{{ item.localId }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">通道名称：</span
              ><span class="r-msg">{{ item.localName }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">开闸时间：</span
              ><span class="r-msg">{{ item.date }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">部门ID：</span
              ><span class="r-msg">{{ item.departmentId }}</span>
            </div>
          </div>
        </div>
           </scroller>
    </div>
  </div>
</template>
<script>
// 上拉加载更新模块
import InfiniteLoading from 'vue-infinite-loading'
import { getDepInfo, getWxInfo, getUserInfo } from '@/utils/userInfo.js'
import { apiGetCameraId, openRelayRecord, openOutLog } from '@/api/url'
import { formatterTime } from '@/utils/formatter'
import { httpGet } from '@/utils/restful'
import success from '@/assets/success.png'
import error from '@/assets/err.png'
import { TransferDomDirective as TransferDom, Radio, XButton } from 'vux'

export default {
  name: '',
  data () {
    return {
      val: 1, // 下拉页码
      steps: 0,
      success,
      isShowcarms: true,
      iconType: success,
      isOpenDoorLog: true,
      departmentId: getDepInfo().departmentId || '',
      userId: getUserInfo().id || '',
      queryLs: {
        offset: 1,
        limit: 10,
        departmentId: getDepInfo().departmentId || ''
      },
      userInfo: null,
      userInfoList: [],
      openLoading: false,
      total: 7,
      openMessage: '',
      checkedOpt: '',
      selectCarmas: [],
      currentIndex: 100,
      userInfoData: [], // 接收查询到的开闸记录
      gateOpeningChannel: [],
      distance: 100 // 距离页面底部多少距离时触发函数
    }
  },
  components: {
    Radio,
    XButton,
    InfiniteLoading // 上拉加载更新组件
  },
  directives: {
    TransferDom
  },
  created () {
    // this.$vux.loading.show({
    //   text: '正在加载...'
    // })
    // console.log('获取用户ID', getUserInfo().id)
    // console.log('获取Token', getUserInfo().token)

    if (!getUserInfo().id || !getUserInfo().token) {
      let querys = Object.assign({}, this.$route.query, {
        redirect: this.$route.path
      })
      this.$router.replace({
        path: '/faceAI/userModel/bind/zhLogin',
        query: querys
      })
      this.$vux.loading.hide()
    } else {
      this.getPassageWay()
      this.userInfo = getUserInfo()
      this.userInfo.uickName = getWxInfo().nickName
    }

    this.userInfoList = [
      {
        label: '微信名称',
        value: this.userInfo.uickName
      },
      {
        label: '电话号码',
        value: this.userInfo.phone
      },
      {
        label: '公司名称',
        value: this.userInfo.leader
      },
      {
        label: '地址',
        value: this.userInfo.addr
      }
    ]
    this.getPassageWay()
  },
  methods: {
    // 页面触底时执行的函数
    infinite (done) {
      let _this = this
      setTimeout(() => {
        if (_this.total - 5 * _this.val < 0) {
          _this.$refs.myscroller.finishInfinite(true)
        } else {
          _this.val++
          _this.openDoorLog(done)
        }
      }, 1000)
    },
    // 根据部门获取通道信息
    getPassageWay () {
      var departmentId = this.queryLs.departmentId
      console.log(departmentId)
      let configs = {
        baseURL: process.env.API_HOST + '/pb/pv'
      }
      // httpGet('http://cy.40mi.com/aiToken/pageByDepartmentId', +'departmentId' + departmentId, configs)
      httpGet(apiGetCameraId, {departmentId: this.departmentId, aiDutyCompanyId: this.userId}, configs)
        .then(res => {
          this.gateOpeningChannel = res.data
        }
        )
        .catch(
          err => {
            console.log(err, '通道信息失败aaaaa')
          }
        )
    },
    selectUsers () {
      if (this.steps === 0) {
        this.steps = 1
      } else if (this.steps === 1) {
        this.steps = 0
      }
    },
    userSelect (id, index) {
      console.log('用户选择', id)
      this.checkedOpt = id
      this.currentIndex = index
    },
    openDisDoor () {
      const config = {
        baseURL: process.env.API_HOST + '/pb/pv',
        headers: {
          AdminToken: getUserInfo().token
        }
      }

      // console.log('用户信息', getUserInfo())
      // var departmentId = this.queryLs.departmentId
      // {departmentId: 1654, aiDutyCompanyId: 658}
      httpGet(apiGetCameraId, {departmentId: this.departmentId, aiDutyCompanyId: this.userId}, config)
        .then(res => {
          console.log('查询到的相机信息：', res, this.departmentId + '---' + this.userId)
          if (res && res.data && res.data.rows.length > 0) {
            res.data.rows.forEach((item, index) => {
              const objs = {
                id: item.id,
                title: item.localName
              }
              this.selectCarmas.push(objs)
            })
          } else {
            this.$vux.loading.hide()
            this.$vux.toast.text('相机数据为空！', 'bottom')
          }
          // console.log('请求成功： ', res)
        })
        .catch(err => {
          this.$vux.loading.hide()
          this.$vux.toast.text('查询相机失败', 'bottom')
          console.log('请求相机失败：', err)
        })
    },
    // 点击一键开闸时调用的接口
    oneKeyOpenDoor () {
      if (this.checkedOpt) {
        // let { id } = this.checkedOpt
        let id = this.checkedOpt
        // console.log('开始请求用户数据：', `${openRelayRecord}${id}/${this.departmentId}/${this.userId}`)
        console.log('开始请求用户数据：', openRelayRecord + id + this.departmentId + this.userId)
        // , {}, { baseURL: process.env.API_HOST }
        let configs = {
          baseURL: process.env.API_HOST + '/pb/pv'
        }
        httpGet(
          // checkedOpt(相机id)
          // v1/ai/aiApp/openRelayRecord/{aiTokenId}/{departmentId}/{userId}
          // openRelayRecord + id + this.departmentId + this.userId,
          '/v1/ai/oa/openRelayRecord',
          {aiTokenId: this.checkedOpt, departmentId: this.departmentId, userId: this.userId},
          configs
        ).then(res => {
          console.log('开闸数据信息：', res.code)
          if (res.code === 1) {
            this.$vux.loading.hide()
            this.userInfoList = [
              {
                label: '微信名称',
                value: this.userInfo.uickName
              },
              {
                label: '电话号码',
                value: this.userInfo.phone
              },
              {
                label: '公司名称',
                value: this.userInfo.leader
              },
              {
                label: '地址',
                value: this.userInfo.addr
              }
            ]
            this.iconType = success
            this.openMessage = '开闸成功'
            this.isOpenDoorLog = true
            this.steps = 1
            this.$vux.toast.text(res.message, 'bottom')
          } else {
            this.$vux.toast.text(res.message, 'bottom')
            this.errMsg()
            this.$vux.loading.hide()
          }
        }).catch(() => {
          httpGet(
            // checkedOpt(相机id)
            // v1/ai/aiApp/openRelayRecord/{aiTokenId}/{departmentId}/{userId}
            // openRelayRecord + id + this.departmentId + this.userId,
            '/v1/ai/oa/openRelayRecord',
            {aiTokenId: this.checkedOpt, departmentId: this.departmentId, userId: this.userId},
            configs
          )
            .then(res => {
              console.log('开闸数据信息：', res.code)
              if (res.code === 1) {
                this.$vux.loading.hide()
                this.userInfoList = [
                  {
                    label: '微信名称',
                    value: this.userInfo.uickName
                  },
                  {
                    label: '电话号码',
                    value: this.userInfo.phone
                  },
                  {
                    label: '公司名称',
                    value: this.userInfo.leader
                  },
                  {
                    label: '地址',
                    value: this.userInfo.addr
                  }
                ]
                this.iconType = success
                this.openMessage = '开闸成功'
                this.isOpenDoorLog = true
                this.steps = 1
                this.$vux.toast.text(res.message, 'bottom')
              } else {
                this.$vux.toast.text(res.message, 'bottom')
                this.errMsg()
                this.$vux.loading.hide()
              }
            })
            .catch(err => {
              console.log('开闸失败236行： ', err)
              this.$vux.toast.text(err, 'bottom')
              this.$vux.loading.hide()
              this.errMsg()
              this.steps = 1
              console.log('跳到catch里')
            })
        })
      } else {
        this.$vux.toast.text('请选择开闸通道', 'bottom')
      }
    },
    errMsg () {
      this.iconType = error
      // this.steps = 1
      this.isOpenDoorLog = true
      this.openMessage = '开闸失败'
      this.userInfoList = [
        {
          label: '微信名称',
          value: this.userInfo.uickName
        },
        {
          label: '电话号码',
          value: this.userInfo.phone
        },
        {
          label: '公司名称',
          value: this.userInfo.leader
        },
        {
          label: '地址',
          value: this.userInfo.addr
        }
      ]
    },
    // 查询开闸记录
    openDoorLog () {
      // console.log('导出记录')
      let configs = {
        baseURL: process.env.API_HOST + '/pb/pv'
      }
      this.openLoading = true
      // this.departmentId 1654 this.userId 658
      httpGet(openOutLog, { departmentId: this.departmentId, userId: this.userId, offset: this.val, limit: 5 }, configs)
        .then(res => {
          console.log('查询成功！', res)
          if (res.code === 1 && res.data && res.data.rows) {
            this.total = res.data.total
            Array.from(res.data.rows).forEach(item => {
              item.date = formatterTime(item.date)
              return item
            })
            this.userInfoData = this.userInfoData.concat(res.data.rows)
            this.openLoading = false
            this.steps = 2
          }
          this.openLoading = false
          this.$refs.myscroller.finishInfinite(true)
        })
        .catch(err => {
          console.log('查询失败：', err)
          this.openLoading = false
        })
      // 测试服接口需要调取两次才可以请求成功，正式服不用，所以build时注释下面这段
      // httpGet(openOutLog, { departmentId: this.departmentId, userId: this.userId, offset: this.val, limit: 5 }, configs)
      //   .then(res => {
      //     console.log('查询成功！', res)
      //     if (res.code === 1 && res.data && res.data.rows) {
      //       this.total = res.data.total
      //       Array.from(res.data.rows).forEach(item => {
      //         item.date = formatterTime(item.date)
      //         return item
      //       })
      //       this.userInfoData = this.userInfoData.concat(res.data.rows)
      //       this.openLoading = false
      //       this.steps = 2
      //     }
      //     this.openLoading = false
      //     this.$refs.myscroller.finishInfinite(true)
      //   })
      //   .catch(err => {
      //     console.log('查询失败：', err)
      //     this.openLoading = false
      //   })
    }
  }
}
</script>
<style lang="scss" scoped>

.check-carams{
  div{
    height: 2.5rem;
    line-height: 2.5rem;
    border-bottom:1px solid #E8E8E8;
  }
}
.success-open {
  margin: 2rem auto;
  color: #666;
  .stateImg {
    display: flex;
    justify-content: space-around;
    align-items: center;
    h2 {
      color: #666;
      font-size: 2rem;
    }
  }

  .stateIcon {
    width: 5rem;
    height: 5rem;
    display: block;
  }
  .weui-btn {
    width: 50%;
    margin-top: 3rem;
  }
}
.open-door-data {
  height: 100%;
  margin: auto;
  .user-list {
    width: 80%;
    margin: 6px auto;
    border: 1px solid #f1f1f1;
    padding: 1rem;
    border-radius: 20px;
    margin-bottom: 2rem;
    box-shadow: 0 0 2px 2px #999;
    .list-item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: 1px solid #eee;
      margin-bottom: 1rem;
      .l-title {
        flex: 4;
        justify-self: flex-end;
        text-align: right;
        padding-right: 1rem;
      }
      .r-msg {
        flex: 6;
        justify-self: flex-start;
        text-align: left;
      }
    }
  }
}
.group-title {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.openButtons {
  position: fixed;
  bottom: 50px;
  width: 50vw;
  left: 50%;
  margin-left: -25vw;
}

.activesBtn {
  background-color: bisque;
}
.box-bind-manager-on{
   border-top: 1px solid rgb(31, 114, 28);
  border-right: 1px solid rgb(31, 114, 28);
  border-bottom: 1px solid rgb(31, 114, 28);
  border-top-right-radius: 1.25rem;
  border-bottom-right-radius: 1.25rem;
  background-color: #e8fae8;
  color: rgb(31, 114, 28);
  width: 8rem;
  font-size: 1rem;
  letter-spacing: 0.0625rem;
  padding: 0.1875rem 0;
  // display: block;
  float: left;
  margin-top: 22rem;
}
</style>
