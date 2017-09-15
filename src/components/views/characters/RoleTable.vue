<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input v-model="form.keyword" placeholder="请输入搜索关键字"></el-input>
        </el-col>
        <el-button @click="onSearch" icon="search"></el-button>
        <el-button @click="showAddDialog" icon="plus"></el-button>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
      <el-dialog title="添加新角色" v-model="addDialog">
        <el-form :form="addForm" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="addForm.displayName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addForm.description"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="end">
          <el-button @click="addRole" type="primary">确定</el-button>
        </el-row>
      </el-dialog>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table
        border
        stripe
        :data="response.data"
        >
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="type" label="类型" width="80"></el-table-column>
        <el-table-column prop="displayName" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="角色描述"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>
        <el-table-column 
          width="320"
          label="操作"
          >
          <template scope="scope">
            <el-button @click="showEditDialog(scope.row.id, scope.row.displayName, scope.row.description)" size="small" icon="edit"></el-button>
            <el-button @click="deleteRole(scope.row.id)" size="small" icon="delete2"></el-button>
            <el-button @click="getRelatedUser(scope.row.id)" size="small" icon="information"></el-button>
            <el-button @click="relateUser(scope.row.id)" size="small">关联用户</el-button>
            <el-button @click="relateAuth(scope.row.id)" size="small">权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改角色" v-model="editDialog">
        <el-form :form="editForm" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="editForm.displayName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="end">
          <el-button @click="editRole" type="primary">修改</el-button>
        </el-row>
      </el-dialog>
    </div>
    <div slot="kobe-table-footer" class="kobe-table-footer">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="response.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="response.pageSize"
            :total="response.count"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </kobe-table>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-role-table',
  data () {
    return {
      response: null,
      error: null,
      addDialog: false,
      editDialog: false,
      addForm: {
        displayName: '',
        description: ''
      },
      editForm: {
        id: '',
        displayName: '',
        description: ''
      },
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    onSearch () {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.updateRoleList(data)
    },
    showAddDialog () {
      this.addDialog = true
    },
    showEditDialog (id, name, description) {
      this.editForm.id = id
      this.editForm.displayName = name
      this.editForm.description = description
      this.editDialog = true
    },
    editRole () {
      api.POST(config.roleUpdateAPI, this.editForm)
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          this.editDialog = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
          const data = {
            currentPage: 1,
            pageSize: this.response.pageSize,
            ...this.form
          }
          this.updateRoleList(data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    addRole () {
      if (this.addForm.displayName === '' || this.addForm.description === '') {
        this.$message({
          type: 'info',
          message: '请填写正确的信息'
        })
        return
      }
      this.addDialog = false
      api.POST(config.roleCreateAPI, this.addForm)
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success'
          })
          const data = {
            currentPage: 1,
            pageSize: this.response.pageSize,
            ...this.form
          }
          this.updateRoleList(data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    relateAuth (id) {
      this.$router.push({
        path: '/admin/role/auth',
        query: {
          id: id
        }
      })
    },
    getRelatedUser (id) {
      this.$router.push({
        path: '/admin/role/user',
        query: {
          id: id
        }
      })
    },
    relateUser(id) {
      this.$router.push({
        path: '/admin/role/link',
        query: {
          id: id
        }
      })
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.updateRoleList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.updateRoleList(data)
    },
    transformData (res) {
      res.data.forEach(item => {
        if (item.createdAt) {
          let date = new Date(item.createdAt)
          const month = date.getMonth() + 1
          item.createdAt = `${date.getFullYear()}-${month}-${date.getDate()}`
        }
      })
      return res
    },
    updateRoleList (data) {
      api.GET(config.roleListAPI, data)
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          this.response = this.transformData(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    deleteRole (id) {
      this.$confirm('是否删除该角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(response => {
        api.POST(config.roleDeleteAPI, {
          id: id
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.form
            }
            this.updateRoleList(data)
          }
        })
      })
    },
    getRoleList () {
      api.GET(config.roleListAPI)
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          this.response = this.transformData(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getRoleList()
  }
}
</script>

<style>
</style>
