<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="obtainCameraFile">获取相机文件</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger"  v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="120" v-if="isShowColumnFormatter(['下载'])">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDownLoad(scope.row)" size="mini">下载文件</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 获取相机文件 -->
      <el-dialog  title="获取相机文件" :visible.sync="dialogFileVisible" width="45%">
        <el-form :rules="fileRules" ref="fileData" :model="file" autoComplete="on" label-position="right" label-width="150px">
          <el-form-item label="相机MAC" prop="tokenId">
            <el-select v-model = "file.tokenId" style="width:60%">
              <el-option v-for="item in localList" :key="item.id"  :value = "item.id" :label="item.localName">
                <span style="float: left">{{item.localName}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{item.mac}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件路径" prop="storePath">
            <el-input clearable v-model="file.storePath" style="width:60%"></el-input><el-button type="primary" style="margin-left:2rem" @click="savePath">寄存路径</el-button>
          </el-form-item>
          <div style="margin-left:4.5rem">
            <el-radio-group v-model="btnId">
              <div style="display:inline-block;width:100%" v-for="item in pathArr" :key=item.id>
                <el-radio style="margin-left:1.5rem;line-height:3rem" @click.native="clickBtn(item)" :label="item.content"></el-radio>
                  <el-button @click.native="delBtn(item)" style="margin-left:1.5rem;background-color:#E6E6FA" icon="el-icon-delete" >
                  </el-button>
              </div>
            </el-radio-group>
          </div>
          <el-form-item style="margin-top:1rem" label="文件名称" prop="fileName">
            <el-input v-model="file.fileName" style="width:60%"></el-input>
          </el-form-item>
          <el-form-item style="margin-top:3rem">
            <el-button :loading="loading" style="width:100px" type="primary" @click="onSubmit">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { timeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { httpGet, httpExport, httpDelete, httpPost } from '@/utils/restful'
import { getCamera, showCameraOrder, getCameraFiles, getCameraFile, CameraFile } from '@/api/url'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      deleteLoading: false,
      disabled: true,
      listQuery: {
        offset: 1,
        limit: 10
      },
      btnId: undefined,
      tableData: [],
      timeFormatter: timeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      total: null,
      dialogFileVisible: false,
      localList: [],
      pathArr: [],
      loading: false,
      file: {
        tokenId: undefined,
        storePath: undefined,
        fileName: undefined
      },
      fileRules: {
        tokenId: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        storePath: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        fileName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      jsonData: [
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '文件名称',
          key: 'fileName',
          type: 'text'
        },
        {
          title: '创建时间',
          key: 'createAt',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remarks',
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
  created () {
    this.getCameraList()
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.createAt = this.timeFormatter(item.createAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.id)
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 点击赋值
    clickBtn (it) {
      this.file.storePath = it.content
    },
    // 获取路径
    getPath () {
      httpGet(showCameraOrder + '/' + 2).then((res) => {
        this.pathArr = res.data
      }).catch(() => {
      })
    },
    // 删除寄存
    delBtn (par) {
      httpDelete(showCameraOrder + '/' + par.id).then((res) => {
        this.getPath()
      }).catch(() => {})
    },
    // 寄存路径
    savePath () {
      let pathObj = {
        type: 2,
        content: this.file.storePath
      }
      httpPost(showCameraOrder, pathObj).then((res) => {
        this.getPath()
      }).catch(() => {})
    },
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(CameraFile, {ids: this.selectArrayId}).then(res => {
            this.deleteLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.deleteLoading = false
          })
        }).catch(() => {})
    },
    getCameraList () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.localList = res.data
        }
      }).catch(() => {})
    },
    fetchData () {
      httpGet(getCameraFiles + this.$store.getters.departmentId, this.listQuery).then(res => {
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
    // 重置相机文件
    resetFileForm () {
      this.file = {
        tokenId: undefined,
        storePath: undefined,
        fileName: undefined
      }
    },
    // 获取相机文件
    obtainCameraFile () {
      // this.resetFileForm()
      this.dialogFileVisible = true
      this.$nextTick(() => {
        this.$refs.fileData.resetFields()
      })
      this.getPath()
    },
    // 提交相机文件
    onSubmit () {
      this.$refs.fileData.validate((valid) => {
        if (valid) {
          this.loading = true
          this.file = Object.assign(this.file)
          httpPost(getCameraFile, this.file).then((res) => {
            this.fetchData()
            this.dialogFileVisible = false
            setTimeout(() => { this.loading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // -------------------下载相机文件-----------------\\
    handleDownLoad (row) {
      this.$confirm('是否下载相机文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpExport(CameraFile + '/' + row.id).then(() => {}).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>
