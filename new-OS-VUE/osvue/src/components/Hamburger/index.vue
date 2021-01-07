<template>
  <div>
      <i @click="toggleClick" class="hamburger fa fa-navicon fa-lg " :class="{'is-active':isActive}"></i>
  </div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: true
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger {
	display: inline-block;
	cursor: pointer;
	width: 20px;
	height: 20px;
	transform: rotate(90deg);
	transition: .38s;
  transform-origin: 50% 50%;
  color: #646363;
}
.hamburger.is-active {
	transform: rotate(0deg);
}
</style>
