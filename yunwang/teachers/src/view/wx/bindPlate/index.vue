<template>
  <!-- 绑定车牌 -->
  <div class="main-body">
    <loading :show="showLoading" text="加载中"></loading>
    <div class="box-card" v-for="(item, index) in data" :key="item.id">
      <div class="box-card-img">
        <img src="@/assets/icon/icon_plate.png"/>
      </div>
      <div class="box-card-plate">{{item.plate}}</div>
      <img class="box-card-close" src="@/assets/icon/icon_close.png" @click="handleDelete(item.plate, index)"/>
    </div>
    <div class="box-add">
      <div class="box-add-btn" @click="handleClick">
        <img src="@/assets/icon/icon_add.png"/>
        <div class="box-add-text">添加车牌</div>
      </div>
    </div>
    <div class="box-line"></div>
    <!-- <div class="question" @click="handleQuestion">常见问题</div> -->
  </div>
</template>
<style lang="scss" scoped>
.main-body {
  padding: 5% 5% 10%;
}
.box-card {
  margin: 5% 0;
  border-radius: 10px;
  width: 100%;
  height: 60px;
  padding: 10px 0;
  background-color: #409EFF;
  position: relative;
  .box-card-img {
    float: left;
    width: 40px;
    height: 40px;
    margin: 5px 0 0 15px;
    border-radius: 50%;
    border: 2px solid #b3d8ff;
    img {
      margin-top: 3px;
    }
  }
  .box-card-plate {
    float: left;
    margin-left: 10%;
    line-height: 50px;
    color: #ffffff;
    font-size: 20px;
  }
  .box-card-close {
    position: absolute;
    right: 7px;
    bottom: 7px;
    width: 24px;
    height: 24px;
  }
}
.box-add {
  padding: 0 0 10px 10%;
  width: 85%;
  height: 32px;
  line-height: 32px;
  .box-add-btn {
    cursor: pointer;
  }
  img {
    width: 24px;
    height: 24px;
    padding: 4px;
    float: left;
  }
  .box-add-text {
    padding-left: 10px;
    float: left;
    height: 32px;
    line-height: 32px;
    color: #707070;
  }
}
.box-line {
  margin-top: 2%;
  width: 100%;
  height: 1px;
  background-image: linear-gradient(to right, #a5a5a5 0%, #a5a5a5 50%, transparent 50%);
  background-size: 10px 1px;
  background-repeat: repeat-x;
}
.question {
  z-index: 1001;
  position: fixed;
  padding: 3% 0;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  color: #409EFF;
}
</style>
<script>
import { getUserCars, deleteUserCar, getWxUserInfo } from '@/api/url.js'
import { httpGet, httpDelete } from '@/utils/restful.js'
import { getQueryString } from '@/utils/formatter.js'
import { Loading } from 'vux'
document.title = '绑定车牌'
export default {
  components: {
    Loading
  },
  data () {
    return {
      data: [],
      openId: '',
      showLoading: true,
      params: {
        account: undefined,
        source: 5
      },
      getQueryString: getQueryString
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // 获取列表
    fetchData () {
      // 获取openId
      // 微信用户临时身份号
      let code = this.getQueryString('code')
      this.openId = this.getQueryString('openId')
      this.params.account = this.getQueryString('account')
      if (this.openId) {
        this.getUserCars()
      } else if (code) {
        let temp = Object.assign(this.params, {unicode: code})
        httpGet(getWxUserInfo, temp).then(res => {
          // 注意是res.openid!!!!
          this.openId = res.data.openid
          this.getUserCars()
        }).catch(() => {
        })
      } else {
        // 未登录
        this.$vux.toast.text('未授权登录', 'bottom')
        this.showLoading = false
      }
    },
    getUserCars () {
      if (this.openId) {
        let temp = Object.assign(this.params, {unicode: this.openId})
        httpGet(getUserCars, temp).then(res => {
          this.data = res.data
          this.showLoading = false
        }).catch(() => {
        })
      }
    },
    handleClick () {
      // this.$router.push({path: '/wx/addPlate', query: {type: 1}})
      this.$vux.toast.text('暂不支持手动绑定', 'bottom')
    },
    handleDelete (plate, index) {
      let self = this
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: plate,
        content: '确定要删除吗?',
        onCancel () {
        },
        onConfirm () {
          let temp = Object.assign(self.params, {plate: plate})
          httpDelete(deleteUserCar, temp).then(res => {
            self.data.splice(index, 1)
            self.$vux.toast.text('删除成功', 'bottom')
          }).catch(() => {
          })
        }
      })
    },
    handleQuestion () {}
  }
}
</script>
