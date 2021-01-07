<template>
  <div class="table-main" style="margin-top: 20px;">
    <!-- 操作 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加进出时段</el-button>
      <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
    </div>
    <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column label="名称" align="center" prop="name"></el-table-column>
      <el-table-column label="开始时间" align="center" prop="beginTime"></el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime"></el-table-column>
      <el-table-column label="星期一" align="center" prop="monday">
        <template slot-scope="scope">
          <el-button v-if="scope.row.monday === 1" type="success" icon="el-icon-check" size="mini" circle></el-button>
          <el-button v-if="scope.row.monday === 0" type="danger" icon="el-icon-close"  size="mini" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column label="星期二" align="center" prop="tuesday">
        <template slot-scope="scope">
          <el-button v-if="scope.row.tuesday === 1" type="success" icon="el-icon-check" size="mini" circle></el-button>
          <el-button v-if="scope.row.tuesday === 0" type="danger" icon="el-icon-close"  size="mini" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column label="星期三" align="center" prop="wednesday">
        <template slot-scope="scope">
          <el-button v-if="scope.row.wednesday === 1" type="success" icon="el-icon-check" size="mini" circle></el-button>
          <el-button v-if="scope.row.wednesday === 0" type="danger" icon="el-icon-close"  size="mini" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column label="星期四" align="center" prop="thursday">
        <template slot-scope="scope">
          <el-button v-if="scope.row.thursday === 1" type="success" icon="el-icon-check" size="mini" circle></el-button>
          <el-button v-if="scope.row.thursday === 0" type="danger" icon="el-icon-close"  size="mini" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column label="星期五" align="center" prop="friday">
        <template slot-scope="scope">
          <el-button v-if="scope.row.friday === 1" type="success" icon="el-icon-check" size="mini" circle></el-button>
          <el-button v-if="scope.row.friday === 0" type="danger" icon="el-icon-close"  size="mini" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column label="星期六" align="center" prop="saturday">
        <template slot-scope="scope">
          <el-button v-if="scope.row.saturday === 1" type="success" icon="el-icon-check" size="mini" circle></el-button>
          <el-button v-if="scope.row.saturday === 0" type="danger" icon="el-icon-close"  size="mini" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column label="星期天" align="center" prop="sunday">
        <template slot-scope="scope">
          <el-button v-if="scope.row.sunday === 1" type="success" icon="el-icon-check" size="mini" circle></el-button>
          <el-button v-if="scope.row.sunday === 0" type="danger" icon="el-icon-close"  size="mini" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
          <el-button type="primary" @click="handleDown(scope.row)" size="mini">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="80px" >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: auto"  placeholder="请输入名称">
          </el-input>
        </el-form-item>
        <el-form-item label="时间段" required>
          <el-time-picker
            is-range
            v-model="time"
            range-separator="至"
            :default-value ="['00:00', '00:00']"
            value-format = "HH:mm"
            format="HH 点 mm 分"
            :clearable = "false"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="星期一" required>
          <el-radio v-model="form.monday" :label="0">不开启</el-radio>
          <el-radio v-model="form.monday" :label="1">开启</el-radio>
        </el-form-item>
        <el-form-item label="星期二" required>
          <el-radio v-model="form.tuesday" :label="0">不开启</el-radio>
          <el-radio v-model="form.tuesday" :label="1">开启</el-radio>
        </el-form-item>
        <el-form-item label="星期三" required>
          <el-radio v-model="form.wednesday" :label="0">不开启</el-radio>
          <el-radio v-model="form.wednesday" :label="1">开启</el-radio>
        </el-form-item>
        <el-form-item label="星期四" required>
          <el-radio v-model="form.thursday" :label="0">不开启</el-radio>
          <el-radio v-model="form.thursday" :label="1">开启</el-radio>
        </el-form-item>
        <el-form-item label="星期五" required>
          <el-radio v-model="form.friday" :label="0">不开启</el-radio>
          <el-radio v-model="form.friday" :label="1">开启</el-radio>
        </el-form-item>
        <el-form-item label="星期六" required>
          <el-radio v-model="form.saturday" :label="0">不开启</el-radio>
          <el-radio v-model="form.saturday" :label="1">开启</el-radio>
        </el-form-item>
        <el-form-item label="星期天" required>
          <el-radio v-model="form.sunday" :label="0">不开启</el-radio>
          <el-radio v-model="form.sunday" :label="1">开启</el-radio>
        </el-form-item>
        <!-- <el-form-item label="通道名称" required>
        <el-select v-model="channelId" multiple placeholder="请选择">
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.localName"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :loading = "createLoading" v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
        <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { timeFormatter } from '@/utils/formatter.js'
import { httpGet, httpPost, httpPut } from '@/utils/restful'
import { AIInOutTime, checkAICamera } from '@/api/url'
export default {
  name: 'Time',
  data () {
    return {
      list: null,
      listLoading: true,
      createLoading: false,
      updateLoading: false,
      timeFormatter: timeFormatter,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      time: ['00:01', '23:59'],
      total: null,
      form: {
        id: undefined,
        name: undefined,
        beginTime: undefined,
        endTime: undefined,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      },
      formRules: {
        name: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      channelList: [],
      channelId: []
    }
  },
  created () {
    this.fetchData()
    this.getChannelList()
  },
  methods: {
    getChannelList () {
      httpGet(checkAICamera + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.channelList = res.data
        }
      }).catch(() => {})
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(AIInOutTime + '/page', this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
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
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        name: undefined,
        beginTime: undefined,
        endTime: undefined,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      }
      this.time = ['00:01', '23:59']
    },
    handleCreate () {
      this.channelId = []
      if (this.total > 48) {
        this.$message.error('只能设置48个段')
      } else {
        let self = this
        self.dialogStatus = 'create'
        self.dialogFormVisible = true
        self.$nextTick(() => {
          self.$refs['dataform'].resetFields()
          self.resetForm()
        })
      }
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.time = [row.beginTime, row.endTime]
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.channelId = []
      row.tokenList.forEach(ele => {
        this.channelId.push(ele.id)
      })
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    handleDown (row) {
      this.$confirm('是否下载到所有相机？', '提示', {})
        .then(() => {
          httpPost(AIInOutTime + '/sync/' + row.id)
            .then(res => {
              this.$message.success(res.message)
            }).catch(() => {})
        }).catch(() => {})
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.form.beginTime = this.time[0]
          this.form.endTime = this.time[1]
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId, aiTokenIdArr: this.channelId})
          httpPost(AIInOutTime, this.form).then((res) => {
            this.fetchData()
            this.dialogFormVisible = false
            setTimeout(() => { this.createLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.createLoading = false
          })
        }
      })
    },
    // 修改
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          this.form.beginTime = this.time[0]
          this.form.endTime = this.time[1]
          const updateFormData = Object.assign(this.form, {departmentId: this.$store.getters.departmentId, aiTokenIdArr: this.channelId})
          httpPut(AIInOutTime, updateFormData).then(res => {
            this.fetchData()
            this.dialogFormVisible = false
            setTimeout(() => { this.updateLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.updateLoading = false
          })
        }
      })
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        limit: 10,
        offset: 1
      }
      this.fetchData()
    }
  }
}
</script>
