<template>
  <div >
    <component :is="current"></component>
  </div>
</template>

<script>
import Workbench from './workbench/index'
export default {
  name: 'home',
  components: {
    Workbench
  },
  data () {
    return {
      current: Workbench
    }
  }
}
</script>
