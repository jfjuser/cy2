<template>
  <div class="containerA">
    <NavBar
      title="平台LED"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-row align="center" type="flex" justify="space-between">
        <van-col span="8" >
          <el-select placeholder="LED类型" v-model='listQuery.ledType' >
            <el-option v-for="item in option1" :key="item.valueNo" :label="item.valueName" :value="item.valueNo" ></el-option>
          </el-select>
        </van-col>
        <van-col span="8">
          <el-select placeholder="绑定状态" v-model='listQuery.isBind' >
            <el-option v-for="item in option2" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </van-col>
        <van-col span="8">
          <el-select placeholder="状态" v-model='listQuery.status' >
            <el-option v-for="item in option3" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
        </van-col>
      </van-row>
      <Field class="searchInput" v-model="listQuery.mac" placeholder="请输入Mac"/>
      <Search
        v-model="listQuery.departmentName"
        placeholder="部门名称"
        show-action
        shape="round"
        background="rgb(238, 238, 238)"
        @search="onSearch"
      >
        <div slot="action" @click="onSearch" style="color:#fff;text-align:center;border-radius:15%;width:3rem;background-color:rgb(14, 105, 254)">搜索</div>
      </Search>
    <PullRefresh v-model="isLoading" @refresh="onRefresh">
      <div style="width:100vw;margin:1rem 0;border-radius:0.5rem">
        <CellGroup style="padding:1.5rem 0;border-bottom:5px solid #eee" v-for="(item, index) in tableData" :key=index>
            <Cell title="部门名称" :value="item.departmentName"/>
            <Cell title="通道名称" :value="item.localName"/>
            <Cell title="唯一标识符" :value="item.mac"/>
            <Cell title="LED类型" :value="ledTypeFormatter(item.ledType)"/>
            <Cell title="绑定状态" :value="isBindFormatter(item.isBind)"/>
            <Cell title="状态" :value="isStatusFormatter(item.status)"/>
            <!-- <Cell title="LED屏宽" :value="item.ledWidth" v-if="tableData.ledType === 0"/>
            <Cell title="LED屏高" :value="item.ledHeight" v-if="tableData.ledType === 0"/> -->
            <Cell title="最近登录时间" :value="timeFormatter(item.loginAt)"/>
            <!-- <Cell title="最近离线时间" :value="timeFormatter(item.loginOutAt)"/> -->
            <!-- <Cell title="操作" is-link @click="edit(item)" style="font-size:1rem;font-weight:bold;color:#1E90FF"/> -->
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
  </div>
</template>
<script>
import { NavBar, Button, PullRefresh, Pagination, Search, CheckboxGroup, Checkbox, CellGroup, Cell, Field, RadioGroup, Radio, Popup, Row, Col } from 'vant'
import { timeFormatter, ledTypeFormatter, isStatusFormatter, isBindFormatter } from '@/utils/formatter'
import { platform } from '@/api/url'
import { httpGet } from '@/utils/restful'
export default {
  name: 'platformLED',
  created () {
    this.fetchData()
  },
  components: { NavBar, Button, PullRefresh, Pagination, CellGroup, Cell, Field, RadioGroup, Radio, Popup, CheckboxGroup, Checkbox, 'van-row': Row, 'van-col': Col, Search },
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
      isBindFormatter: isBindFormatter,
      listQuery: {
        offset: 1,
        limit: 10
      },
      option1: [
        {
          'valueName': 'bx-5e1',
          'valueNo': 0
        },
        {
          'valueName': '安卓电视机',
          'valueNo': 1
        }
      ],
      option2: [
        {
          'valueName': '未绑定',
          'valueNo': 0
        },
        {
          'valueName': '已绑定',
          'valueNo': 1
        }
      ],
      option3: [
        {
          'valueName': '离线',
          'valueNo': 0
        },
        {
          'valueName': '在线',
          'valueNo': 1
        }
      ],
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
    fetchData () {
      httpGet(platform, this.listQuery)
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
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    onClickLeft () {
      this.$router.push('/siteManage/')
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
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
