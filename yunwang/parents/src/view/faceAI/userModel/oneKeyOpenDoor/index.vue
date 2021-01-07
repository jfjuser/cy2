<template>
  <div>
    <div class="success-open" v-if="steps === 1" >
      <div class="stateImg">
        <h2>开闸成功</h2>
        <img :src="success" alt="" class="stateIcon" />
      </div>
      <group>
        <cell title="用户信息"></cell>
        <cell-form-preview :list="userInfoList"></cell-form-preview>
      </group>
      <x-button
        type="primary"
        text="查询开闸记录"
        @click.native.prevent="openDoorLog"
        :show-loading="openLoading"
      ></x-button>
    </div>
    <div class="open-door-data"  v-else-if="steps === 2">
      <group>
        <h2>开闸记录</h2>
        <div
          class="user-list"
          v-for="(item, index) in userInfoData"
          :key="index"
        >
          <div class="" v-if="userInfoData.length > 0">
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
      </group>
    </div>
  </div>
</template>
<script>
import { getDepInfo, getWxInfo, getUserInfo } from '@/utils/userInfo.js'
import { apiGetCameraId, openRelayRecord, openOutLog } from '@/api/url'
import { formatterTime } from '@/utils/formatter'
import { httpGet } from '@/utils/restful'
import success from '@/assets/success.png'
export default {
  name: '',
  data () {
    return {
      steps: 0,
      success,
      departmentId: getDepInfo().departmentId || '',
      userId: getUserInfo().id || '',
      queryLs: {
        offset: 1,
        limit: 1,
        departmentId: getDepInfo().departmentId || ''
      },
      userInfo: null,
      userInfoList: [],
      openLoading: false,
      total: 7,
      userInfoData: [
        {
          id: 34,
          userId: 52993,
          userName: '王泽敏',
          phone: '13778031361',
          email: null,
          localId: 13366,
          localName: '一期东门道闸入口02',
          date: formatterTime(1594445372000),
          departmentId: 8279
        }
      ]
    }
  },
  created () {
    this.$vux.loading.show({
      text: '正在加载...'
    })
    if (!getUserInfo().id || !getUserInfo().token) {
      let redirects = this.$route.query
      this.$router.replace({
        path: this.$route.path,
        query: redirects
      })
      this.getPassageWay()
      this.$vux.loading.hide()
    } else {
      this.openDisDoor()
      this.userInfo = getUserInfo()
      this.userInfo.uickName = getWxInfo().nickName
      this.getPassageWay()
    }
  },
  methods: {
    openDisDoor () {
      let config = {
        // baseURL: process.env.API_HOST + 'pb/pv/',
        // headers: {
        //   AdminToken: getUserInfo().token
        // }
      }
      console.log('用户信息： ', this.userInfo)

      httpGet(apiGetCameraId, this.queryLs, config)
        .then(res => {
          if (res && res.data && res.data.rows.length > 0) {
            let { id } = res.data.rows[0]
            httpGet(
              openRelayRecord + id + '/' + this.departmentId + '/' + this.userId
            ).then(res => {
              console.log('数据信息： ', res)
              if (res.code === 1) {
                this.userInfoList = [
                  {
                    label: '用户名称',
                    value: this.userInfo.uickName
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
                this.steps = 1
                this.$vux.toast.text(res.message, 'bottom')
              } else {
                this.$vux.toast.text(res.message, 'bottom')
              }
              this.$vux.loading.hide()
            })
          } else {
            this.$vux.loading.hide()
            this.$vux.toast.text('相机数据为空！', 'bottom')
          }
          console.log('请求成功： ', res)
        })
        .catch(err => {
          this.$vux.loading.hide()
          console.log('error', err)
        })
    },
    openDoorLog () {
      console.log('导出记录')

      this.openLoading = true
      httpGet(openOutLog + this.departmentId + '/' + this.userId)
        .then(res => {
          console.log('查询成功！', res)
          this.openLoading = false
          this.steps = 2
        })
        .catch(err => {
          console.log('查询失败：', err)
          this.openLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
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
  margin: auto;
  .user-list {
    width: 80%;
    margin: 0 auto;
    border: 1px solid #f1f1f1;
    padding: 1rem;
    border-radius: 20px;
    margin-bottom: 2rem;
    .list-item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: 1px solid #eee;
      margin-bottom: 1rem;
      .l-title {
        flex: 3;
        justify-self: flex-end;
        text-align: right;
        padding-right: 2rem;
      }
      .r-msg {
        flex: 7;
        justify-self: flex-start;
        text-align: left;
      }
    }
  }
}
</style>
