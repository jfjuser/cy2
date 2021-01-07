<template>
   <div style="background-color:#F5F5F5;min-height:100vh">
     <NavBar
      title="通知信息"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      style="margin-bottom:1rem"
    />
    <div v-for="(item, index) in rowsArr" :key=index style="text-align:left;margin-top:1rem">
      <div style="text-align:center;">
        <span style="color:#585858;padding-top:1rem;font-size:14px">{{timeFormatter(item.createAt)}}</span>
      </div>
    <CellGroup style="width:94vw;margin-left:3vw;">
      <Cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template slot="title">
          <span class="custom-title">你的补卡申请核销<span style="color:#339911">{{formatterCheck(item.isCheck)}}</span>。更多详情点击查看</span>
        </template>
      </Cell>
      <Cell title="查看详情" @click.native="showCat(item)">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <Icon
          slot="right-icon"
          name="arrow"
          style="line-height: inherit;"
        />
      </Cell>
    </CellGroup>
     </div>
     <Popup v-model="isShow" position="top">
       <CellGroup>
          <Cell title="核销结果" :value="formatterCheck(details.isCheck)"/>
          <Cell v-if="details.isCheck === 0" title="失败原因" :value="details.failReason"/>
          <Cell title="核销日期" :value="timeFormatter(details.applyTime)" />
        </CellGroup>
     </Popup>
     <div v-show="rowsArr.length === 0" class="card" style="letter-spacing:3px;line-height:7rem;text-align:center;">暂无信息</div>
   </div>
</template>

<script>
import { Cell, Icon, NavBar, CellGroup, Popup } from 'vant'
import { attendApply } from '@/api/url'
import { httpGet } from '@/utils/restful'
import { timeFormatter } from '@/utils/formatter.js'
import {mapGetters} from 'vuex' // 引入vuex辅助函数
export default {
  data () {
    return {
      rowsArr: [],
      details: {
        reason: '',
        applyTime: undefined,
        isCheck: undefined,
        failReason: ''
      },
      srcUrl: '',
      isShow: false,
      timeFormatter: timeFormatter,
      formatterCheck: function (type) {
        if (type === 0) return '失败'
        if (type === 1) return '成功'
      }
    }
  },
  created () {
    // let userId = Number(localStorage.getItem('userid'))
    httpGet(attendApply + '/' + this.userId).then((res) => {
      if (res.data.rows.length === 0) {
        this.rowsArr = []
      } else {
        this.rowsArr = res.data.rows // reverse()
      }
    }).catch(() => {})
  },
  computed: {
    ...mapGetters('user', [
      'userId'
    ])
  },
  methods: {
    showCat (item) {
      console.log(item)
      this.details = item
      this.isShow = true
    },
    onClickLeft () {
      this.$router.replace('/mySet/')
    }
  },
  components: {
    Cell,
    Icon,
    NavBar,
    CellGroup,
    Popup
  }
}
</script>

<style lang="scss">
.card{
  width:92vw;
  border-radius:8px;
  box-shadow:0 0 12px #ccc;
  margin-left:4vw;
  // position:absolute;
  // top:4rem;
  margin-top:5rem;
  height:7rem;
  background:#fff
}
</style>
