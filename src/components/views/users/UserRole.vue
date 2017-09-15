<template>
  <div class="sc-user-role-component" v-if="linkData && unLinkData">
    <el-row type="flex" class="sc-user-role-content">
      <el-col :span="12" class="sc-user-link-role">
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
              <el-table-column prop="displayName" label="角色名"></el-table-column>
              <el-table-column prop="description" label="角色描述"></el-table-column>
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
            <el-row type="flex" justify="center">
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

      <el-col :span="12" class="sc-user-unlink-role">
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
              <el-table-column prop="displayName" label="角色名"></el-table-column>
              <el-table-column prop="description" label="角色描述"></el-table-column>
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
            <el-row type="flex" justify="center">
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
  name: 'sc-user-role',
  data () {
    return {
      id: this.$route.query.id,
      error: null,
      response: null,
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
    onUnLink (id) {
      api.POST(config.users.unlinkRole, {
        users: [this.id],
        roles: [id]
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
    onLink (id) {
      api.POST(config.users.linkRole, {
        users: [this.id],
        roles: [id]
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
    getLinkData (data = {}) {
      api.GET(config.users.relatedRole, {
        userId: this.id,
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
    getUnlinkData (data = {}) {
      api.GET(config.users.unrelatedRole, {
        userId: this.id,
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
