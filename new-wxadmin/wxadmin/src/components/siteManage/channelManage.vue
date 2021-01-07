<template>
  <div class="containerA">
    <NavBar
      title="通道管理"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <PullRefresh v-model="isLoading" @refresh="onRefresh">
      <div style="width:100vw;margin:1rem 0;border-radius:0.5rem">
        <CellGroup style="margin-top:2.5rem;" v-for="(item, index) in tableData" :key=index>
            <Cell title="通道名称" :value="item.localName"/>
            <Cell title="MAC地址" :value="item.mac"/>
            <Cell title="类型" :value="ledTypeFormatter(item.ledType)"/>
            <Cell title="状态" :value="isStatusFormatter(item.status)"/>
            <Cell title="LED屏宽" :value="item.ledWidth" v-if="tableData.ledType === 0"/>
            <Cell title="LED屏高" :value="item.ledHeight" v-if="tableData.ledType === 0"/>
            <Cell title="最近在线时间" :value="timeFormatter(item.loginAt)"/>
            <Cell title="最近离线时间" :value="timeFormatter(item.loginOutAt)"/>
            <Cell title="操作" is-link @click="edit(item)" style="font-size:1rem;font-weight:bold;color:#1E90FF"/>
        </CellGroup>
      </div>
      <div style="height:60vh" v-show="total == 0">
          <img src='@/assets/noData (2).png' style="max-width: 375px;max-height: auto;"/>
        </div>
    </PullRefresh>
    <div style="margin:2.5rem 0 1rem 0" v-show="total !== 0">
      <Pagination
        v-model="listQuery.offset"
        :page-count="Math.ceil(total/10)"
        :total-items = 'total'
        mode="simple"
        @change="seePage"
      >
      </Pagination>
    </div>
        <!-- 编辑 -->
        <Popup v-model="isEdit" position="bottom">
          <Button size="large" @click="unbind">解绑</Button>
          <Button size="large" @click="handleEdit">修改</Button>
          <Button size="large" @click="turnOn" v-show="snakeData.ledType === 0">开机</Button>
          <Button size="large" @click="turnOff" v-show="snakeData.ledType === 0">关机</Button>
          <Button size="large" @click="setAdv" v-show="snakeData.ledType === 1">设置提示语</Button>
          <Button size="large" @click="sysnWhite" v-show="snakeData.ledType === 1">同步白名单</Button>
          <Button size="large" @click="deleteWhite" v-show="snakeData.ledType === 1">清空白名单</Button>
          <Button size="large" @click="isEdit = false">取消</Button>
        </Popup>
        <Popup v-model="isSetInfo" position="top" style="width:96vw;height:12rem">
          <Field label="进出时提示" v-model="setAdvFrom.inOutAdv" style="margin: 10px 0" placeholder="请输入进出时提示"/>
          <Field label="空闲时提示" v-model="setAdvFrom.freeAdv" placeholder="请输入空闲时提示"/>
          <div style="margin-top:15px;display:flex;justify-content:center">
            <Button @click="cancelSet" style="width:35vw;margin-right:6vw;">取消</Button>
            <Button :disabled="setloading" @click="saveTip" type="info" style="width:35vw;margin-left:6vw">确定</Button>
          </div>
        </Popup>
        <!-- 编辑修改资料 -->
        <Popup v-model="isShow" style="width:94vw;height:30rem" position=top>
          <NavBar
            title="修改信息"
          />
          <Field
            v-model="upgradeFileForm.localName"
            label="通道名称"
            placeholder="请输入通道名称"
            required
            @blur="checkLocalName"
            :error-message= 'err.localName'
          />
           <Field
            label="相机选择"
            required
            disabled
          />
          <CheckboxGroup v-model="upgradeFileForm.aiTokenIdArr">
            <Checkbox style="display:inline-block;line-height:2rem;margin-left:2rem" v-for="item in cameraList" :name="item.localId" :key="item.localId">{{item.localName}}</checkbox>
            <Checkbox v-show="cameraList.length === 0">部门下暂无相机可选择</Checkbox>
          </CheckboxGroup>
          <Field
            v-model="upgradeFileForm.ledWidth"
            label="LED屏宽"
            placeholder="请输入LED屏幕宽度"
            required
            @blur="checkLedWidth"
            :error-message= 'err.ledWidth'
            v-if="upgradeFileForm.ledType == 0"
          />
          <Field
            v-model="upgradeFileForm.ledHeight"
            label="LED屏高"
            placeholder="请输入LED屏幕高度"
            required
            @blur="checkLedHeight"
            :error-message= 'err.ledHeight'
            v-if="upgradeFileForm.ledType == 0"
          />
          <Field
            v-model="upgradeFileForm.ledBrightness"
            label="LED亮度"
            placeholder="请输入LED屏幕亮度"
            required
            @blur="checkLedBrightness"
            :error-message= 'err.ledBrightness'
            v-if="upgradeFileForm.ledType == 0"
          />
          <Button size=large @click="cancelAdapt" style="width:70vw;border-radius:10px;margin: 1rem 0 0 12vw;">取消</Button>
          <Button size=large :loading="listLoading" @click="saveUpgradeFile" style="width:70vw;border-radius:10px;margin: 1rem 0 1rem 12vw;" type="info">确定</Button>
        </Popup>
  </div>
