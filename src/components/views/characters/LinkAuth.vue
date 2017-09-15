<template>
  <div class="sc-auth-role-component" v-if="linkData && unLinkData">
    <el-row type="flex" class="sc-auth-role-content">
      <el-col :span="12" class="sc-auth-link-role">
        <kobe-table>
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
              <el-col :span="7">
                <el-input v-model="linkDataForm.keyword" placeholder="请输入搜索关键字"></el-input>
              </el-col>
              <el-button @click="onLinkDataSearch" icon="search"></el-button>
            </el-row>
          </div>
          <div slot="kobe-table-content" class="kobe-table">
            <el-table
              border
              stripe
              :data="linkData.data"
              >
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="displayName" label="权限名"></el-table-column>
              <el-table-column prop="description" label="权限描述"></el-table-column>
              <el-table-column 
                width="80"
                label="操作"
                >
                <template scope="scope">
                  <el-button @click="onUnLink(scope.row.id)" type="small">解除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="linkData.count > 10" slot="kobe-table-footer" class="kobe-table-footer">
            <el-row type="flex">
              <el-col :span="12">
                <el-pagination
                  @size-change="onLinkSizeChange"
                  @current-change="onLinkCurrentChange"
                  :current-page="linkData.currentPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="linkData.pageSize"
                  :total="linkData.count"
                  layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </kobe-table>
      </el-col>

      <el-col :span="12" class="sc-auth-unlink-role">
        <kobe-table>
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
              <el-col :span="7">
                <el-input v-model="unLinkDataForm.keyword" placeholder="请输入搜索关键字"></el-input>
              </el-col>
              <el-button @click="onUnLinkDataSearch" icon="search"></el-button>
            </el-row>
          </div>
          <div slot="kobe-table-content" class="kobe-table">
            <el-table
              border
              stripe
              :data="unLinkData.data"
              >
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="displayName" label="权限名"></el-table-column>
              <el-table-column prop="description" label="权限描述"></el-table-column>
              <el-table-column 
                width="80"
                label="操作"
                >
                <template scope="scope">
                  <el-button @click="onLink(scope.row.id)" type="small">关联</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="unLinkData.count > 10" slot="kobe-table-footer" class="kobe-table-footer">
            <el-row type="flex">
              <el-col :span="12">
                <el-pagination
                  @size-change="onUnLinkSizeChange"
                  @current-change="onUnLinkCurrentChange"
                  :current-page="unLinkData.currentPage"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="unLinkData.pageSize"
                  :total="unLinkData.count"
                  layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </kobe-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  name: 'sc-auth-role',
  data () {
    return {
      id: this.$route.query.id,
      error: null,
      linkData: null,
      unLinkData: null,
      linkDataForm: {
        keyword: ''
      },
      unLinkDataForm: {
        keyword: ''
      }
    }
  },
  methods: {
    onLinkDataSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.linkData.pageSize,
        ...this.linkDataForm
      }
      this.getLinkData(data)
    },
    onUnLinkDataSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.unLinkData.pageSize,
        ...this.unLinkDataForm
      }
      this.getUnlinkData(data)
    },
    onLink (id) {
      api.POST(config.role.linkAuth, {
        roles: [this.id],
        permissions: [id]
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.getLinkData()
          this.getUnlinkData()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onUnLink (id) {
      api.POST(config.role.unLinkAuth, {
        roles: [this.id],
        permissions: [id]
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.getLinkData()
          this.getUnlinkData()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onLinkSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.linkData.currentPage,
        ...this.linkDataForm
      }
      this.getLinkData(data)
    },
    onLinkCurrentChange (value) {
      const data = {
        pageSize: this.linkData.pageSize,
        currentPage: value,
        ...this.linkDataForm
      }
      this.getLinkData(data)
    },
    getLinkData (data = {}) {
      api.GET(config.role.relatedAuth, {
        roleId: this.id,
        ...data
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }
        if (response.data.errcode === '0000') {
          this.linkData = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onUnLinkSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.unLinkData.currentPage,
        ...this.unLinkDataForm
      }
      this.getUnlinkData(data)
    },
    onUnLinkCurrentChange (value) {
      const data = {
        pageSize: this.unLinkData.pageSize,
        currentPage: value,
        ...this.unLinkDataForm
      }
      this.getUnlinkData(data)
    },
    getUnlinkData (data = {}) {
      api.GET(config.role.unrelatedAuth, {
        roleId: this.id,
        ...data
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }
        if (response.data.errcode === '0000') {
          this.unLinkData = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getLinkData()
    this.getUnlinkData()
  }
}
</script>

<style>
.sc-auth-link-role {
  border-right: 1px solid lightgray;
}
.sc-auth-role-content {
  margin-top: 1rem;
}
</style>
