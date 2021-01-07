<template>
  <div class="app-container">
    <div >
      <el-tabs v-model="type" type="border-card">
        <el-tab-pane label="已使用" name="used">
          <transition name="fade"  mode="out-in">
            <is-used v-if="type === 'used'"></is-used>
          </transition>
        </el-tab-pane>
        <el-tab-pane label="未使用" name="notUsed">
          <transition name="fade"  mode="out-in">
            <not-used v-if="type === 'notUsed'"></not-used>
          </transition>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import isUsed from './isUsed/index'
import notUsed from './notUsed/index'
export default {
  components: {
    isUsed,
    notUsed
  },
  data () {
    return {
      type: 'used'
    }
  }
}
</script>
