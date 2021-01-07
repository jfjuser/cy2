<template>
    <div class="page">
        <NavBar title="物业通知栏" left-text="返回"  left-arrow @click-left="onClickLeft" />
        <PullRefresh v-model="isPullLoading" @refresh="onRefresh" style="min-height: 80vh;">
        <div style="width:100%;height:22rem;text-align:center" v-if="list.length==0">
            <img src="@/assets/noData.png" class="nothingImg">
        </div>
        <div class="list">
            <div class="card" v-for="(item) in list" :key="item.id">
                <div class="title">
                    <span>{{item.title}}</span>
                    <van-icon name="close" color="#f44" @click="delNotify(item.id)" />
                </div>
                <div class="main autoheight" @click="showPopup(item.list)">
                    <template v-for="(ite, i) in item.list">
                        <div :key="i">名称:{{ite.name}}</div>
                        <div class="content" :key="i+1">内容:{{ite.text}}</div>
                    </template>
                    <div class="switch" v-if="item.list.length>1 || item.list[0].text.length>60">全文</div>
                </div>
            </div>
        </div>
        </PullRefresh>
        <Popup v-model="show">
            <template v-for="(ite, i) in itemtext">
                <div :key="i" :style="i==0?'':'padding-top:.4rem'">名称:<span style="color: #7d7e80;">{{ite.name}}</span></div>
                <div class="content" :key="i+1">内容:<span style="color: #7d7e80;">{{ite.text}}</span></div>
            </template>
        </Popup>
    </div>
</template>

<script>
import { NavBar, Popup, Icon, Dialog, Toast, PullRefresh } from 'vant'
import { aiNotify } from '@/api/url'
import { httpDelete, httpGet } from '@/utils/restful'
export default {
  components: {
    NavBar,
    Popup,
    'van-icon': Icon,
    PullRefresh
  },
  data () {
    return {
      list: [],
      isPullLoading: false,
      show: false,
      itemtext: []
    }
  },
  mounted () {
    this.getaiNotify()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/addNotify/')
    },
    showPopup (item) {
      this.itemtext = item
      this.show = true
    },
    onRefresh () {
      setTimeout(() => {
        this.getaiNotify()
        this.$toast('刷新成功')
        this.isPullLoading = false
      }, 500)
    },
    getaiNotify () {
      httpGet(aiNotify + '/' + this.$store.getters.departmentId)
        .then(res => {
          if (res.code === 1) {
            this.list = res.data
          }
        }).catch(() => {})
    },
    delNotify (id) {
      Dialog.confirm({
        title: '提示',
        message: '确认删除吗?'
      }).then(() => {
        httpDelete(aiNotify + '/' + id).then(res => {
          this.getaiNotify()
          Toast.success('删除成功!')
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.van-popup {
    width: 80%;
    padding: .5rem;
}
.nothingImg{
  max-width: 260px;
  max-height: 300px;
}
.page {
    background-color: #fafafa;
    min-height: 100vh;
}
.list {
    padding: 1rem;
    box-sizing: border-box;
    div.card {
        margin-bottom: 1rem;
    }
    div:last-of-type.card {
        margin-bottom: 0;
    }
    .card {
        border:1px solid #ebedf0;
        border-radius: .4rem;
        padding: .5rem;
        box-shadow: 0 1px .9rem 0 rgba(0,0,0,.1);
        background-color: #fff;
        .title {
            margin-bottom: .3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .autoheight {
            max-height: 5rem;
        }
        .main {
            font-size: .8rem;
            color: #c9c9c9;
            overflow: hidden;
            position: relative;
            div.content {
                margin-bottom: .3rem;
            }
            div:last-of-type.content {
                margin-bottom: 0;
            }
            .switch {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                color: #1989fa;
                text-align: right;
                background-image: linear-gradient(0deg, #ffffff 0%, transparent 100%);
            }
        }
    }
}
</style>
