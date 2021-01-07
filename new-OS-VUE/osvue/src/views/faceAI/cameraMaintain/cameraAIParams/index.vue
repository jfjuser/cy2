<template>
  <div class="app-container">
    <div >
      <el-row :span="20">
        <el-col :span="10" class="table-main">
          <el-button size="mini"  @click="handleCreate">新增</el-button>
          <el-form label-width="150px" autoCompete = "on" label-position="right">
            <el-form-item label="相机类型" required>
              <el-select v-model="cameraType" @change="changeCameraType">
                <el-option v-for="item in aiCameraType"  :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-for="(item, index) in array" :key="index" :label="item.chineseName" required>
              <!-- 输入框 -->
              <el-row :span="20">
                <el-col :span="20">
                  <div v-if="item.type === 1">
                    <!-- 数字类型 -->
                    <el-input v-if="item.inputType === 1" v-model="item.value" :min="item.min" :max="item.max" :placeholder="item.remarks"></el-input>
                    <!-- 字符串类型 -->
                    <el-input v-if="item.inputType === 2" v-model="item.value" :placeholder="item.remarks"></el-input>
                  </div>
                  <!-- 选择框 -->
                  <div v-else-if="item.type === 2">
                    <el-select  v-model="item.value" :multiple="item.selectType === 2" :placeholder="item.remarks">
                      <el-option v-for="(option, index) in item.options" :key="index" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                  </div>
                  <!-- slider滑块 -->
                  <div v-else-if="item.type === 3">
                    <el-slider v-model="item.value" :min="item.min" :max="item.max"></el-slider>
                  </div>
                  <!-- 单选框 -->
                  <div v-else-if="item.type === 4">
                    <el-radio-group v-model="item.value">
                      <el-radio v-for="(option, index) in item.options" :key="index" :label="option.value">{{option.label}}</el-radio>
                    </el-radio-group>
                  </div>
                  <!-- 多选框 -->
                  <div v-if="item.type === 5">
                    <el-checkbox-group v-model="item.value">
                      <el-checkbox v-for="(option, index) in item.options" :key="index" :label="option.value">{{option.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-col>
                <el-col :span="4" style="text-align: center;">
                  <el-button type="warning" circle size="mini" @click="handEdit(item, index)" icon="el-icon-edit"></el-button>
                  <el-button type="danger" circle size="mini" @click="deleteItem(index)" icon="el-icon-close"></el-button>
                </el-col>
              </el-row>
              <span style="color:red; font-size: 14px;">{{item.classify}}</span>
            </el-form-item>
            <el-form-item v-if="array.length > 0">
              <el-button :loading="saveLoading" @click="saveData" type="primary">保存</el-button>
              <el-button @click="seeData" type="primary">查看用户界面</el-button>
              <el-button @click="exportData" type="warning">下载</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10" class="table-main" style="margin-left: 20px;" v-if="list.length > 0">
          <el-form label-width="150px" style="width: 100%" autoCompete = "on" label-position="right">
            <el-tabs type="border-card">
              <el-tab-pane v-for="(item, index) in list" :key="index" :label="item[0].classify">
                <!-- {{item[0].classify}} -->
                <el-form-item v-for="(obj, index) in item" :key="index" :label="obj.chineseName" required>
                  <!-- 输入框 -->
                  <div v-if="obj.type === 1">
                    <!-- 数字类型 -->
                    <el-input v-if="obj.inputType === 1" v-model="obj.value" :min="obj.min" :max="obj.max" :placeholder="obj.remarks"></el-input>
                    <!-- 字符串类型 -->
                    <el-input v-if="obj.inputType === 2" v-model="obj.value" :placeholder="obj.remarks"></el-input>
                  </div>
                  <!-- 选择框 -->
                  <div v-else-if="obj.type === 2">
                    <el-select  v-model="obj.value" :multiple="obj.selectType === 2" :placeholder="obj.remarks">
                      <el-option v-for="(option, index) in obj.options" :key="index" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                  </div>
                  <!-- slider滑块 -->
                  <div v-else-if="obj.type === 3">
                    <el-slider v-model="obj.value" :min="obj.min" :max="obj.max"></el-slider>
                  </div>
                  <!-- 单选框 -->
                  <div v-else-if="obj.type === 4">
                    <el-radio-group v-model="obj.value">
                      <el-radio v-for="(option, index) in obj.options" :key="index" :label="option.value">{{option.label}}</el-radio>
                    </el-radio-group>
                  </div>
                  <!-- 多选框 -->
                  <div v-if="obj.type === 5">
                    <el-checkbox-group v-model="obj.value">
                      <el-checkbox v-for="(option, index) in obj.options" :key="index" :label="option.value">{{option.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <span style="color:red; font-size: 14px;">{{obj.remarks}}</span>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>
      </el-row>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="LogoVisible" width="40%">
        <el-form  autoCompete = "on" label-position="right" label-width="150px">
          <el-form-item label="文件名称" required>
            <el-input v-model="form.fileName"></el-input>
          </el-form-item>
          <el-form-item label="所属分类" required>
            <!-- <el-input v-model="form.classify"></el-input> -->
            <el-autocomplete
              v-model="form.classify"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
            >
            <template slot-scope="{ item }">
              <div style="width: 100%;" >{{ item.value }}</div>
            </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="中文名" required>
            <el-input v-model="form.chineseName"></el-input>
          </el-form-item>
          <el-form-item label="字段名" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="类型" required>
            <el-radio-group v-model="form.type" @change="typeChange">
              <el-radio :label="1">输入框</el-radio>
              <el-radio :label="2">选择框</el-radio>
              <el-radio :label="3">slider滑块</el-radio>
              <el-radio :label="4">单选框</el-radio>
              <el-radio :label="5">多选框</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 输入框 -->
          <div v-if="form.type === 1">
            <el-form-item label="输入框类型">
              <el-radio-group v-model="form.inputType">
                <el-radio :label="1">数字</el-radio>
                <el-radio :label="2">字符串</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="form.inputType === 1">
              <el-form-item label="最小值">
                <el-input-number v-model="form.min"></el-input-number>
              </el-form-item>
              <el-form-item label="最大值">
                <el-input-number v-model="form.max"></el-input-number>
              </el-form-item>
            </div>
          </div>
          <el-form-item  label="字段值" v-if="!(form.selectType === 2 || form.type === 5)">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
          <!-- 选择框 -->
          <div v-if="form.type === 2">
            <el-form-item label="选择框类型">
              <el-radio-group v-model="form.selectType">
                <el-radio :label="1">单选</el-radio>
                <el-radio :label="2">多选</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="选择属性">
              <el-row :span="20" v-for="(item, index) in form.options" :key="index" style="text-align: center;margin-bottom: 10px;">
                <el-col :span="2">
                  <span>名称</span>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="item.label"></el-input>
                </el-col>
                <el-col :span="2">
                  <span>值</span>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="item.value"></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" v-if="index === form.options.length-1" @click="addOption" circle size="mini"
                  icon="el-icon-plus"></el-button>
                </el-col>
                <el-col :span="2" v-if="form.options.length > 1">
                  <el-button type="danger" circle size="mini" @click="deleteOption(index)" icon="el-icon-delete"></el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <!-- slider滑块 -->
          <div v-if="form.type === 3">
            <el-form-item label="最小值">
              <el-input-number v-model="form.min"></el-input-number>
            </el-form-item>
            <el-form-item label="最大值">
              <el-input-number v-model="form.max"></el-input-number>
            </el-form-item>
          </div>
          <!-- 单选框 -->
          <div v-if="form.type === 4 || form.type === 5">
            <el-form-item label="选项">
              <el-row :span="20" v-for="(item, index) in form.options" :key="index" style="text-align: center;margin-bottom: 10px;">
                <el-col :span="2">
                  <span>名称</span>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="item.label"></el-input>
                </el-col>
                <el-col :span="2">
                  <span>值</span>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="item.value"></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" v-if="index === form.options.length-1" @click="addOption" circle size="mini"
                  icon="el-icon-plus"></el-button>
                </el-col>
                <el-col :span="2" v-if="form.options.length > 1">
                  <el-button type="danger" circle size="mini" @click="deleteOption(index)" icon="el-icon-delete"></el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <el-form-item label="备注信息">
            <el-input v-model="form.remarks"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="LogoVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='create'" @click="createData" type="primary">保存</el-button>
          <el-button v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import FileSaver from 'file-saver'
import { cameraAIParams } from '@/api/url'
import { aiCameraType } from '@/utils/selectAble'
import { httpPost, httpGet } from '@/utils/restful'
export default {
  data () {
    return {
      LogoVisible: false,
      saveLoading: false,
      aiCameraType: aiCameraType,
      cameraType: undefined,
      form: {
        fileName: 'AppConfig.ini',
        chineseName: undefined, // 中文名
        name: undefined, // 字段名
        value: undefined, // 字段值
        type: undefined, // 类型 1.输入框 2.选择框 3.slider滑块 4. 单选框 5.多选框
        // 输入框
        inputType: undefined, // 输入框类型 1.数字 2.字符串
        min: undefined, // 最小值
        max: undefined, // 最大值
        remarks: undefined, // 备注信息
        // 选择
        selectType: undefined, // 选择框类型 1 单选 2 多选
        options: [ // 选择框、单选框或者多选框的option
          {
            value: undefined,
            label: undefined
          }
        ]
      },
      array: [],
      arrayIndex: undefined,
      list: [],
      classifyArr: [],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      }
    }
  },
  methods: {
    changeCameraType () {
      if (this.cameraType === undefined) {
        this.$message.warning('请先选择相机')
      } else {
        httpGet(cameraAIParams, { cameraType: this.cameraType })
          .then(res => {
            let data = JSON.parse(res.data)
            if (data !== null) {
              this.array = data
            } else {
              this.array = []
            }
          }).catch(() => {})
      }
    },
    typeChange () {
      if (this.form.type === 5) {
        this.form.value = []
      } else {
        this.form.value = undefined
      }
    },
    resetForm () {
      this.form = {
        fileName: 'AppConfig.ini',
        chineseName: undefined,
        name: undefined,
        value: undefined,
        type: undefined,
        inputType: undefined,
        min: undefined,
        max: undefined,
        remarks: undefined,
        selectType: undefined,
        options: [
          {
            value: undefined,
            label: undefined
          }
        ]
      }
    },
    createData () {
      if (this.form.type === 3) this.form.value = Number(this.form.value)
      if ((this.form.type === 5 || this.form.selectType === 2) && this.form.value === undefined) this.form.value = []
      this.array.push(this.form)
      this.resetForm()
      this.LogoVisible = false
    },
    addOption () {
      this.form.options.push({value: undefined, label: undefined})
    },
    deleteItem (index) {
      this.$confirm('是否删除此项?', '提示', {})
        .then(res => {
          this.array.splice(index, 1)
        }).catch(() => {})
    },
    deleteOption (index) {
      this.$confirm('是否删除此项', '提示', {})
        .then(res => {
          this.form.options.splice(index, 1)
        }).catch(() => {})
    },
    saveData () {
      this.$confirm('请确保每一个参数都已经设置值，然后在保存....', '提示', {})
        .then(res => {
          this.saveLoading = true
          httpPost(cameraAIParams, {
            cameraType: this.cameraType,
            param: JSON.stringify(this.array)
          }).then(res => {
            this.saveLoading = false
            this.$message.success(res.message)
          }).catch(() => {
            this.saveLoading = false
          })
        }).catch(() => {})
    },
    seeData () {
      let names = []
      this.array.forEach(item => {
        names.push(item.classify)
      })
      let name = Array.from(new Set(names))
      let data = []
      for (let i = 0; i < name.length; i++) {
        let arr = []
        for (let j = 0; j < this.array.length; j++) {
          if (name[i] === this.array[j].classify) {
            arr.push(this.array[j])
          }
        }
        data.push(arr)
      }
      this.list = data
    },
    // 新增
    handleCreate () {
      if (this.cameraType === undefined) {
        this.$message.warning('请先选择相机')
      } else {
        this.dialogStatus = 'create'
        this.resetForm()
        let arr = []
        this.array.forEach(item => {
          arr.push(item.classify)
        })
        arr = Array.from(new Set(arr))
        this.classifyArr = []
        arr.forEach(item => {
          this.classifyArr.push({
            value: item
          })
        })
        this.LogoVisible = true
      }
    },
    querySearch (queryString, cb) {
      let results = queryString ? this.classifyArr.filter(this.createFilter(queryString)) : this.classifyArr
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (classify) => {
        return (classify.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handEdit (item, index) {
      this.dialogStatus = 'update'
      this.arrayIndex = index
      this.form = Object.assign({}, item)
      this.LogoVisible = true
    },
    updateData () {
      this.array[this.arrayIndex] = this.form
      this.LogoVisible = false
    },
    exportData () {
      this.$confirm('是否对相机参数进行导出?', '提示', {})
        .then(res => {
          let fileNames = []
          let kinds = []
          for (let i = 0; i < this.array.length; i++) {
            fileNames.push(this.array[i].fileName)
            kinds.push(this.array[i].classify)
          }
          let fileName = Array.from(new Set(fileNames))
          let kind = Array.from(new Set(kinds))
          // 1. 先遍历文件名称
          let data = []
          for (let i = 0; i < fileName.length; i++) {
            // 遍历
            let s = []
            // 遍历类别名称
            for (let k = 0; k < kind.length; k++) {
              let obj = {}
              let arr = []
              for (let j = 0; j < this.array.length; j++) {
                if (fileName[i] === this.array[j].fileName && kind[k] === this.array[j].classify) {
                  arr.push(this.array[j])
                }
              }
              if (arr.length > 0) {
                Object.assign(obj, {
                  kind: kind[k],
                  arr: arr
                })
                s.push({
                  obj: obj
                })
              }
            }
            data.push({
              fileName: fileName[i],
              arr: s
            })
          }
          let str = '请注意：不同相机支持的参数不同' + ' \r\n\r\n'
          for (let i = 0; i < data.length; i++) {
            str = str + (i + 1) + '、文件名：' + data[i].fileName + ' \r\n\r\n'
            for (let k = 0; k < data[i].arr.length; k++) {
              let mm = data[i].arr[k].obj.arr
              if (mm.length > 0) {
                str += ' \r\n\r\n' + ' '.repeat(2) + (i + 1) + '.' + (k + 1) + '、类别：' + data[i].arr[k].obj.kind + ' \r\n\r\n'
                for (let j = 0; j < mm.length; j++) {
                  str = str + ' '.repeat(4) + (i + 1) + '.' + (k + 1) + '.' + (j + 1) + '、功能名称：' + mm[j].chineseName + ' '.repeat(5) + '\t 参数名称：' + mm[j].name
                  if (mm[j].type === 1 && mm[j].inputType === 2) {
                    str += ' '.repeat(5) + '\t 参数值：字符串类型'
                  }
                  if (mm[j].min !== undefined && mm[j].max !== undefined) {
                    str += ' '.repeat(5) + '\t 参数值：(' + mm[j].min + '-' + mm[j].max + ') '
                  } else {
                    str += ' '
                  }
                  if (mm[j].selectType === 2 || mm[j].type === 5) {
                    let s = ''
                    for (let m = 0; m < mm[j].options.length; m++) {
                      if (s === '') {
                        s += mm[j].options[m].value
                      } else {
                        s += ',' + mm[j].options[m].value
                      }
                    }
                    str += ' '.repeat(5) + '\t 参数值：(' + s + ') ' + '  '.repeat(5) + '\t 备注信息：' + mm[j].remarks + '\r\n\r\n'
                  } else {
                    str += '  '.repeat(5) + '\t 备注信息：' + mm[j].remarks + '\r\n\r\n'
                  }
                }
              }
            }
          }
          let blob = new Blob([str], {
            type: ''
          })
          FileSaver(blob, '参数.txt')
          this.exportLoading = false
        }).catch(() => {
          this.exportLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select{
  width: 100%;
}
</style>
