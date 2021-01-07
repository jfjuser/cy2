<template>
  <div>
    <div class="messageDiv">
          <div style="opacity:0.8;" class="div1">
            <h3 style="line-height:2rem;font-size:1.1rem; margin:0.5rem">
              <span>全部消息</span>
              <router-link style="font-size:1rem;font-weight: normal;" to="/addNotify/">新建物业通知</router-link>
            </h3>
            <PullRefresh v-model="isPullLoading" @refresh="onRefresh" style="min-height:80vh;margin-bottom:3.2rem">
              <div style="line-height:2.5rem;width:96vw;margin-left:2vw;height:4.5rem;margin-top:0.5rem;" v-for="item in infoRecieve" :key=item.id>
                <SwipeCell :right-width="45" style="border-radius:0.5rem;margin-top:1rem">
                  <CellGroup>
                    <Cell style="display:inline-block;line-height:1rem;height:4rem;" @click="shotContent(item)"
                      :title="typeToChinese(item.type) || type1ToChinese(item.suggestionSelect)" :value="timeFormatter1(item.createAt)" size="large" :label="item.suggestionContact"/>
                  </CellGroup>
                  <span slot="right"
                    style="background-color:#CE0000;display:flex;
                    height:4.5rem;width:3rem;font-size:0.75rem;
                    color:#fff;justify-content: space-around;
                    align-items:center" @click="delInfo(item)">删除</span>
                </SwipeCell>
              </div>
            <div style="width:100%;height:22rem;text-align:center" v-show="isShow">
              <img src="@/assets/noData.png" class="nothingImg">
            </div>
            </PullRefresh>
            <Popup v-model="isDetails" position=top style="width:100vw;min-height:40vh">
              <div>
                <Cell title="详情" style="line-height:1.5rem;font-size:1rem">
                  <van-icon name="cross" right-icon @click="shotKills"/>
                </Cell>
                <p style="margin-left:1rem">类型：<span style="line-height:1rem" class="h5font">{{typeToChinese(details.type) || type1ToChinese(details.suggestionSelect)}}</span></p>
                <p style="margin-left:1rem">时间：<span style="line-height:1rem" class="h5font">{{timeFormatter1(details.createAt)}}</span></p>
                <p style="margin-left:1rem">内容：<span class="h5font">{{details.suggestionContact}}</span></p>
              </div>
            </Popup>
            <!-- style="margin:1.5rem 0 1rem 0" -->
            <!-- <div v-show="!isShow" style="width:100vw;background-color:#ff7575;position:relative;bottom:5rem;">
              <Pagination
                v-model="listQuery.offset"
                :page-count="Math.ceil(total/10)"
                :total-items = 'total'
                mode="simple"
                @change="seePage"
              >
              </Pagination>
             </div> -->
          </div>
          <van-tabbar v-model="active">
            <van-tabbar-item icon="home-o" @click="indexPage">主页</van-tabbar-item>
            <van-tabbar-item icon="comment">消息</van-tabbar-item>
            <van-tabbar-item icon="manager-o" @click="mySet">我的</van-tabbar-item>
         </van-tabbar>
       </div>
  </div>
</template>
<script>
import { Tabbar, TabbarItem, PullRefresh, Pagination, Popup, Cell, Notify, SwipeCell, Icon, CellGroup } from 'vant'
import { httpGet, httpDelete } from '@/utils/restful'
import { suggestion } from '@/api/url'
import { timeFormatter1, typeToChinese, type1ToChinese } from '@/utils/formatter'
export default {
  name: 'infomation',
  data () {
    return {
      active: 1,
      total: 0,
      isPullLoading: false,
      infoRecieve: undefined,
      isDetails: false,
      isShow: false,
      selectArrayId: [],
      timeFormatter1: timeFormatter1,
      typeToChinese: typeToChinese,
      type1ToChinese: type1ToChinese,
      listQuery: {
        offset: 1,
        limit: 10,
        type: undefined,
        suggestionSelect: undefined
      },
      details: {
        type: '',
        createAt: '',
        suggestionContact: ''
      }
    }
  },
  components: {
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem,
    PullRefresh,
    Pagination,
    Popup,
    Cell,
    SwipeCell,
    'van-icon': Icon,
    CellGroup
  },
  created () {
    this.checkMessage()
  },
  methods: {
    checkMessage () {
      Object.assign(this.listQuery, {
        departmentId: this.$store.getters.departmentId,
        kind: this.type
      })
      httpGet(suggestion, this.listQuery).then(res => {
        if (res.data.rows.length !== 0) {
          this.infoRecieve = res.data.rows
          this.total = res.data.total
          this.isShow = false
          // console.log(timeFormatter1(this.infoRecieve[0].createAt))
        } else {
          this.total = 0
          this.isShow = true
        }
        console.log(res)
      }).catch(() => {})
    },
    indexPage () {
      this.$router.push('/indexPage/')
    },
    mySet () {
      this.$router.push('/mySet/')
    },
    shotContent (item) {
      console.log(item)
      this.details = item
      this.isDetails = true
    },
    seePage (val) {
      this.listQuery.offset = val
      this.checkMessage()
    },
    shotKills () {
      this.isDetails = false
    },
    onRefresh () {
      setTimeout(() => {
        this.checkMessage()
        this.$toast('刷新成功')
        this.isPullLoading = false
      }, 500)
    },
    // 删除消息
    delInfo (item) {
      console.log(item)
      this.selectArrayId = [item.id]
      // Dialog.confirm({message: '确定要删除吗？', title: '提示'})
      //   .then(() => {
      httpDelete(suggestion, {ids: this.selectArrayId}).then(res => {
        Notify('删除成功')
        this.checkMessage()
      }).catch(() => {
      })
      // }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.messageDiv{
  // background: url(../../assets/list.jpg);
  background-color: rgb(224,238,251);
  background-size: 100%;
  height: 100vh;
  width: 100vw;
  overflow: scroll;
  // overflow: hidden;
}
.h5font{
 margin-left:1rem;
 line-height: 2rem;
 display: inline-block;
}
.nothingImg{
  max-width: 260px;
  max-height: 300px;
}
.div1 {
  h3 {
    display: flex;
    justify-content: space-between;
  }
}
</style>
