<template>
    <div class="card">
        <slot></slot>
        <div class="text-r bottom">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: 'listCard'
}
</script>

<style lang="scss" scoped>
.card {
    margin-bottom: 15px;
    background-color: #fff;
    .bottom {
        padding: 5px;
        box-sizing: border-box;
    }
}
</style>
