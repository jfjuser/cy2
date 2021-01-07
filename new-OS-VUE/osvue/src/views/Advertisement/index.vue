<template>
  <div style="text-align: center;">
    <!-- <img class="pan-img" src="https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646"> -->
    <div class="block">
      <el-carousel :height="height" :interval="1000">
        <el-carousel-item v-for="item in list" :key="item.id">
          <!-- <h3>{{ item.src }}</h3> -->
          <img style="width: 100%;height:100%" :src="'data:image/jpg;base64,' + item.img" :alt="item.name">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div style="position:absolute;top:10px;right:10px; z-index: 10000000">
      <el-button @click="$router.push({path: '/'})" type="warning" icon="el-icon-close" circle></el-button>
    </div>
  </div>
</template>
<script>
import { httpGet } from '@/utils/restful'
import { getAdv } from '@/api/url'
export default {
  data () {
    return {
      height: '0px',
      list: []
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.ADV()
  },
  methods: {
    ADV () {
      const form = {
        type: 1,
        departmentId: this.$store.getters.departmentId
      }
      httpGet(getAdv, form)
        .then(res => {
          if (res.data.length > 0) {
            this.list = res.data
            setTimeout(() => {
              this.$router.push({ path: '/' })
            }, 3000)
          } else {
            this.$router.push({ path: '/' })
          }
        }).catch(() => {
          this.$router.push({ path: '/' })
        })
    },
    init () {
      this.height = document.body.offsetHeight + 'px'
    }
  }
}
</script>
<style lang="scss" scoped>
// .el-carousel__item h3 {
//     color: #475669;
//     font-size: 14px;
//     opacity: 0.75;
//     line-height: 150px;
//     margin: 0;
//   }

// .el-carousel__item:nth-child(2n) {
//    background-color: #99a9bf;
// }

// .el-carousel__item:nth-child(2n+1) {
//    background-color: #d3dce6;
// }
</style>
