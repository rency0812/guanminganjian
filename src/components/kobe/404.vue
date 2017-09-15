<template>
  <div class="kobe-404-component">
    <slot name="logo">
      <a href=""><b>{{ title }}</b></a>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'kobe-404',
  prop: {
    title: {
      type: String,
      default: 'KOBE UI'
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
