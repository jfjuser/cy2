<template>
  <div class="app-container">
    <div class="table-main" style="margin-top: 20px;">
      <div class="filter-container">
        <el-button @click="add" type="primary">添加</el-button>
        <el-button @click="delStrategyList" type="primary" :disabled="isDel">删除选中</el-button>
        <el-button @click="distributionStrategy" type="success">下发策略</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="strategyId"
          align="center"
          label="唯一标识"
          min-width="25%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="strategyName"
          label="策略名称"
          min-width="25%">
        </el-table-column>
        <el-table-column
          label="策略状态"
          align="center"
          min-width="25%"
          show-overflow-tooltip>
            <template slot-scope="scope">
              {{strategyTypeFormatter(scope.row.status)}}
            </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="操作"
          min-width="25%"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="primary">修改</el-button>
            <el-button @click="editRule(scope.row)" type="primary">编辑规则</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="isAdd?'新增策略':'编辑策略'"
        :visible.sync="dialogVisible"
        width="30%">
        <el-form :rules="rules" ref="form" :model="form" label-width="80px">
          <el-form-item label="ID" prop="strategyId">
            <el-input v-model="form.strategyId"></el-input>
          </el-form-item>
          <el-form-item label="策略名称" prop="strategyName">
            <el-input v-model="form.strategyName"></el-input>
          </el-form-item>
          <el-form-item label="策略状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option
                  v-for="item in strategyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertStrategy">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="规则"
        :visible.sync="ruleDialogVisible"
        width="80%">
          <el-button @click="addRule" type="primary">添加</el-button>
          <el-button :disabled="(delRule.length) < 1" @click="delChooseRule" type="primary">删除选中</el-button>
            <el-dialog
              width="30%"
              :close-on-click-modal="false"
              :title="isModify?'修改规则':'新建规则'"
              :visible.sync="innerVisible"
              :modal='false'
              append-to-body>
                <!-- 编辑规则区域 -->
                <el-form :rules="ruleRules" ref="ruleForm" :model="ruleForm" label-width="80px">
                  <el-form-item label="ID" prop="ruleId">
                    <el-input v-model="ruleForm.ruleId"></el-input>
                  </el-form-item>
                  <el-form-item label="日期范围" required="">
                    <el-date-picker
                      v-model="dateSelection"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item required="" v-for="(item, index) in timeRange" :key="item.id" label="时间段">
                      <el-time-picker
                        is-range
                        v-model="item.value"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                      </el-time-picker>
                      <img v-show=" index === 0 " @click="addTimeRange" style="margin-left: 5px;cursor: pointer" src="@/assets/add.png" alt="">
                      <img v-show=" index !== 0 " @click="subtractTimeRange(index)" style="margin-left: 5px;cursor: pointer" src="@/assets/subtract.png" alt="">
                  </el-form-item>
                  <el-form-item label="星期信息" prop="week">
                    <el-select v-model="week" multiple placeholder="请选择">
                      <el-option
                        v-for="item in weekOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="规则类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择">
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmitRule">{{isModify?'保存修改': '立即添加'}}</el-button>
                    <el-button @click="innerVisible = false">取消</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
          <el-table
            ref="multipleTable"
            :data="ruleTableData"
            tooltip-effect="dark"
            height="500"
            style="width: 100%"
            @selection-change="chooseDelRule">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="ruleId"
              label="唯一标识"
              align="center"
              min-width="10%">
            </el-table-column>
            <el-table-column
              prop="begDate"
              label="起始日期"
              align="center"
              min-width="10%">
            </el-table-column>
            <el-table-column
              prop="endDate"
              align="center"
              label="结束日期"
              min-width="10%"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="timeRange"
              min-width="18%"
              label="时间段范围"
              align="center">
            </el-table-column>
            <el-table-column
              min-width="18%"
              label="星期信息"
              align="center">
              <template slot-scope="scope">{{weekFormatter(scope.row.week)}}</template>
            </el-table-column>
            <el-table-column
              label="规则类型"
              align="center"
              min-width="12%">
              <template slot-scope="scope">{{trafficTypeFormatter(scope.row.type)}}</template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              min-width="12%">
              <template slot-scope="scope">
                <el-button @click="modifyRule(scope.row)" type="primary">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ruleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ruleDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { distributionListStrategyRule, listStrategy, insertStrategy, updateStrategy, delStrategy, listStrategyRule, insertRule, delStrategyRule, updateRule } from '@/api/url'
