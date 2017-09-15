<template>
  <div class="kobe-info-cell">
    <slot name="kobe-cell-header">
    </slot>
    <slot name="kobe-cell-content">
      <el-row type="flex" justify="end">
        <el-col>{{ title }}:</el-col>
        <el-col class="kobe-info-cell-detail">{{ info }}</el-col>
      </el-row>
    </slot>
    <slot name="kobe-cell-footer">
    </slot>
  </div>
</template>

<script>
export default {
  name: 'kobe-info-cell',
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    info: {
      type: String,
      default: 'Info'
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style>
.kobe-info-cell-detail {
  text-align: right;
}
</style>
