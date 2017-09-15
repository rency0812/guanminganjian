<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input placeholder="请输入id、职位名进行搜索" v-model="keyword"></el-input>
        </el-col>
        <el-button icon="search" @click="onSearch"></el-button>
      </el-row>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table :data="response.data" border stripe>
        <el-table-column prop="name" label="职位"></el-table-column>
        <el-table-column prop="description" label="职位描述"></el-table-column>
        <el-table-column label="创建时间">
          <template scope="scope">
            {{scope.row.createdAt | toDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button @click="relate(scope.row.id)" size="small" :disabled="btnDisabled">关联</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      query: {
        orgaId: ''
      },
      btnDisabled: false,
      keyword: ''
    }
  },
  methods: {
    getOrgaId() {
      this.query.orgaId = this.$route.query.id
    },
    getList() {
      const obj = { organizationId: this.query.orgaId }
      api.GET(config.dutyUnrelated, obj)
        .then(res => {
          if (res.status === 200 && res.data.errcode === '0000') {
            this.response = res.data.data
            console.log(this.response)
          }
        })
    },
    onSearch() {
      const obj = {
        organizationId: parseInt(this.query.orgaId),
        currentPage: this.response.currentPage,
        pageSize: this.response.pageSize,
        keyword: this.keyword
      }
      console.log(obj)
      this.updateUserList(obj)
    },
    updateUserList(obj) {
      api.GET(config.dutyUnrelated, obj)
        .then(res => {
          if (res.status === 200 && res.data.errcode === '0000') {
            this.response = res.data.data
            console.log(this.response)
          }
        })
    },
    relate(id) {
      this.btnDisabled = true
      let obj = {
        positions: [],
        organizations: []
      }
      obj.positions.push(id)
      obj.organizations.push(parseInt(this.query.orgaId))
      console.log(config.createRelateAPI, obj)
      api.POST(config.createRelateAPI, obj)
        .then(res => {
          if (res.status === 200 && res.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '关联成功',
              type: 'success'
            })
            this.getList()
            this.btnDisabled = false
          }
        })
    },
    handleSizeChange(value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.updateUserList(data)
    },
    handleCurrentChange(value) {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.form
      }
      this.updateUserList(data)
    }
  },
  mounted() {
    this.getList()
  },
  created() {
    this.getOrgaId()
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
