<template>
  <div class="add-div">
    <!-- 广告区域，客户要求去除 -->
    <!-- <div style="width:100%;height:24vh;overflow:hidden;">
      <Swipe style="height:24vh;" :autoplay="3000" indicator-color="#1E90FF">
        <SwipeItem><img src="@/assets/pic/2.jpg" class="img"/></SwipeItem>

        <SwipeItem><img src="@/assets/pic/3.jpg" class="img"/></SwipeItem>

        <SwipeItem><img src="@/assets/pic/1.jpg" class="img"/></SwipeItem>
      </Swipe>
    </div> -->
    <!-- 使用添加人员组件 -->
    <AddUser v-if="active !== 3" />
    <!-- 使用用户信息展示组件 -->
    <UserInfo v-else />
    <!-- 后期需改。。。。。。。。。。。 -->
    <tabbar :param="1"></tabbar>
    <!-- 新增元素信息 -->
    <div class="sile-bar">
      <div class="flex-wrap">
        <van-button
          type="primary"
          @touchstart="isPhoneShow = true"
          square
          size="small"
          color="#0066FF"
          >绑定账号</van-button
        >
      </div>
    </div>
    <van-dialog
      v-model="isPhoneShow"
      title="查询个人考勤"
      show-confirm-button
      show-cancel-button
      @confirm="userCheckPhone"
      @close="phone = ''"
    >
      <div class="phone-wrap" v-if="isPhoneShow" title="手机号码">
        <p class="title">请输入手机号码查询个人考勤信息</p>
        <van-field
          class="phone-box"
          v-model="phone"
          clearable
          maxlength="11"
          type="number"
          placeholder="请输入手机号码..."
        >
        </van-field>
      </div>
    </van-dialog>
    <van-dialog
      class=""
      v-model="isShowAttendance"
      title="考勤信息"
      :show-confirm-button="false"
      show-cancel-button
      @confirm="userCheckPhone"
    >
      <div class="user-addtendance-list">
        <van-cell-group v-if="userAttendance && userAttendance.length > 0">
          <van-cell
            @click="selectAttendance(index)"
            :value-class="item.user?'':'empty'"
            v-for="(item, index) in userAttendance"
            :key="index"
            :title="item.departmentName"
            :value="item.user ? item.user.userName : '用户信息为空'"
            :label="item.id"
          />
        </van-cell-group>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import tabbar from '@/components/tabbar'
