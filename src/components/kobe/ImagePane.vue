<template>
  <div class="kobe-image-pane">
    <el-card>
      <img class="img-responsive" :src="image" alt="image">
      <div class="kobe-image-pane-info">
        <span>{{ description }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'kobe-image-pane',
  props: {
    image: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style>
.kobe-image-pane-info {
  max-width: 20rem;
  text-align: center;
}
</style>
