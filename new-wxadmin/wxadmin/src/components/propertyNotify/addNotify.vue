<template>
    <div>
        <NavBar title="新建物业通知" left-text="返回" right-text="查看物业通知"  left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
        <van-notice-bar wrapable :scrollable="false">全体业主将会收到下发的物业通知</van-notice-bar>
        <CellGroup>
            <Field label="标题" required placeholder="请输入标题(限制8字)" maxlength="8" v-model.trim="notifyForm.title" :error-message='err.title' @blur="checkTitle" />
            <template v-for="(item, i) in notifyForm.list">
                <Field
                    :label="i===0?'名称':`名称${i}`"
                    required
                    placeholder="请输入名称"
                    :key="item.key"
                    v-model.trim="item.name"
                    :error-message="item.name==''?'不能为空':''"
                >
                   <Button slot="button" type="danger" size="small" v-if="notifyForm.list.length != 1" @click.prevent="removeDetail(item)">删除</Button>
                </Field>
                <Field
                    :label="i===0?'内容':`内容${i}`"
                    required
                    :placeholder="`请输入内容(限制${maxlengthNotify}字)`"
                    type="textarea"
                    rows="5"
                    :maxlength="maxlengthNotify"
                    :key="i"
                    style="margin-bottom: .8rem"
                    v-model.trim="item.text"
                    :error-message="item.text==''?'不能为空':''"
                />
            </template>
            <Cell title=" ">
                <Button @click="addDetail" size="small">新增内容</Button>
            </Cell>
        </CellGroup>
        <div class="savebox">
            <Button type="info" @click="createNotify" loading-text="加载中..." :loading="createLoading">保存</Button>
        </div>
        <div>
            <div style="background-color: #fafafa;height: 1rem;"></div>
            <Cell title="示例：" :border="false" />
            <CellGroup>
                <Field label="标题" required disabled value="停电通知"/>
                <Field
                    label="名称"
                    required
                    disabled
                    value="深圳xxx物业服务中心"
                />
                <Field
                    label="内容"
                    required
                    type="textarea"
                    rows="5"
                    disabled
                    value="由于供电局施工需要，计划在2014年5月20日14:00—18:00进行停电施工，请各住户做好停电前的各项准备工作，防止设备电源线路出现故障。不便之处敬请谅解！"
                />
            </CellGroup>
        </div>
    </div>
</template>

<script>
import { NavBar, Field, CellGroup, NoticeBar, Button, Cell, Dialog } from 'vant'
import { aiNotify } from '@/api/url'
import { httpPost } from '@/utils/restful'
export default {
  components: {
    NavBar,
    Field,
    CellGroup,
    'van-notice-bar': NoticeBar,
    Button,
    Cell
  },
  data () {
    return {
      maxlengthNotify: 80,
      notifyForm: {
        title: '',
        departmentId: this.$store.getters.departmentId,
        list: [{
          name: '',
          text: ''
        }]
      },
      createLoading: false,
      err: {
        title: ''
      }
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/infomation/')
    },
    onClickRight () {
      this.$router.push('/lookNotify/')
    },
    createNotify () {
      let notifyForm = this.notifyForm
      if (!notifyForm.title || notifyForm.title === '') {
        return
      }
      for (const v of notifyForm.list) {
        if (v.name === '') return
        if (v.text === '') return
      }
      this.createLoading = true
      httpPost(aiNotify, this.notifyForm)
        .then(res => {
          this.createLoading = false
          Dialog.confirm({
            title: '',
            message: '操作成功',
            confirmButtonText: '查看'
          }).then(() => {
            this.$router.push('/lookNotify/')
          }).catch(() => {})
        })
        .catch(() => {
          this.createLoading = false
        })
    },
    checkTitle () {
      if (this.notifyForm.title === '') {
        this.err.title = '标题不能为空'
      } else {
        this.err.title = ''
      }
    },
    // 输入框增删
    addDetail () {
      this.notifyForm.list.push({
        name: '',
        text: '',
        key: Date.now()
      })
    },
    removeDetail (item) {
      let index = this.notifyForm.list.indexOf(item)
      if (index !== -1) {
        this.notifyForm.list.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.savebox {
    text-align: right;
    margin: .8rem;
}
</style>
