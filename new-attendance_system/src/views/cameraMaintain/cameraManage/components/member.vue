<template>
    <div>
        <h4>当前通道名称: <el-tag v-if="leaderName">{{leaderName}}</el-tag></h4>
        <div class="filter-container">
            <el-button class="filter-item" type="primary" @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
        </div>
        <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
            <el-table-column label="用户名" align="center" prop="file"></el-table-column>
            <el-table-column label="图片" align="center">
                <template slot-scope="scope">
                    <el-button type="success" size="small" @click.native.prevent="handleSeePhoto(scope.row.photo)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="同步状态" align="center" prop="isSync">
              <template slot-scope="scope">
                {{isSyncFormatter(scope.row.isSync)}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click.native.prevent="handleModify(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- <div class="pagination-container">
            <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div> -->

        <el-dialog title="图片" width="30%" :visible.sync = "dialogPhotoVisible">
            <el-image
            style="width: 200px; height: 200px"
            :src="imgUrl"
            :preview-src-list="[imgUrl]"
            fit="contain"></el-image>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="dialogFormVisible" width="40%">
          <el-form :rules="formRules" ref="form" :model="form">
            <el-form-item label="用户名" prop="name">
              <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button  type="primary" @click="handleSave" :loading="saveLoading">保存</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { modifyAICameraFace, getAICameraFace } from '@/api/url'
import { httpPut, httpGet } from '@/utils/restful'
import { toNull, isSyncFormatter } from '@/utils/formatter'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      isSyncFormatter: isSyncFormatter,
      tableData: [],
      total: null,
      dialogFormVisible: false,
      form: {
        id: undefined,
        name: undefined,
        tokenId: undefined
      },
      saveLoading: false,
      dialogPhotoVisible: false,
      imgUrl: '',
      formRules: {
        name: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      }
    }
  },
  props: {
    memberId: {
      type: Number,
      required: true
    },
    leaderName: {
      type: String
    }
  },
  name: 'member',
  watch: {
    memberId (curVal, oldVal) {
      this.fetchData()
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    handleSeePhoto (base64) {
      if (base64) {
        this.imgUrl = 'data:image/jpg;base64,' + base64
        this.dialogPhotoVisible = true
      } else {
        this.$message.error('未获取到图片')
      }
    },
    // 刷新
    handleRefresh () {
      this.fetchData()
    },
    // 获取数据
    fetchData () {
      httpGet(getAICameraFace + '/' + this.memberId).then(res => {
        this.listLoading = false
        if (res.data) {
          let arr = []
          for (let [key, value] of Object.entries(res.data)) {
            arr.push({id: key, ...value})
          }
          this.tableData = arr
        }
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
    // 搜索
    handleFilter () {
      this.listQuery.userName = toNull(this.listQuery.userName)
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleModify (row) {
      let self = this
      this.form.id = Number(row.id)
      self.dialogFormVisible = true
      self.$nextTick(() => {
        self.$refs['form'].resetFields()
      })
    },
    handleSave () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.tokenId = this.memberId
          this.saveLoading = true
          httpPut(modifyAICameraFace, this.form).then((res) => {
            this.dialogFormVisible = false
            setTimeout(() => { this.saveLoading = false }, 300)
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    }
  }
}
</script>
