<template>
<div>
     <div class="open-door-data">
        <!-- 开闸记录card区域 -->
            <scroller :on-infinite="infinite" ref="myscroller" noDataText="没有数据了">
                      <div class="group-title">
          <h2>开闸记录</h2>
          <span style="">一共 {{ total }} 条记录</span>
        </div>
        <div
          class="user-list"
          v-for="(item, index) in userInfoData"
          :key="index"
        >
          <div class="">
            <div class="list-item">
              <span class="l-title">用户名称：</span
              ><span class="r-msg">{{ item.userName }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">手机号：</span
              ><span class="r-msg">{{ item.phone }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">邮箱：</span
              ><span class="r-msg">{{ item.email }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">相机ID：</span
              ><span class="r-msg">{{ item.localId }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">通道名称：</span
              ><span class="r-msg">{{ item.localName }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">开闸时间：</span
              ><span class="r-msg">{{ item.date }}</span>
            </div>
            <div class="list-item">
              <span class="l-title">部门ID：</span
              ><span class="r-msg">{{ item.departmentId }}</span>
            </div>
          </div>
        </div>
           </scroller>
    </div>
</div>
</template>

<script>
import { openOutLog } from '@/api/url.js'
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
      httpGet(openOutLog, { departmentId: this.$store.getters.departmentId, offset: this.val, limit: 5 })
        .then(res => {
          console.log('查询成功！', res)
          if (res.code === 1 && res.data && res.data.rows) {
            this.total = res.data.total
            Array.from(res.data.rows).forEach(item => {
              item.date = formatterTime(item.date)
              return item
            })
            this.userInfoData = this.userInfoData.concat(res.data.rows)
          }
          this.$refs.myscroller.finishInfinite(true)
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
