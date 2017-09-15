<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-button @click="showDictDialog" icon="plus"></el-button>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
      <el-dialog :title="referName + refCloName" v-model="showAddDialog">
        <el-form :model="addForm" label-width="80px">
          <el-form-item label="键">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="addForm.value"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="end">
          <el-button @click="addDictEl" type="primary">确定</el-button>
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
        <el-table-column prop="name" label="键"></el-table-column>
        <el-table-column prop="value" label="值"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>
        <el-table-column prop="enabled" label="状态"></el-table-column>
        <el-table-column 
          width="180"
          label="操作"
          >
          <template scope="scope">
            <el-button @click="onEdit(scope.row.id, scope.row.name, scope.row.value)" size="small" icon="edit"></el-button>
            <el-button v-if="scope.row.isLock === 0" @click="onLock(scope.row.id, 0)" size="small" icon="circle-cross"></el-button>
            <el-button v-if="scope.row.isLock === 1" @click="onUnLock(scope.row.id, 1)" size="small" icon="circle-check"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改" v-model="showEditDialog">
        <el-form :model="editForm" label-width="80px">
          <el-form-item label="键">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="editForm.value"></el-input>
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="end">
          <el-button @click="editDictEl" type="primary">确定</el-button>
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
  name: 'sc-dict-el-table',
  data () {
    return {
      dictElID: this.$route.query.id,
      response: null,
      error: null,
      showAddDialog: false,
      showEditDialog: false,
      refer: '',
      refClo: '',
      referName: '',
      refCloName: '',
      editForm: {
        id: '',
        name: '',
        value: ''
      },
      addForm: {
        pId: this.$route.query.id,
        name: '',
        value: ''
      }
    }
  },
  methods: {
    showDictDialog () {
      this.showAddDialog = true
    },
    onEdit(id, name, value) {
      this.editForm.id = id
      this.editForm.name = name
      this.editForm.value = value
      this.showEditDialog = true
    },
    editDictEl () {
      this.showEditDialog = false
      api.POST(config.dictElUpdateAPI, this.editForm)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
          const data = {
            currentPage: this.response.currentPage,
            pageSize: this.response.pageSize
          }
          this.updateList(data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    addDictEl () {
      if (this.addForm.name === '' || this.addForm.value === '') {
        this.$message({
          type: 'info',
          message: '请填写正确字段'
        })
        return
      }
      const data = {
        refer: this.refer,
        refClo: this.refClo,
        ...this.addForm
      }
      this.showAddDialog = false
      api.POST(config.dictElCreateAPI, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success'
          })

          const data = {
            currentPage: 1,
            pageSize: this.response.pageSize
          }

          this.updateList(data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value
      }
      this.updateList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize
      }
      this.updateList(data)
    },
    transformData (res) {
      this.refer = res.data[0].refer
      this.refClo = res.data[0].refClo
      this.referName = res.data[0].referName
      this.refCloName = res.data[0].refCloName
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
    onUnLock (id, enabled) {
      this.$confirm('是否解锁该条数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(response => {
        api.POST(config.dictElDeleteAPI, {
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
              currentPage: this.response.currentPage
            }
            this.updateList(data)
          }
        })
      })
    },
    onLock (id, enabled) {
      this.$confirm('是否锁定该条数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(response => {
        api.POST(config.dictElDeleteAPI, {
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
              currentPage: this.response.currentPage
            }
            this.updateList(data)
          }
        })
      })
    },
    updateList (data) {
      api.GET(config.dictElListAPI, {
        pId: this.dictElID,
        ...data
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
    },
    getList () {
      api.GET(config.dictElListAPI, {
        pId: this.dictElID
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
    this.getList()
  }
}
</script>

<style>
</style>
