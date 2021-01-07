<template>
  <div class="app-container">
    <transition name="fade" mode="out-in">
      <Standard v-if="type === 1"></Standard>
      <Unattended v-if="type === 0"></Unattended>
    </transition>
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
      httpGet(getDepTransport + this.$store.getters.departmentId)
        .then(res => {
          this.type = res.data
        }).catch(() => {})
    }
  }
}
</script>
