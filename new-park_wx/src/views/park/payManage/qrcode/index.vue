<template>
  <div class="page">
    <Standard v-if="type === 1"></Standard>
    <Unattended v-if="type === 0"></Unattended>
  </div>
</template>

<script>
import Standard from './Standard/index.vue'
import Unattended from './Unattended/index.vue'
import { httpGet } from '@/utils/restful'
import { getDepTransport } from '@/api/url'
export default {
  components: {
    Standard,
    Unattended
  },
  data () {
    return {
      type: undefined
    }
  },
  created () {
    this.getType()
  },
  methods: {
    getType () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getDepTransport + this.$store.getters.departmentId)
        .then(res => {
          ToastLoading.clear()
          this.type = res.data
        }).catch(() => { ToastLoading.clear() })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
