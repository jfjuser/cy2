<template>
    <section class="planbox">
        <div class="plan">
        <div class="row" v-for="(planitem, i) in planDataSort" :key="i">
            <div>{{planitem.floor}}层</div>
            <div class="grid" v-for="(roomsitem, i2) in planitem.rooms" :key="i2" @dblclick="editorRoom(i, i2, roomsitem)">{{roomsitem}}</div>
        </div>
        </div>
    </section>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    planData: {
      type: Array,
      required: true
    }
  },
  computed: {
    planDataSort () {
      let planData = this.planData
      let max
      for (var i = 0; i < planData.length; i++) {
        for (var j = i; j < planData.length; j++) {
          if (planData[i].floor < planData[j].floor) {
            max = planData[j]
            planData[j] = planData[i]
            planData[i] = max
          }
        }
      }
      return planData
    }
  },
  methods: {
    editorRoom (row, column, room) {
      this.$emit('editorRoom', row, column, room)
    }
  }
}
</script>

<style lang="scss" scoped>
$oddcolor: #6d54ee;
$evencolor: #4a78ff;
.planbox {
  display: flex;
  justify-content: center;
  align-items: center
}
// 平面图
.plan {
  font-size: .9rem;
  .row {
    width: 95vw;
    display: flex;
    color: #fff;
    div:first-of-type {
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .grid {
      height: 2rem;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid blue;
      &:hover {
        opacity: .9;
      }
    }
    div:last-of-type {
      border: none
    }
  }
  div:nth-of-type(odd) .grid {
    background-color: $oddcolor;
  }
  div:nth-of-type(even) .grid {
    background-color: $evencolor;
  }
  div:nth-of-type(odd) div:first-of-type {
    color: $oddcolor;
  }
  div:nth-of-type(even) div:first-of-type {
    color: $evencolor;
  }
}
</style>
