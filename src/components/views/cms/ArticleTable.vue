<template>
  <div v-if="response" class="sc-article-table">
    <div class="sc-article-table-header">
      <el-popover
        ref="advancedSearch"
        width="400"
        trigger="click"
        placement="bottom-end"
        >
        <el-form class="search-form" :model="searchForm">
          <el-form-item class="advance-form-item" label="ID">
            <el-input v-model="searchForm.id"></el-input>
          </el-form-item>
          <el-form-item class="advance-form-item" label="文章标题">
            <el-input v-model="searchForm.title"></el-input>
          </el-form-item>
          <el-form-item class="advance-form-item" label="作者">
            <el-input v-model="searchForm.author"></el-input>
          </el-form-item>
          <el-form-item class="advance-form-item" label="创建时间">
            <el-row type="flex">
              <el-date-picker type="datetime" placeholder="开始日期" v-model="searchForm.startTime"></el-date-picker>
              <el-date-picker type="datetime" placeholder="结束日期" v-model="searchForm.endTime"></el-date-picker>
            </el-row>
          </el-form-item>
          <el-row type="flex">
            <el-form-item class="advance-form-item">
              <el-cascader
                expand-trigger="hover"
                :options="articleCatlg"
                clearable
                @change="handleCatlgChange">
              </el-cascader>
            </el-form-item>
          </el-row>
          <el-row type="flex" justify="center">
            <el-form-item>
              <el-col :span="10">
                <el-button class="button-search" type="primary" @click="onAdvancedSearch">搜索</el-button>
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </el-popover>
      <el-row type="flex" justify="end">
        <el-col :span="5">
          <el-input class="input-keyword" v-model="searchForm.keyword" placeholder="请输入关键字"></el-input>
        </el-col>
        <el-button icon="search" @click="onSearch"></el-button>
        <el-button v-popover:advancedSearch type="primary">高级</el-button>
        <el-button class="ion-paper-airplane" type="primary" @click="onPublish">发布</el-button>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
    </div>
    <div class="sc-article-table-content">
      <el-table :data="response.data" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="文章标题" min-width="100"></el-table-column>
        <el-table-column prop="category.displayName" label="类别" width="100"></el-table-column>
        <el-table-column prop="author" label="发布者"></el-table-column>
        <el-table-column prop="createdAt" label="发布时间"></el-table-column>
        <el-table-column prop="click" label="点击量" width="100px"></el-table-column>
        <el-table-column prop="state" label="状态" width="120px"></el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button size="small" icon="information" @click="toArticleDetail(scope.row.id)"></el-button>
            <el-button size="small" icon="edit" @click="onEditArticle(scope.row.id)"></el-button>
            <el-button size="small" icon="delete2" @click="onDeleteArticle(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sc-article-table-footer">
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
  name: 'sc-article-table',
  data () {
    return {
      response: null,
      articleCatlg: [],
      searchForm: {
        id: '',
        title: '',
        author: '',
        startTime: '',
        endTime: '',
        categoryId: '',
        keyword: ''
      },
      error: null
    }
  },
  computed: {
  },
  methods: {
    onAdvancedSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.searchForm
      }
      this.updateArticleList(data)
    },
    onSearch () {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: this.response.pageSize,
        ...this.searchForm
      }
      this.updateArticleList(data)
    },
    handleCatlgChange (value) {
      this.searchForm.categoryId = value[value.length - 1]
    },
    handleSizeChange (value) {
      this.updateArticleList({
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.searchForm
      })
    },
    handleCurrentChange (value) {
      this.updateArticleList({
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.searchForm
      })
    },
    onPublish () {
      this.$router.push({
        path: '/admin/article/add'
      })
    },
    onEditArticle (id) {
      this.$router.push({
        path: '/admin/article/add',
        query: {
          id: id
        }
      })
    },
    transformSearhForm (data) {
      if (data.startTime && data.startTime !== '') {
        const start = new Date(data.startTime.toString()).getTime()
        data.startTime = start
      }
      if (data.endTime && data.endTime !== '') {
        const end = new Date(data.endTime.toString()).getTime()
        data.endTime = end
      }
      return data
    },
    toArticleDetail (id) {
      this.$router.push({
        path: '/admin/article/detail',
        query: {
          id: id
        }
      })
    },
    onDeleteArticle (id) {
      this.$confirm('是否确认删除该篇文章？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.deleteArticleAPI, {
          id: id
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            let data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.searchForm
            }
            this.updateArticleList(data)
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除失败'
            })
          }
        })
      })
    },
    transformData (res) {
      res.data.forEach(item => {
        switch (item.state) {
          case 0:
            item.state = '未审核'
            break
          case 1:
            item.state = '审核通过'
            break
          case 2:
            item.state = '审核未通过'
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
    updateArticleList (object) {
      const data = this.transformSearhForm(object)
      api.GET(config.articleAPI, data)
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
    // Get Article List
    getArticleList () {
      api.GET(config.articleAPI)
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
    // Get Article Category List
    getArticleCatlg () {
      api.GET(config.articleCatlgAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            this.$message.error(this.error)
            return
          }

          if (response.data.errcode === '0000') {
            const data = response.data.data
            this.articleCatlg = this.transformCatlgList(data)
          }
          this.$store.commit('SET_ARTICLE_CATLG', this.articleCatlg)
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    transformCatlgList (data) {
      let object = []
      data.forEach(item => {
        let category = {}
        category.value = item.id
        category.label = item.displayName
        if (item.children.length !== 0) {
          const children = this.transformCatlgList(item.children)
          category.children = children
        } else {
          category.children = null
        }
        object.push(category)
      })

      return object
    }
  },
  components: {
  },
  mounted () {
    this.getArticleList()
    this.getArticleCatlg()
  }
}
</script>

<style>
.sc-article-table-header {
  margin: 1rem 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid lightgray;
}
.sc-article-table-content {
  margin-left: 2rem;
  margin-right: 2rem;
  padding-bottom: 1rem;
}
.search-form {
  border: 1px solid lightgray;
  margin-bottom: 10px;
}
.advance-form-item {
  font-size: 12px;
  margin: 10px;
  padding: 0;
}
.search-form .el-form-item label {
  margin: 0;
  padding: 0;
  font-size: 12px;
}
</style>
