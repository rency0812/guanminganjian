<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input v-model="form.keyword" placeholder="请输入搜索关键字"></el-input>
        </el-col>
        <el-button @click="onSearch" icon="search"></el-button>
        <el-button @click="showDialog" icon="plus"></el-button>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
      <el-dialog title="字典添加" v-model="showAddDialog">
        <el-form label-width="80px" :model="addForm">
          <el-form-item label="关系表">
            <el-input v-model="addForm.refer"></el-input>
          </el-form-item>
          <el-form-item label="关系列">
            <el-input v-model="addForm.refClo"></el-input>
          </el-form-item>
          <el-form-item label="关系表名">
            <el-input v-model="addForm.referName"></el-input>
          </el-form-item>
          <el-form-item label="关系列名">
            <el-input v-model="addForm.refCloName"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="end">
          <el-button @click="addDialog" type="primary">确定</el-button>
        </el-row>
      </el-dialog>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table
        :data="response.data"
        stripe
        border
        >
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="refer" label="表名"></el-table-column>
        <el-table-column prop="referName" label="表描述"></el-table-column>
        <el-table-column prop="refClo" label="列名"></el-table-column>
        <el-table-column prop="refCloName" label="列描述"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>
        <el-table-column 
          width="280"
          label="操作"
          >
          <template scope="scope">
            <el-button @click="selectDictEl(scope.row.id)" size="small" icon="information"></el-button>
            <el-button v-if="scope.row.isLock === 0" @click="lockDict(scope.row.id, 0)" size="small" icon="circle-cross"></el-button>
            <el-button v-if="scope.row.isLock === 1" @click="unLockDict(scope.row.id, 1)" size="small" icon="circle-check"></el-button>
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
  name: 'sc-dict-table',
  data () {
    return {
      response: null,
      error: null,
      showAddDialog: false,
      referName: '',
      referColName: '',
      addForm: {
        refer: '',
        referName: '',
        refClo: '',
        refCloName: ''
      },
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    showDialog () {
      this.showAddDialog = true
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.updateDictList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.updateDictList(data)
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: 10,
        ...this.form
      }
      this.updateDictList(data)
    },
    addDialog () {
      this.showAddDialog = false
      api.POST(config.dictCreateAPI, this.addForm)
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
          this.updateDictList(data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    transformData (res) {
      this.referName = res.data[0].referName
      this.referColName = res.data[0].referColName
      res.data.forEach(item => {
        switch (item.enabled) {
          case 0:
            item.enabled = '锁定'
            item.isLock = 1
            break
          case 1:
            item.enabled = '未锁定'
            item.isLock = 0
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
    updateDictList (data) {
      api.GET(config.dictListAPI, data)
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
    selectDictEl (id) {
      this.$router.push({
        path: '/admin/dict/element',
        query: {
          id: id
        }
      })
    },
    unLockDict (id, enabled) {
      this.$confirm('是否解锁该条信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(response => {
        api.POST(config.dictDeleteAPI, {
          id: id,
          enabled: enabled
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '解锁成功',
              type: 'success'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.form
            }
            this.updateDictList(data)
          }
        })
      })
    },
    lockDict (id, enabled) {
      this.$confirm('是否锁定该条信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(response => {
        api.POST(config.dictDeleteAPI, {
          id: id,
          enabled: enabled
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '锁定成功',
              type: 'success'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.form
            }
            this.updateDictList(data)
          }
        })
      })
    },
    getDictList () {
      api.GET(config.dictListAPI)
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
    this.getDictList()
  }
}
</script>

<style>
</style>
