<template>
  <div class="app-container">
    <div class="table-main" style="float:left;width:70%;opacity:0.8">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input v-if="!isShowColumnFormatter(['有为学校'])" v-model = "listQuery.dutyCompanyName" class="filter-item" clearable style="width:200px" placeholder="账户名"></el-input>
        <el-input v-model = "listQuery.addr" v-if="addrType === 0"  class="filter-item" clearable style="width:200px" :placeholder="themeType === 3 ? '班级' : '地址'"></el-input>
        <el-input v-model = "listQuery.floorNum" v-if="addrType === 1"  class="filter-item" clearable style="width:200px" :placeholder="themeType === 1 ? '单元' : (themeType === 2 ? '楼层' : (themeType === 3 ? '年级' : '班组'))"></el-input>
        <el-input v-model = "listQuery.roomNum" v-if="addrType === 1"  class="filter-item" clearable style="width:200px" :placeholder="themeType === 1 ? '房号' : (themeType === 2 ? '室号' : (themeType === 3 ? '班级' : '班号'))"></el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width:60vw;margin-right:20px" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column v-if="!isShowColumnFormatter(['有为学校'])" fixed="left" label="账户" align="center" prop="leader"></el-table-column>
        <el-table-column v-if="!isShowColumnFormatter(['有为学校'])" fixed label="电话" align="center" prop="phone"></el-table-column>
        <el-table-column v-if="isShowColumnFormatter(['有为学校'])" fixed label="学校" align="center" prop="school"></el-table-column>
        <el-table-column v-if="isShowColumnFormatter(['有为学校'])" fixed label="班级" align="center" prop="roomNum"></el-table-column>
        <el-table-column v-if="!isShowColumnFormatter(['有为学校'])" fixed :label="themeType === 1 ? '房号' : (themeType === 2 ? '楼室' : (themeType === 3 ? '班级' : '地址'))" align="center" prop="addr"></el-table-column>
        <el-table-column :label="themeType === 3 ? '在校人数' : '在场人数'" align="center" prop="countIn"></el-table-column>
        <el-table-column :label="themeType === 3 ? '离校人数' : '离场人数'" align="center" prop="countOut"></el-table-column>
        <el-table-column v-if="!isShowColumnFormatter(['有为学校'])" label="进场人数" align="center" prop="countEnter"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
       <!-- <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="div" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="用户名" align="center" prop="userName"></el-table-column>
        <el-table-column label="进出时间" align="center" prop="inOutTime">
           <template slot-scope="scope">
            {{timeFormatter(scope.row.inOutTime)}}
          </template>
        </el-table-column>
        <el-table-column label="用户地址" align="center" prop="addr"></el-table-column>
        <el-table-column label="隶属账户" align="center" prop="teamLeader"></el-table-column>
        <el-table-column label="进出类型" align="center" prop="inOutType">
          <template slot-scope="scope">
            {{scope.row.inOutType === 0 ? '进' : '出'}}
          </template>
        </el-table-column>
        <el-table-column label="用户类别" align="center" prop="userType">
          <template slot-scope="scope">
            {{userType(scope.row.userType)}}
          </template>
        </el-table-column>
        <el-table-column label="账户在场人数" align="center" prop="teamInNum"></el-table-column>
        <el-table-column label="账户进场人数" align="center" prop="teamEnterNum"></el-table-column>
        <el-table-column label="账户离场人数" align="center" prop="teamOutNum"></el-table-column>
      </el-table> -->
    </div>
    <div>
      <el-button style="font-size:20px;font-weight:bold;margin: 0 0 0px 15px" type="text">实时统计浏览</el-button>
      <div style="height:720px;overflow:hidden;padding-left:15px" class="conttan">
        <div v-for="(item, index) in div" :key=index :style="firstMove" class="moveFly" max-height="600">
          <el-card class="box-card" style="margin-bottom:8px;opacity:0.6">
          <div slot="header" class="clearfix">
            <span style="color:#000"><span v-if="!isBlack">隶属账号：{{item.teamLeader}}</span> <span style="margin-right:10px;color:red" v-if="isBlack">黑名单</span></span>
            <el-button style="float: right; padding: 3px 0;color:#0000FF" type="text">{{timeFormatter(item.inOutTime)}}</el-button>
          </div>
          <div class="text item" style="color:#3399FF;line-height:26px;"><span style="margin-right:10px">用户名：</span>{{item.userName}}</div>
          <div class="text item" style="color:#3399FF;line-height:26px;" v-if="!isBlack"><span style="margin-right:2px">手机号：</span>{{item.phone}}</div>
          <div class="text item" style="color:#3399FF;;line-height:26px;" v-if="!isBlack"><span style="margin-right:10px">地址：</span>{{item.addr}}</div>
          <!-- <div class="text item" style="color:#3399FF;;line-height:26px"><span style="margin-right:10px">账户在场人数：</span>{{item.teamInNum}}</div>
          <div class="text item" style="color:#3399FF;;line-height:26px"><span style="margin-right:10px">账户离场人数：</span>{{item.teamOutNum}}</div>
          <div class="text item" style="color:#3399FF;line-height:26px"><span style="margin-right:10px">账户进场人数：</span>{{item.enter}}</div> -->
          <div class="text item" style="color:#3399FF;line-height:26px;"><span style="margin-right:10px">进出类型：</span>{{item.inOutType === 0 ? '进场' : '离场'}}</div>
        </el-card>
        </div>
        </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { timeFormatterSort, timeFormatter, isShowColumnFormatter, userType } from '@/utils/formatter'
