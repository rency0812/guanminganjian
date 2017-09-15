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
      <el-dialog title="添加权限" v-model="addDialog">
        <el-form label-width="120px" :model="addForm">
          <el-form-item label="权限名">
            <el-input v-model="addForm.name" placeholder="示例:manage_dog"></el-input>
          </el-form-item>
          <el-form-item label="权限展示名">
            <el-input v-model="addForm.displayName" placeholder="示例:养犬管理员"></el-input>
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="addForm.description" placeholder="示例:犬只管理的权限"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="end">
          <el-button @click="addAuth" type="primary">确定</el-button>
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
        <el-table-column prop="displayName" label="权限名称"></el-table-column>
        <el-table-column prop="description" label="权限描述"></el-table-column>
        <el-table-column 
          width="250"
          label="操作"
          >
          <template scope="scope">
            <el-button @click="onEdit(scope.row.id, scope.row.displayName, scope.row.description, scope.row.name)" type="small" icon="edit"></el-button>
            <el-button @click="onDelete(scope.row.id)" type="small" icon="delete2"></el-button>
            <el-button @click="onMenuLink(scope.row.id)" type="small">菜单</el-button>
            <el-button @click="onRoleLink(scope.row.id)" type="small">角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改权限" v-model="editDialog">
        <el-form label-width="120px" v-model="editForm">
          <el-form-item label="权限展示名">
            <el-input v-model="editForm.displayName"></el-input>
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="end">
          <el-button @click="editAuth" type="primary">确定</el-button>
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
  name: 'sc-auth-table',
  data () {
    return {
      addDialog: false,
      editDialog: false,
      response: null,
      error: null,
      form: {
        keyword: ''
      },
      addForm: {
        name: '',
        displayName: '',
        description: ''
      },
      editForm: {
        id: '',
        name: '',
        displayName: '',
        description: ''
      }
    }
  },
  methods: {
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    showAddDialog () {
      this.addDialog = true
    },
    onMenuLink (id) {
      this.$router.push({
        path: '/admin/auth/menu',
        query: {
          id: id
        }
      })
    },
    onRoleLink (id) {
      this.$router.push({
        path: '/admin/auth/role',
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
      this.getList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    onEdit (id, displayName, description, name) {
      this.editForm.id = id
      this.editForm.name = name
      this.editForm.displayName = displayName
      this.editForm.description = description
      this.editDialog = true
    },
    onDelete (id) {
      this.$confirm('是否确定删除该条权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.auth.authDelete, {
          id: id
        })
        .then(response => {
          if (response.status !== 200) {
            this.$message.error(response.statusText)
            return
          }
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
            this.getList(data)
          }
        })
      })
    },
    editAuth () {
      this.editDialog = false
      api.POST(config.auth.authUpdate, this.editForm)
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
          const data = {
            pageSize: this.response.pageSize,
            currentPage: this.response.currentPage,
            ...this.form
          }
          this.getList(data)
        } else {
          this.$message.error('发生了错误,请重试')
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    addAuth () {
      if (this.addForm.name === '' || this.addForm.displayName === '' || this.addForm.description === '') {
        this.$message({
          message: '请填写正确的信息',
          type: 'info'
        })
        return
      }
      this.addDialog = false
      api.POST(config.auth.authCreate, this.addForm)
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
            pageSize: this.response.pageSize,
            currentPage: this.response.currentPage,
            ...this.form
          }
          this.getList(data)
        } else {
          this.$message.error('发生了错误,请重试')
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getList (data = {}) {
      api.GET(config.auth.authList, data)
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          this.response = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style>
</style>