</template>
<script>
import { NavBar, Toast, Dialog, Button, PullRefresh, Pagination, CheckboxGroup, Checkbox, CellGroup, Cell, Field, RadioGroup, Radio, Popup } from 'vant'
import { timeFormatter, ledTypeFormatter, isStatusFormatter } from '@/utils/formatter'
import { gainAllLedApp, unbind, ledAppTurnOff, ledAppTurnOn, ledAppSyncWhiteList, ledAppDeleteWhiteList, ledAppSetAdv, backShow, updateParams } from '@/api/url'
import { httpGet, httpPut, httpPost } from '@/utils/restful'
export default {
  name: 'channelManage',
  created () {
    this.fetchData()
  },
  components: { NavBar, Button, PullRefresh, Pagination, CellGroup, Cell, Field, RadioGroup, Radio, Popup, CheckboxGroup, Checkbox },
  data () {
    return {
      tableData: [],
      isLoading: false,
      isEdit: false,
      snakeData: {
        ledType: undefined
      },
      isSetInfo: false,
      isShow: false,
      listLoading: false,
      setloading: false,
      timeFormatter: timeFormatter,
      ledTypeFormatter: ledTypeFormatter,
      isStatusFormatter: isStatusFormatter,
      listQuery: {
        offset: 1,
        limit: 10
      },
      err: {
        ledWidth: '',
        ledHeight: '',
        ledBrightness: '',
        localName: ''
      },
      setAdvFrom: {
        ledAppId: undefined,
        departmentId: this.$store.getters.departmentId,
        inOutAdv: '',
        freeAdv: ''
      },
      upgradeFileForm: {
        localName: '',
        id: undefined,
        ledHeight: 0,
        ledWidth: 0,
        ledBrightness: 6,
        aiTokenIdArr: undefined,
        newAiTokenIdArr: [],
        oldAiTokenIdArr: []
      },
      total: undefined,
      cameraList: []
    }
  },
  methods: {
    checkLocalName () {
      if (this.upgradeFileForm.localName === '') {
        this.err.localName = '通道名称不可为空'
      } else {
        this.err.localName = ''
      }
    },
    checkLedWidth () {
      if (this.upgradeFileForm.ledWidth === '') {
        this.err.ledWidth = '请输入LED屏幕宽度'
      } else {
        this.err.ledWidth = ''
      }
    },
    checkLedHeight () {
      if (this.upgradeFileForm.ledHeight === '') {
        this.err.ledHeight = '请输入LED屏幕高度'
      } else {
        this.err.ledHeight = ''
      }
    },
    checkLedBrightness () {
      if (this.upgradeFileForm.ledBrightness === '') {
        this.err.ledBrightness = '亮度不可为空'
      } else {
        let x = parseInt(this.upgradeFileForm.ledBrightness)
        if (x > 1 && x < 16) {
          this.err.ledBrightness = ''
        } else {
          this.err.ledBrightness = '请输入的亮度区间为1-16'
        }
      }
    },
    cancelAdapt () {
      this.isShow = false
      this.isEdit = false
    },
    handleEdit () {
      let rows = JSON.stringify(this.snakeData)
      let x = JSON.parse(rows)
      this.upgradeFileForm = Object.assign(this.upgradeFileForm, x)
      this.isShow = true
      this.selectCamera(this.snakeData.id)
    },
    selectCamera (row) {
      console.log(row)
      httpGet(backShow + '/' + row + '/' + this.$store.getters.departmentId) // 1624 this.$store.getters.departmentId
        .then((res) => {
          console.log(res)
          if (res.data !== null) {
            this.cameraList = res.data.local
            this.upgradeFileForm.aiTokenIdArr = res.data.checked
            this.upgradeFileForm.oldAiTokenIdArr = res.data.checked
          }
        })
    },
    // 修改保存
    saveUpgradeFile () {
      this.listLoading = true
      var x = {
        id: this.upgradeFileForm.id,
        ledHeight: this.upgradeFileForm.ledHeight,
        ledWidth: this.upgradeFileForm.ledWidth,
        localName: this.upgradeFileForm.localName,
        newAiTokenIdArr: this.upgradeFileForm.aiTokenIdArr,
        oldAiTokenIdArr: this.upgradeFileForm.oldAiTokenIdArr,
        ledBrightness: this.upgradeFileForm.ledBrightness
      }
      let ledAppBindDto = Object.assign(x, {departmentId: parseInt(this.$store.getters.departmentId)})
      httpPut(updateParams, ledAppBindDto)
        .then((res) => {
          Toast({
            message: res.message,
            type: 'success',
            duration: 4000
          })
          this.isShow = false
          this.fetchData()
          this.listLoading = false
          this.isEdit = false
        }).catch((err) => {
          Toast({
            type: 'fail',
            message: err,
            duration: 4 * 1000
          })
          this.listLoading = false
        })
    },
    onClickLeft () {
      this.$router.push('/siteManage/')
    },
    cancelSet () {
      this.isSetInfo = false
      this.isEdit = false
    },
    edit (item) {
      this.snakeData = item
      this.isEdit = true
    },
    // 设置广告语
    saveTip () {
      if (!this.setloading) {
        this.setloading = true
        Toast('设置中,请稍后...')
        httpPost(ledAppSetAdv, this.setAdvFrom).then((res) => {
          Toast({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
          this.setloading = false
          this.isSetInfo = false
          this.isEdit = false
          this.fetchData()
        }).catch(() => {
          Toast({
            type: 'fail',
            message: '设置失败，请稍后再试',
            duration: 4 * 1000
          })
          this.setloading = false
        })
      }
    },
    // 解绑
    unbind () {
      Dialog.confirm({
        message: '是否要进行相机解绑？',
        title: '解绑提示'
      }).then((res) => {
        httpPut(unbind + '/' + this.$store.getters.departmentId + '/' + this.snakeData.id)
          .then((res) => {
            console.log(res)
            Toast({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
            this.fetchData()
          }).catch(() => {})
      }).catch(() => {})
    },
    // 开机
    turnOn () {
      Toast.success('设置中,请稍后...')
      httpPost(ledAppTurnOn + '/' + this.snakeData.id + '/' + this.$store.getters.departmentId).then((res) => {
        Toast({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
      }).catch((error) => {
        Toast({
          type: 'fail',
          message: error,
          duration: 4 * 1000
        })
      })
      this.isEdit = false
    },
    // 关机
    turnOff () {
      Toast.success('设置中,请稍后...')
      httpPost(ledAppTurnOff + '/' + this.snakeData.id + '/' + this.$store.getters.departmentId)
        .then((res) => {
          Toast({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch((err) => {
          Toast({
            type: 'fail',
            message: err,
            duration: 4 * 1000
          })
        })
      this.isEdit = false
    },
    // 同步白名单
    sysnWhite () {
      httpPost(ledAppSyncWhiteList + '/' + this.snakeData.id + '/' + this.$store.getters.departmentId).then((res) => {
        Toast({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
      }).catch(() => {
        Toast({
          type: 'fail',
          message: '同步失败',
          duration: 4 * 1000
        })
      })
    },
    // 删除白名单
    deleteWhite () {
      Dialog.confirm({
        message: '当前操作清空设备的数据!, 确认删除吗？',
        title: '警告'
      }).then((res) => {
        Toast.success('删除中,请稍后...')
        httpPost(ledAppDeleteWhiteList + '/' + this.snakeData.id + '/' + this.$store.getters.departmentId).then((res) => {
          Toast({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          Toast({
            type: 'fail',
            message: '删除失败!',
            duration: 4 * 1000
          })
        })
      }).catch(() => {})
    },
    // 点击设置广告
    setAdv () {
      this.setAdvFrom.ledAppId = this.snakeData.id
      this.setloading = false
      this.isSetInfo = true
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    fetchData () {
      httpGet(gainAllLedApp + '/' + this.$store.getters.departmentId, this.listQuery)
        .then((res) => {
          if (res.data.rows !== null) {
            this.total = res.data.total
            this.tableData = res.data.rows
          } else {
            this.tableData = []
            this.total = 0
          }
        }).catch(() => {
          this.total = 0
        })
    },
    onRefresh () {
      setTimeout(() => {
        this.fetchData()
        this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
