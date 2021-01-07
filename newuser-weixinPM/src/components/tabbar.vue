<template>
  <Tabbar v-model="setTag" class="active_tab" active-color="#0066FF">
    <TabbarItem
      v-for="(item,index) in tabbars"
      :key="index"
      @click="tab(index,item.name)"
    >
      <span :class="currIndex == index ? active:''">{{item.title}}</span>
      <template slot="icon" >
        <!-- <img :src="props.active ? item.active : item.normal"> -->
        <Icon :class="item.active" class-prefix="iconfont"></Icon>
      </template>
    </TabbarItem>
  </Tabbar>
</template>

<script>
import '@/assets/css/tabIcon.scss'
import { Tabbar, TabbarItem, Icon } from 'vant'
import { mapActions, mapGetters } from 'vuex' // 引入vuex辅助函数
export default {
  name: 'tabbar',
  components: {
    Tabbar,
    TabbarItem,
    Icon
  },
  props: ['param'],
  data () {
    return {
      currIndex: 0,
      setTag: 1,
      // active: this.param,
      tabbars: [
        {
          name: 'statiReport',
          title: '考勤',
          // normal: require('@/assets/phone.png'),
          // active: require('@/assets/phone.png')
          normal: 'icon-kaoqin',
          active: 'icon-kaoqin'
        },
        {
          name: 'addInfo',
          title: '资料',
          // normal: require('@/assets/phone.png'),
          // active: require('@/assets/phone.png')
          normal: 'icon-gerenxinxi',
          active: 'icon-gerenxinxi'
        },
        {
          name: 'mySet',
          title: '我的',
          // normal: require('@/assets/email.png'),
          // active: require('@/assets/email.png')
          normal: 'icon-wodedangxuan',
          active: 'icon-wodedangxuan'
        }
      ]
    }
  },
  created () {
    // console.log('param', this.param)
    this.setTag = this.param // 占改， 后期修改 tabBar
  },
  computed: {
    ...mapGetters('user', ['active'])
  },
  methods: {
    ...mapActions('user', ['SaveActive']),
    tab (index, val) {
      if (window.location.href.indexOf(val) > -1) {
      } else {
        // console.log(val, index, this.setTag)
        this.$router.replace('/' + val + '/') // 切换

        // if (index === 0) {
        //   if (Number(this.active) === 3) {
        //     this.$router.replace('/' + val + '/')
        //   } else {
        //     // this.$notify('暂未加入考勤组，无法查看考勤情况')
        //     Dialog.alert({
        //       message: '暂未加入考勤组，无法查看考勤情况'
        //     }).then(() => {
        //       // console.log(this.setTag)
        //       this.$router.replace('/' + val + '/')
        //       // this.SaveActive(this.setTag) // 存储状态
        //       // on close
        //     })
        //   }
        // } else {
        //   this.currIndex = index
        //   this.$router.replace('/' + val + '/')
        // }
      }
    }
  },
  watch: {
    // param (cur, old) {
    //   console.log('监听param', cur, old)

    //   // this.$emit('param', cur)
    //   // console.log(cur)
    //   // this.active = cur
    //   // this.currIndex = cur
    //   // if (cur === 2) {
    //   //   this.$router.replace('mySet')
    //   // }
    //   // if (cur === 0) {
    //   //   this.$router.replace('statiReport')
    //   // }
    // }
    // active (cur, old) {
    //   console.log(cur, old)

    //   // this.setTag = old
    // }
  }
}
</script>

<style lang="scss" scoped>
.active_tab img {
  width: 26px;
  height: 26px;
}
.active_tab{
  // border-top:1px solid #ccc;
}
.van-tabbar-item--active {
  color:rgb(33,124,255);
}
</style>
