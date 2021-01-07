<template>
  <div class="app-container">
    <mytree :index="index" :data="data"></mytree>
  </div>
</template>
<script>
import mytree from './components/Tree'
export default {
  components: {
    mytree
  },
  data () {
    return {
      index: 0,
      data: [{'id': 127, 'name': '刘长毛', 'dcCode': '1615-', 'account': false, 'dutyCompanyId': null, 'checkType': null}]
    }
  }
}
</script>
