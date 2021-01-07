<template>
    <div>
      <section class="box">
        <van-cell-group class="group">
            <van-cell title="部门名称" :label="form.departmentName" />
            <van-cell title="部门类别" :label="form.departmentTypeId | typeformatter(depType)" />
            <van-cell title="详细地址" :label="form.address" />
            <van-cell title="备注信息" :label="form.resume" />
        </van-cell-group>
      </section>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Cell, CellGroup } from 'vant'
import { department, getDepTypeByLevel } from '@/api/url'
import { httpGet } from '@/utils/restful'
export default {
  name: 'muck-home',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  data () {
    return {
      form: {
        id: undefined,
        departmentName: undefined,
        departmentTypeId: undefined,
        phone: undefined,
        email: undefined,
        resume: undefined,
        createAt: undefined
      },
      depType: []
    }
  },
  computed: {
    ...mapGetters([
      'departmentTypeId'
    ])
  },
  created () {
    this.getDepTypeByLevel()
  },
  mounted () {
    this.getDepInfo()
  },
  methods: {
    // 获取部门详情
    getDepInfo () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(department + '/' + this.$store.getters.departmentId).then(res => {
        this.form = Object.assign({}, res.data)
        ToastLoading.clear()
      }).catch(() => { ToastLoading.clear() })
    },
    // 获取部门类别
    getDepTypeByLevel () {
      let type
      if (this.departmentTypeId === 100044) {
        type = 3
      } else {
        type = 2
      }
      httpGet(getDepTypeByLevel + type).then(res => {
        this.depType = res.data
      }).catch(() => {})
    }
  },
  filters: {
    typeformatter: function (value, depType) {
      if (!value) return ''
      for (const v of depType) {
        if (v.id === value) {
          return v.typeName
        }
      }
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 15px;
  .group {
    box-shadow: 0 1px 12px 0 rgba(0,0,0,.1);
    border-radius: 5px;
    overflow: hidden;
  }
}
</style>
