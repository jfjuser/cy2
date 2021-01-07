<template>
  <div class="auth-box">
    <!-- <Tag type='success' size=large mark>未获取到用户授权，请退出重试！</Tag> -->
    <van-dialog
      @confirm="queCom"
      show-confirm-button
      show-cancel-button
      @cancel='userCancel'
      width="80vw"
      title="请选择要进入的公司"
      v-model="isShow"
    >
      <RadioGroup v-model="radio">
        <CellGroup>
          <van-cell
            v-for="(item, index) in userInfo"
            :key="index"
            :title="item.departmentName?'公司：'+item.departmentName:'公司：'+'公司为空！'"
            :label="item.user?'用户名：'+item.user.userName:'用户名：'+'用户名为空！'"
            :class="item.user && item.user.userName?'':'user-empty'"
            clickable
            @click="radio = index"
          >
            <van-radio style="margin-left:30vw" :name="index" />
          </van-cell>
        </CellGroup>
      </RadioGroup>
    </van-dialog>
  </div>
</template>
<script>
import { httpGet } from '@/utils/restful'
import { getCodeSome, getBaseInfo } from '@/api/url'
import { Tag, CellGroup, Loading, Cell, RadioGroup, Radio, Field } from 'vant'
import {mapActions, mapGetters} from 'vuex' // 引入vuex辅助函数
export default {
  data: () => ({
    isShow: false,
    userInfo: [],
    Oorigin: '', // 获取当前地址源
    radio: 0
  }),
  components: {
    Tag,
    Loading,
    CellGroup,
    'van-cell': Cell,
    RadioGroup,
    'van-radio': Radio,
    'van-field': Field
  },
  mounted () {
    this.getCode()
  },
  created () {
    // 开发环境测试配置
    if (process.env.NODE_ENV === 'development') {
      let tempInfo =
        {'id': 17162547,
          'source': 5,
          'account': 'wx023544aa74a35288',
          'unicode': 'oWhIZwysfSMxnFTd7bTvwWirWP0U',
          'userName': null,
          'nickName': '錦',
          'phone': null,
          'email': null,
          'sex': 1,
          'province': '广东',
          'city': '汕头',
          'country': '中国',
          'headImgUrl': 'http://thirdwx.qlogo.cn/mmopen/vi_32/seibGiaVPEcDP9RoN6PUQk1hzslqfarxlp9V2JqXZia7ficLgvcicI6YiaYtA3MuTTbXzGrtsgXOKTomb1ViaXZBEbDtw/132'
        }
      this.SaveWxInfo(tempInfo) // 存储临时信息...
    }
    // 每次进来重置o
    this.SaveUerStatus(0)
  },
  computed: {
    ...mapGetters('user', [
      'wxOrigin',
      'userId',
      'active',
      'loginState'
    ])
  },
  methods: {
    ...mapActions('user', ['SaveWxOrigin', 'SaveWxInfo', 'SaveUserId', 'SaveUserInfo', 'SaveActive', 'SaveUerStatus', 'SaveDepartmentId']),
    // 检测数组唯一性
    uniquenessArr (arr, key = 'id') {
      // console.log('查看需要去重的数据：', arr)
      if (arr.length <= 1) { return arr }
      let temp = {}
      let newArr = arr.reduce((v, next) => { // 利用reduce检测
        console.log('next.user', next.user)
        if (next.user && next.user.id) { // 判断是否含有用户信息
          console.log('nextID', next.user, next.user.id)

          // eslint-disable-next-line
        // temp[next[key]] ? '' : temp[next[key]] = true && v.push(next)
          if (!temp[next[key]]) {
            temp[next[key]] = true && v.push(next)
          }
          return v
        }
      }, [])
      console.log('去重之后的数组： ', newArr)
      return newArr
    },
    getCode () {
      // 获取openId
      // 微信用户临时身份号
      // let code = this.$route.query.code
      // let account = this.$route.query.account
      const setLoading = this.$toast.loading({mask: true, message: '正在加载...', duration: 0})
      if (process.env.NODE_ENV === 'development') {
        console.log('当前在开发环境。。。： ', process.env.NODE_ENV)
        // 开发环境。。。
        this.Oorigin = 'http://cy.40mi.com/attendance/user/?account=wx023544aa74a35288&code=021DHH000cqacK1Wtt200uwPw23DHH03&state=#/addInfo/?tid=1'
      } else {
        console.log('当前在生产环境： ', process.env.NODE_ENV)
        // 生产环境...
        this.Oorigin = this.wxOrigin ? this.wxOrigin : window.location.href // 获取当前地址进行操作。。。
      }
      this.SaveWxOrigin(this.Oorigin)// 暂存获取wx信息地址栏

      // console.log('查询当前访问的地址： ', this.Oorigin)
      this.$nextTick(() => {
        let code = ((this.Oorigin.split('?')[1] || '').split('&')[1] || '').substring(5) // 截取当前微信地址的 code码
        let account = ((this.Oorigin.split('?')[1] || '').split('&')[0] || '').substring(8) // 截取当前微信地址的 account码

        // console.log('获取微信code:', code)
        // console.log('获取微信account:', account)
        if (code) {
          // 拿code去获取openId
          httpGet(getCodeSome, {
            account: account,
            unicode: code
          })
            .then(res => {
              // console.log('获取微信信息成功：', res)
              if (process.env.NODE_ENV === 'development') { res.data = res.default.data }// 测试环境使用
              if (!res.data) {
                // console.log('微信信息获取失败！', res.default.data)
                this.SaveActive(0).then(() => {
                  this.$toast.fail('微信信息获取失败！')
                  setLoading.clear() // 结束loading
                  this.$router.replace({name: 'addInfo'})
                })
              }
              // localStorage.setItem('wxInfo', JSON.stringify(res.data))
              // console.log('获取到的微信信息：', res.data.default[0])
              if (process.env.NODE_ENV === 'development') { // 测试环境使用
                res.data = res.default.data
              }
              // console.log('查看获取到的微信信息：', res.data)

              this.SaveWxInfo(res.data).then(() => { // 存储用户Wx信息
              // 请求当前的考勤信息
                httpGet(
                  getBaseInfo + '/' + res.data.unicode + '/' + res.data.account
                )
                  .then(res => {
                    this.userInfo = res.data
                    if (process.env.NODE_ENV === 'development') { // 测试环境使用
                      this.userInfo = res.default.data
                      // this.userInfo = res.default.data.concat(res.default.data).concat(res.default.data).concat(res.default.data).concat(res.default.data).concat(res.default.data)
                    }
                    setLoading.clear() // 结束loading
                    console.log('返回用户考勤信息start: ', this.userInfo)
                    //  this.userInfo = this.uniquenessArr(this.userInfo) // 检测返回数据是否有重复的

                    if (this.userInfo.length > 1) {
                      this.isShow = true
                    } else {
                      // console.log('查看返回的用户考勤信息：', this.userInfo)
                      console.log(this.userInfo[0].id + 'cjs')
                      let userInfo = Object.assign(this.userInfo[0].user, {
                        companyName: this.userInfo[0].departmentName,
                        depName: this.userInfo[0].user.dutyCompanyName
                      })
                      let userId = this.userInfo[0].user.id
                      // console.log('查看获取到userInfo的信息： ', userInfo)
                      // console.log('userId:', userId)
                      this.SaveDepartmentId(this.userInfo[0].id)
                      this.SaveUserId(userId) // 存储userId
                      this.SaveUserInfo(userInfo) // 存储用户数据

                      if (this.loginState && this.loginState === 1) {
                        this.SaveActive(3).then(() => {
                          this.$router.replace('/addInfo/?tid=1')
                        })
                      } else {
                        this.SaveActive(0).then(() => {
                          this.$router.replace('/addInfo/?tid=1')
                        })
                      }

                      // 原始配置
                      // localStorage.setItem('userid', userId)
                      // localStorage.setItem('userInfo', JSON.stringify(userInfo))

                      // this.$router.replace('/addInfo/?tid=0') //
                    }
                  })
                  .catch(err => {
                    // this.$toast.fail(err)
                    console.log('返回用户考勤信息失败： ', err)
                    setLoading.clear() // 结束loading
                    this.SaveActive(0).then(() => {
                      this.$router.replace('/addInfo/?tid=0')
                    })
                  })
              })
            })
            .catch((err) => {
              console.log('微信信息获取失败。。', err)
              setLoading.clear() // 结束loading
              // this.$router.replace('/addInfo/?tid=0')
              this.SaveActive(0).then(() => {
                this.$notify('没有获取到微信的基本信息!')
                this.$router.replace('/addInfo/?tid=0')
              })
            })
          // 拿code去换用户信息【需后端接口】
          // 储存起来
        } else {
          this.$notify('未授权登录,请退出重试')
          setLoading.clear() // 结束loading
          this.$router.replace('/addInfo/?tid=0')
        }

        // 测试阶段，不做授权阻拦 打包后去掉
        // this.$router.replace('/addInfo/?tid=1')
      })
    },
    queCom () {
      // console.log('开启公司选择...', this.userInfo[this.radio])
      if (this.userInfo[this.radio].user && this.userInfo[this.radio].user.id) {
        let userInfo = Object.assign(this.userInfo[this.radio].user, {
          companyName: this.userInfo[this.radio].departmentName,
          depName: this.userInfo[this.radio].user.dutyCompanyName
        })
        let userId = this.userInfo[this.radio].user.id
        console.log('用户信息：', userInfo)
        this.SaveDepartmentId(this.userInfo[this.radio].id)
        this.SaveUserId(userId)// 存储信息
        this.SaveUserInfo(userInfo)//
        this.SaveActive(1).then(() => {
          this.$router.replace('/addInfo/?tid=1')
        })
      } else {
        this.$dialog.confirm({
          title: '用户信息为空，请重新选择！',
          showCancelButton: false,
          showConfirmButton: true
        }).then(() => { this.isShow = true })
      }
    },
    userCancel () {
      this.SaveUserId('')// 存储信息
      this.SaveUserInfo('')//
      this.SaveActive(0).then(() => {
        this.$router.replace('/addInfo/?tid=0')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.auth-box >>> {
  // background: #999;
  height: 100%;
  width: 100%;
  text-align: center;
  .van-dialog__content{
    height: 30vh;
    overflow: auto;
  }
  .van-cell__title{
    text-align: left;
  }
  .user-empty .van-cell__label{
    color: rgb(235, 18, 18);
  }
}

.phone-box >>> {
  padding: 0.5rem 0.5rem;
  margin-bottom: 1rem;
}
.phone-button {
  width: 50%;
}
</style>
