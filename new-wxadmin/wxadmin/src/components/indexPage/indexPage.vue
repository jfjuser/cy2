<template>
    <div class="container">
       <div class="swiper-div" v-show="active === 0">
          <div style="width:100%;height:25vh;overflow:hidden;" id="content">
            <van-swipe :autoplay="3000" indicator-color="white" class="warpdiv">
              <van-swipe-item class="swiperImg">
                <img src="@/assets/swiper3.jpg" class="img"/>
              </van-swipe-item>
              <van-swipe-item>
                <img src="@/assets/swiper2.jpg" class="img"/>
              </van-swipe-item>
              <van-swipe-item>
                <img src="@/assets/1122.jpg" class="img"/>
              </van-swipe-item>
            </van-swipe>
          </div>
          <!-- background="#ecf9ff"mode="closeable" -->
          <NoticeBar
            color="#1989fa"
            v-show="isSee"
            @click="viewTo"
            text="友情提示：有申请用户待审核！请点击查看"
            left-icon="info-o"
          ></NoticeBar>
            <Button v-show="isBtn" @click="exchangeDe" size=mini style="position:absolute;top:19vh;right:2vw;opacity:0.8;width:4rem;height:2rem">
              <div style="display: flex;justify-content: center;align-items: center;font-size:0.9rem">
                <van-icon name="exchange"/>部门
              </div>
            </Button>
         <Tag mark type="primary" size="large" style="position:absolute;top:20vh">{{title}}</Tag>
         <Popup v-model="isDepart" style="width:96vw;height:96vh;">
           <Cell title="请选择部门" style="font-size:0.95rem">
              <van-icon slot="right-icon" name="cross" class="custom-icon" @click="closeEx"/>
          </Cell>
          <el-tree highlight-current :props="props" node-key="id" :expand-on-click-node="false" :default-expanded-keys="[0]" :load="loadNode" lazy>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span @click="getFun(data)">
                       <el-button type="text">
                          <i :class="isIconFormatter(data.icon)"></i>
                        </el-button>
                        <span>{{ node.label}}</span>
                    </span>
                </span>
              </el-tree>
         </Popup>
        <div class="warp-icon">
          <div class="warp-divicon">
            <div v-for='item in arr' :key=item>
              <div @click="toHistory"  v-show="item === '进出记录管理'"><img src="@/assets/richenganpai.png" width="45"> <span>进出记录</span></div>
              <div @click="toCamera" v-show="item === '相机维护'"><img src="@/assets/camera.png" width="45"> <span>相机维护</span></div>
              <div @click="toTemUser" v-show="item === '体温相机'"><img src="@/assets/manage.png" width="45"><span>体温相机</span></div>
              <div @click="toStaff" v-show="item === '人脸识别'"><img src="@/assets/userManage.png" width="45"><span>人脸识别</span></div>
              <div @click="toTable" v-show="item === '每日统计'"><img src="@/assets/shengbao.png" width="45"> <span>考勤统计</span></div>
              <div @click="toCompany" v-show="item === '考勤管理'"><img src="@/assets/zuzhijigou.png" width="45"><span>考勤管理</span></div>
              <div @click="toManage" v-show="item === '权限管理'"><img src="@/assets/set.png" width="45"><span>权限管理</span></div>
              <div @click="toLED" v-show="item === '工地管理'"><img src="@/assets/userBind.png" width="45"><span>工地管理</span></div>
              <div @click="toLED" v-show="item === '工地管理'"><img src="@/assets/userBind.png" width="45"><span>查询记录</span></div>
            </div>
            <!-- <div style="position:absolute;right:1.6vw;top:42.5%" @click="orderFunction">
              <van-icon name='plus' size=2.8rem></van-icon>
              <div style="margin-top:-3.5rem;"><span>定制功能</span></div>
              </div> -->
          </div>
        </div>
        <!-- mode="closeable" -->
         <NoticeBar
          text="温馨提示：您好，作为管理员请注意保护业主以及用户的个人信息隐私安全。"
          left-icon="volume-o"
        />
         <!-- <Cell title="近期活动" is-link value="更多" class="titleSty"></Cell> -->
        <van-card
            class="dsc"
            :thumb="imageURL"
            >
            <div slot="desc" style="line-height:1.4rem;">
              <span style="font-size:0.8rem">人脸识别，是基于人的脸部特征信息进行身份识别的一种生物识别技术。用摄像机或摄像头采集含有人脸的图像或视频流，并自动在图像中检测和跟踪人脸，进而对检测到的人脸进行脸部识别的一系列相关技术，通常也叫做人像识别、面部识别。
              </span>
              </div>
        </van-card>
        <div style="height: 50px;"></div>
        <Popup v-model="isShow" style="width:80vw;height:30vh">
          <Cell title="企业或部门" style="line-height:1.5rem;font-size:1rem">
            <van-icon name="cross" right-icon/>
          </Cell>
          <Field
            placeholder="请输入"
            v-model="company.userName"
            style="line-height:1.5rem"
          />
          <Button @click="submit" type="info" size=large style="width:60vw;margin:10% 0 0 10vw;border-radius:0.5rem">确定</Button>
        </Popup>
       </div>
         <van-tabbar v-model="active">
            <van-tabbar-item icon="home-o">主页</van-tabbar-item>
            <van-tabbar-item icon="comment" @click="checkMessage">消息</van-tabbar-item>
            <van-tabbar-item icon="manager-o" @click="setPage">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script type="text/javascript">
