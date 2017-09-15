<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-popover
        ref="advancedSearch"
        width="400"
        trigger="click"
        placement="bottom-end"
        >
        <el-form class="search-form" :model="searchForm" label-position="top">
          <el-form-item label="受理号">
            <el-input v-model="searchForm.acceptNo"></el-input>
          </el-form-item>
            <el-form-item label="举报人">
              <el-input v-model="searchForm.reportName"></el-input>
            </el-form-item>
            <el-form-item label="隐患单位">
              <el-input v-model="searchForm.hiddenUnit"></el-input>
            </el-form-item>
            <el-row type="flex">
              <el-col :span="12">
                <el-form-item label="案件分类">
                  <el-select class="catlg-select" placeholder="案件分类" v-model="searchForm.catlgId" clearable>
                    <el-option 
                      v-for="item in caseCatlg"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="案件状态">
                  <el-select class="status-select" placeholder="案件状态" v-model="searchForm.status" clearable>
                    <el-option
                      v-for="item in caseStatusCatlg"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="创建时间">
              <el-date-picker type="datetime" placeholder="开始日期" v-model="searchForm.startTime"></el-date-picker>
              <el-date-picker type="datetime" placeholder="结束日期" v-model="searchForm.endTime"></el-date-picker>
            </el-form-item>
        </el-form>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="onAdvancedSearch">确定</el-button>
        </el-row>
      </el-popover>
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input v-model="searchForm.keyword" placeholder="请输入受理号,举报人,隐患单位关键字" class="sc-table-header-select"></el-input>
        </el-col>
        <el-button class="sc-table-search-btn" @click="onKeywordSearch" icon="search"></el-button>
        <el-button type="primary" v-popover:advancedSearch>高级</el-button>
        <el-button type="primary" icon="upload2"></el-button>
        <el-button type="primary" icon="setting"></el-button>
      </el-row>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table :data="response.data" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="acceptNo" label="受理号" min-width="90"></el-table-column>
        <el-table-column prop="reportName" label="举报人" width="80"></el-table-column>
        <el-table-column prop="catlgName" label="案件分类" min-width="90"></el-table-column>
        <el-table-column prop="hiddenUnit" label="隐患单位" width="100"></el-table-column>
        <el-table-column prop="address" label="事发地址" min-width="180"></el-table-column>
        <el-table-column prop="description" label="案件描述" min-width="200"></el-table-column>
        <el-table-column prop="createdAt" label="举报时间" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="80"></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template scope="scope">
            <el-button size="small" icon="information" @click="selectCase(scope.row)"></el-button>
            <el-button size="small" icon="circle-cross" @click="shieldReport(scope.row.id)"></el-button>
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
  name: 'sc-report-table',
  data () {
    return {
      selectedCatlg: '',
      caseCatlg: [],
      searchForm: {
        keyword: '',
        status: '',
        acceptNo: '',
        reportName: '',
        hiddenUnit: '',
        selectedCatlg: '',
        startTime: '',
        catlgId: '',
        endTime: ''
      },
      response: null,
      error: null
    }
  },
  computed: {
    caseStatusCatlg () {
      return config.reportsStatusCatlg
    }
  },
  methods: {
    handleSizeChange (value) {
      let data = {
        pageSize: value,
        currentPage: this.response.currentPage,
        ...this.searchForm
      }
      this.updateCase(data)
    },
    handleCurrentChange (value) {
      let data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.searchForm
      }
      this.updateCase(data)
    },
    onAdvancedSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.searchForm
      }
      this.updateCase(data)
    },
    selectCase (object) {
      this.$store.commit('SET_CURRENT_CASE', object)
      this.$router.push({
        path: '/admin/report/detail'
      })
    },
    onKeywordSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.searchForm
      }
      this.updateCase(data)
    },
    shieldReport (id) {
      this.$confirm('是否确认屏蔽该条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.shieldCaseAPI, {
          id: id
        })
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '屏蔽成功',
              type: 'success'
            })
            let data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.searchForm
            }
            this.updateCase(data)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getCaseList () {
      api.GET(config.caseListAPI)
      .then(response => {
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
    },
    // GET Report Catlgory Request
    getCaseCatlg () {
      api.GET(config.caseCatlgAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            response.data.data.forEach(item => {
              let object = {}
              object.label = item.name
              object.id = item.id
              object.value = item.id
              this.caseCatlg.push(object)
            })
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    // Update Report List With Extra Conditions
    updateCase (form) {
      const data = this.transformSearchForm(form)
      api.GET(config.caseListAPI, data)
      .then(response => {
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
    },
    // Transform Response Data
    transformData (res) {
      res.data.forEach(item => {
        switch (item.status) {
          case 1:
            item.status = '进行中'
            break
          case 2:
            item.status = '已结案'
            break
          case 3:
            item.status = '已驳回'
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
    transformSearchForm (data) {
      if (data.startTime && data.startTime !== '') {
        const start = new Date(data.startTime.toString()).getTime()
        data.startTime = start
      }
      if (data.endTime && data.endTime !== '') {
        const end = new Date(data.endTime.toString()).getTime()
        data.endTime = end
      }
      return data
    }
  },
  components: {
  },
  mounted () {
    this.getCaseList()
    this.getCaseCatlg()
  }
}
</script>

<style scoped>
  .sc-report-table {
    margin-left: 2rem;
    margin-right: 2rem;
    padding-bottom: 1rem;
  }

  .search-form {
    padding: 1rem;
  }

  .sc-report-table-header {
    margin: 1rem 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid lightgray;
  }

  .sc-report-table-content {
    margin-bottom: 20px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>
