<template>
  <div class="sc-orga-table">
    <el-button class="orga-add-button" @click="addMenu" type="primaty">新增组织</el-button>
    <el-tree :data="data" :props="defaultProps" node-key="id" accordion :expand-on-click-node="false" :render-content="renderContent">
    </el-tree>
    <el-dialog title="提示" v-model="deleteVisible" size="tiny">
      <span>确认要删除该组织吗？(将删除所有的子组织)</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="danger" @click="deleteCategory">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="isEditing? '编辑' : '新增'" v-model="addVisible" size="tiny">
      <el-form labelPosition="right" label-width="90px">
        <el-form-item label="父级部门" required>
          <el-cascader :options="options" change-on-select :props="props" @change="handleChange" v-model="formData.valueList" v-if="!isEditing"></el-cascader>
          <el-input v-else v-model="formData.parentName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" required>
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-row type="flex" justify="space-around">
          <el-button type="primary" @click="addSubmit" size="large">提交</el-button>
          <el-button @click="back" size="large">返回</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      newCategory: '',
      newMenu: '',
      deleteVisible: false,
      addVisible: false,
      deletedId: '',
      options: [],
      props: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      formData: {
        id: 0,
        name: '',
        parentId: 0,
        valueList: [],
        parentName: ''
      },
      rules: {
        valueList: [
          { required: true, message: '请选择父级节点', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入节点名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    iteration(obj) {
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
    clearFormData() {
      let obj = this.formData
      for (let key in obj) {
        if (key === 'id' || key === 'parentId') {
          obj[key] = 0
        } else if (key === 'valueList') {
          obj[key] = []
        } else {
          obj[key] = ''
        }
      }
      this.formData = obj
    },
    getList() {
      api.GET(config.orgaListAPI)
        .then(res => {
          let obj = res.data.data.data
          this.iteration(obj)
          obj.push({ id: 0, name: '根级菜单', label: '根级菜单', value: 0 })
          this.options = obj
        })
    },
    addMenu() {
      this.clearFormData()
      this.isEditing = false
      this.addVisible = true
    },
    detail(node, store, data) {
      this.$router.push({ path: '/admin/organization/duty', query: { id: data.id } })
    },
    relate(node, store, data) {
      this.$router.push({ path: '/admin/organization/link', query: { id: data.id } })
    },
    edit(node, store, data) {
      console.log(node, store, data)
      this.isEditing = true
      if (Array.isArray(node.parent.data)) {
        this.formData.parentName = '根级目录'
      } else {
        this.formData.parentName = node.parent.data.name
        this.formData.parentId = node.parent.data.id
      }
      this.formData.name = data.name
      this.formData.id = data.id
      this.addVisible = true
    },
    remove(store, data) {
      this.deleteVisible = true
      this.deletedId = data.id
    },
    back() {
      this.isEditing = true
      this.addVisible = false
    },
    getData() {
      api.GET(config.orgaListAPI)
        .then(res => {
          console.log(res.data, 'config')
          this.data = res.data.data.data
        })
    },
    deleteCategory() {
      api.POST(config.removeOrgaAPI, { id: this.deletedId })
        .then(res => {
          if (res.data.errcode === '0000') {
            this.deleteVisible = false
            this.$notify({
              title: '删除',
              message: '删除成功',
              type: 'success'
            })
            this.getData()
            this.getList()
          }
        })
    },
    handleChange(value) {
      this.formData.parentId = value[value.length - 1]
    },
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
          <span style="float: right; margin-right: 20px">
            <el-button size="mini" on-click={() => this.detail(node, store, data)}>详情</el-button>
            <el-button size="mini" on-click={() => this.relate(node, store, data)}>关联</el-button>
            <el-button size="mini" on-click={() => this.edit(node, store, data)}>编辑</el-button>
            <el-button size="mini" on-click={() => this.remove(store, data)}>删除</el-button>
          </span>
        </span>)
    },
    addSubmit() {
      let obj = {}
      obj.name = this.formData.name
      obj.parentId = this.formData.parentId
      if (this.isEditing) {
        obj.id = this.formData.id
      }
      let url = this.isEditing ? config.editOrgaAPI : config.addOrgaAPI
      api.POST(url, obj)
        .then(res => {
          if (res.status === 200 && res.data.errcode === '0000') {
            if (this.isEditing) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
              this.isEditing = false
              this.addVisible = false
              this.getData()
            } else {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success'
              })
              this.isEditing = false
              this.addVisible = false
              this.getData()
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
    }
  },
  mounted() {
    this.getData()
    this.getList()
  }
}
</script>

<style scoped>
.sc-orga-table {
  margin-top: 2rem;
  border-top: 1px solid lightgray;
  padding: 2rem 4rem;
}

.orga-add-button {
  margin-bottom: 1rem;
}
</style>
