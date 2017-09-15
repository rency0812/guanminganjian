<template>
  <div class="sc-firm-component" v-if="response">
    <div class="sc-firm-header">
      <el-popover
        ref="advancedSearch"
        width="400"
        trigger="click"
        placement="bottom-end"
        >
        <el-form class="search-form" :model="form">
          <el-form-item class="advance-form-item" label="企业名称">
            <el-input v-model="form.companyName"></el-input>
          </el-form-item>
          <el-form-item class="advance-form-item" label="所属职位">
            <el-input v-model="form.dutyName"></el-input>
          </el-form-item>
          <el-form-item class="advance-form-item" label="姓名">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item class="advance-form-item" label="联系电话">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
          <el-row type="flex" justify="center">
            <el-button type="primary" @click="onAdvancedSearch">搜索</el-button>
          </el-row>
        </el-form>
      </el-popover>
      <el-row type="flex" justify="end">
        <el-col :span="5">
          <el-input v-model="form.keyword" class="sc-firm-input-search" placeholder="请输入搜索关键字"></el-input>
        </el-col>
        <el-button @click="onKeywordSearch" icon="search"></el-button>
        <el-button v-popover:advancedSearch type="primary">高级</el-button>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
    </div>
    <div class="sc-firm-content">
      <el-table
        class="sc-firm-table"
        border
        stripe
        :data="response.data">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="companyName" label="企业名称"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="dutyName" label="所属职位"></el-table-column>
        <el-table-column prop="mobile" label="联系电话"></el-table-column>
        <el-table-column prop="status" label="状态" width="120"></el-table-column>
        <el-table-column prop="createdAt" label="登记时间" width="120"></el-table-column>
        <el-table-column label="操作" width="120">
          <template scope="scope">
            <el-button size="small" icon="information" @click="onEditFirmDetail(scope.row.id)"></el-button>
            <el-button size="small" icon="delete2" @click="onDeleteFirm(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sc-firm-footer">
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
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-firm',
  data () {
    return {
      response: null,
      error: null,
      form: {
        companyName: '',
        dutyName: '',
        name: '',
        keyword: '',
        mobile: ''
      }
    }
  },
  methods: {
    onAdvancedSearch () {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.updateList(data)
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.updateList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.updateList(data)
    },
    onEditFirmDetail (id) {
      this.$router.push({
        path: '/admin/personal/detail',
        query: {
          id
        }
      })
    },
    onKeywordSearch () {
      const data = {
        ...this.form
      }
      api.GET(config.personalListAPI, data)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          this.$message.error(this.error)
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
    onDeleteFirm (id) {
      this.$confirm('是否确认删除该上报？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.personalDeleteAPI, {
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
            this.updateList(data)
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除失败'
            })
          }
        })
      })
    },
    updateList (data) {
      if (!data) {
        return
      }
      api.GET(config.personalListAPI, data)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            this.$message.error(this.error)
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
      if (!res) {
        return null
      }
      res.data.forEach(item => {
        switch (item.status) {
          case 0:
            item.status = '未审核'
            break
          case 1:
            item.status = '审核通过'
            break
          case 2:
            item.status = '审核未通过'
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
    getFirmList () {
      api.GET(config.personalListAPI)
        .then(response => {
          console.log(response)
          if (response.status !== 200) {
            this.error = response.statusText
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
    this.getFirmList()
  }
}
</script>

<style>
.sc-firm-header {
  margin: 1rem 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid lightgray;
}
.sc-firm-content {
  margin-left: 2rem;
  margin-right: 2rem;
  padding-bottom: 1rem;
}
.sc-firm-input-search .el-input {
  width: 8rem;
}
</style>