import $ from 'jquery'
$(document).ready(function () {
  if (window.history && window.history.pushState) {
    $(window).on('popstate', function () {
      window.history.pushState('forward', null, '#')
      window.history.forward(1)
    })
  }
  window.history.pushState('forward', null, '#') // 在IE中必须得有这两行
  window.history.forward(1)
})
</script>
<script>
import { Tabbar, Pagination, Notify, PullRefresh, RadioGroup, Radio, Popup, SwipeCell, Collapse, CollapseItem, Tag, Field, Toast, TabbarItem, Swipe, CellGroup, NoticeBar, Cell, SwipeItem, Button, Icon, Card } from 'vant'
import xiangji from '@/assets/show.jpg'
import { bindCompany, unBindLogin, getRecord, getFunction, getDepartmentTree } from '@/api/url' // , getList
import { httpPost, httpGet } from '@/utils/restful' // , httpGet
import { timeFormatter1, typeToChinese, isIconFormatter } from '@/utils/formatter'
export default {
  name: 'indexPage',
  data () {
    return {
      isIconFormatter: isIconFormatter,
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      isGreat: false,
      isShow: false,
      isBtn: true,
      isDepart: false,
      timeFormatter1: timeFormatter1,
      typeToChinese: typeToChinese,
      allDepartment: undefined,
      departmentTree: undefined,
      departmentArr: undefined,
      companyName: '',
      total: 0,
      listQuery: {
        offset: 1,
        limit: 10,
        type: undefined,
        suggestionSelect: undefined
      },
      menuList: [],
      arr: [],
      menuName: [
        '相机维护',
        '进出记录',
        '人脸识别',
        '权限管理',
        '考勤管理',
        '每日统计',
        '进出记录管理',
        '工地管理',
        '体温相机'
      ],
      imgURL: {
      },
      isSee: false,
      active: 0,
      imageURL: xiangji,
      activeName: '1',
      title: '',
      company: {
        appId: '',
        password: '',
        type: 0,
        unicode: '',
        userName: ''
      }
    }
  },
  components: {
    Button,
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem,
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'van-icon': Icon,
    'van-card': Card,
    Pagination,
    NoticeBar,
    CellGroup,
    Cell,
    Popup,
    Tag,
    Field,
    Collapse,
    CollapseItem,
    RadioGroup,
    Radio,
    SwipeCell,
    PullRefresh
  },
  created () {
    this.getList()
    this.getCont()
    this.title = localStorage.getItem('title')
  },
  methods: {
    getFun (data) {
      console.log(data)
      this.changePart(data)
      this.title = data.name
      localStorage.setItem('title', data.name)
      this.getList()
    },
    loadNode (node, resolve) {
      let self = this
      if (node.level === 0) {
        httpGet(getDepartmentTree + '/0').then(res => {
          if (res.data[0].leaf) {
            self.showDep = false
            resolve([])
          } else {
            setTimeout(() => {
              resolve(res.data)
            }, 500)
          }
        }).catch(() => {})
      } else {
        httpGet(getDepartmentTree + '/' + node.data.id).then(res => {
          if (res.data == null) {
            resolve([])
          } else {
            resolve(res.data)
          }
        }).catch(() => {})
      }
    },
    getCont () {
      httpGet(getRecord + '/' + this.$store.getters.departmentId)
        .then((res) => {
          let x = res.data
          if(x.unCheckAiUserNumber !== 0 || x.unCheckVisitorNumber !== 0) {
            this.isSee = true
          } else {
            this.isSee = false
          }
        }).catch(() => {})
    },
    getList () {
      httpGet(getFunction + this.$store.getters.departmentId)
        .then((res) => {
          if (res.data.type === 0) {
            Notify({
               type: 'primary',
               message: '请检查账号是否是人脸账号'
            })
            httpPost(unBindLogin + '/' + this.$store.getters.userId).then((res) => {
              this.$store.dispatch('WebLogOut').then(() => {
                // this.$router.push('/login/')
                var host = process.env.API_HOST
                var appid = localStorage.getItem('appid')
                var redirectUrl = encodeURIComponent(host + 'face' + '/')
                localStorage.setItem('marks', 123)
                localStorage.setItem('title', '')
                var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base`
                window.location.href = url
                // location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            })
          }
          if (res.message === '暂无数据') {
            Toast('该账号暂无授权可用功能')
          } else {
            this.$store.commit('getFun', res.data.list)
            // session.setAttribute('list', res.data.list)
            window.sessionStorage['list'] = JSON.stringify(res.data.list)
            this.arr = []
            if (res.data.list) {
              this.menuList = res.data.list
              for (let i = 0; i < this.menuList.length; i++) {
                for (let j = 0; j < this.menuName.length; j++) {
                  if (this.menuName[j] === this.menuList[i].name) {
                    this.arr.push(this.menuList[i].name)
                  }
                }
                for (let k = 0; k < this.menuList[i].children.length; k++) {
                    if (this.menuList[i].children[k].name === '每日统计') {
                      this.arr.push(this.menuList[i].children[k].name)
                    }
                }
              }
            }
          }
          let themeType = res.data.themeType
          localStorage.setItem('themeType', themeType)
          // console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
      this.exchangeDe1()
    },
    orderFunction () {
      Notify('暂无可定制功能，敬请期待！')
    },
    closeEx () {
      this.isDepart = false
    },
    // swiperDown () {
    //   this.isGreat = false
    // },
    changePart (item) {
      this.$store.dispatch('SetDepartmentId', item.id)
      this.title = item.name
      localStorage.setItem('title', this.title)
      httpGet(getFunction + '/' + Number(item.id))
        .then((res) => {
          this.menuList = res.data.list
          this.arr = []
          for (let i = 0; i < this.menuList.length; i++) {
            for (let j = 0; j < this.menuName.length; j++) {
              if (this.menuName[j] === this.menuList[i].name) {
                this.arr.push(this.menuList[i].name)
              }
            }
          }
          // localStorage.setItem('ids', item.id)
          localStorage.setItem('themeType', res.data.themeType)
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
      this.isDepart = false
      this.isGreat = false
      this.getCont()
    },
    exchangeDe () {
      this.isDepart = true
      httpGet(getDepartmentTree + '/0').then(res => {
        console.log(res)
        if (res.data.list) {
          this.menuList = res.data.list
          this.arr = []
          for (let i = 0; i < this.menuList.length; i++) {
            for (let j = 0; j < this.menuName.length; j++) {
              if (this.menuName[j] === this.menuList[i].name) {
                this.arr.push(this.menuList[i].name)
              }
            }
          }
        }
        this.departmentTree = res.data
      }).catch(() => {})
    },
    exchangeDe1 () {
      httpGet(getDepartmentTree + '/0').then(res => {
        // console.log(res)
        if (res.data.length === 1) {
          if (res.data[0].name !== '人脸识别云平台') {
            // this.isBtn = false
          }
        }
      }).catch(() => {})
    },
    // 底栏设置页
    setPage () {
      this.$router.push('/mySet/')
    },
    toTemUser () {
      this.$router.push('/temUser/')
    },
    // 点击通知栏
    viewTo () {
      this.$router.push({
        path: '/userManage/',
        query: {
          setOne: 123
        }
      })
    },
    submit () {
      if (this.company.userName === '') {
        Toast('输入的名称不能为空！')
      } else {
        this.company = Object.assign(this.company, {departmentId: this.$store.departmentId})
        httpPost(bindCompany, this.company)
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    // 底栏消息页
    checkMessage () {
      this.$router.push('/infomation/')
    },
    // 企业绑定
    bindCompany () {
      this.isShow = true
    },
    // 底栏主页
    indexPage () {
      localStorage.setItem('checkType', this.active)
    },
    toCamera () {
      this.$router.push('/cameraManage/')
    },
    toHistory () {
      this.$router.push('/searchRecord/')
    },
    toManage () {
      this.$router.push('/permissionSet/')
    },
    toLED () {
      this.$router.push('/siteManage/')
    },
    toTable () {
      this.$router.push('/statiReport/')
    },
    toStaff () {
      this.$router.push('/staffManage/')
    },
    toCompany () {
      this.$router.push('/attendManage/')
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  // background: url(../assets/set.jpg);
  // background-size: 100%;
  width: 100vw;
  height: 100%;
  background-color: #fff;
}
.swiper-div{
    height: auto;
    // margin-bottom: 3rem;
     background: url(../../assets/bind-back.jpg);
      background-size: 100%;
      // height: 100vh;
}
.coverImg{
  max-width:100%;
  max-height:100%;
}
.titleSty{
  opacity: 0.7;
  font-size: 0.9rem;
}
.warpdiv{
    background-color:#fff;
    height: 25vh;
}
.dsc{
  opacity: 0.7;
  height: 26vh;
  margin-top:0.8rem;
  // margin: 0 0 1rem 0;
  background-color:LightCyan;
}
.img{
  width:100%;
  display: block;
  height:25vh;
  overflow: hidden;
  // max-width:100%;
  // max-height:100%;
}
.warp-icon{
  display: inline-block;
  // margin-bottom: -1rem;
  width: 100%;
  height: 28vh;
  overflow:hidden;
  padding-top: 0.8rem;
  .warp-divicon{
    height: 28vh;
    width: 100vw;
    // overflow:hidden;
    // display: flex;
    // align-items: left;
    text-align: left;
    // justify-content: left;
    // margin-left: 0.5rem;
    // align-content: left;
   div{
    display: inline-block;
    // background-color: LightSkyBlue;
    width: 20vw;
    height: 40%;
    // border-radius: 50%;
    // margin-top:1rem;
    margin-bottom: 5%;
    // margin-left: 2%;
    font-size: 0.75rem;
    text-align: center;
    position: relative;
    img{
        margin-top: 16%;
        left:25%;
        position: absolute;
        // margin-left: 0.8rem;
    }
    span{
        position: absolute;
        top:10vh;
        left:5vw;
        // left:3rem;
      }
    }
  }
  span{
    // margin-left: 0.23rem;
    font-size: 0.75rem;
    color: Black;
  }
}
img{
    display: inline;
}
.titleText{
  font-size: 1.2rem;
  color: #3399cc;
  margin-left: 5%;
  line-height: 1.5rem;
}
.h5font{
 margin-left:1rem;
 display: block;
}
</style>
<style>
.el-tree-node__content{
  line-height:30px
}
.custom-tree-node {
  /* flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 18px; */
  font-size: 17px;
}
</style>