import {httpGet, httpPost, httpPut, httpDelete} from '@/utils/restful'
import {strategyTypeFormatter, timeFormatterSortS, timeHourMinSFormatter, trafficTypeFormatter, weekFormatter} from '@/utils/formatter'
export default {
  name: '',
  data () {
    return {
      ruleId: undefined,
      isModify: true,
      delRule: [],
      week: [],
      strategyId: undefined,
      num: 1,
      typeOptions: [{
        value: 1,
        label: '允许通行'
      }, {
        value: 2,
        label: '禁止通行'
      }],
      weekOptions: [{
        value: '1',
        label: '星期一'
      }, {
        value: '2',
        label: '星期二'
      }, {
        value: '3',
        label: '星期三'
      }, {
        value: '4',
        label: '星期四'
      }, {
        value: '5',
        label: '星期五'
      }, {
        value: '6',
        label: '星期六'
      }, {
        value: '0',
        label: '星期日'
      }],
      dateSelection: [],
      timeRange: [{value: '', id: 0}],
      ruleForm: {
        ruleId: undefined,
        tbStrategyId: undefined,
        begDate: undefined,
        endDate: undefined,
        timeRange: undefined,
        week: undefined,
        type: undefined
      },
      innerVisible: false,
      ruleDialogVisible: false,
      isDel: true,
      delList: [],
      id: undefined,
      isAdd: true,
      weekFormatter: weekFormatter,
      trafficTypeFormatter: trafficTypeFormatter,
      strategyTypeFormatter: strategyTypeFormatter,
      tableData: [],
      ruleTableData: [],
      dialogVisible: false,
      form: {
        strategyId: undefined,
        strategyName: undefined,
        status: undefined
      },
      strategyOptions: [
        {value: 1, label: '启用'},
        {value: 0, label: '禁用'}
      ],
      ruleRules: {
        ruleId: [
          {required: true, trigger: 'blur', message: '请输入ID'}
        ],
        week: [
          {required: true, trigger: 'blur', message: '请选择星期信息'}
        ],
        type: [
          {required: true, trigger: 'blur', message: '请选择规则类型  '}
        ]
      },
      rules: {
        strategyId: [
          {required: true, trigger: 'blur', message: '请输入ID'}
        ],
        status: [
          {required: true, trigger: 'blur', message: '请输入策略名称'}
        ],
        strategyName: [
          {required: true, trigger: 'blur', message: '请输入策略状态'}
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  watch: {
    dateSelection (n, o) {
      this.ruleForm.begDate = timeFormatterSortS(n[0])
      this.ruleForm.endDate = timeFormatterSortS(n[1])
    }
  },
  methods: {
    // 下发策略
    distributionStrategy () {
      this.$confirm('此操作将下发策略, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return httpGet(distributionListStrategyRule + this.$store.getters.departmentId)
      }).then(res => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: '下发策略成功!'
          })
        } else {
          this.$message.error('下发策略失败')
        }
      }).catch(() => {})
    },
    initForm () {
      this.ruleForm.ruleId = undefined
      this.dateSelection = []
      this.timeRange = [{value: '', id: 0}]
      this.week = []
      this.ruleForm.type = undefined
    },
    // 添加规则
    addRule () {
      this.innerVisible = true
      this.isModify = false
      this.initForm()
    },
    // 修改规则
    modifyRule (row) {
      this.ruleId = row.id
      this.innerVisible = true
      this.isModify = true
      // 点击修改时初始化ID
      this.ruleForm.ruleId = row.ruleId
      // 点击修改时初始化日期范围
      let bt = row.begDate.split('/')
      let et = row.endDate.split('/')
      this.dateSelection = [new Date(bt[0], bt[1] - 1, bt[2]), new Date(et[0], et[1] - 1, et[2])]
      // 点击修改时初始化时间段
      let tr = row.timeRange.split(',')
      this.num = tr.length
      this.timeRange = []
      tr.map((ele, index) => {
        let startTime = ele.split('-')[0].split(':')
        let endTime = ele.split('-')[1].split(':')
        let obj = {}
        obj.value = [
          new Date(1998, 12, 5, startTime[0], startTime[1], startTime[2]),
          new Date(1998, 12, 5, endTime[0], endTime[1], endTime[2])
        ]
        obj.id = index
        this.timeRange.push(obj)
      })
      // 点击修改时初始化星期信息
      this.week = row.week.split(',')
      // 点击修改时初始化规则类型
      this.ruleForm.type = row.type
      console.log(row)
    },
    // 创建规则
    onSubmitRule () {
      let arr = []
      // 时间段转化
      if (this.dateSelection < 1) {
        this.$message.error('请输入时间范围')
        return
      }
      if (this.timeRange.length < 1) {
        this.$message.error('请输入时间段')
        return
      }
      this.timeRange.map(ele => {
        console.log(ele)
        let str = `${timeHourMinSFormatter(ele.value[0])}-${timeHourMinSFormatter(ele.value[1])}`
        arr.push(str)
      })
      this.ruleForm.timeRange = arr.join()
      // 星期信息转化
      this.ruleForm.week = this.week.sort().toString()
      this.$refs.ruleForm.validate(res => {
        if (res) {
          if (this.isModify) {
            // 点击修改走这里
            let form = Object.assign({}, this.ruleForm, {id: this.ruleId})
            httpPut(updateRule, form).then(res => {
              if (res.code === 1) {
                this.getRuleData()
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
              } else {
                this.$message.error('修改失败')
              }
              this.innerVisible = false
            })
          } else {
            // 如果是点击添加走这里
            httpPut(insertRule, this.ruleForm).then(res => {
              if (res.code === 1) {
                this.getRuleData()
                this.innerVisible = false
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
              } else {
                this.innerVisible = false
                this.$message.error('添加失败')
              }
            }).catch(res => {
              this.$message.error('添加失败')
            })
          }
        }
      })
    },
    chooseDelRule (val) {
      this.delRule = []
      val.map(ele => {
        this.delRule.push(ele.id)
      })
    },
    // 删除选中规则
    delChooseRule () {
      this.$confirm('此操作将永久删除规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return httpDelete(delStrategyRule, this.delRule)
      }).then(res => {
        if (res.code === 1) {
          this.getRuleData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 减去时间规则
    subtractTimeRange (index) {
      this.timeRange.splice(index, 1)
      this.num++
    },
    // 添加时间规则
    addTimeRange () {
      let obj = {}
      obj.value = ''
      obj.id = this.num
      this.timeRange.push(obj)
      this.num++
    },
    getRuleData () {
      httpGet(listStrategyRule + this.ruleForm.tbStrategyId)
        .then(res => {
          this.ruleTableData = res
        })
    },
    editRule (row) {
      this.ruleDialogVisible = true
      this.ruleForm.tbStrategyId = row.id
      this.getRuleData()
    },
    delStrategyList () {
      let self = this
      this.$confirm('此操作将永久删除该策略, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpDelete(delStrategy, this.delList)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '已删除'
              })
            }
            self.getData()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange (val) {
      this.delList = []
      val.map(ele => {
        this.delList.push(ele.id)
      })
      if (val.length > 0) {
        this.isDel = false
      } else {
        this.isDel = true
      }
      console.log(this.delList)
    },
    add () {
      this.form.strategyId = undefined
      this.form.strategyName = undefined
      this.form.status = undefined
      this.dialogVisible = true
      this.isAdd = true
    },
    edit (row) {
      this.form.strategyId = row.strategyId
      this.form.strategyName = row.strategyName
      this.form.status = row.status
      this.id = row.id
      this.dialogVisible = true
      this.isAdd = false
    },
    getData () {
      httpPost(listStrategy, {departmentId: this.$store.getters.departmentId})
        .then(res => {
          this.tableData = res.data.rows
        })
    },
    deleteIndividualUser () {
    },
    insertStrategy () {
      let self = this
      if (this.isAdd) {
        this.$refs.form.validate((res) => {
          if (res) {
            httpPut(insertStrategy, {...self.form, departmentId: this.$store.getters.departmentId})
              .then(res => {
                if (res.code === 1) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  self.getData()
                } else {
                  this.$message.error('添加失败')
                }
                self.dialogVisible = false
              })
          }
        })
      } else {
        this.$refs.form.validate(res => {
          if (res) {
            httpPut(updateStrategy, {...self.form, id: this.id, departmentId: this.$store.getters.departmentId})
              .then(res => {
                if (res.code === 1) {
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
                  self.getData()
                } else {
                  this.$message.error('编辑失败')
                }
                self.dialogVisible = false
              })
          }
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
