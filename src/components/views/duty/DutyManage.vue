<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input placeholder="请输入职位名进行搜索" v-model="searchForm.keyword"></el-input>
        </el-col>
        <el-button icon="search" @click="onSearch"></el-button>
        <el-button @click="addDuty">添加职位</el-button>
      </el-row>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table :data="response.data" border stripe>
        <el-table-column prop="name" label="职位"></el-table-column>
        <el-table-column prop="description" label="职位描述"></el-table-column>
        <el-table-column label="操作" prop="id">
          <template scope="scope">
            <el-button @click="editDuty(scope.row)" size="small">修改</el-button>
            <el-button @click="deleteDuty(scope.row)" size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="isEditing? '编辑' : '新增'" v-model="addVisible" size="tiny">
        <el-form labelPosition="right" label-width="90px">
          <el-form-item label="职位名" required>
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="职位描述" required>
            <el-input v-model="formData.description"></el-input>
          </el-form-item>
          <el-row type="flex" justify="space-around">
            <el-button type="primary" @click="addSubmit" size="large" :disabled="submitDisabled">提交</el-button>
            <el-button @click="back" size="large">返回</el-button>
          </el-row>
        </el-form>
      </el-dialog>
      <el-dialog title="提示" v-model="deleteVisible" size="tiny">
        <span>确认要删除该职位吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="danger" @click="deleteConfirm" :disabled="deleteDisabled">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div slot="kobe-table-footer" class="kobe-table-footer">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="response.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="response.pageSize" :total="response.count" layout="total, sizes, prev, pager, next, jumper">
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
  name: 'sc-wxuser-table',
  data() {
    return {
      response: {},
      addVisible: false,
      idEditing: false,
      formData: {
        name: '',
        description: ''
      },
      searchForm: {
        keyword: ''
      },
      deleteId: '',
      submitDisabled: false,
      deleteDisabled: false,
      deleteVisible: false
    }
  },
  methods: {
    getList() {
      api.GET(config.dutyListAPI)
        .then(res => {
          if (res.status === 200 && res.data.errcode === '0000') {
            this.response = res.data.data
            console.log(this.response)
          }
        })
    },
    onSearch() {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: this.response.pageSize,
        ...this.searchForm
      }
      console.log(data)
      this.updateUserList(data)
    },
    updateUserList(data) {
      api.GET(config.dutyListAPI, data)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.response = response.data.data
          } else {
            this.$message.error('发生了错误，请重试')
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    clearForm() {
      let obj = this.formData
      Object.keys(obj).forEach(item => {
        obj[item] = ''
      })
      this.formData = obj
    },
    addDuty() {
      this.clearForm()
      this.isEditing = false
      this.addVisible = true
    },
    editDuty(row) {
      this.isEditing = true
      this.addVisible = true
      this.formData.id = row.id
      this.formData.name = row.name
      this.formData.description = row.description
    },
    deleteDuty(row) {
      this.deleteId = row.id
      this.deleteVisible = true
    },
    deleteConfirm() {
      this.deleteDisabled = true
      api.POST(config.dutyDeleteAPI, { id: this.deleteId })
        .then(res => {
          if (res.data.errcode === '0000') {
            this.deleteVisible = false
            this.deleteDisabled = false
            this.$notify({
              title: '删除',
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.deleteDisabled = false
            this.$notify({
              title: '删除',
              message: '删除失败，请重试'
            })
          }
        })
        .catch(err => {
          if (err) {
            this.deleteDisabled = false
            this.$notify({
              title: '删除',
              message: '删除失败，请重试'
            })
          }
        })
    },
    back() {
      this.addVisible = false
    },
    handleSizeChange(value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.searchForm
      }
      this.updateUserList(data)
    },
    handleCurrentChange(value) {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.searchForm
      }
      this.updateUserList(data)
    },
    addSubmit() {
      this.submitDisabled = true
      let obj = {}
      obj.name = this.formData.name
      obj.description = this.formData.description
      if (this.isEditing) {
        obj.id = this.formData.id
      }
      let url = this.isEditing ? config.dutyUpdateAPI : config.dutyCreateAPI
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
              this.getList()
              this.submitDisabled = false
            } else {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success'
              })
              this.isEditing = false
              this.addVisible = false
              this.getList()
              this.submitDisabled = false
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '提交失败，请重试',
              type: 'error'
            })
            this.submitDisabled = false
          }
        })
        .catch(err => {
          if (err) {
            this.$notify.error({
              title: '错误',
              message: '提交失败，请重试',
              type: 'error'
            })
            this.submitDisabled = false
          }
        })
    }
  },
  mounted() {
    this.getList()
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
</style>
