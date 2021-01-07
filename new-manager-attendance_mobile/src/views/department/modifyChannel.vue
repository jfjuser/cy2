<template>
    <div class="page full-height bgc-grey">
        <!-- 修改通道 -->
        <div class="editor">
            <van-cell-group>
                <van-cell title="通道名称" is-link @click="dialogVisible = true" />
            </van-cell-group>
            <div class="btnbox">
                <van-button type="info" block class="btn mar-b-10" @click="finishModifyingChannel">完成</van-button>
                <van-button plain block class="btn" @click="back">返回</van-button>
            </div>
        </div>
        <!-- 主内容 -->
        <van-dialog v-model="dialogVisible" title="选择通道" close-on-popstate >
          <div class="text-c fc-grey nulldata" v-if="localList.length == 0">暂无通道</div>
            <van-checkbox-group v-model="localform.aiTokenIds" class="radio-group">
              <template v-for="(item, index) in localList">
                <van-checkbox :name="item.localId" class="mar-b-10" :key="index">{{item.localName}}</van-checkbox>
              </template>
            </van-checkbox-group>
        </van-dialog>
    </div>
</template>

<script>
import { CheckboxGroup, Tag, ActionSheet, Checkbox, Grid, GridItem, Divider } from 'vant'
import { userForaiLocalPermission } from '@/api/url'
export default {
  components: {
    'van-checkbox-group': CheckboxGroup,
    'van-checkbox': Checkbox,
    'van-tag': Tag,
    'van-action-sheet': ActionSheet,
    'van-grid': Grid,
    'van-grid-item': GridItem,
    [Divider.name]: Divider
  },
  data () {
    return {
      data: {},
      dialogVisible: false,
      localform: {
        aiTokenIds: []
      },
      localList: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 点击完成时触发
    finishModifyingChannel () {
      this.$http.put(userForaiLocalPermission, { aiUserId: this.$route.query.aiUserId, aiTokenIds: this.localform.aiTokenIds })
        .then(res => {
          this.$router.replace('/user/')
        })
    },
    back () {
      this.$router.replace('/user/')
    },
    getData () {
      this.$http.get(userForaiLocalPermission + '?departmentId=' + this.$store.getters.departmentId + '&aiUserId=' + this.$route.query.aiUserId)
        .then(res => {
          console.log(res)
          this.data.localNames = []
          for (const v of res.data.local) {
            for (const v2 of res.data.checked) {
              if (v.localId === v2) {
                this.data.localNames.push(v)
              }
            }
          }
          this.localform.aiTokenIds = res.data.checked
          this.localList = res.data.local
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  .header {
      padding: 30px 15px 15px;
      margin-bottom: 15px;
      position: relative;
      .icon {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 18px;
      }
      h2 {
          margin-bottom: 5px;
      }
      .tag {
        margin-left: 5px;
      }
  }
  .user {
      .line {
          padding: 0 80px;
          padding-top: 10px;
          margin: 0;
      }
      .head {
          margin-bottom: 5px;
      }
      .fixed-width {
        width: 50px;
      }
      .add-icon {
          /deep/ .van-grid-item__icon {
              font-size: 35px;
          }
      }
  }
  /deep/ .userinfo.van-popup {
      border-radius: 5px;
  }
  .userinfo {
    width: 300px;
  }
  .usersbox {
      width: 100vw;
      min-height: 100vh;
      .title {
          padding: 15px 0;
      }
      .add-btn {
        position: absolute;
        right: 10px;
        top: 8px;
      }
  }
  .btnbox {
      padding: 15px;
      .btn {
        border-radius: 5px;
        overflow: hidden;
      }
  }
  .radio-group {
    padding-left: 15px;
  }
}
.nulldata {
  padding: 10px;
}
</style>
