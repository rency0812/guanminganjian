<template>
  <kobe-table v-if="response && streetList">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="space-around">
        <el-col :span="13">
          <el-cascader
            expand-trigger="hover"
            :options="streetList"
            v-model="selectedStreet"
            @change="changeStreet"
            placeholder="街道社区"
            clearable
            >
          </el-cascader>
          <el-select
            v-model="form.industryId"
            placeholder="行业"
            @change="onSearch"
            clearable
            >
            <el-option
              v-for="item in industryList"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input v-model="form.param" placeholder="请输入昵称、姓名、企业名称进行搜索"></el-input>
        </el-col>
        <el-button @click="onSearch" icon="search"></el-button>
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
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column prop="industry" label="行业"></el-table-column>
        <el-table-column prop="company" label="企业名称"></el-table-column>
        <el-table-column prop="workspace" label="街道社区"></el-table-column>
        <el-table-column 
          width="80"
          label="操作"
          >
          <template scope="scope">
            <el-button @click="linkUser(scope.row.id)" size="small">关联</el-button>
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
  name: 'sc-wxuser-link',
  data () {
    return {
      tagId: this.$route.query.id,
      streetList: null,
      selectedStreet: [],
      industryList: null,
      response: null,
      error: null,
      form: {
        streetId: '',
        industryId: '',
        param: ''
      }
    }
  },
  methods: {
    linkUser (id) {
      let userIds = [id]
      const data = {
        userIds: userIds,
        tagId: this.tagId
      }
      api.POST(config.wxUserGroupLinkAPI, data)
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          this.$message({
            message: '关联用户成功',
            type: 'success'
          })
          const data = {
            pageSize: this.response.pageSize,
            currentPage: this.response.currentPage,
            ...this.form
          }
          this.updateUserList(data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    changeStreet () {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: this.response.pageSize,
        ...this.form
      }
      data.streetId = this.selectedStreet[this.selectedStreet.length - 1]
      this.updateUserList(data)
    },
    onSearch () {
      const data = {
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.updateUserList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
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
    changeStreetData (data) {
      let object = []
      data.forEach(item => {
        let category = {}
        category.value = item.id
        category.label = item.name
        if (item.children && item.children.length !== 0) {
          const children = this.changeStreetData(item.children)
          category.children = children
        } else {
          category.children = null
        }
        object.push(category)
      })

      return object
    },
    transformData (res) {
      res.data.forEach(item => {
        if (item.community && item.subDistrictName) {
          item.workspace = `${item.community}/${item.subDistrictName}`
        }
      })
      return res
    },
    updateUserList (data) {
      api.GET(config.wxUserGroupReUserAPI, {
        tagId: this.$route.query.id,
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
    getIndustryList () {
      api.GET(config.wxUserIndustryAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.industryList = response.data.data
            this.industryList.forEach(item => {
              item.label = item.name
              item.value = item.id
            })
          } else {
            this.$message.error('发生了错误，请重试')
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    getUserList () {
      api.GET(config.wxUserGroupReUserAPI, {
        tagId: this.$route.query.id
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
    getStreetList () {
      api.GET(config.wxUserStreetAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.streetList = this.changeStreetData(response.data.data)
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
    this.getStreetList()
    this.getIndustryList()
  }
}
</script>

<style>
</style>
