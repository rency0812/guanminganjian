<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input v-model="form.keyword" placeholder="请输入搜索关键字"></el-input>
        </el-col>
        <el-button @click="onSearch" icon="search"></el-button>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table
        border
        stripe
        :data="response.data">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column
          label="微信头像/昵称"
          width="180"
          >
          <template scope="scope">
            <img class="user-img-avatar" :src="scope.row.avatar" alt="头像">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column prop="realname" label="用户" width="120"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="isLock" label="锁定" width="80"></el-table-column>
        <el-table-column 
          width="180"
          label="操作"
          >
          <template scope="scope">
            <el-button @click="unRelateUser(scope.row.id)" size="small" icon="delete2"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
  name: 'sc-role-user-table',
  data () {
    return {
      id: this.$route.query.id,
      response: null,
      error: null,
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
        roleId: this.id,
        ...this.form
      }
      this.updateUserList(data)
    },
    unRelateUser (id) {
      this.$confirm('是否确认删除该用户的角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.roleUserRelatedDeleteAPI, {
          roles: [this.id],
          users: [id]
        }).then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              roleId: this.id,
              ...this.form
            }
            this.updateUserList(data)
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        roleId: this.id,
        ...this.form
      }
      this.updateUserList(data)
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        roleId: this.id,
        ...this.form
      }
      this.updateUserList(data)
    },
    transformData (res) {
      res.data.forEach(item => {
        switch (item.isLock) {
          case 0:
            item.isLock = '未锁定'
            break
          case 1:
            item.isLock = '锁定'
            break
        }
        if (item.createdAt) {
          let date = new Date(item.createdAt)
          const month = date.getMonth() + 1
          item.createdAt = `${date.getFullYear()}-${month}-${date.getDate()}`
        }
      })
      return res
    },
    updateUserList (data) {
      api.GET(config.roleUserRelatedAPI, data)
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
    getUserList () {
      api.GET(config.roleUserRelatedAPI, {
        roleId: this.id
      })
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
    this.getUserList()
  }
}
</script>  

<style>
</style>
