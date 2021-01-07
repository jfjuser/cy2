<template>
  <div class="hit">
    <NavBar title="审核设置" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="warpDiv">
      <Field required clearable label="家人" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.userCheck">
          <Radio :name="0" class="select">人工审核</Radio>
          <Radio :name="1" class="select">自动审核</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="访客" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.visitorCheck">
          <Radio :name="0" class="select">人工审核</Radio>
          <Radio :name="1" class="select">自动审核</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="微信推送" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.openPush">
          <Radio :name="0" class="select">关闭</Radio>
          <Radio :name="1" class="select">开启</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="韦根号" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.openWigan">
          <Radio :name="0" class="select">关闭</Radio>
          <Radio :name="1" class="select">开启</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="地址类型" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.addrType">
          <Radio :name="1" class="select">单元房号</Radio>
          <Radio :name="0" class="select">其他</Radio>
        </RadioGroup>
      </div>
      <Field required clearable label="进出时段" :border="false" class="fi" disabled/>
      <div>
        <RadioGroup v-model="form.timeLimit" @change="watchVal">
          <Radio :name="0" class="select">开启</Radio>
          <Radio :name="1" class="select">不开启</Radio>
        </RadioGroup>
      </div>
      <div style="width:100vw;text-align:right">
        <Button type="info" :loading="loading" @click="onSubmit" style="width:25vw;margin:1.5rem 0rem 1rem 0">保存</Button>
      </div>
    </div>
    <NoticeBar v-show="form.timeLimit === 1" text="当进出时段关闭的时候，请清除时段限制" left-icon="volume-o"/>
    <Panel title="相机列表" v-show="form.timeLimit === 1">
      <div style="width:100vw;text-align:center;">
        <RadioGroup v-model="radio">
          <CellGroup>
            <Cell :title="item.localName" v-for="(item, index) in localList" :key=index clickable @click="clickRadio(item)">
              <Radio :name="item.id"/>
            </Cell>
          </CellGroup>
        </RadioGroup>
      <!-- <Button type="info" style="width:70vw;border-radius:10px;margin:2rem 0">删除</Button> -->
      </div>
      <div slot="footer">
        <Button size="small" type="danger" :loading="clearLoading" style="margin-left:70vw" @click="onDelete">删除</Button>
      </div>
    </Panel>
    <!-- <NoticeBar v-show="form.timeLimit === 0" text="进出时段一览表" left-icon="volume-o"/> -->
    <Tag v-show="form.timeLimit === 0" color="#f2826a">进出时段一览表</Tag>
    <div v-show="form.timeLimit === 0">
      <PullRefresh v-model="isHas">
        <div style="100vw">
          <div style="text-align:right;"><Button style="width:20vw" @click="jumpNext" type="info" plain>添加</Button></div>
          <div v-for="(item, index) in timeData" :key=index>
            <CellGroup class="groupdiv">
              <Cell title="名称" :value="item.name"/>
              <Cell title="开始时间" :value="item.beginTime" />
              <Cell title="结束时间" :value="item.endTime"/>
              <Cell title="星期一" :value="closeFormatter(item.monday)" />
              <Cell title="星期二" :value="closeFormatter(item.tuesday)" />
              <Cell title="星期三" :value="closeFormatter(item.wednesday)" />
              <Cell title="星期四" :value="closeFormatter(item.thursday)" />
              <Cell title="星期五" :value="closeFormatter(item.friday)" />
              <Cell title="星期六" :value="closeFormatter(item.saturday)" />
              <Cell title="星期天" :value="closeFormatter(item.sunday)" />
              <span style="display:block;line-height:2.5rem;color:#1E90FF;margin-left:86%;" @click="edit(item)">操作</span>
            </CellGroup>
          </div>
        </div>
         <div style="height:24rem;text-align:center" v-show="imgShow">
            <img src="@/assets/noData (2).png" class="imgStyle"/>
          </div>
        <div v-show="!imgShow" style="margin:0.5rem 0 1rem 0">
          <Pagination
            v-model="listQuery.offset"
            :page-count="Math.ceil(total/10)"
            :total-items = 'total'
            mode="simple"
            @change="seePage"
          >
          </Pagination>
      </div>
      </PullRefresh>
       <Popup v-model="isPop" position="bottom">
          <Button size="large" @click="adaptSet">编辑</Button>
          <Button size="large" @click="handleDown">下载</Button>
          <Button size="large" @click="isPop = false">取消</Button>
        </Popup>
    </div>
  </div>
