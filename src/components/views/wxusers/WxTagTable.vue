<template>
  <kobe-table v-if="response">
    <div class="kobe-table-header" slot="kobe-table-header">
      <el-row
        type="flex"
        justify="end"
        >
        <el-col :span="5">
          <el-input placeholder="请输入搜索关键字" v-model="form.name"></el-input>
        </el-col>
        <el-button @click="onSearch" icon="search"></el-button>
        <el-button @click="addTag" type="primary">新增</el-button>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
    </div>
    <div class="kobe-table" slot="kobe-table-content">
      <el-table
        :data="response.data"
        border
        stripe
        >
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="标签组名称"></el-table-column>
        <el-table-column prop="count" label="用户数"></el-table-column>
        <el-table-column prop="username" label="创建人"></el-table-column>
        <el-table-column 
          width="260"
          label="操作"
          >
          <template scope="scope">
            <el-button @click="editTag(scope.row.id)" size="small" icon="edit"></el-button>
            <el-button @click="deleteTag(scope.row.id)" size="small" icon="delete2"></el-button>
            <el-button @click="toTagInfo(scope.row.id, scope.row.name)" size="small" icon="information"></el-button>
            <el-button @click="toLinkUser(scope.row.id)" size="small">关联用户</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改标签组名称" v-model="showDialog">
        <el-form :model="updateForm">
          <el-form-item label="标签组名称" :label-width="'120px'">
            <el-input placeholder="请输入新的标签名" v-model="updateForm.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="updateTag">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="kobe-table-footer" slot="kobe-table-footer">
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
  name: 'sc-wechat-tag-table',
  data () {
    return {
      response: null,
      error: null,
      showDialog: false,
      selectedTag: null,
      form: {
        name: ''
      },
      updateForm: {
        name: ''
      }
    }
  },
  methods: {
    toLinkUser (id) {
      this.$router.push({
        path: '/admin/wxuser/link',
        query: {
          id: id
        }
      })
    },
    onSearch () {
      api.GET(config.wxUserGroupListAPI, this.form)
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
    },
    toTagInfo (id, name) {
      this.$router.push({
        path: '/admin/wxuser/user',
        query: {
          id: id,
          name: name
        }
      })
    },
    updateTag () {
      if (this.updateForm.name === '') {
        this.$message.error('请输入标签组名')
        return
      }
      api.GET(config.wxUserGroupCheckAPI, {
        name: this.updateForm.name
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(this.response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          if (response.data.data === true) {
            this.changeTagName(this.updateForm.name)
          } else {
            this.$message.error('名字有冲突')
          }
        }
      })
    },
    editTag (id) {
      this.showDialog = true
      this.selectedTag = id
    },
    addTag () {
      this.$router.push({
        path: '/admin/wxuser/add'
      })
    },
    changeTagName (tag) {
      api.POST(config.wxUserGroupUpdateAPI, {
        name: tag,
        id: this.selectedTag
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          this.showDialog = false
          this.$notify({
            title: '成功',
            message: '修改标签成功',
            type: 'success'
          })
          const data = {
            currentPage: this.response.currentPage,
            pageSize: this.response.pageSize,
            ...this.form
          }
          this.updateTagList(data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    deleteTag (id) {
      this.$confirm('是否确认该标签组', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.wxUserGroupDeleteAPI, {
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
            this.updateTagList(data)
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
        ...this.form
      }
      this.updateTagList(data)
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.updateTagList(data)
    },
    updateTagList (data) {
      api.GET(config.wxUserGroupListAPI, data)
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
    },
    getTagList () {
      api.GET(config.wxUserGroupListAPI)
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
    this.getTagList()
  }
}
</script>

<style>
</style>
