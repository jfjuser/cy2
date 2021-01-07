<template>
  <div class="app-container">
   <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <!-- 级别一 -->
          <el-card  class="box-card" shadow="hover">
            <div slot="header" >
              <span style="font-size:18px;color:#409EFF;cursor:pointer" class="title" @click="routerLevel(1)"  >平台级别</span>
              <el-button style="float: right; padding: 3px 0;" :loading="firstLoading"  v-show="!showFirst" @click="plus(1)" type="text" icon="el-icon-plus" ></el-button>
              <el-button style="float: right; padding: 3px 0;" v-show="showFirst" @click="minus(1)" type="text" icon="el-icon-minus" ></el-button>
            </div>
            <el-collapse-transition>
              <div v-show="showFirst">
                <div v-for="(item, index) in firstList" :key="index" class="text item" @click="showFirstItem(index)">
                   <router-link :to="{ path: '/cloudMaintain/cloudCategory/info', query: { id: item.id }}">
                      <span :class="[ activeFirstIndex === index ? redClass : '', 'normalClass']" ><i :class="isIconFormatter(item.icon)"></i>&#x3000;{{ item.typeName}} </span>
                   </router-link>
                </div>
              </div>
            </el-collapse-transition>
          </el-card>
          <!-- 级别二 -->
          <el-card   class="box-card" shadow="hover" style="margin-top:10px;">
            <div slot="header" class="clearfix">
              <span style="font-size:18px;color:#409EFF;cursor:pointer" class="title" @click="routerLevel(2)">代理级别</span>
              <el-button style="float: right; padding: 3px 0" :loading="secondLoading" v-show="!showSecond" @click="plus(2)" type="text" icon="el-icon-plus" ></el-button>
              <el-button style="float: right; padding: 3px 0" v-show="showSecond" @click="minus(2)" type="text" icon="el-icon-minus" ></el-button>
            </div>
            <el-collapse-transition>
              <div v-show="showSecond">
                <div v-for="(item,index) in secondList" :key="item.id" class="text item"  @click="showSecondItem(index)">
                   <router-link :to="{ path: '/cloudMaintain/cloudCategory/info', query: { id: item.id }}">
                      <span :class="[ activeSecondIndex === index ? redClass : '', 'normalClass']" ><i :class="isIconFormatter(item.icon)"></i>&#x3000;{{ item.typeName}} </span>
                   </router-link>
                </div>
              </div>
            </el-collapse-transition>
          </el-card>
          <!-- 级别三-->
          <el-card   class="box-card" shadow="hover" style="margin-top:10px;">
            <div slot="header" class="clearfix">
              <span style="font-size:18px;color:#409EFF;cursor:pointer" class="title" @click="routerLevel(3)">运营级别</span>
              <el-button style="float: right; padding: 3px 0" :loading="thirdLoading" v-show="!showThird" @click="plus(3)" type="text" icon="el-icon-plus" ></el-button>
              <el-button style="float: right; padding: 3px 0" v-show="showThird" @click="minus(3)" type="text" icon="el-icon-minus" ></el-button>
            </div>
            <el-collapse-transition>
              <div v-show="showThird">
                <div v-for="(item,index) in thirdList" :key="item.id" class="text item" @click="showThirdItem(index)">
                   <router-link :to="{ path: '/cloudMaintain/cloudCategory/info', query: { id: item.id, level: 3 }}">
                    <span :class="[ activeThirdIndex === index ? redClass : '', 'normalClass']" ><i :class="isIconFormatter(item.icon)"></i>&#x3000;{{ item.typeName}} </span>
                   </router-link>
                </div>
              </div>
            </el-collapse-transition>
          </el-card>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </transition>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { isIconFormatter } from '@/utils/formatter.js'
import { httpGet } from '@/utils/restful'
import { getDepTypeByLevel } from '@/api/url'
export default {
  data () {
    return {
      isIconFormatter: isIconFormatter,
      showFirst: false,
      firstLoading: false,
      firstList: [],
      showSecond: false,
      secondLoading: false,
      secondList: [],
      showThird: false,
      thirdLoading: false,
      thirdList: [],
      activeFirstIndex: -1,
      activeSecondIndex: -1,
      activeThirdIndex: -1,
      redClass: 'red',
      normalClass: 'normal'
    }
  },
  methods: {
    plus (type) {
      let self = this
      if (type === 1) self.firstLoading = true
      if (type === 2) self.secondLoading = true
      if (type === 3) self.thirdLoading = true
      httpGet(getDepTypeByLevel + type).then(res => {
        if (type === 1) {
          self.firstLoading = false
          self.firstList = res.data
          self.showFirst = true
        } else if (type === 2) {
          self.secondLoading = false
          self.secondList = res.data
          self.showSecond = true
        } else {
          self.thirdLoading = false
          self.thirdList = res.data
          self.showThird = true
        }
      }).catch(() => {
        if (type === 1) self.firstLoading = false
        if (type === 2) self.secondLoading = false
        if (type === 3) self.thirdLoading = false
      })
    },
    minus (type) {
      if (type === 1) {
        this.showFirst = false
        this.secondLoading = false
        this.thirdLoading = false
      }
      if (type === 2) {
        this.showSecond = false
        this.firstLoading = false
        this.thirdLoading = false
      }
      if (type === 3) {
        this.showThird = false
        this.firstLoading = false
        this.secondLoading = false
      }
    },
    routerLevel (value) {
      this.$router.push({path: '/cloudMaintain/cloudCategory/level', query: { id: value }})
      this.activeFirstIndex = -1
      this.activeSecondIndex = -1
      this.activeThirdIndex = -1
    },
    showFirstItem (index) {
      this.activeFirstIndex = index
      this.activeSecondIndex = -1
      this.activeThirdIndex = -1
    },
    showSecondItem (index) {
      this.activeSecondIndex = index
      this.activeFirstIndex = -1
      this.activeThirdIndex = -1
    },
    showThirdItem (index) {
      this.activeThirdIndex = index
      this.activeFirstIndex = -1
      this.activeSecondIndex = -1
    }
  },
  mounted () {
    this.routerLevel(1)
    this.plus(1)
    // this.intro.start().oncomplete(() => {
    //   console.log(11111)
    // }).onexit(() => {
    //   console.log(222221)
    // }).onbeforechange((e) => {
    //   console.log(e.getAttribute('tourl'))
    //   console.log(33333, e)
    // })
  }
}
</script>
<style lang="scss" scoped>
.title:hover {
  opacity: .5;
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  // 卡片
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
    a:hover {
      color: red;
    }
  }
  .normal {
    color:#303133;
  }
  .red {
    color: red !important;
  }
</style>
