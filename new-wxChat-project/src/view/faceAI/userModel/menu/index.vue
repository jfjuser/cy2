<template>
  <div class="menu-theme">
    <div class="box">
      <div class="box-title">我的应用</div>
      <div class="box-main">
        <div class="box-body" v-for="i in myfun" :key="i.id" @click="handleClick(i, false)">
          <div class="menu">
            <img class="menu-icon" src="@/assets/icon/wx/menu/icon-prevent.png"/>
            <img slot="icon" :src="i.img"/>
            <p>{{i.title}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="box-title">最近使用</div>
      <div class="box-main">
        <div class="box-body" v-for="(i, index) in lastFun" :key="index" @click="handleClick(i, true)">
          <div class="menu">
            <img class="menu-icon" src="@/assets/icon/wx/menu/icon-addto.png"/>
            <img slot="icon" :src="i.img"/>
            <p>{{i.title}}</p>
          </div>
        </div>
        <div style="padding: .62rem;" v-if="lastFun.length==0">无</div>
      </div>
    </div>
    <div class="box">
      <div class="box-title">增值功能</div>
      <div class="box-main">
        <div class="box-body" v-for="i in feeFun" :key="i.id" @click="handleClick(i, true)">
          <div class="menu">
            <img class="menu-icon" src="@/assets/icon/wx/menu/icon-addto.png"/>
            <img slot="icon" :src="i.img"/>
            <p>{{i.title}}</p>
          </div>
        </div>
        <div style="padding: .62rem;" v-if="feeFun.length==0">无</div>
      </div>
    </div>
    <div class="box">
      <div class="box-title">免费功能</div>
      <div class="box-main">
        <div class="box-body" v-for="i in noFeeFun" :key="i.id" @click="handleClick(i, true)">
          <div class="menu">
            <img class="menu-icon" src="@/assets/icon/wx/menu/icon-addto.png"/>
            <img slot="icon" :src="i.img"/>
            <p>{{i.title}}</p>
          </div>
        </div>
        <div style="padding: .62rem;" v-if="noFeeFun.length==0">无</div>
      </div>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPost } from '@/utils/restful'
import { getMenu, setMenu } from '@/api/url.js'
import { funBlock } from '@/utils/funAble.js'
import { setMenuInfo, getMenuInfo, getWxInfo, getDepInfo, getLastMenuInfo, setLastMenuInfo } from '@/utils/userInfo.js'
export default {
  data () {
    return {
      // 我的应用
      myfun: [],
      fun: [],
      // 最近使用
      lastFun: getLastMenuInfo(),
      // 增值功能
      feeFun: [],
      // 免费功能
      noFeeFun: [],
      defParams: {}
    }
  },
  created () {
    let menuInfo = getMenuInfo()
    if (menuInfo) {
      // 缓存数据快速回显
      this.fun = this.removeAddMenu(menuInfo)
      this.myfun = this.fun

      console.log('我的应用： ', this.myfun)

      this.setOtherMenu()
    }
    // 与服务器保持一致
    this.getMenu()
    this.defParams = {
      departmentId: getDepInfo().departmentId,
      account: getWxInfo().account,
      unicode: getWxInfo().unicode
    }
  },
  methods: {
    getMenu () {
      if (this.defParams.account) {
        let self = this
        httpGet(getMenu, self.defParams).then(res => {
          console.log('请求到的菜单：', res)

          // 用户保存到的菜单信息
          self.fun = []
          let array = res.data.menus
          for (let i = 0; i < array.length; i++) {
            if (array[i] && array[i] > 0) {
              self.fun.push(funBlock[array[i] - 1])
            }
          }
          self.fun = self.removeAddMenu(self.fun)
          self.myfun = self.fun
          self.setOtherMenu()
          setMenuInfo(self.fun)
          // 如果有绑定了的部门,默认添加一个定制功能菜单,用来管理菜单
          // self.fun.push({id: 5, title: '定制功能', img: AddImg})
          // localStorage.setItem('menuInfo', JSON.stringify(self.fun))
        }).catch(() => {
          // 如果有绑定了的部门,默认添加一个定制功能菜单,用来管理菜单
          // self.fun.push({id: 5, title: '定制功能', img: AddImg})
          self.$vux.toast.text('菜单加载失败', 'bottom')
          // localStorage.setItem('menuInfo', JSON.stringify(self.fun))
        })
      }
    },
    setMenu () {
      let menu = []
      for (let i = 0; i < this.fun.length; i++) {
        menu.push(this.fun[i].id)
      }
      let m = {
        menuId: menu
      }
      let params = Object.assign(m, this.defParams)
      let temp = this.fun
      httpPost(setMenu, params).then(res => {
        // 保存成功
        setMenuInfo(temp)
        this.myfun = temp
        // 保存最近使用的菜单
        setLastMenuInfo(this.lastFun)
        this.setOtherMenu()
      }).catch((err) => {
        console.log(err)

        this.getMenu()
        this.$vux.toast.text('保存失败', 'bottom')
      })
    },
    handleClick (info, type) {
      if (type) {
        // 去重
        for (let i = 0; i < this.fun.length; i++) {
          if (this.fun[i].id === info.id) {
            this.fun.splice(i, 1)
            break
          }
        }
        // 增加
        this.fun.push(info)
        if (this.lastFun) {
          for (let i = 0; i < this.lastFun.length; i++) {
            if (this.lastFun[i].id === info.id) {
              this.lastFun.splice(i, 1)
              break
            }
          }
        }
      } else {
        // 去掉
        if (this.fun) {
          for (let i = 0; i < this.fun.length; i++) {
            if (this.fun[i].id === info.id) {
              this.fun.splice(i, 1)
              // break
            }
          }
        }
        // 去重
        for (let i = 0; i < this.lastFun.length; i++) {
          if (this.lastFun[i].id === info.id) {
            this.lastFun.splice(i, 1)
            break
          }
        }
        // 增加
        this.lastFun.push(info)
      }
      this.fun = this.removeAddMenu(this.fun)
      this.lastFun = this.removeAddMenu(this.lastFun)
      this.setMenu()
    },
    // 去掉定制功能菜单
    removeAddMenu (info) {
      if (info) {
        for (let i = 0; i < info.length; i++) {
          if (info[i].id === 5 || info[i].id === 0) {
            info.splice(i, 1)
          }
        }
      }
      return info
    },
    // 设置增值功能，免费功能
    setOtherMenu () {
      let flag
      this.feeFun = []
      this.noFeeFun = []
      let temp = Object.assign([], funBlock)
      let array = this.removeAddMenu(temp)
      for (let i = 0; i < array.length; i++) {
        flag = true
        for (let o = 0; o < this.fun.length; o++) {
          if (array[i].id === this.fun[o].id) {
            flag = false
            break
          }
        }
        if (flag) {
          if (array[i].feeValue > 0) {
            this.feeFun.push(array[i])
          } else {
            this.noFeeFun.push(array[i])
          }
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.box {
  padding: .625rem;
  border-bottom: 1px solid #d8d8d8;
  .box-title {
    font-size: 1.25rem;
    font-weight: bold;
    text-align: left;
    margin: 0 0 .3125rem 1.25rem;
  }
  .box-main {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .box-body {
      background-color: #f4fdfd;
      padding: 1%;
      margin: .3125rem 1%;
      width: 20%;
      .menu {
        position: relative;
        margin: 0 auto;
        letter-spacing: .0625rem;
        .menu-icon {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
        }
        img {
          width: 36px;
        }
        p {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
