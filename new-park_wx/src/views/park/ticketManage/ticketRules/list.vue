<template>
  <div>
      <top-right-btn v-has2father="['新增']" :to="`add/`">添加</top-right-btn>
        <van-dropdown-menu class="mar-b-15">
            <van-dropdown-item :options="ticketType" v-model="listQuery.type" title="类型" @change="handleFilter" />
            <van-search placeholder="优惠券名称" v-model.trim="listQuery.name" show-action left-icon="" @search="handleFilter" >
                <div slot="action" @click="handleFilter">搜索</div>
            </van-search>
        </van-dropdown-menu>

        <main>
            <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>
            <list-card v-for="(item, index) in tableData" :key="index" >
                <van-cell-group :border="isShowColumn2Father(['编辑', '删除']) || isTicketPer(['静态二维码', '动态二维码', '单次扫', '车牌输入'], permission)">
                    <van-cell title="优惠券名称" :value="item.name" />
                    <van-cell title="优惠券类型" :value="ticketTypeFormatter(item.type)" />
                    <van-cell title="减免金额" :value="moneyFormatter(item.subFee)" v-if="item.type === 0" />
                    <van-cell title="折扣率" :value="item.discount" v-if="item.type === 3" />
                    <van-cell title="减免时长" :value="item.subTime" v-if="item.type === 1" />
                    <van-cell title="总券数" :value="item.number === 9999 ? '不限' : item.number" />
                    <van-cell title="剩余券数" :value="item.restNumber === 9999 ? '不限' : item.restNumber" />
                    <van-cell title="备注信息" :value="item.consume" />
                </van-cell-group>
                <template v-slot:footer>
                    <van-button size="small" round @click="handleFun(item)" v-if="isShowColumn2Father(['编辑', '删除']) || isTicketPer(['静态二维码', '动态二维码', '单次扫', '车牌输入'], permission)" >操作</van-button>
                </template>
            </list-card>

            <van-pagination
            v-if="tableData.length!==0"
            v-model="listQuery.offset"
            :page-count="Math.ceil(total/listQuery.limit)"
            :items-per-page="listQuery.limit"
            mode="simple"
            @change="changePage"/>
        </main>

        <van-popup v-model="showFun" position="bottom" safe-area-inset-bottom>
            <van-button block v-has2father="['编辑']" @click="handleUpdate">编辑</van-button>
            <van-button block v-if="isTicketPer(['车牌输入'], permission)" @click="handlePlate" >车牌输入</van-button>
            <van-button block v-if="isTicketPer(['静态二维码'], permission)" @click="erCodeStatic(funData)">静态码</van-button>
            <van-button block v-if="isTicketPer(['动态二维码'], permission)" @click="erCodeMove(funData)">动态码</van-button>
            <van-button block v-if="isTicketPer(['单次扫'], permission)" @click="erCodeOne(funData)">单次扫</van-button>
            <van-button block v-has2father="['删除']" @click="handleDelete(funData.id)">删除</van-button>
            <div style="height:0.3rem;" class="bgc-grey"></div>
            <van-button block class="mar-t-15" @click="showFun=false">取消</van-button>
        </van-popup>

        <van-popup v-model="dialogPlateVisible" round close-on-popstate class="popup" style="width:80%;padding-top:.5rem">
          <van-field
          :border="false"
          v-model.trim="plate"
          label="车牌号码"
          placeholder="请输入车牌号码"
          type="password"
          :error-message="plateErr"/>
          <div class="bottom text-r padding-10 flex-jc-around">
            <van-button round @click="dialogPlateVisible = false" style="width:2.666rem">取消</van-button>
            <van-button round type="info" @click="bindPlate" style="width:2.666rem">绑定</van-button>
          </div>
        </van-popup>
        <van-popup v-model="dialogQRVisible" close-on-popstate @close="oncloseWS">
          <div id="qrcode" ref="qrcode" class="qrcode"></div>
        </van-popup>
  </div>
</template>

<script>
import QRcode from 'qrcodejs2'
import { DropdownMenu, DropdownItem, Cell, CellGroup, Pagination, Button, Popup, Field, Search, Dialog } from 'vant'
import topRightBtn from '@/components/topRightBtn'
import listCard from '@/components/listCard'
import { ticketType } from '@/utils/selectAble.js'
import { httpGet, httpDelete, httpPost } from '@/utils/restful'
import { getTicketRules, getTicketRulesPer, TicketRules, plateInset, moveErCode, staticErCode, erCodeOne } from '@/api/url'
import { isTicketPer, ticketTypeFormatter, moneyFormatter, isShowColumn2Father } from '@/utils/formatter.js'
import { qrCodeWebSocket } from '@/api/websocket.js'