import { apiGetUserInfo, getBaseInfo } from '@/api/url'
import { Swipe, SwipeItem, NavBar } from 'vant'
import { httpGet } from '@/utils/restful'
import { mapGetters, mapActions } from 'vuex' // 引入vuex辅助函数Dialog
import AddUser from './components/addUser'
import UserInfo from './components/userInfo'
export default {
  name: 'addInfo',
  data () {
    return {
      isPhoneShow: false,
      isShowAttendance: false,
      phone: '',
      userAttendance: [] // 存储考勤数据信息
    }
  },
  mounted () {
  },
  created () {
    // console.log('查看当前状态： ', this.active)

  },
  components: {
    Swipe,
    SwipeItem,
    tabbar,
    AddUser,
    UserInfo,
    vanNavBar: NavBar
  },
  computed: {
    ...mapGetters('user', [
      'wxInfo',
      'userId',
      'userInfo',
      'active'
    ])
  },
  methods: {
    ...mapActions('user', [
      'SaveDepartmentId',
      'SaveUserId',
      'SaveUserInfo',
      'SaveActive',
      'SaveUerStatus'
    ]),
    selectAttendance (index) {
      if (
        this.userAttendance[index].user &&
        this.userAttendance[index].user.id
      ) {
        // console.log('用户正在选择...', this.userAttendance[index].user)
        let userInfo = Object.assign(this.userAttendance[index].user, {
          companyName: this.userAttendance[index].departmentName,
          depName: this.userAttendance[index].user.dutyCompanyName
        })
        let userId = this.userAttendance[index].user.id
        // console.log('用户id数据', userId)
        // console.log('用户userInfo数据', userInfo)
        this.SaveUserId(userId) // 存储信息
        this.SaveUserInfo(userInfo) // 存储用户信息
        this.SaveActive(3) // 记录当前状态
        this.isShowAttendance = false

        this.phone = '' // 制空
      } else {
        this.$toast.fail('当前的用户信息数据为空！')
        this.isShowAttendance = false
        this.phone = '' // 制空
      }
    },
    // 【先请求一些返回信息到底有没有审核通过】
    getTagStatus () {
      if (!(this.$route.params && this.$route.params.tag)) return
      let getTag = this.$route.params.tag
      console.log('查看参数：', getTag)
      if (getTag === 3) {
        this.SaveActive(getTag).then(() => {
          // 存储状态信息
          this.$notify({
            type: 'success',
            duration: 3000,
            message: '你已加入过考勤组，可直接跳过'
          })
        })
      } else {
        console.log('getTag', getTag)
        // this.SaveActive(getTag) // 存储状态信息
      }
    },
    // 手机号获取用户考勤信息
    userCheckPhone () {
      // console.log('用户输入的手机号', this.phone)
      // let reg = /^[1][3-9][0-9]\d{8}$/
      if (this.phone === '') {
        return this.$toast.fail('手机号码不可为空！')
        //  || !reg.test(this.phone)
      } else if (this.phone.length !== 11) {
        return this.$toast.fail('手机号码格式不对！')
        //  && reg.test(this.phone)
      } else if (this.phone.length === 11) {
        // 下一步操作...
        // console.log('发起手机请求考勤信息...')
        this.sendPhoneGetUser(this.phone) // 开始发送请求
      }
    },
    // 通过手机号码获取账户考勤信息
    sendPhoneGetUser (phone) {
      if (process.env.NODE_ENV === 'development') {
        // this.wxInfo.id = 17524
        // this.wxInfo.id = 17161625
      }
      // console.log('查看用户的微信信息', this.wxInfo.id)
      const setLoading = this.$toast.loading({
        mask: true,
        message: '正在获取...',
        duration: 0
      })
      // 发起请求
      // 这个接口是绑定手机号的
      httpGet(apiGetUserInfo + '/' + phone + '/' + this.wxInfo.id)
        .then(res => {
          // console.log('通过手机号获取成功信息：', res)
          // console.log('通过手机号获取成功信息：', res, '开始请求考勤信息', this.wxInfo.unicode, this.wxInfo.account)
          if (this.wxInfo.unicode && this.wxInfo.account) {
            httpGet(
              getBaseInfo +
                '/' +
                this.wxInfo.unicode +
                '/' +
                this.wxInfo.account
            ).then(resault => {
              if (process.env.NODE_ENV === 'development') {
                resault = resault.default
              } // 测试使用
              // console.log('通过手机号获取考勤：', resault)
              setLoading.clear()
              if (resault.data && resault.data.length > 0) {
                this.userAttendance = resault.data // 去除重复id
                this.isShowAttendance = true // 显示选择考勤组信息
              } else {
                this.$notify({
                  type: 'danger',
                  message: '当前考勤数据为空！'
                })
                setLoading.clear()
                this.isShowAttendance = false
                this.phone = '' // 制空
              }
            })
          }
        })
        .catch(error => {
          setLoading.clear()
          this.isPhoneShow = true
          console.log('通过手机号获取信息失败：', error)
        })
    },
    /** ********  【 去除数组对象方法 】  **********/
    setUniqueness (arr) {
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        // let length = arr.length
        let keys = 'id' // 设置需要去除重复的唯一 key ID值
        let map = new Map() // 创建map实现除重
        for (let key of arr) {
          console.log('考勤id：', key.id)
          console.log(
            '用户id：',
            key.user ? key.user.id : 'null',
            '用户名：',
            key.user ? key.user.userName : 'null'
          )

          if (!map.has(key[keys])) {
            // 检测map里没有keys就设置推送
            map.set(key[keys], key)
          }
        }
        return [...map.values()] // return 最终结果
      }
    }

  }

}
</script>

<style lang="scss" scoped>

.spanNext {
  text-decoration: underline;
  color: #399dd0;
  position: absolute;
  right: 5rem;
}
.img {
  width: 100vw;
  display: block;
  height: 24vh;
  overflow: hidden;
  // max-width:100%;
  // max-height:100%;
}
.add-div >>> {
  position: relative;
  height: 100%;
  padding-bottom: calc(3rem + 50px);
  .user-addtendance-list {
    height: 30vh;
    overflow: auto;
    .empty{
        span{
          color: red;
        }
    }
  }
}
.sile-bar {
  height: 3rem;
  border-bottom: 1px solid #ddd;
  position: fixed;
  bottom: 50px;
  width: 100%;
  overflow: hidden;
  .flex-wrap {
    width: auto;
    height: 100%;
    box-sizing: border-box;
    vertical-align: middle;
    white-space: nowrap;
    overflow: auto;
    padding: 0.3rem 1rem;
    & > button {
      display: inline-block;
      height: 100%;
    }
  }
}
.phone-wrap >>> {
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  border-radius: 10px;
  padding: 0 1rem;
  .van-field {
    border: 1px solid #dddd;
    margin: 1.5rem 0;
  }
  .title {
    color: #666;
    font-size: 1rem;
  }
}
</style>
