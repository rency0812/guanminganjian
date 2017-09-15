<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row
        type="flex"
        justify="end"
        >
        <el-col :span="5">
          <el-input placeholder="请输入搜索关键字" v-model="form.keyword"></el-input>
        </el-col>
        <el-button @click="onSearch" icon="search"></el-button>
        <router-link class="add-user-link add" to="/admin/user/add">
            <el-button type="primary" icon="plus"></el-button>
        </router-link>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table
        :data="response.data"
        border
        stripe
        >
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column
          label="用户头像/昵称"
          width="180"
          >
          <template scope="scope">
            <img class="user-img-avatar" :src="scope.row.avatar" alt="头像">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column 
          width="180"
          label="操作"
          >
          <template scope="scope">
          	<el-button size="small" icon="information" @click="onUserDetail(scope.row.id)"></el-button>
            <el-button @click="onDeleteUser(scope.row.id)" size="small" icon="delete2"></el-button>
            <el-button size="small" @click="onUserRole(scope.row.id)">角色</el-button>
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
import config from 'src/config'
import api from 'src/api'

export default {
  name: 'sc-user-table',
  data () {
    return {
      form: {
        keyword: ''
      },
      response: null,
      error: null
    }
  },
  methods: {
    onUserRole (id) {
      this.$router.push({
        path: '/admin/user/role',
        query: {
          id: id
        }
      })
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.updateUserList(data)
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.updateUserList(data)
    },
    handleCurrentChange (value) {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.form
      }
      this.updateUserList(data)
    },
    onDeleteUser (id) {
      this.$confirm('是否确认该用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.users.deleteUser, {
          id: id
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$message({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.form
            }
            this.updateUserList(data)
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    onUserDetail (id) {
      this.$router.push({
        path: '/admin/user/detail',
        query: {
          id
        }
      })
    },
    updateUserList (data) {
      api.GET(config.userListAPI, data)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.response = response.data.data
            this.response.data.forEach(item => {
              if (item.community && item.subDistrictName) {
                item.address = `${item.community}/${item.subDistrictName}`
              }
            })
          } else {
            this.$message.error('发生了错误，请重试')
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    transformData (data) {
      let object = []
      data.forEach(item => {
        let category = {}
        category.value = item.id
        category.label = item.name
        if (item.children && item.children.length !== 0) {
          const children = this.transformData(item.children)
          category.children = children
        } else {
          category.children = null
        }
        object.push(category)
      })

      return object
    },
    getUserList () {
      api.GET(config.userListAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.response = response.data.data
            // console.log(this.response)
            this.response.data.forEach(item => {
              if (item.community && item.subDistrictName) {
                item.address = `${item.community}/${item.subDistrictName}`
              }
            })
          } else {
            this.$message.error('发生了错误，请重试')
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

<style scoped>
.user-img-avatar {
  margin-top: 5px;
  margin-bottom: 5px;
  width: 56px;
  height: 56px;
}
.add{
	margin-left: 10px;
	margin-right: 10px;
}
</style>
