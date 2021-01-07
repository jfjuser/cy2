<template>
  <div class="containerw">
    <NavBar
      title="相机维护"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="onClickLeft"
      @click-right="bindCamera"
    />
    <van-tabs v-model="active" type="card" color="#1989fa">
    <van-tab title="绑定相机">
    <bind-camera v-if="active==0"></bind-camera>
    </van-tab>
  <van-tab title="相机管理">
     <div v-if="active==1">
      <List
      v-model='loading'
      :finished="finished"
      finished-text="没有更多了"
      @load='onLoad'
    >
    <PullRefresh v-model="isLoading" @refresh="onRefresh">
      <div style="width:100%;height:22rem;text-align:center;background-color: #fff;" v-show="isVisible">
          <img src="@/assets/noData (2).png" style="max-width: 280px;max-height: 280px;">
      </div>
      <div>
        <div v-for="(item, index) in cameraData" :key="index">
          <van-cell-group style="margin-bottom: 1rem;">
            <van-cell title="通道名称" :value="item.localName" />
            <van-cell title="MAC" :value="item.mac" />
            <van-cell title="状态" :value="isStatusFormatter(item.status)" />
            <van-cell title="相机类型" :value="aiCameraTypeFormatter(item.cameraType)" />
            <van-cell title="绑定状态" :value="isBindFormatter(item.isBind)" />
            <span style="display:block;line-height:2.5rem;color:#1E90FF;margin-left:86%;" @click="showdo(item)">操作</span>
          </van-cell-group>
        </div>
      </div>
      <Button @click="toOpenGateRecord" type="info" class="openGateRecord">查询开闸记录</Button>
    </PullRefresh>
      <Popup v-model="innerVisible" width="90vw">
        <div style="text-align:center;">
          <img :src="picSrc" alt="图片" style="max-height: 400px;max-width: 300px">
        </div>
      </Popup>
    </List>
      <div v-show="!isVisible" id="asd" style="line-height:3rem;margin-top:1.5rem;">
        <Pagination
          v-if="total > 10"
          v-model="listQuery.offset"
          :page-count="Math.ceil(total/10)"
          :total-items = 'total'
          mode="simple"
          @change="seePage"
        >
        </Pagination>
       </div>
      <popup v-model="show" position='bottom' style="width:100vw">
         <div class="do-something">
            <van-row type="flex" justify="space-around" style="margin:15px 10px 0;-webkit-flex-wrap: wrap;-moz-flex-wrap: wrap;-ms-flex-wrap: wrap;-o-flex-wrap: wrap;flex-wrap:wrap;" :gutter="10">
              <van-col span="6" v-if="share.includes('编辑')" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info"  class="btns" @click="setItem" size=large>编辑</Button>
              </van-col>
              <van-col span="6" v-show="share.includes('删除')" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info" class="btns" @click="deleItem" size=large>解绑</Button>
              </van-col>
              <van-col span="6" v-if="share.includes('获取图片')" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info" class="btns" @click="getPicture" size=large>抓拍</Button>
              </van-col>
              <van-col span="6" v-if="itemInfo.cameraType === 130||itemInfo.cameraType === 135" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info" class="btns"  @click="reBoot" size=large>重启设备</Button>
              </van-col>
              <van-col span="6" v-if="itemInfo.cameraType === 130||itemInfo.cameraType === 135" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info" class="btns"  @click="openGate" size=large>一键开闸</Button>
              </van-col>
              <van-col span="6" v-if="itemInfo.cameraType === 130" style="margin-top:10px;margin-bottom:10px;width:30%">
                <Button plain type="info" style="font-size:0.85rem" class="btns"  @click="restoreSetting" size=large>恢复出厂设置</Button>
              </van-col>
              <van-col span="6" v-if="share.includes('校对时间')" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info" class="btns" @click="setTime" size=large>校时</Button>
              </van-col>
              <van-col span="6" v-if="share.includes('重启TCP')" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info" class="btns" @click="reBootCamera" size=large>重启TCP</Button>
              </van-col>
              <van-col span="6" v-if="share.includes('清除相机名单')" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info" class="btns" @click="clearWhiteList" size=large>清除白名单</Button>
              </van-col>
              <van-col span="6" v-if="share.includes('升级相机')&&itemInfo.cameraType !== 131" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info" class="btns"  @click="updateCamera" size=large>升级相机</Button>
              </van-col>
              <van-col span="6" v-if="share.includes('版本信息')" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info"  class="btns"  @click="getCameraVer" size=large>版本</Button>
              </van-col>
               <van-col span="6" v-if="share.includes('同步状态修改')" style="margin-top:10px;margin-bottom:10px;">
                <Button plain type="info" class="btns"  @click="adaptStatus" size=large>同步状态</Button>
              </van-col>
            </van-row>
            <!-- <van-row type="flex" justify="space-around" style="margin-top:10px">
            </van-row >
            <van-row type="flex" justify="space-around" style="margin-top:10px">
            </van-row>
            <van-row type="flex" justify="space-around" style="margin-top:10px">
            </van-row >
            <van-row type="flex" justify="space-around" style="margin-top:10px">
            </van-row > -->
            <br>
          <!-- <Button @click="ayncState" size=large>同步状态修改</Button> -->
            <Button type="info" @click="closePop" size=large>取消</Button>
          </div>
      </popup>
      <popup v-model="isWatch" style="width:94vw;height:15rem" position=top>
        <van-cell title="编辑" style="line-height:2.5rem;font-size:1rem">
          <Icon slot="right-icon" name="cross" @click="closeEdit"/>
        </van-cell>
        <Field
          label='名称'
          v-model="editForm.localName"
          style="line-height:2.5rem;font-size:1rem"
        />
        <Button type="info"
        @click="saveContent"
        style="width:70vw;margin-left:12vw;border-radius:12px;margin-top:12%;"
        >保存</Button>
      </popup>
      <popup v-model="dialogVersionVisible">
         <div style="padding:20px;">
         {{version}}
         </div>
      </popup>
     </div>
  </van-tab>
  <van-tab title="通道日志" >
    <!-- v-if="active==2" -->

  </van-tab>
