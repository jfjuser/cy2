<template>
    <div class="app-container">
        <div class="table-main">
            <div class="filter-container">
                <el-select v-model="id" placeholder="请选择部门" @change="onConfirm" class="filter-item">
                  <el-option
                    v-for="(item, index) in options"
                    :key="index"
                    :label="item.leader"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button class="filter-item" type="primary" @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
            </div>
            <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
                <el-table-column label="审核状态" align="center" prop="isCheck">
                    <template slot-scope="scope">
                        <template v-if="scope.row.isCheck === 0">待审核</template>
                        <template v-if="scope.row.isCheck === 1">待审核</template>
                        <template v-if="scope.row.isCheck === 2">待审核</template>
                    </template>
                </el-table-column>
                <el-table-column label="申请人" align="center" prop="aiUserName"></el-table-column>
                <el-table-column label="申请时间" align="center" prop="createAt">
                    <template slot-scope="scope">
                        {{timeFormatter(scope.row.createAt)}}
                    </template>
                </el-table-column>
                <el-table-column label="补卡时间" align="center" prop="applyTime">
                    <template slot-scope="scope">
                        {{timeFormatter(scope.row.applyTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="补卡理由" align="center" prop="reason"></el-table-column>
                <el-table-column label="辅助图片" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" size="small" @click.native.prevent="handleSeePhoto(scope.row.file)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click.native.prevent="handleAudit(scope.row)" :disabled="scope.row.isCheck !== 0">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="图片" width="30%" :visible.sync = "dialogPhotoVisible">
            <el-image
            style="width: 200px; height: 200px"
            :src="imgUrl"
            :preview-src-list="[imgUrl]"
            fit="contain"></el-image>
        </el-dialog>
        <el-dialog title="审核" width="40%" :visible.sync = "dialogCheckVisible">
            <el-form>
                <el-form-item label="拒绝理由" required v-show="form.isChekc === 2">
                    <el-input v-model="form.failReason"></el-input>
                </el-form-item>
                <el-form-item label="审核状态" required >
                    <el-radio-group v-model="form.isChekc">
                    <el-radio :label= 2 >拒绝</el-radio>
                    <el-radio :label= 1 >同意</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogCheckVisible = false">取消</el-button>
                <el-button type="primary" @click="isCheckData" :loading="saveLoading">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getPunchInList, auditPunchIn, getAllDepartment } from '@/api/url'
import { timeFormatter } from '@/utils/formatter'
import { httpGet, httpPost } from '@/utils/restful'
import { punchInText } from '@/utils/helptext'
import Storage from '@/utils/storage'
export default {
  data () {
    return {
      timeFormatter,
      list: null,
      listLoading: true,
      tableData: [],
      dialogPhotoVisible: false,
      imgUrl: '',
      dialogCheckVisible: false,
      form: {
        failReason: '',
        id: undefined,
        userId: this.$store.getters.userId,
        isChekc: undefined
      },
      saveLoading: false,
      listQuery: {
        leader: null,
        offset: 1,
        limit: 1000,
        departmentId: this.$store.getters.departmentId
      },
      options: [],
      id: undefined
    }
  },
  mounted () {
    this.fetchDepaData()
    if (!Storage.get('punchInShowHelp')) {
      this.$nextTick(() => {
        this.$alert(punchInText, '帮助说明', {
          confirmButtonText: '知道了，不再提醒',
          // showClose: false,
          center: true,
          roundButton: true,
          callback: action => {
            if (action === 'confirm') {
              Storage.set('punchInShowHelp', 1)
            }
          }
        })
      })
    }
  },
  methods: {
    // 刷新
    handleRefresh () {
      this.fetchData()
    },
    // 获取数据
    fetchData () {
      let self = this
      httpGet(getPunchInList + '/' + this.id).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.listLoading = false
        } else {
          self.tableData = res.data
          self.listLoading = false
        }
      }).catch(() => {
        self.listLoading = false
      })
    },
    handleSeePhoto (base64) {
      if (base64) {
        this.imgUrl = 'data:image/jpg;base64,' + base64
        this.dialogPhotoVisible = true
      } else {
        this.$message.error('未获取到图片')
      }
    },
    handleAudit (row) {
      this.dialogCheckVisible = true
      this.form.id = row.id
    },
    isCheckData () {
      if (this.form.isChekc === 2) {
        if (this.form.failReason === '') {
          return
        }
      }
      this.saveLoading = true
      httpPost(auditPunchIn, this.form)
        .then(res => {
          this.fetchData()
          this.dialogCheckVisible = false
          setTimeout(() => { this.saveLoading = false }, 300)
          this.$message.success(res.message)
        }).catch(() => {
          this.saveLoading = false
        })
    },
    fetchDepaData () {
      let self = this
      httpGet(getAllDepartment, this.listQuery).then(res => {
        if (res.data === null) {
          self.options = []
          self.listLoading = false
        } else {
          self.options = res.data.rows
          if (res.data.rows.length >= 1) {
            this.id = res.data.rows[0].id
            this.fetchData()
          } else {
            self.listLoading = false
          }
        }
      }).catch(() => {
        self.listLoading = false
      })
    },
    onConfirm (value) {
      // console.log(value)
      this.fetchData()
    }
  }
}
</script>