export default {
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Pagination.name]: Pagination,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Field.name]: Field,
    [Search.name]: Search,
    listCard,
    topRightBtn
  },
  data () {
    return {
      moneyFormatter,
      ticketTypeFormatter,
      isShowColumn2Father,
      isTicketPer,
      listQuery: {
        offset: 1,
        limit: 10,
        name: undefined,
        type: undefined,
        timeType: undefined
      },
      tableData: [],
      total: null,
      showFun: false,
      funData: {},
      ticketType: [],
      permission: [],
      dialogPlateVisible: false,
      plate: '',
      plateErr: '',
      dialogQRVisible: false,
      rowId: 0,
      codeUrl: '',
      ws: null
    }
  },
  created () {
    this.typeFormatter()
    this.getPermission()
  },
  methods: {
    handleUpdate () {
      this.$router.push(`${this.$route.path}editor/?data=${JSON.stringify(this.funData)}`)
    },
    // 格式化下拉菜单
    typeFormatter () {
      let arr = []
      for (const v of ticketType) {
        let obj = {}
        obj.text = v.valueName
        obj.value = v.valueNo
        arr.push(obj)
      }
      this.ticketType = arr
    },
    getPermission () {
      httpGet(getTicketRulesPer + this.$store.getters.departmentId)
        .then(res => {
          this.permission = res.data
          this.fetchData()
        }).catch(() => {})
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {shopId: this.$store.getters.departmentId})
      httpGet(getTicketRules, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        ToastLoading.clear()
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    // 分页
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleFun (data) {
      this.funData = data
      this.showFun = true
    },
    // 车牌输入
    handlePlate () {
      this.plate = ''
      this.dialogPlateVisible = true
      this.plateErr = ''
    },
    bindPlate () {
      const normalPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
      const newPlate = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
      if (this.plate === '') {
        this.plateErr = '车牌不可为空'
      } else if (!(normalPlate.test(this.plate) || newPlate.test(this.plate))) {
        this.plateErr = '请输入正确的车牌号'
      } else {
        let data = {
          type: 'INPUT',
          code: this.funData.id,
          plate: this.plate
        }
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpPost(plateInset, data)
          .then(res => {
            ToastLoading.clear()
            this.dialogPlateVisible = false
            this.$notify({
              message: res.message,
              type: 'success'
            })
          }).catch(() => { ToastLoading.clear() })
      }
    },
    // 删除选中
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确认删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(TicketRules, {ids: [id]}).then(res => {
          ToastLoading.clear()
          this.fetchData()
          this.$notify({
            message: res.message,
            type: 'success'
          })
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    },
    // 生成二维码
    createQrCode () {
      this.createCode = new QRcode('qrcode', {
        text: this.codeUrl,
        width: 300,
        height: 300
      })
    },
    // 生成静态二维码
    erCodeStatic (row) {
      httpGet(staticErCode + row.id)
        .then(res => {
          if (res.data === null || res.data.ercode === null) {
            this.$notify({
              message: '暂无二维码',
              type: 'warning'
            })
          } else {
            this.dialogQRVisible = true
            this.$nextTick(() => {
              const QrCodeHTML = this.$refs.qrcode
              QrCodeHTML.innerHTML = ' '
              this.createQrCode()
              this.codeUrl = res.data.ercode
              this.createCode.clear()
              this.createCode.makeCode(this.codeUrl)
            })
          }
        }).catch(() => {})
    },
    // 生成单次码
    erCodeOne (row) {
      httpGet(erCodeOne + row.id)
        .then(res => {
          if (res.data === null || res.data.ercode === null) {
            this.$notify({
              message: '暂无二维码',
              type: 'warning'
            })
          } else {
            this.dialogQRVisible = true
            this.$nextTick(() => {
              const QrCodeHTML = this.$refs.qrcode
              QrCodeHTML.innerHTML = ' '
              this.createQrCode()
              this.codeUrl = res.data.ercode
              this.createCode.clear()
              this.createCode.makeCode(this.codeUrl)
            })
          }
        }).catch(() => {})
    },
    // -------------------------websocket -------------------------- \\
    websocket () {
      // 检查浏var ws;览器是否支持WebSocket
      if (window.WebSocket) {
        if (this.ws !== null) {
          this.ws.close()
        }
        let time = new Date().getTime()
        this.ws = new WebSocket(qrCodeWebSocket + this.rowId + '-' + time)
        // 连接websocket
        this.ws.onopen = this.initWebSocket(time)
        this.ws.onmessage = this.onmessageWebSocket
        // 链接失败
        this.ws.onerror = this.onerrorWebSocket
      } else {
        this.$notify('您的浏览器暂时不支持实时下载结果展示，可尝试换浏览器!')
      }
    },
    initWebSocket (time) {
      let ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      setTimeout(() => {
        httpGet(moveErCode + this.rowId + '/' + time)
          .then(res => {
            this.dialogQRVisible = true
            this.$nextTick(() => {
              const QrCodeHTML = this.$refs.qrcode
              QrCodeHTML.innerHTML = ' '
              this.createQrCode()
              ToastLoading.clear()
            })
          }).catch(() => { ToastLoading.clear() })
      }, 1000)
    },
    // 接收消息
    onmessageWebSocket (evt) {
      let data = JSON.parse(evt.data)
      this.codeUrl = data.ercode
      if (this.createCode) {
        this.createCode.clear()
        this.createCode.makeCode(this.codeUrl)
      }
    },
    // 链接失败
    onerrorWebSocket () {
      this.$notify('无法实时显示下载信息！')
    },
    // 生成动态码
    erCodeMove (row) {
      this.rowId = row.id
      this.websocket()
    },
    oncloseWS () {
      if (this.ws !== null) {
        this.ws.close()
      }
    }
  },
  destroyed () {
    this.oncloseWS()
  }
}
</script>

<style lang="scss" scoped>
.qrcode {
  padding: 10px;
  box-sizing: border-box;
}
</style>
