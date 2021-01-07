<template>
  <div>
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
        <el-form-item v-if="list.length > 0" class="operate">
          <el-button :loading="saveLoading" @click="saveData" type="primary">保存</el-button>
          <el-button :loading="exportLoading" @click="exportData" type="primary">下载</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
import FileSaver from 'file-saver'
import { cameraAIOneParams } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
export default {
  name: 'params-ai-setting',
  props: ['aiTokenId', 'cameraType'],
  watch: {
    aiTokenId (curVal) {
      this.fetchData()
    }
  },
  mounted () {
    this.fetchData()
  },
  data () {
    return {
      saveLoading: false,
      exportLoading: false,
      array: [],
      list: []
    }
  },
  methods: {
    fetchData () {
      httpGet(cameraAIOneParams, {aiTokenId: this.aiTokenId, cameraType: this.cameraType})
        .then(res => {
          this.array = JSON.parse(res.data.parameterStyle)
          if (res.data.parameterValue !== null) {
            let values = JSON.parse(res.data.parameterValue)
            for (let i = 0; i < this.array.length; i++) {
              for (let j = 0; j < values.length; j++) {
                if (this.array[i].name === values[j].key) {
                  if (this.array[i].type === 5 || this.array[i].selectType === 2) {
                    // 现将十进制转化为二进制
                    let a = parseInt(values[j].value).toString(2).split('').reverse().join('')
                    let data = []
                    for (let k = 0; k < a.length; k++) {
                      let v = a[k] * (Math.pow(2, k))
                      data.push(v.toString(16))
                    }
                    this.array[i].value = data
                  } else {
                    if (this.array[i].type === 3) {
                      this.array[i].value = parseInt(values[j].value)
                    } else {
                      this.array[i].value = values[j].value
                    }
                  }
                  break
                }
              }
            }
            this.splitArr()
          } else {
            this.splitArr()
          }
        }).catch(() => {})
    },
    // 分离arr
    splitArr () {
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
    saveData () {
      this.$confirm('是否对相机的参数进行保存？', '提示', {})
        .then(() => {
          this.saveLoading = true
          let arr = []
          this.array.forEach(item => {
            if (item.type === 5 || item.selectType === 2) {
              let data = 0
              if (item.value.length > 0) {
                item.value.forEach(value => {
                  if (value !== 'NaN') {
                    data += Number(parseInt(value, 16))
                  }
                })
                data = data.toString()
              } else {
                data = []
              }
              arr.push({
                fileName: item.fileName,
                key: item.name,
                value: data
              })
            } else if (item.name === 'serverIP' || item.name === 'serverPort' || item.name === 'user_id' || item.name === 'user_passwd') {
              return false
            } else {
              arr.push({
                fileName: item.fileName,
                key: item.name,
                value: item.value.toString()
              })
            }
          })
          let data = {
            aiTokenId: this.aiTokenId,
            departmentId: this.$store.getters.departmentId,
            paramJson: JSON.stringify(arr)
          }
          httpPost(cameraAIOneParams, data)
            .then(res => {
              this.saveLoading = false
              this.$message.success(res.message)
            }).catch(() => {
              this.saveLoading = false
            })
        }).catch(() => {})
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
              console.log(data)
              let mm = data[i].arr[k].obj.arr
              if (mm.length > 0) {
                str += ' \r\n\r\n' + ' '.repeat(2) + (i + 1) + '.' + (k + 1) + '、类别：' + data[i].arr[k].obj.kind + ' \r\n\r\n'
                for (let j = 0; j < mm.length; j++) {
                  str = str + ' '.repeat(4) + (i + 1) + '.' + (k + 1) + '.' + (j + 1) + '、功能名称：' + mm[j].chineseName + ' '.repeat(5) + '\t 参数名称：' + mm[j].name
                  if (mm[j].type === 1 && mm[j].inputType === 2) {
                    str += ' '.repeat(5) + '\t 参数值：字符串类型'
                  }
                  if (mm[j].min !== undefined && mm[j].max !== undefined) {
                    str += ' '.repeat(5) + '\t 参数范围：(' + mm[j].min + '-' + mm[j].max + ') '
                  } else {
                    str += ' '
                  }
                  if (mm[j].type === 3) {
                    str += ' '.repeat(5) + '\t 默认值:' + mm[j].value
                  }
                  if (mm[j].selectType === 2 || mm[j].type === 5) {
                    let s = ''
                    for (let m = 0; m < mm[j].options.length; m++) {
                      if (s === '') {
                        s += mm[j].options[m].value + ':' + mm[j].options[m].label
                      } else {
                        s += ',' + mm[j].options[m].value + ':' + mm[j].options[m].label
                      }
                    }
                    str += ' '.repeat(5) + '\t 参数范围：(' + s + ') ' + '  '.repeat(5) + '\t 备注信息：' + mm[j].remarks + '\r\n\r\n'
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
<style lang='scss' scoped>
.el-select{
  width: 100%;
}
.el-form-item{
  margin-bottom: 0;
}
.operate{
  margin-top: 20px;
}
</style>
