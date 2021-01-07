<template>
<div>
     <div class="open-door-data">
        <!-- 开闸记录card区域 -->
            <scroller :on-infinite="infinite" ref="myscroller" noDataText="没有数据了">
                      <div class="group-title">
          <h2>同步状态</h2>
        </div>
        <div
          class="user-list"
          v-for="(item, index) in userInfoData"
          :key="index"
        >
          <div class="">
            <div class="list-item">
              <span class="l-title">通道名称：</span
              ><span class="r-msg">{{ item.localName }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">总人数(人数)：</span
              ><span class="r-msg">{{ item.num }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">同步(人数)：</span
              ><span class="r-msg">{{ item.finsh }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">下发中(人数)：</span
              ><span class="r-msg">{{ item.middle }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">未同步(人数)：</span
              ><span class="r-msg">{{ item.notFinsh }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">删除中(人数)：</span
              ><span class="r-msg">{{ item.delete }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">排队(按部门)：</span
              ><span class="r-msg">{{ item.number }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">进度：</span
              ><span class="r-msg">{{ item.percentage }}%</span>
            </div>
            <div class="list-item">
              <span class="">预计下发完成时间：</span
              ><span class="r-msg">{{ item.date }}</span>
            </div>
          </div>
        </div>
           </scroller>
    </div>
</div>
</template>

<script>
import { lookState } from '@/api/url.js'
import { httpGet } from '@/utils/restful.js'
import { formatterTime } from '@/utils/formatter.js'
// import axios from 'axios'
export default {
  data () {
    return {
      val: 1, // 下拉加载的页数
      total: '', // 数据的总数
      userInfoData: [] // 数据的数组
    }
  },
  created () {
    this.openDoorLog()
  },
  methods: {
    // 上拉到底时触发的函数，类似于翻页效果
    infinite (done) {
      let _this = this
      setTimeout(() => {
        if (_this.total - 5 * _this.val < 0) { // 判断当前数据的总量是否超出总数据条数，如果超出则中止请求
          _this.$refs.myscroller.finishInfinite(true)
        } else {
          _this.val++
          _this.openDoorLog(done)
        }
      }, 1000)
    },
    // 进入页面时调用的函数，用于查找开闸数据
    openDoorLog () {
      // axios({
      //   method: 'get',
      //   url: process.env.API_HOST + 'pb/' + openOutLog,
      //   params: {
      //     departmentId: this.$store.getters.departmentId,
      //     offset: this.val,
      //     limt: 5
      //   }
      // })
      httpGet(lookState + this.$store.getters.departmentId)
        .then(res => {
          console.log('查询成功！', res)
          if (res.code === 1 && res.data) {
            // this.total = res.data.total
            Array.from(res.data).forEach(item => {
              // item.date = formatterTime(item.date)
              if (item.number) {
                item.number = item.number
              } else {
                item.number = '排队中'
              }
              if (parseInt(item.finsh) === 0 && parseInt(item.num) === 0) {
                item.percentage = 0
              } else if (parseInt(item.finsh) !== 0 && parseInt(item.num) === 0) {
                item.percentage = 100
              } else if (parseInt(item.finsh) === 0 && parseInt(item.num) !== 0) {
                item.percentage = 0
              } else {
                item.percentage = parseInt(item.finsh / (item.num) * 100)
              }
              if (parseInt(item.finsh) === 0 && parseInt(item.middle) === 0) {
                item.date = item.date ? formatterTime(new Date(item.date).getTime()) : '-'
              } else if (parseInt(item.finsh) === 0 && parseInt(item.middle) !== 0) {
                item.date = item.date ? formatterTime((new Date().getTime() - new Date(item.date).getTime()) * item.middle + new Date().getTime() / 1) : '-'
              } else if (parseInt(item.finsh) !== 0 && parseInt(item.middle) === 0) {
                item.date = item.date ? formatterTime((new Date().getTime() - new Date(item.date).getTime()) / item.finsh + new Date().getTime() / 1) : '-'
              } else {
                item.date = item.date ? formatterTime((new Date().getTime() - new Date(item.date).getTime()) / item.finsh * item.middle + new Date().getTime() / 1) : '-'
              }
              return item
            })
            this.userInfoData = res.data
          }
          // this.$refs.myscroller.finishInfinite(true)
        })
        .catch(err => {
          console.log('查询失败：', err)
        })
    }

  }
}
</script>

<style lang="scss" scoped>
.group-title {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.open-door-data {
  height: 100%;
  margin: auto;
  .user-list {
    width: 80%;
    margin: 6px auto;
    border: 1px solid #f1f1f1;
    padding: 1rem;
    border-radius: 20px;
    margin-bottom: 2rem;
    box-shadow: 0 0 2px 2px #999;
    .list-item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: 1px solid #eee;
      margin-bottom: 1rem;
      .l-title {
        flex: 4;
        justify-self: flex-end;
        text-align: right;
        padding-right: 1rem;
      }
      .r-msg {
        flex: 6;
        justify-self: flex-start;
        text-align: left;
      }
    }
  }
}
</style>
