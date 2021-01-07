<template>
    <div v-if="type==='f'||type==='c'">
      <section class="menuRight">
        <div class="title">
          <span v-if="type==='f'">{{form.menuFirstLevel}}</span>
          <span v-if="type==='c'">{{form.menuSecondLevel}}</span>
          <el-button type="text" @click="saveMenu(type, form, menuI, childI)"><span v-if="type==='f'">保存菜单</span><span v-if="type==='c'">保存子菜单</span></el-button>
        </div>
        <el-form :rules="formRules" ref="dataform" :model="form" :inline="true" label-width="100px" label-position="left">
          <el-form-item :label="menuName" prop="menuFirstLevel" v-if="type==='f'">
            <el-input v-model="form.menuFirstLevel" size="small" placeholder="请输入名称" v-if="type==='f'"></el-input>
            <div class="f-grey" v-if="type==='f'">仅支持中英文和数字，字数不超过4个汉字或8个字母</div>
          </el-form-item>
          <el-form-item :label="menuName" prop="menuSecondLevel" v-if="type==='c'">
            <el-input v-model="form.menuSecondLevel" size="small" placeholder="请输入名称" v-if="type==='c'"></el-input>
            <div class="f-grey" v-if="type==='c'">仅支持中英文和数字，字数不超过8个汉字或16个字母</div>
          </el-form-item>
          <div class="menu-content" v-if="showMenuCenter">
            <div class="radiobox">
              <label class="menu-content-title" v-if="type==='f'">菜单内容</label>
              <label class="menu-content-title" v-if="type==='c'">子菜单内容</label>
              <el-radio-group v-model="form.type">
                <el-radio label="view">跳转网页</el-radio>
                <el-radio label="miniprogram">跳转小程序</el-radio>
              </el-radio-group>
            </div>
            <div class="menu-content-main">
              <template v-if="form.type == 'view'">
                <div class="f-grey" v-if="type==='f'">订阅者点击该菜单会跳到以下链接</div>
                <div class="f-grey" v-if="type==='c'">订阅者点击该子菜单会跳到以下链接</div>
                <el-form-item label="页面地址">
                  <el-input v-model="form.link" size="small"></el-input>
                </el-form-item>
              </template>
              <template v-if="form.type == 'miniprogram'">
                <div class="f-grey" v-if="type==='f'">订阅者点击该菜单会跳到以下小程序</div>
                <div class="f-grey" v-if="type==='c'">订阅者点击该子菜单会跳到以下小程序</div>
                <div>
                  <el-form-item label="小程序">
                    <el-input v-model="form.miniprogramAppid" size="small" placeholder="请输入小程序AppID"></el-input>
                    <el-input v-model="form.miniprogramPagepath" size="small" placeholder="请输入小程序页面路径"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="备用网页">
                  <el-input v-model="form.link" size="small"></el-input>
                  <div class="f-grey">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</div>
                </el-form-item>
              </template>
            </div>
          </div>
        </el-form>
      </section>
    </div>
</template>

<script>
const checkMenuName = (rule, value, callback) => {
  let t = value.replace(/[\u4e00-\u9fa5]/g, '')
  let reg = (value.length - t.length) * 2 + t.length <= 8
  if (!reg) {
    return callback(new Error('字数超过上限'))
  } else {
    callback()
  }
}
const checkMenuChildName = (rule, value, callback) => {
  let t = value.replace(/[\u4e00-\u9fa5]/g, '')
  let reg = (value.length - t.length) * 2 + t.length <= 16
  if (!reg) {
    return callback(new Error('字数超过上限'))
  } else {
    callback()
  }
}

export default {
  data () {
    return {
      innerVisibleMp: false,
      form: {}
    }
  },
  props: {
    type: {
      type: String
    },
    menudata: {
      type: Object
    },
    menuI: {
      type: Number
    },
    childI: {
      type: Number
    }
  },
  watch: {
    menudata () {
      this.form = {...this.menudata}
    }
  },
  computed: {
    menuName () {
      if (this.type === 'f') {
        return '菜单名称'
      }
      if (this.type === 'c') {
        return '子菜单名称'
      }
    },
    showMenuCenter () {
      let form = this.form
      if (this.type === 'f') {
        if (form.child.length !== 0) {
          return false
        }
      }
      return true
    },
    formRules () {
      let obj
      if (this.type === 'f') {
        obj = {
          menuFirstLevel: [
            {required: true, trigger: 'blur', message: '不能为空'},
            {validator: checkMenuName, trigger: 'blur'}
          ]
        }
      }
      if (this.type === 'c') {
        obj = {
          menuSecondLevel: [
            {required: true, trigger: 'blur', message: '不能为空'},
            {validator: checkMenuChildName, trigger: 'blur'}
          ]
        }
      }
      return obj
    }
  },
  methods: {
    saveMenu (type, form, menuI, childI) {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          form = {...form}
          this.$emit('saveMenu', { type, form, menuI, childI })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.menuRight {
  background-color: #f4f5f9;
  padding: 0 15px;
  .f-grey {
    color: #ccc
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E7E7EB;
    box-sizing: border-box;
    margin-bottom: 15px;
  }
  .menu-content {
    padding-bottom: 15px;
    .radiobox {
      margin-bottom: 10px;
    }
    .menu-content-title {
      display: inline-block;
      width: 100px;
    }
    .menu-content-main {
      border: 1px solid #E7E7EB;
      background-color: #fff;
      padding: 15px;
    }
  }
}
</style>
