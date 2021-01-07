<template>
    <div class="bgc-grey full-height page box-sizing">
        <h2 class="title mar-b-15">请选择要进入的公司</h2>
        <div class="list fc-dark">
          <template v-for="(item, index) in data" >
            <div class="card bgc" @click="golink(index)" :key="index">{{item.departmentName}}</div>
          </template>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      data: JSON.parse(decodeURI(this.$route.query.data)) || null
    }
  },
  created () {
    // console.log('选择公司的数据：', this.data, '当前路由：', this.$route)
  },
  methods: {
    async golink (index) {
      let data = this.data[index]
      await this.$store.dispatch('setLoginInfo', data)
      this.$router.push('/home/?a=123')
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
    padding: 20px;
}
.title {
    font-weight: normal;
}
.list {
    .card {
        padding: 15px;
        font-size: 20px;
        margin-top: 15px;
        &:first-child {
            margin-top: 0;
        }
    }
}
</style>
