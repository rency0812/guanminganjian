<template>
  <div class="sc-article-category-add">
    <el-form>
      <el-form-item label="父级板块">
        <el-cascader
          :options="options"
          change-on-select
          :props="props"
          @change="handleChange"
          v-model="formData.valueList"
          v-if="!isEditing"
        ></el-cascader>
        <el-input v-else v-model="formData.parentName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="板块名称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="板块描述">
        <el-input v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="图标选择">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="同级排序">
        <el-input v-model="formData.sort"></el-input>
      </el-form-item>
      <el-form-item label="访问路径">
        <el-input v-model="formData.url"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from 'src/api'
import config from 'src/config'

export default {
  data () {
    return {
      options: [],
      props: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      formData: {
        id: '',
        name: '',
        description: '',
        parentId: 0,
        sort: '',
        url: '',
        icon: '',
        valueList: [],
        parentName: ''
      },
      isEditing: false
    }
  },
  mounted () {
    if (this.$route.query) {
      this.isEditing = true
      let {node, data} = this.$route.query
      this.formData.name = data.name
      this.formData.description = data.description
      this.formData.id = data.id
      this.formData.sort = data.sort
      this.formData.url = data.url
      this.formData.icon = data.icon
      this.formData.parentId = node.parent.data.id
      this.formData.parentName = node.parent.data.name
    } else {
      api.GET(config.articleCatlgAPI)
        .then(res => {
          let obj = res.data.data
          this.iteration(obj)
          obj.push({id: 0, name: '根级菜单', label: '根级菜单', value: 0})
          this.options = obj
        })
    }
  },
  methods: {
    iteration (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] instanceof Object) {
            if (obj[key].length === 0) {
              obj[key] = null
            } else {
              this.iteration(obj[key])
            }
          }
        }
      }
    },
    submit () {
      let obj = {}
      obj.name = this.formData.name
      obj.parentId = this.formData.parentId
      obj.description = this.formData.description
      obj.sort = this.formData.sort
      obj.url = this.formData.url
      obj.icon = this.formData.icon
      if (this.isEditing) {
        obj.id = this.formData.id
      }
      api.POST(config.addArticleCatlgAPI, obj)
        .then(res => {
          if (res.status === 200 && res.data.errcode === '0000') {
            if (this.isEditing) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
              this.$router.push({
                path: '/admin/article/category'
              })
            } else {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success'
              })
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '提交失败，请重试'
            })
          }
        })
        .catch(err => {
          if (err) {
            this.$notify.error({
              title: '错误',
              message: '提交失败，请重试'
            })
          }
        })
    },
    handleChange (value) {
      console.log(value)
      this.formData.parentId = value[value.length - 1]
      console.log(this.formData.parentId)
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped></style>
