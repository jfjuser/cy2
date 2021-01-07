<template>
  <div class="tree">
    <div class="tree-ul" v-for="(item, index) in data" :key="index">
      <div class="tree-parant" @click="handleOpen(item, index)">
        <div class="tree-i"><i class="fa fa-caret-right"></i></div>
        <div class="tree-tip" @click="handleClick(item, index)">
          <img class="tree-img" :src="imgFiliter(item.checkType)"/>
          <div :class="colorFormatter(index)">{{nameFormatter(item.name)}}</div>
          <div class="tree-name">{{item.name}}</div>
        </div>
      </div>
      <mytree class="tree-li" :index="index+1" :data="[]"></mytree>
      <i class="fa fa-caret-down"></i>
    </div>
  </div>
</template>
<script>
import img1 from '@/assets/icon/icon-noselection.png'
import img2 from '@/assets/icon/icon-refuse.png'
import img3 from '@/assets/icon/icon-selection.png'
import { httpGet } from '@/utils/restful'
import { AIDuyCompanyAndAiUser } from '@/api/url'
export default {
  name: 'mytree',
  props: {
    data: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  watch: {
    data (curVal) {
    },
    index (curVal) {
    }
  },
  data () {
    return {
    }
  },
  methods: {
    fetchData () {
      httpGet(AIDuyCompanyAndAiUser).then(res => {
      }).catch(() => {})
    },
    handleOpen (item, index) {
      // 打开子节点
    },
    handleClick (item, index) {
      if (item.checkType === 0) {
        // 全选改成未选
        item.checkType = 2
      } else {
        // 未选或半选改为全选
        item.checkType = 0
      }
    },
    imgFiliter (checkType) {
      if (checkType === 0) {
        // 全选
        return img3
      } else if (checkType === 1) {
        // 半选
        return img2
      }
      return img1
    },
    nameFormatter (name) {
      if (name && name.length > 2) {
        // 取最后两位
        name = name.substring(name.length - 2, name.length)
      }
      return name
    },
    colorFormatter (index) {
      if (index % 5 === 0) {
        return 'tree-simple blue'
      } else if (index % 5 === 1) {
        return 'tree-simple green'
      } else if (index % 5 === 2) {
        return 'tree-simple grey'
      } else if (index % 5 === 3) {
        return 'tree-simple orange'
      } else if (index % 5 === 4) {
        return 'tree-simple red'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tree {
  .tree-ul {
    position: relative;
    .tree-parant {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      height: 2rem;
      line-height: 2rem;
      cursor: pointer;
      .tree-i {
        display: flex;
        padding: 0.3rem .3125rem;
        i {
          height: 0.5rem;
          margin-top: 0.15rem;
        }
      }
      .tree-tip {
        display: flex;
        .tree-img {
          width: 1.5rem;
          height: 1.5rem;
          margin: 0.25rem .3125rem;
        }
        .tree-simple {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          font-size: .75rem;
          color: #fff;
          line-height: 2rem;
          text-align: center;
        }
        .tree-name {
          padding-left: .3125rem;
        }
      }
    }
    .tree-li {
      cursor: pointer;
    }
  }
}
.blue {
  background-color: #409EFF;
}
.green {
  background-color: #67c23a;
}
.grey {
  background-color: #909399;
}
.orange {
  background-color: #e6a23c;
}
.red {
  background-color: #f56c6c;
}
</style>
