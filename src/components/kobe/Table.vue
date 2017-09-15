<template>
  <div class="kobe-table-component">
    <slot name="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input placeholder="请输入搜索关键字"></el-input>
        </el-col>
        <el-button icon="search"></el-button>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
    </slot>

    <slot name="kobe-table-content" class="kobe-table">
      <el-table
        :data="tableData"
        border
        stripe>
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
      </el-table>
    </slot>

    <slot name="kobe-table-footer" class="kobe-table-footer">
    </slot>
  </div>
</template>

<script>
export default {
  name: 'kobe-table',
  props: {
  },
  data () {
    return {
      tableData: {
        default: {
        },
        type: Object
      }
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style>
.kobe-table-header {
  margin: 1rem 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid lightgray;
}
.kobe-table {
  margin-left: 2rem;
  margin-right: 2rem;
  padding-bottom: 1rem;
}
.kobe-table-footer {
  padding-bottom: 1rem;
}
</style>
