<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-form>
          <el-form-item label="对接协议" required>
            <el-select v-model="protoArr" @change="checkSelect" :disabled="ff !== undefined">
              <el-option v-for="item in protocolData"  :key="item.id" :label="item.protocolName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
.         <el-button class="filter-item" type="primary" :disabled="total" v-has="['新增']" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
         <el-button class="filter-item" type="danger" :disabled="!total" v-has="['删除']" @click="deletePro" icon="el-icon-delete">删除</el-button>
        <div class="demo-input-suffix">
          <div v-if="infoData.protocolKeyFirstRemark != undefined">
            <label style="margin-right:20px;font-size:15px">秘钥一</label>
            <el-input
              placeholder="秘钥"
              style="display:inline-block;width:30vw;line-height:60px"
              v-model="infoData.protocolKeyFirst">
            </el-input>
            <el-input
              style="display:inline-block;width:30vw;margin-left:10vw;line-height:40px"
              disabled
              v-model="infoData.protocolKeyFirstRemark">
            </el-input>
          </div>
          <div v-if="infoData.protocolKeyTwoRemark != undefined">
            <label style="margin-right:20px;font-size:15px">秘钥二</label>
            <el-input
              placeholder="秘钥"
              style="display:inline-block;width:30vw;line-height:60px"
              v-model="infoData.protocolKeyTwo">
            </el-input>
            <el-input
              style="display:inline-block;width:30vw;margin-left:10vw;line-height:40px"
              disabled
              v-model="infoData.protocolKeyTwoRemark">
            </el-input>
          </div>
          <div v-show="infoData.protocolKeyThreeRemark != undefined">
            <label style="margin-right:20px;font-size:15px">秘钥三</label>
            <el-input
              placeholder="秘钥"
              style="display:inline-block;width:30vw;line-height:60px"
              v-model="infoData.protocolKeyThree">
            </el-input>
            <el-input
              style="display:inline-block;width:30vw;margin-left:10vw;line-height:40px"
              disabled
              v-model="infoData.protocolKeyThreeRemark">
            </el-input>
          </div>
          <div v-show="infoData.protocolKeyFourRemark != undefined">
            <label style="margin-right:20px;font-size:15px">秘钥四</label>
            <el-input
              placeholder="秘钥"
              style="display:inline-block;width:30vw;line-height:60px"
              v-model="infoData.protocolKeyFour">
            </el-input>
            <el-input
              style="display:inline-block;width:30vw;margin-left:10vw;line-height:40px"
              disabled
              v-model="infoData.protocolKeyFourRemark">
            </el-input>
          </div>
          <div v-show="infoData.protocolKeyFiveRemark != undefined">
            <label style="margin-right:20px;font-size:15px">秘钥五</label>
            <el-input
              placeholder="秘钥"
              style="display:inline-block;width:30vw;line-height:60px"
              v-model="infoData.protocolKeyFive">
            </el-input>
            <el-input
              style="display:inline-block;width:30vw;margin-left:10vw;line-height:40px"
              disabled
              v-model="infoData.protocolKeyFiveRemark">
            </el-input>
          </div>
          <div v-show="infoData.protocolKeySixRemark != undefined">
            <label style="margin-right:20px;font-size:15px">秘钥六</label>
            <el-input
              placeholder="秘钥"
              style="display:inline-block;width:30vw;line-height:60px"
              v-model="infoData.protocolKeySix">
            </el-input>
            <el-input
              style="display:inline-block;width:30vw;margin-left:10vw;line-height:40px"
              disabled
              v-model="infoData.protocolKeySixRemark">
            </el-input>
          </div>
           <div v-show="infoData.protocolKeySevenRemark != undefined">
            <label style="margin-right:20px;font-size:15px">秘钥七</label>
            <el-input
              placeholder="秘钥"
              style="display:inline-block;width:30vw;line-height:60px"
              v-model="infoData.protocolKeySeven">
            </el-input>
            <el-input
              style="display:inline-block;width:30vw;margin-left:10vw;line-height:40px"
              disabled
              v-model="infoData.protocolKeySevenRemark">
            </el-input>
          </div>
           <div v-show="infoData.protocolKeyEightRemark != undefined">
            <label style="margin-right:20px;font-size:15px">秘钥八</label>
            <el-input
              placeholder="秘钥"
              style="display:inline-block;width:30vw;line-height:60px"
              v-model="infoData.protocolKeyEight">
            </el-input>
            <el-input
              style="display:inline-block;width:30vw;margin-left:10vw;line-height:40px"
              disabled
              v-model="infoData.protocolKeyEightRemark">
            </el-input>
          </div>
           <div v-show="infoData.protocolKeyNineRemark != undefined">
            <label style="margin-right:20px;font-size:15px">秘钥九</label>
            <el-input
              placeholder="秘钥"
              style="display:inline-block;width:30vw;line-height:60px"
              v-model="infoData.protocolKeyNine">
            </el-input>
            <el-input
              style="display:inline-block;width:30vw;margin-left:10vw;line-height:40px"
              disabled
              v-model="infoData.protocolKeyNineRemark">
            </el-input>
          </div>
           <div v-show="infoData.protocolKeyTenRemark != undefined">
            <label style="margin-right:20px;font-size:15px">秘钥十</label>
            <el-input
              placeholder="秘钥"
              style="display:inline-block;width:30vw;line-height:60px"
              v-model="infoData.protocolKeyTen">
            </el-input>
            <el-input
              style="display:inline-block;width:30vw;margin-left:10vw;line-height:40px"
              disabled
              v-model="infoData.protocolKeyTenRemark">
            </el-input>
          </div>
        </div>
        <el-button class="filter-item" style="margin: 2% 0 0 85%" type="primary"  v-has="['编辑']" @click="updateContent"  icon="el-icon-edit">修改</el-button>
      </div>
      <!-- <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="infoData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" v-if = "isShowColumnFormatter(['删除'])"  width="40" fixed="left" ></el-table-column>
        <el-table-column label="秘钥" align="center" prop="protocolKeyEight"></el-table-column>
        <el-table-column label="备注" align="center" prop="protocolKeyEightRemark"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300" v-if = "isShowColumnFormatter(['编辑','权限'])">
          <template slot-scope="scope">
            <el-button v-has="['编辑']" type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table> -->
      <!-- 分页 -->
      <!-- <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div> -->
      <el-dialog title="添加" :visible.sync="dialogFormVisible">
        <el-form ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="秘钥一" prop="protocolKeyFirst">
            <el-input v-model="form.protocolKeyFirst"  clearable placeholder="请输入秘钥名称"></el-input>
          </el-form-item>
         <el-form-item label="秘钥二" prop="protocolKeyTwo">
            <el-input v-model="form.protocolKeyTwo"  clearable placeholder="请输入秘钥名称"></el-input>
          </el-form-item>
          <el-form-item label="秘钥三" prop="protocolKeyThree">
            <el-input v-model="form.protocolKeyThree"  clearable placeholder="请输入秘钥名称"></el-input>
          </el-form-item>
          <el-form-item label="秘钥四" prop="protocolKeyFour">
            <el-input v-model="form.protocolKeyFour"  clearable placeholder="请输入秘钥名称"></el-input>
          </el-form-item>
          <el-form-item label="秘钥五" prop="protocolKeyFive">
            <el-input v-model="form.protocolKeyFive"  clearable placeholder="请输入秘钥名称"></el-input>
          </el-form-item>
          <el-form-item label="秘钥六" prop="protocolKeySix">
            <el-input v-model="form.protocolKeySix"  clearable placeholder="请输入秘钥名称"></el-input>
          </el-form-item>
          <el-form-item label="秘钥七" prop="protocolKeySeven">
            <el-input v-model="form.protocolKeySeven"  clearable placeholder="请输入秘钥名称"></el-input>
          </el-form-item>
          <el-form-item label="秘钥八" prop="protocolKeyEight">
            <el-input v-model="form.protocolKeyEight"  clearable placeholder="请输入秘钥名称"></el-input>
          </el-form-item>
          <el-form-item label="秘钥九" prop="protocolKeyNine">
            <el-input v-model="form.protocolKeyNine"  clearable placeholder="请输入秘钥名称"></el-input>
          </el-form-item>
          <el-form-item label="秘钥十" prop="protocolKeyTen">
            <el-input v-model="form.protocolKeyTen"  clearable placeholder="请输入秘钥名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading"  type="primary" @click="createData">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { isShowColumnFormatter } from '@/utils/formatter.js'
