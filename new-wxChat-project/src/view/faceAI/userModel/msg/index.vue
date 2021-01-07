<template>
  <div class="box-main">
    <div class="box-title">
      <p class="box-title-text">共{{list.length ? list.length : 0}}条信息</p>
    </div>
    <div v-for="(item, index) in list" :key="index" @click="handleClick(index)">
      <div class="box-date" v-if="item.tipTime !== undefined">{{item.tipTime}}</div>
      <div class="box-msg">
        <div class="box-msg-title">{{item.title}}</div>
        <div class="box-msg-content" v-for="(it, is) in item.list" :key="is">
          <span class="box-msg-name">{{it.name}}：</span>
          <span class="box-msg-text">{{it.text}}</span>
        </div>
        <div class="box-msg-time">{{formatterTime(item.createTime)}}</div>
        <img src="@/assets/icon/wx/tip-next.png"/>
      </div>
    </div>
    <div>
      <x-dialog v-model="show" class="box-dialog" :hide-on-blur="true">
        <div class="box-msg-big">
          <div class="box-msg-title">{{bigText.title}}</div>
          <div class="box-msg-content" v-for="(it, is) in bigText.list" :key="is">
            <span class="box-msg-name">{{it.name}}：</span>
            <span class="box-msg-text">{{it.text}}</span>
          </div>
          <div class="box-msg-time">{{formatterTime(bigText.createTime)}}</div>
        </div>
      </x-dialog>
      <div v-show="show" class="box-dialog-btn-close" @click="show = false"><img src="@/assets/icon/wx/sign/dialog-close.png"/></div>
    </div>
    <div v-show="list.length === 0 && isSuccess">
      <img class="img" src="@/assets/icon/wx/msg/not-msg.png"/>
      <p class="tip">暂无消息</p>
    </div>
  </div>
</template>
<script>
import { getNotice } from '@/api/url'
import { httpGet } from '@/utils/restful'
import { getDepInfo } from '@/utils/userInfo'
import { formatterTime, timeMonthDayFormatter } from '@/utils/formatter.js'
import { CellFormPreview, Group, Cell, XDialog } from 'vux'
export default {
  components: {
    CellFormPreview,
    Group,
    Cell,
    XDialog
  },
  data () {
    return {
      formatterTime: formatterTime,
      list: [],
      isSuccess: false,
      show: false,
      bigText: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      // getQueryString('d')
      // getDepInfo().departmentId
      httpGet(getNotice + '/' + getDepInfo().departmentId)
        .then((res) => {
          // this.list = res.data
          this.list = res.data
          if (this.list && this.list.length > 0) {
            // 处理分析的数据
            let tipTime
            for (let i = 0; i < this.list.length; i++) {
              let temp = this.list[i]
              if (i === 0 || (i > 0 && timeMonthDayFormatter(temp.createTime) !== timeMonthDayFormatter(this.list[i - 1].createTime))) {
                tipTime = timeMonthDayFormatter(temp.createTime)
                this.list[i] = Object.assign(this.list[i], {tipTime: tipTime})
              }
            }
          }
          this.isSuccess = true
        }).catch(() => {
          this.isSuccess = true
        })
    },
    handleClick (index) {
      this.bigText = this.list[index]
      this.show = true
    }
  }
}
</script>
<style lang='scss' scoped>
.box-main {
  background-color:#eff8f8;
  height:100vh;
  .box-title {
    text-align:left;
    background-color:#fff
  }
  .box-title-text {
    line-height:50px;
    margin-left:15px;
    font-size: .75rem;
  }
}
.box-date {
  width: 6.25rem;
  margin: .5rem auto .3125rem;
  padding: .1875rem .625rem;
  background-color: #a0a0a0;
  color: #f0f0f0;
  font-size: .75rem;
  border-radius: .625rem;
}
.box-msg {
  margin: .625rem auto;
  width: 85%;
  background-color: #fff;
  min-height: 5rem;
  border: 1 solid #f0f0f0;
  border-radius: .5rem;
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0.5rem 1rem 1rem;
  text-align: left;
  div {
    width: 90%;
  }
  img {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    right: 1rem;
    top: 35%;
  }
  .box-msg-title {
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: .125rem;
    padding: .3125rem 0;
  }
  .box-msg-content {
    font-size: .75rem;
    color: rgb(117, 117, 117);
  }
  .box-msg-text {
    margin-left: .625rem;
  }
  .box-msg-time {
    margin-top: .625rem;
    font-size: .75rem;
    color: rgb(80, 80, 80);
  }
}
.box-msg-big {
  margin: .625rem auto;
  width: 85%;
  background-color: #fff;
  min-height: 5rem;
  max-height: 80%;
  border: 1 solid #f0f0f0;
  border-radius: .5rem;
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0.5rem 1rem 1rem;
  text-align: left;
  div {
    width: 90%;
  }
  .box-msg-title {
    font-size: 1.375rem;
    font-weight: bold;
    letter-spacing: .125rem;
    padding: .3125rem 0;
  }
  .box-msg-content {
    font-size: 1.125rem;
    color: rgb(117, 117, 117);
  }
  .box-msg-text {
    margin-left: .625rem;
    word-wrap:break-word;
    word-break:break-all;
  }
  .box-msg-time {
    margin-top: .625rem;
    font-size: 1.25rem;
    color: rgb(80, 80, 80);
  }
}
.box-dialog {
  .weui-dialog{
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
.box-dialog-btn-close {
  position: absolute;
  bottom: 2rem;
  left: 44%;
  z-index: 1001;
  img {
    width: 35px;
    height: 35px;
  }
}
.img {
  margin-top: 25%;
}
.tip{
  padding-top: 10%;
  color: rgb(77, 77, 77);
  font-size: .875rem;
}
.list {
  padding: 1rem;
  text-align: left;
  .card {
    border: 1px solid #ccc;
    border-radius: .2rem;
    padding: .5rem;
    margin-bottom: .8rem;
  }
}
</style>
