<template>
  <div class="main">
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane label="文件上传">
        <el-upload
          ref="upload"
          :action = "uploadUrl"
          :headers = "headers"
          :limit="1"
          :on-remove = "handleRemove"
          :on-success = "uploadSuccss"
          :on-error = "uploadError"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="文件编辑">
        <mavon-editor ref="md"  @imgAdd="imgAdd" :style="{height: height + 'px'}" v-model="value" :toolbars = "toolbars" @save="saveHtml"/>
      </el-tab-pane>
      <el-tab-pane label="白名单文件">
        <el-form>
          <el-form-item label="白名单类型">
            <el-select v-model="data.type">
              <el-option v-for="item of list" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-upload
              ref="upload"
              :limit="1"
              :data = "data"
              :action = "uploadWhite"
              :headers = "headers"
              :on-remove = "handleRemove"
              :on-success = "uploadSuccss"
              :on-error = "uploadError"
              :auto-upload="false">
              <el-button slot="trigger"  type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { uploadDescriptions, uploadWhite, getWord, saveWord } from '@/api/url.js'
import { httpGet, httpPost } from '@/utils/restful.js'
import { getToken } from '@/utils/cookie.js'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  computed: {
    headers () {
      return {
        'AdminToken': getToken(),
        'departmentId': this.$store.getters.departmentId
      }
    }
  },
  components: {
    mavonEditor
  },
  data () {
    return {
      value: '',
      height: 0,
      uploadUrl: uploadDescriptions,
      uploadWhite: uploadWhite,
      toolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        fullscreen: true,
        readmodel: true,
        htmlcode: true,
        help: false,
        undo: true,
        redo: true,
        trash: true,
        save: true,
        navigation: true,
        aligncenter: false,
        alignright: false,
        alignleft: false,
        subfield: true,
        preview: true
      },
      list: [
        {value: 5, name: '普通白名单导入模板'},
        {value: 6, name: '高级白名单导入模板'},
        {value: 7, name: '盒子固定车导入模板'},
        {value: 8, name: '盒子免费车导入模板'}
      ],
      data: {
        type: 5
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 获取屏幕的高度
    init () {
      this.height = document.body.offsetHeight - 100
    },
    // tab切换
    tabClick (tab) {
      if (tab.label === '文件编辑') this.getMarkWord()
    },
    // -------------- 文件上传 -------------\\
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      this.$message.success(`删除${file.name}成功`)
    },
    uploadSuccss () {
      this.$message.success('上传成功')
    },
    uploadError (err) {
      this.$message.error(JSON.parse(err.message))
    },
    // -------------- markdown编辑 ---------------- \\
    getMarkWord () {
      httpGet(getWord).then(res => {
        this.value = res.data.content
      }).catch(() => {})
    },
    saveHtml (value) {
      let data = {
        content: value
      }
      httpPost(saveWord, data)
        .then(res => {
          this.$notify.success({
            title: '提示',
            message: res.message,
            duration: 2000
          })
        }).catch(() => {})
    },
    // 这个因为没有静态资源服务器 所以保存md5图片
    imgAdd (fileName, file) {
      this.$refs.md.$img2Url(fileName, file.miniurl)
    }
  }
}
</script>
<style lang='scss' scoped>
.main{
  margin: 0 auto;
  padding: 1.25rem;
}
</style>
