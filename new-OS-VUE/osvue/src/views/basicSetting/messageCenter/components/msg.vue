<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>详情信息</span>
      </div>
      <ul>
        <li v-for="(item) in msgTypeList" :key="item.typeId">
            <el-tag  v-if="((isReader!=2?item.readCount:0) + (isReader!=3?item.notReadCount:0))>0" @click.native="clickType(item.typeId)">{{item.typeName}}({{(isReader!=2?item.readCount:0) + (isReader!=3?item.notReadCount:0)}})</el-tag>
        </li>
      </ul>
      <div class="box-switch" v-if="isReader!=3"><el-switch v-model="readAll" active-text="全部标记为已读" @change="HandleReadAll" :disabled="readAll"></el-switch></div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" :data="data"
        v-loading.body="listLoading" element-loading-text="加载中..."
        border fit highlight-current-row @row-click="openRow"
        :row-class-name="tableRowClassName">
        <el-table-column label="" align="center" prop="seeNum" width="70">
            <template slot-scope="scope">
              <el-button v-if="scope.row.seeNum > 0" type="success" icon="el-icon-check" circle size="mini"></el-button>
              <el-button v-if="scope.row.seeNum == 0" type="danger" icon="el-icon-message" circle size="mini"></el-button>
            </template>
        </el-table-column>
        <el-table-column label="标题内容" align="center" prop="title"></el-table-column>
        <el-table-column label="类型" align="center" prop="typeName" width="200"></el-table-column>
        <el-table-column label="接收时间" align="center" prop="createAt" width="200">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.createAt)}}
            </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </el-card>
    <el-dialog :title="dialog.title" :visible.sync="dialogVisible" min>
      <div class="box-text">
        <h3 style="margin-left:5px;">尊敬的用户:</h3>
        <div class="textStyle" v-html="dialog.text"></div>
        <p style="text-align: right; padding: 0 10px">
          功能优化中...
        </p>
        <p style="text-align: right; padding: 10px">
          接收时间:{{timeFormatterSort(dialog.createAt)}}
        </p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { httpGet, httpPost } from '@/utils/restful'
import { pageMsgByUserId, getMsgTypeCount, getMsgDetailedInfo, setReadAll } from '@/api/url'
import { timeFormatter, timeFormatterSort } from '@/utils/formatter.js'
export default {
  name: 'Msg',
  props: ['isReader'],
  data () {
    return {
      data: [],
      msgTypeList: [],
      listLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        typeId: undefined,
        isReader: undefined
      },
      total: null,
      timeFormatter: timeFormatter,
      timeFormatterSort: timeFormatterSort,
      dialogVisible: false,
      dialog: {
        title: '查看',
        text: '',
        createAt: undefined
      },
      readAll: false
    }
  },
  created () {
    this.listQuery.isReader = 1
    this.listQuery.typeId = undefined
    this.fetchData()
    this.getMsgTypeCount()
  },
  watch: {
    isReader (curVal, oldVal) {
      this.listQuery.offset = 1
      this.listQuery.isReader = curVal
      this.listQuery.typeId = undefined
      this.fetchData()
      this.getMsgTypeCount()
    }
  },
  methods: {
    fetchData () {
      this.listLoading = true
      httpGet(pageMsgByUserId, this.listQuery).then(res => {
        if (res.data !== null) {
          this.data = res.data.rows
          this.total = res.data.total
        } else {
          this.total = 0
          this.data = []
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    clickType (typeId) {
      if (this.listQuery.typeId !== typeId) {
        this.listQuery.typeId = typeId
        this.fetchData()
        this.getMsgTypeCount()
      }
    },
    getMsgTypeCount () {
      httpGet(getMsgTypeCount, {isReader: this.listQuery.isReader}).then(res => {
        this.msgTypeList = res.data
      }).catch(() => {
      })
    },
    tableRowClassName ({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    openRow (row, event, column) {
      if (row && row.id) {
        httpPost(getMsgDetailedInfo + row.id).then(res => {
          if (res.data !== null) {
            this.dialog = res.data
            this.data[row.index].seeNum = (this.data[row.index].seeNum != null ? this.data[row.index].seeNum : 0) + 1
            this.dialog.text = this.dialog.text.replace(new RegExp('\\n', 'gm'), '<br/>')
            this.dialogVisible = true
          }
        }).catch(() => {
        })
      }
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 标记所有为已读
    HandleReadAll () {
      if (this.readAll) {
        httpPost(setReadAll, this.listQuery).then(res => {
          this.$message.success('操作成功')
        }).catch(() => {})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.el-tag {
    cursor: pointer;
}
ul li {
  float: left;
  padding: 0 5px 10px;
  list-style: none;
}
.box-switch {
  float: right;
  padding: 0 5px 10px;
}
.box-text {
  border: 1px solid #c8cfda;
  padding: 30px;
  background: linear-gradient(to bottom,rgb(221, 244, 255), rgb(237, 249, 255), rgb(247, 252, 255), rgb(255, 255, 255), rgb(255, 255, 255), rgb(255, 255, 255));
}
.textStyle {
  font-size: 16px;
  padding: 10px 5%;
  width: 100%;
  line-height: 30px;
}
</style>
