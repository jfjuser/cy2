<template>
  <div>
    <!-- 测试 -->
    <transition name="fade" mode="out-in">
      <themeType14 v-if="themeType === 1 || themeType === 4 || themeType === 5"></themeType14>
      <themeType23 v-if="themeType === 2 || themeType === 3 || themeType === 8"></themeType23>
    </transition>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import themeType14 from './themeType14'
import themeType23 from './themeType23'
export default {
  name: 'themeType',
  computed: {
    ...mapGetters([
      'themeType',
      'departmentId'
    ])
  },
  components: {
    themeType14,
    themeType23
  },
  created () {
    console.log('查看类型：', this.themeType)
  }
}
</script>
