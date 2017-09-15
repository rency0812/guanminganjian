<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="space-around">
        <el-col :span="6" class="wechat-user-group-info">
          所属流量标签组：
          {{ this.$route.query.name }}
        </el-col>
        <el-col :span="6" class="wechat-user-group-info">
          用户数：
          {{ this.count }}
        </el-col>
        <el-col :span="8">
          <el-input v-model="form.param" placeholder="请输入昵称、姓名、企业名称进行搜索"></el-input>
        </el-col>
        <el-button @click="onSearch" icon="search"></el-button>
        <el-button @click="addUser" icon="plus"></el-button>
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
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
        <el-table-column
          label="微信头像/昵称"
          width="180"
          >
          <template scope="scope">
            <img class="user-img-avatar" :src="scope.row.avatar" alt="头像">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column prop="openid" label="openid" width="280"></el-table-column>
        <el-table-column prop="realname" label="姓名" width="80"></el-table-column>
        <el-table-column prop="industry" label="行业" width="120"></el-table-column>
        <el-table-column prop="company" label="企业名称"></el-table-column>
        <el-table-column prop="workspace" label="街道社区"></el-table-column>
        <el-table-column 
          width="80"
          label="操作"
          >
          <template scope="scope">
            <el-button @click="unlinkUser(scope.row.id)" size="small" icon="delete2"></el-button>
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
  name: 'sc-wechat-tag-user-table',
  data () {
    return {
      response: null,
      error: null,
      count: null,
      form: {
        tagId: this.$route.query.id,
        param: ''
      }
    }
  },
  methods: {
    addUser () {
      this.$router.push({
        path: '/admin/wxuser/link',
        query: {
          id: this.$route.query.id
        }
      })
    },
    onSearch () {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.updateUserList(data)
    },
    unlinkUser (id) {
      this.$confirm('是否确认要将该用户从当前标签组移除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let users = [id]
        api.POST(config.wxUserGroupUserUnlinkAPI, {
          userIds: users,
          tagId: this.form.tagId
        })
        .then(response => {
          if (response.status !== 200) {
            this.$message.error(response.statusText)
            return
          }

          if (response.data.errcode === '0000') {
            this.$message({
              message: '移除用户成功',
              type: 'success'
            })
            const data = {
              currentPage: this.response.currentPage,
              pageSize: this.response.pageSize,
              ...this.form
            }
            this.updateUserList(data)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      })
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
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
    updateUserList (data) {
      api.GET(config.wxUserListAPI, data)
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
    transformData (res) {
      res.data.forEach(item => {
        if (item.community && item.subDistrictName) {
          item.workspace = `${item.community}/${item.subDistrictName}`
        }
      })
      return res
    },
    getUserList () {
      api.GET(config.wxUserListAPI, {
        tagId: this.form.tagId
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          this.response = this.transformData(response.data.data)
          this.count = this.response.count
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
.user-img-avatar {
  margin-top: 5px;
  margin-bottom: 5px;
  width: 56px;
  height: 56px;
}
.wechat-user-group-info {
  padding-top: 1rem;
  padding-left: 2rem;
  font-size: 1.5rem;
}
</style>