import { httpGet } from '@/utils/restful'
import { getInoutIntime } from '@/api/url'
import { realTimeWebSocket } from '@/api/websocket'
export default {
  computed: {
    ...mapGetters([
      'themeType'
    ])
  },
  data () {
    return {
      addrType: 0,
      isShowColumnFormatter: isShowColumnFormatter,
      div: [],
      listLoading: false,
      isBlack: false,
      firstMove: '',
      total: null,
      tableData: [],
      ws: null,
      timeFormatterSort: timeFormatterSort,
      timeFormatter: timeFormatter,
      userType: userType,
      listQuery: {
        offset: 1,
        limit: 10,
        floorNum: undefined,
        roomNum: undefined,
        departmentId: this.$store.getters.departmentId,
        beginTime: timeFormatterSort(new Date()) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59',
        dutyCompanyName: undefined,
        addr: undefined
      },
      jsonData: [
        {
          title: '账户',
          key: 'leader',
          type: 'text'
        },
        {
          title: '电话',
          key: 'phone',
          type: 'text'
        },
        {
          title: '房号',
          key: 'addr',
          type: 'text'
        },
        {
          title: '在校人数',
          key: 'countIn',
          type: 'text'
        },
        {
          title: '离校人数',
          key: 'countOut',
          type: 'text'
        },
        {
          title: '进场人数',
          key: 'countEnter',
          type: 'text'
        }
        // ,
        // {
        //   title: 'Pic',
        //   key: 'pic',
        //   type: 'image',
        //   width: 80,
        //   height: 50
        // }
      ],
      jsonData1: [
        {
          title: '学校',
          key: 'school',
          type: 'text'
        },
        {
          title: '班级',
          key: 'roomNum',
          type: 'text'
        },
        {
          title: '在校人数',
          key: 'countIn',
          type: 'text'
        },
        {
          title: '离校人数',
          key: 'countOut',
          type: 'text'
        }
        // ,
        // {
        //   title: 'Pic',
        //   key: 'pic',
        //   type: 'image',
        //   width: 80,
        //   height: 50
        // }
      ]
    }
  },
  mounted () {
    this.fetchData()
    this.websocket()
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.onCloseWebsocket()
    next()
  },
  methods: {
    handleh () {
      this.jsonData.forEach((item, index) => {
        if (item.key === 'countIn') {
          item.title = this.themeType === 3 ? '在校人数' : '在场人数'
        }
        if (item.key === 'countOut') {
          item.title = this.themeType === 3 ? '离校人数' : '离场人数'
        }
        if (item.key === 'addr') {
          item.title = this.themeType === 1 ? '房号' : (this.themeType === 2 ? '楼室' : (this.themeType === 3 ? '班级' : '地址'))
        }
      })
      this.jsonData1.forEach((item, index) => {
        if (item.key === 'countIn') {
          item.title = this.themeType === 3 ? '在校人数' : '在场人数'
        }
        if (item.key === 'countOut') {
          item.title = this.themeType === 3 ? '离校人数' : '离场人数'
        }
      })
      let obj = JSON.parse(JSON.stringify(this.tableData))
      // obj.forEach((item, index) => {
      // })
      this.table2excel(this.isShowColumnFormatter(['有为学校']) ? this.jsonData1 : this.jsonData, obj, 'excel.xlsx')
    },
    // 获取数据
    fetchData () {
      this.listLoading = true
      let self = this
      httpGet(getInoutIntime, this.listQuery).then(res => {
        this.addrType = res.data.addrType
        if (res.data.page.rows === null) {
          self.tableData = []
          self.total = 0
        } else {
          self.tableData = res.data.page.rows
          if (this.isShowColumnFormatter(['有为学校']) === true) {
            this.tableData.map((item) => {
              item.school = this.$store.getters.depName
            })
          }
          self.total = res.data.page.total
        }
        self.listLoading = false
      }).catch(() => {
        self.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
      // this.ws.send('123')
    },
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        floorNum: undefined,
        roomNum: undefined,
        departmentId: this.$store.getters.departmentId,
        beginTime: timeFormatterSort(new Date()) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59',
        dutyCompanyName: undefined,
        addr: undefined
      }
      this.fetchData()
    },
    // -------------------websocket-------------------------
    // + '_' + this.$store.getters.departmentId + '_' + new Date()
    websocket () {
      // 检查浏览器是否支持websocket
      if (window.WebSocket) {
        if (this.ws !== null) {
          this.ws.close()
        }
        this.ws = new WebSocket(realTimeWebSocket + '_' + this.$store.getters.departmentId)
        // 连接websocket
        this.ws.onopen = this.initWebSocket
        this.ws.onmessage = this.onmessageWebSocket
        // 连接失败
        this.ws.onerror = this.onerrorWebSocket
      } else {
        this.$message({
          message: '您的浏览器暂时不支持实时统计功能，可尝试换浏览器！',
          type: 'error',
          duration: 3000
        })
      }
    },
    // 初始化实例
    initWebSocket () {
      console.log('初始化成功！')
    },
    // 接收消息
    onmessageWebSocket (mes) {
      console.log(mes.data)
      this.div.push(JSON.parse(mes.data))
      if (this.div.length > 4) {
        this.div.splice(0, 1)
      }
      var x = 0
      for (let i = 0; i < this.tableData.length; i++) {
        if (JSON.parse(mes.data).teamId === this.tableData[i].dutyCompanyId) {
          this.tableData[i].countEnter = JSON.parse(mes.data).teamEnterNum
          this.tableData[i].countIn = JSON.parse(mes.data).teamInNum
          this.tableData[i].countOut = JSON.parse(mes.data).teamOutNum
          this.tableData[i].phone = JSON.parse(mes.data).teamPhone
          x = 1
        }
      }
      if (JSON.parse(mes.data).userType !== 2) {
        if (x === 0) {
          let item = {
            leader: JSON.parse(mes.data).teamLeader,
            addr: JSON.parse(mes.data).addr,
            countIn: JSON.parse(mes.data).teamInNum,
            countEnter: JSON.parse(mes.data).teamEnterNum,
            countOut: JSON.parse(mes.data).teamOutNum,
            phone: JSON.parse(mes.data).teamPhone,
            dutyCompanyId: JSON.parse(mes.data).teamId
          }
          this.tableData.unshift(item)
          if (this.tableData.length > 10) {
            this.tableData.pop()
          }
        }
        this.isBlack = false
      } else {
        this.isBlack = true
      }
    },
    // ---这个地方想维护请做好准备，我是想显示4个，超过4个时，增加一个，去除第一个，这样就可以往上寄送消息---//
    // 连接失败
    onerrorWebSocket () {
      this.$message({
        message: '无法实时显示记录！',
        type: 'error',
        duration: 4 * 1000
      })
    },
    // 关闭websocket
    onCloseWebsocket () {
      this.ws.close()
      console.log('关闭websocket')
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container{
  background: url(../../../../assets/3.jpg);
  // background-color: #4169E1;
  background-size: cover;
}
.conttan{
  width: 30%;
}
@-webkit-keyframes firstMove
  {
  from {top:700px;}
  to {top: 0;}
  }
  .moveFly{
    -webkit-animation:firstMove 2s;
    position:relative;
    animation:firstMove 220px ease;
    -webkit-animation:firstMove 220px ease;
  }
.text {
    font-size: 16px;
  }
.item {
  // margin-bottom: 18px;
  display: inline-flex;
  width:45%;
  justify-content: flex-start
}
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    width: 100%;
  }
</style>