</van-tabs>
    <!-- <Search
      v-model="value"
      placeholder="请输入搜索关键词"
      show-action
      style="text-indent:0.5em"
      shape="round"
      background="#6495ED"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch">搜索</div>
    </Search> -->
    <!-- <h3 style="margin-left:0.75rem;">相机列表</h3> -->
  </div>
</template>
<script>
import bindCamera from '@/components/bindCamera/bindCamera'
import { Search, NavBar, Field, Icon, Pagination, Row, Col, Toast, Cell, Popup, PullRefresh, CellGroup, Button, Dialog, List, Tab, Tabs } from 'vant'
import { aiCameraTypeFormatter, isBindFormatter, isStatusFormatter } from '@/utils/formatter'
import { httpGet, httpPut, httpPost } from '@/utils/restful.js'
import { aKeyOpened, dataReset, deviceReboot, getAICamera, unBindAICamera, editAICameraName, setAITime, syncState, reAIBoot, getAISnap, clearAIWhite, updateCameraAl, getAIVer } from '@/api/url.js'
import { setTimeout } from 'timers'

export default {
  name: 'cameraManage',
  components: {
    Search,
    NavBar,
    'van-cell': Cell,
    'van-cell-group': CellGroup,
    Button,
    List,
    Icon,
    PullRefresh,
    Popup,
    Pagination,
    Field,
    'van-row': Row,
    'van-col': Col,
    'van-tabs': Tabs,
    'van-tab': Tab,
    bindCamera

  },
  data () {
    return {
      share: [],
      active: 0,
      aiCameraTypeFormatter,
      isBindFormatter,
      isStatusFormatter: isStatusFormatter,
      loading: false,
      isWatch: false,
      show: false,
      isLoading: false,
      finished: false,
      innerVisible: false,
      isVisible: false,
      picSrc: '',
      value: '',
      total: undefined,
      username: '',
      editForm: {
        id: undefined,
        localName: undefined
      },
      cameraData: [],
      form: {
        mac: undefined,
        type: undefined,
        localName: undefined
      },
      listQuery: {
        offset: 1,
        limit: 10
      },
      itemInfo: {
        cameraType: undefined
      },
      dialogVersionVisible: false,
      version: ''
    }
  },
  methods: {
    toOpenGateRecord () {
      this.$router.push('/openGateRecord/')
    },
    onClickLeft () {
      this.$router.push('/indexPage/')
    },
    // 刷新
    onRefresh () {
      setTimeout(() => {
        this.getData()
        this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    setItem () {
      this.isWatch = true
    },
    saveContent () {
      httpPut(editAICameraName, this.editForm)
        .then(res => {
          this.getData()
          this.isWatch = false
          this.show = false
          Toast.success(res.message)
        }).catch(() => {})
    },
    closeEdit () {
      this.isWatch = false
      // this.show = false
    },
    // 编辑
    showdo (item) {
      this.itemInfo = item
      this.show = true
      this.editForm = {
        id: item.id,
        localName: item.localName
      }
      // this.username = item.localName
    },
    closePop () {
      this.show = false
    },
    onLoad () {
      this.loading = false
    },
    // 绑定
    bindCamera () {
      this.$router.push('/bindcamera/')
    },
    // 分页
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 同步状态修改
    // ayncState () {
    //   let item = this.itemInfo
    //   Dialog.confirm({
    //     title: '提示',
    //     message: '确定要同步状态？'})
    //     .then(() => {
    //       httpGet(syncState, {aiTokenId: item.id}).then(res => {
    //         Toast({
    //           message: res.message,
    //           type: 'success',
    //           duration: 4 * 1000
    //         })
    //       }).catch((err) => {
    //         console.log(err)
    //       })
    //     }).catch(() => {})
    //   this.show = false
    // },
    // 恢复出厂设置
    restoreSetting () {
      Dialog.confirm({
        title: '提示',
        message: '确定要恢复出厂设置？'
      })
        .then(() => {
          httpGet(dataReset + '/' + this.itemInfo.id + '/' + this.$store.getters.departmentId)
            .then((res) => {
              console.log(res)
              Toast({
                message: res.message,
                type: 'success',
                duration: 3 * 1000
              })
            }).catch((err) => {
              Toast({
                message: err,
                type: 'fail',
                duration: 3 * 1000
              })
            })
          this.show = false
        }).catch(() => {})
    },
    // 重启设备
    reBoot () {
      Dialog.confirm({
        title: '提示',
        message: '确定要重启设备？'
      })
        .then(() => {
          httpGet(deviceReboot + '/' + this.itemInfo.id + '/' + this.$store.getters.departmentId)
            .then((res) => {
              console.log(res)
              Toast({
                message: res.message,
                type: 'success',
                duration: 3 * 1000
              })
            }).catch((err) => {
              Toast({
                message: err,
                type: 'fail',
                duration: 3 * 1000
              })
            })
          this.show = false
        }).catch(() => {})
    },
    // // 重启TCP
    // reBootCamera () {
    //   let item = this.itemInfo
    //   Dialog.confirm({
    //     title: '提示',
    //     message: '是否重启TCP？'}).then(() => {
    //       httpPost(reAIBoot + item.id).then(res => {
    //         this.$message({
    //           message: res.message,
    //           type: 'success',
    //           duration: 4 * 1000
    //         })
    //       }).catch(() => {})
    //     }).catch(() => {})
    // },
    // 一键开闸
    openGate () {
      httpGet(aKeyOpened + '/' + this.itemInfo.id + '/' + this.$store.getters.departmentId)
        .then((res) => {
          Toast({
            message: res.message,
            type: 'success',
            duration: 3 * 1000
          })
        }).catch((err) => {
          Toast({
            message: err,
            type: 'fail',
            duration: 3 * 1000
          })
        })
      this.show = false
    },
    // 解绑
    deleItem () {
      let item = this.itemInfo
      Dialog.confirm({
        title: '提示',
        message: '确定要解绑？'})
        .then(() => {
          httpPut(unBindAICamera + item.id).then(res => {
            Toast({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
      this.show = false
    },
    // 校时
    setTime () {
      let item = this.itemInfo
      Dialog.confirm({
        title: '提示',
        message: '是否对相机进行校时？'})
        .then(() => {
          httpPost(setAITime + item.id).then(res => {
            Toast.success({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch((err) => { console.log(err) })
        }).catch(() => {})
      this.show = false
    },
    // 重启TCP
    reBootCamera () {
      let item = this.itemInfo
      Dialog.confirm({
        title: '提示',
        message: '是否重启相机？'})
        .then(() => {
          httpPost(reAIBoot + item.id).then(res => {
            Toast({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
      this.show = false
    },
    // 获取相机版本
    getCameraVer () {
      let item = this.itemInfo
      httpPost(getAIVer + item.id).then(res => {
        this.dialogVersionVisible = true
        this.version = JSON.stringify(res.data, null, 4)
      }).catch(() => {})
    },
    // 状态修改
    adaptStatus () {
      let item = this.itemInfo
      Dialog.confirm({
        title: '提示',
        message: '当前操作会清除相机内所有注册人员，然后重新同步？'}).then(() => {
        let obj = {
          'aiTokenId': item.id,
          'departmentId': parseInt(this.$store.getters.departmentId)
        }
        httpPut(syncState, obj).then(res => {
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 抓拍
    getPicture () {
      let item = this.itemInfo
      httpPost(getAISnap + item.id)
        .then(res => {
          Toast({
            message: res.message,
            type: 'success',
            duration: 3000
          })
          this.picSrc = 'data:image/jpg;base64,' + res.data
          this.innerVisible = true
        }).catch((err) => {
          Toast({
            message: err,
            type: 'fail',
            duration: 3000
          })
        })
      this.show = false
    },
    // 升级相机
    updateCamera () {
      let item = this.itemInfo
      Dialog.confirm({
        title: '提示',
        message: '确定要升级相机？'
      }).then(() => {
        httpGet(updateCameraAl + '/' + item.id).then((res) => {
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 清空白名单
    clearWhiteList () {
      let item = this.itemInfo
      Dialog.confirm({
        title: '提示',
        message: '是否要清空相机里的所有白名单？'
      })
        .then(() => {
          httpPost(clearAIWhite + item.id).then(res => {
            Toast({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
      this.show = false
    },
    // 搜索
    onSearch () {
      this.listQuery.offset = 1
      this.getData()
    },
    // 获取数据
    getData () {
      Object.assign(this.listQuery, {
        departmentId: this.$store.getters.departmentId
      })
      console.log(this.$store.getters.departmentId)
      httpGet(getAICamera, this.listQuery)
        .then(res => {
          if (res.data.rows === null) {
            this.isVisible = true
            this.total = 0
          } else {
            this.cameraData = res.data.rows
            this.isVisible = false
            this.total = res.data.total
          }
          console.log(res)
        })
        .catch(err => console.log(err))
    },
    filterArr () {
      // this.$store.getters.permissionFun
      JSON.parse(window.sessionStorage.getItem('list')).map(item => {
        if (item.name === '相机维护') {
          item.children.map(it => {
            if (it.name === '相机管理') {
              this.share = it.roles
            }
          })
        }
      })
    }
  },
  created () {
    this.getData()
    this.filterArr()
  }
}
</script>
<style scoped>
#asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:red;
}
</style>
<style lang="scss" scoped>
.containerw{
    // height: 100vh;
    // background-color: rgb(238,238,238);
    // background:url(/src/assets/background.jpg) no-repeat center center fixed;
    // background-size: 100%;
    background-color:rgb(238,238,238);
  }
  .btns{
    border-radius:8px;
    height:2.5rem;
    font-size:0.85rem;
    line-height: 1.5rem;
  }
  .colcss{
    font-size: 0.7rem;
    color:#585858;
    }
.do-something{
  line-height: 2rem;
}
.small{
  width: 4rem;
  line-height: 1.5rem;
  border-radius: 6px;
  letter-spacing: 0.15rem;
  border: none;
  margin-right: 1rem;
  color: #fff;
  background-color:DodgerBlue;
  margin-bottom: 0.3rem;
}
.imgStyle{
  max-width: 100vw;
  max-height: auto;
}

.openGateRecord{
  position: fixed;
  bottom: 50px;
  width: 50vw;
  left: 50%;
  margin-left: -25vw;
  border-radius: 10px;
}
</style>