</template>
<script>
import { Field, Icon, Tag, RadioGroup, Radio, NavBar, CellGroup, Cell, NoticeBar, Button, Panel, PullRefresh, Toast, Pagination, Popup, Dialog } from 'vant'
import { httpGet, httpPut, httpDelete, httpPost } from '@/utils/restful'
import { AISetting, checkAICamera, deleteAIInOutTime, AIInOutTime } from '@/api/url'
import { closeFormatter } from '@/utils/formatter'
export default {
  name: 'setting',
  data () {
    return {
      closeFormatter: closeFormatter,
      isPop: false,
      form: {
        id: undefined,
        userCheck: undefined,
        visitorCheck: undefined,
        openWigan: undefined,
        timeLimit: undefined,
        addrType: undefined,
        openPush: 1
      },
      listQuery: {
        offset: 1,
        limit: 5
      },
      clearLoading: false,
      radio: undefined,
      isHas: false,
      imgShow: false,
      loading: false,
      total: undefined,
      timeData: [],
      localList: [],
      row: undefined
    }
  },
  components: { Field, Icon, Tag, RadioGroup, Radio, NavBar, CellGroup, Cell, NoticeBar, Button, Panel, PullRefresh, Toast, Pagination, Popup },
  created () {
    this.getSetting()
    this.getCameraList()
  },
  methods: {
    clickRadio (item) {
      console.log(item)
      this.radio = item.id
    },
    watchVal (val) {
      if (val === 0) {
        this.show()
      }
    },
    edit (item) {
      this.row = item
      this.isPop = true
    },
    adaptSet () {
      console.log(this.row)
      this.$router.push({
        name: 'addTimeList',
        params: {
          row: this.row
        }
      })
      this.isPop = false
    },
    jumpNext () {
      this.$router.push('/addTimeList/')
    },
    handleDown () {
      Dialog.confirm({
        title: '提示',
        message: '是否下载到所有相机？'
      })
        .then(() => {
          httpPost(AIInOutTime + '/sync/' + this.row.id)
            .then(res => {
              Toast({
                message: res.message,
                duration: 4000})
            }).catch((err) => {
              Toast({
                message: err,
                duration: 4000})
            })
          this.isPop = false
        }).catch(() => {})
    },
    seePage (val) {
      this.listQuery.offset = val
      this.show()
    },
    show () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(AIInOutTime + '/page', this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.timeData = []
          this.imgShow = true
          this.total = 0
        } else {
          this.timeData = res.data.rows
          this.imgShow = false
          this.total = res.data.total
        }
      }).catch(() => {
      })
    },
    onSubmit () {
      this.loading = true
      httpPut(AISetting, this.form).then(res => {
        Toast({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    onDelete () {
      if (this.radio === undefined) {
        Toast.error('请选择相机在进行提交！')
      } else {
        this.clearLoading = true
        httpDelete(deleteAIInOutTime + '/' + this.radio).then(res => {
          Toast.success(res.message)
          this.clearLoading = false
        }).catch(() => {
          this.clearLoading = false
        })
      }
    },
    onClickLeft () {
      this.$router.push('/staffManage/')
    },
    getSetting () {
      httpGet(AISetting + '/' + this.$store.getters.departmentId).then(res => {
        this.form = Object.assign({}, res.data)
        // if (this.form.openWigan === undefined) {
        //   this.form.openWigan = 1
        // }
      }).catch(() => {})
    },
    getCameraList () {
      httpGet(checkAICamera + this.$store.getters.departmentId).then(res => {
        this.localList = res.data
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.warpDiv{
  border-radius: 7px;
}
.groupdiv{
    border:1px solid #ccc;
    margin-top: 1.5rem
}
.select{
  margin-left:3.5rem;
  line-height:2.2rem;
  display:inline-block;
  font-size:0.75rem;
  // border: 1px solid #7bb4ec;
  // padding: 5px 10px;
  // border-radius: 4px;
}
.imgStyle{
  max-width: 375px;
  max-height: 300px;
}
.fi {
  line-height: 1rem;
  font-size: 0.85rem;
  width: 100vw;
  border: none;
}
</style>
