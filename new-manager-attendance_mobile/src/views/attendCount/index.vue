<template>
    <div class="bgc-grey full-height">
        <header class="border-b flex-jc-center header bgc-blue">
            <!-- <rightTopBtn @click.native="exportInfo">导出</rightTopBtn> -->
            <div class="nav">
                <router-link replace to="/dailyCount/" >日统计</router-link>
                <router-link replace to="/monthlyCount/" >月统计</router-link>
            </div>
        </header>
        <!-- {{$route.meta}} -->
        <!-- <router-view v-wechat-title="$route.meta.title" ></router-view> -->
        <keep-alive>
            <router-view v-wechat-title="$route.meta.title"  />
        </keep-alive>
    </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.header {
    padding: 10px 0;
}
.nav {
  height: 30px;
  line-height: 30px;
  font-size: 0;
}
.nav > a {
  color: #fff;
  background-color: #409EFF;
  font-size: 14px;
  display: inline-block;
  border: 1px solid #fff;
  padding: 0 20px;
  box-sizing: border-box;
}
.nav > a:nth-of-type(1) {
    border-right: 0;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
}
.nav > a:nth-of-type(2) {
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
}
.nav a.router-link-exact-active {
    color: #409EFF;
    background-color: #fff;
}
</style>