import { httpGet, httpPost, httpDelete } from '@/utils/restful'
import { getFullInfo, addInfo, getRemark, delInfo } from '@/api/url' // , getRemark
export default {
  data () {
    return {
      list: null,
      protoArr: undefined,
      listLoading: true,
      createLoading: false,
      total: false,
      updataLoading: false,
      deleteLoading: false,
      roleLoading: false,
      getRoleLoading: false,
      isShowColumnFormatter: isShowColumnFormatter,
      count: undefined,
      tableData: [],
      protocolData: [],
      infoData: {
        id: undefined,
        protocolKeyFirst: undefined,
        protocolKeyFirstRemark: undefined,
        protocolKeyTwo: undefined,
        protocolKeyTwoRemark: undefined,
        protocolKeyThree: undefined,
        protocolKeyThreeRemark: undefined,
        protocolKeyFour: undefined,
        protocolKeyFourRemark: undefined,
        protocolKeyFive: undefined,
        protocolKeyFiveRemark: undefined,
        protocolKeySix: undefined,
        protocolKeySixRemark: undefined,
        protocolKeySeven: undefined,
        protocolKeySevenRemark: undefined,
        protocolKeyEight: undefined,
        protocolKeyEightRemark: undefined,
        protocolKeyNine: undefined,
        protocolKeyNineRemark: undefined,
        protocolKeyTen: undefined,
        protocolKeyTenRemark: undefined
      },
      dialogFormVisible: false,
      selectArrayId: [],
      disabled: true,
      ff: undefined,
      ids: undefined,
      form: {
        protocolKeyFirst: '',
        protocolKeyTwo: '',
        protocolKeyThree: '',
        protocolKeyFour: '',
        protocolKeyFive: '',
        protocolKeySix: '',
        protocolKeySeven: '',
        protocolKeyEight: '',
        protocolKeyNine: '',
        protocolKeyTen: ''
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      httpGet(getFullInfo + '/' + this.$store.getters.departmentId).then(res => {
        console.log(res)
        if (res.data.thirdProtocolDtos === null) {
          this.protocolData = []
        } else {
          this.protocolData = res.data.thirdProtocolDtos
        }
        if (res.data.protocolRemarkDo === null) {
          // this.infoData = {}
          // this.protoArr = undefined
        } else {
          this.infoData = res.data.protocolRemarkDo
          this.protoArr = res.data.protocolRemarkDo.thirdProtocolId
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    deletePro () {
      this.$confirm('确认要删除所有秘钥吗？', '提示', {})
        .then(() => {
          let id = this.infoData.id
          httpDelete(delInfo + '/' + id + '/' + this.$store.getters.departmentId)
            .then((res) => {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4 * 1000
              })
            }).catch(() => {})
          this.fetchData()
        }).catch(() => {})
    },
    rest () {
      this.infoData = {
        id: undefined,
        protocolKeyFirst: undefined,
        protocolKeyFirstRemark: undefined,
        protocolKeyTwo: undefined,
        protocolKeyTwoRemark: undefined,
        protocolKeyThree: undefined,
        protocolKeyThreeRemark: undefined,
        protocolKeyFour: undefined,
        protocolKeyFourRemark: undefined,
        protocolKeyFive: undefined,
        protocolKeyFiveRemark: undefined,
        protocolKeySix: undefined,
        protocolKeySixRemark: undefined,
        protocolKeySeven: undefined,
        protocolKeySevenRemark: undefined,
        protocolKeyEight: undefined,
        protocolKeyEightRemark: undefined,
        protocolKeyNine: undefined,
        protocolKeyNineRemark: undefined,
        protocolKeyTen: undefined,
        protocolKeyTenRemark: undefined
      }
    },
    checkSelect () {
      httpGet(getRemark + '/' + this.protoArr)
        .then((res) => {
          console.log(res)
          // this.rest()
          if (res.data !== null) {
            this.infoData = Object.assign(this.infoData, res.data)
            // this.infoData = res.data
            this.total = true
            this.fetchData()
          }
        })
      console.log(this.protoArr)
    },
    handleCreate () {
      if (this.protoArr === undefined) {
        this.$message({
          message: '请先选择协议再添加',
          type: 'warning'
        })
      } else {
        let self = this
        self.dialogFormVisible = true
      }
      // this.form = Object.assign(this.form, JSON.parse(x))
      // 延迟调用
      // self.$nextTick(() => {
      //   self.$refs['dataform'].resetFields()
      //   self.resetForm()
      // })
    },
    // 新增
    createData () {
      this.createLoading = true
      this.thirdProtocolPram = Object.assign(this.form, {
        departmentId: parseInt(this.$store.getters.departmentId),
        thirdProtocolId: this.protoArr
      })
      httpPost(addInfo, this.thirdProtocolPram).then(res => {
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
    },
    updateContent () {
      httpGet(getFullInfo + '/' + this.$store.getters.departmentId)
        .then(res => {
          this.protoArr = res.data.protocolRemarkDo.thirdProtocolId
        }).catch(() => {})
      this.thirdProtocolPram = Object.assign(this.infoData, {
        departmentId: parseInt(this.$store.getters.departmentId),
        thirdProtocolId: this.protoArr
      })
      httpPost(addInfo, this.thirdProtocolPram).then(res => {
        this.$message({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
        this.ff = '123'
        this.fetchData()
        console.log(res)
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
