<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="grid-content">
                    <el-card  class="box-card" shadow="hover">
                        <div slot="header" >
                            <span style="font-size:18px;color:#409EFF;cursor:pointer">消息中心</span>
                            <el-button style="float: right; padding: 3px 0;" :loading="firstLoading"  v-show="!showFirst" @click="plus(1)" type="text" icon="el-icon-plus" ></el-button>
                            <el-button style="float: right; padding: 3px 0;" v-show="showFirst" @click="minus(1)" type="text" icon="el-icon-minus" ></el-button>
                        </div>
                        <el-collapse-transition>
                          <div v-show="showFirst">
                            <div :class="[ index === 1 ? redClass : '', 'normalClass', 'item']" @click="open(1, 1)">&#x3000;&#x3000;全部消息 </div>
                            <el-badge :value="notReadCount" :max="99" :hidden="notReadCount <= 0">
                              <div :class="[ index === 2 ? redClass : '', 'normalClass', 'item']" @click="open(1, 2)">&#x3000;&#x3000;未读消息 </div>
                            </el-badge>
                            <div :class="[ index === 3 ? redClass : '', 'normalClass', 'item']" @click="open(1, 3)">&#x3000;&#x3000;已读消息 </div>
                          </div>
                        </el-collapse-transition>
                    </el-card>
                    <el-card  class="box-card" shadow="hover" style="margin-top:10px;">
                        <div slot="header" >
                            <span style="font-size:18px;color:#409EFF;cursor:pointer">消息接收管理</span>
                            <el-button style="float: right; padding: 3px 0;" :loading="secondLoading"  v-show="!showSecond" @click="plus(2)" type="text" icon="el-icon-plus" ></el-button>
                            <el-button style="float: right; padding: 3px 0;" v-show="showSecond" @click="minus(2)" type="text" icon="el-icon-minus" ></el-button>
                        </div>
                        <el-collapse-transition>
                          <div v-show="showSecond">
                            <div :class="[ index === 4 ? redClass : '', 'normalClass', 'item']" @click="open(2, 1)">&#x3000;&#x3000;基本接收设置</div>
                          </div>
                        </el-collapse-transition>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="18">
              <Msg v-show="openType === 1" :isReader="openValue"></Msg>
              <Set v-show="openType === 2" :unicode="openValue"></Set>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Msg from './components/msg'
import Set from './components/set'
import { httpGet } from '@/utils/restful'
import { getMsgTypeCount } from '@/api/url'
export default {
  components: {
    Msg,
    Set
  },
  data () {
    return {
      redClass: 'red',
      showFirst: true,
      showSecond: true,
      showThird: true,
      firstLoading: false,
      secondLoading: false,
      thirdLoading: false,
      notReadCount: 0,
      index: 1,
      openType: 1,
      openValue: 1
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      httpGet(getMsgTypeCount).then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.notReadCount += res.data[i].notReadCount
        }
      }).catch(() => {
      })
    },
    open (type, value) {
      this.openType = type
      this.openValue = value
      this.index = (type - 1) * 3 + value
    },
    plus (type) {
      if (type === 1) {
        this.showFirst = true
      } else if (type === 2) {
        this.showSecond = true
      } else if (type === 3) {
        this.showThird = true
      }
    },
    minus (type) {
      if (type === 1) {
        this.showFirst = false
      } else if (type === 2) {
        this.showSecond = false
      } else if (type === 3) {
        this.showThird = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
  cursor: pointer;
}
.normal {
  color:#303133;
}
.red {
  color: red !important;
}
</style>
