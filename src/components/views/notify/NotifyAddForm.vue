<template>
  <div class="sc-notify-form-add">
    <div class="sc-notify-form-header">
      <el-steps :space="300" :active="active">
        <el-step title="配置通知"></el-step>
        <el-step title="配置模板消息"></el-step>
      </el-steps>
    </div>
    <div class="sc-notify-form-content" v-if="templates">
      <el-form 
        class="notify-form" 
        ref="notifyForm" 
        :model="notifyForm" 
        label-width="120px"
        v-if="active === 1"
        >
        <el-form-item label="通知名称" required>
          <el-input class="notify-title" v-model="notifyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模板类型" required>
          <el-select class="notify-form-select" v-model="notifyForm.templateId">
            <el-option 
              class="notify-options"
              v-for="template in templates" 
              :label="template.name"
              :value="template.templateId"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户组" required>
          <el-select class="notify-form-select" v-model="notifyForm.tags" multiple>
            <el-option
              v-for="tag in tags"
              :label="tag.name"
              :value="tag.id"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知描述" required>
          <el-input class="notify-description" type="textarea" v-model="notifyForm.description"></el-input>
        </el-form-item>
      </el-form>
      <ActiveForm
        :data="notifyForm"
        :change="updateActiveForm"
        :article="selectedArticle"
        v-if="active === 2 && activeFormData"
        >
      </ActiveForm>
    </div>
    <div class="sc-notify-form-footer">
      <div class="notify-footer-stepOne" v-if="active === 1">
        <el-button @click="stepNext" type="primary">下一步</el-button>
      </div>
      <div class="notify-footer-stepTwo" v-if="active === 2">
        <el-button @click="saveForm" type="primary">保存</el-button>
        <el-button @click="sendForm" type="primary">立即发送</el-button>
        <el-button @click="cancelForm" type="primary">取消</el-button>
        <el-button @click="selectArticle" type="primary">选择文章</el-button>
      </div>
    </div>
    <el-dialog title="选择文章" v-model="showArticle" v-if="articleList">
      <div class="dialog-header">
        <el-row type="flex">
          <el-input v-model="articleKeyword" placeholder="请输入搜索关键字"></el-input>
          <el-button @click="searchArticle" icon="search"></el-button>
          <el-button @click="resetArticle">重置</el-button>
        </el-row>
      </div>
      <div class="dialog-table">
        <el-table :data="articleList.data"
          highlight-current-row
          @selection-change="handleSelectionChange"
          stripe
          border>
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="title" label="文章标题" min-width="100"></el-table-column>
          <el-table-column prop="category.displayName" label="类别" width="100"></el-table-column>
          <el-table-column prop="author" label="发布者"></el-table-column>
        </el-table>
      </div>
      <div class="dialog-footer">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="articleList.currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="articleList.pageSize"
              :total="articleList.count"
              layout="total, sizes, prev, pager, next">
            </el-pagination>
          </el-col>
          <el-col :span="4">
            <el-button @click="confirmArticle" type="primary">确定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'
import ActiveForm from 'src/components/views/ActiveForm'

export default {
  name: 'NotifyAdd',
  components: {
    ActiveForm
  },
  data () {
    return {
      articleList: null,
      response: null,
      error: null,
      templates: null,
      tags: null,
      activeFormData: null,
      selectedArticle: null,
      templateTypeURL: config.templateTypeAPI,
      templateGetURL: config.templateGetAPI,
      templateSaveURL: config.templateSaveAPI,
      wxUserGroupURL: config.wxUserGroupAPI,
      articleKeyword: '',
      showArticle: false,
      active: 1,
      notifyForm: {
        articleId: '',
        name: '',
        templateId: '',
        tags: [],
        description: '',
        model: {
          url: ''
        }
      }
    }
  },
  methods: {
    saveForm () {
      this.callSaveAPI(0)
    },
    sendForm () {
      this.callSaveAPI(1)
    },
    cancelForm () {
      this.active = 1
    },
    resetArticle () {
      this.articleKeyword = ''
      this.selectArticle()
    },
    confirmArticle () {
      this.showArticle = false
      this.notifyForm.articleId = this.selectedArticle.id
    },
    searchArticle () {
      const data = {
        pageSize: this.articleList.pageSize,
        currentPage: this.articleList.currentPage,
        keyword: this.articleKeyword
      }
      this.updataArticleList(data)
    },
    handleSelectionChange (value) {
      this.selectedArticle = value[value.length - 1]
      if (value.length === 2) {
        value.shift()
      }
    },
    handleSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.articleList.currentPage
      }
      this.updataArticleList(data)
    },
    handleCurrentChange (value) {
      const data = {
        pageSize: this.articleList.pageSize,
        currentPage: value
      }
      this.updataArticleList(data)
    },
    updataArticleList (data) {
      api.GET(config.articleAPI, data)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }

        if (response.data.errcode === '0000') {
          this.articleList = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
        this.showArticle = false
      })
    },
    selectArticle () {
      api.GET(config.articleAPI)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }

        if (response.data.errcode === '0000') {
          this.articleList = response.data.data
          this.showArticle = true
        }
      })
      .catch(error => {
        this.$message.error(error)
        this.showArticle = false
      })
    },
    callSaveAPI (isSend = 0) {
      this.notifyForm.isSend = isSend
      api.POST(this.templateSaveURL, this.notifyForm)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            this.$message.error(this.error)
            return
          }
          if (response.data.errcode === '0000') {
            this.$router.push({
              path: '/admin/notify'
            })
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    stepNext () {
      /*
      if (this.notifyForm.templateId === '' || this.notifyForm.name === '' ||
        this.notifyForm.description === '' || this.notifyForm.tags === []) {
        this.$message('请填写完整信息')
        return
      }
      */
      api.GET(this.templateGetURL, {
        templateId: this.notifyForm.templateId
      })
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          this.$message.error(this.error)
          return
        }
        if (response.data.errcode === '0000') {
          this.activeFormData = response.data.data
          this.$store.commit('SET_NOTIFY_ACTIVE_FORM', this.activeFormData)
          this.active = 2
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    updateActiveForm (value) {
      this.notifyForm.model = value
    },
    getTemplateTypes () {
      api.GET(this.templateTypeURL)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            this.$message.error(this.error)
            return
          }
          if (response.data.errcode === '0000') {
            this.templates = response.data.data
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    getUserGroup () {
      api.GET(this.wxUserGroupURL)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            this.$message.error(this.error)
            return
          }
          if (response.data.errcode === '0000') {
            this.tags = response.data.data
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    }
  },
  mounted () {
    this.getTemplateTypes()
    this.getUserGroup()
  }
}
</script>

<style>
.sc-notify-form-header {
  margin-left: 2rem;
  margin-top: 20px;
  border-bottom: 1px solid lightgray;
}
.notify-form {
  width: 50rem;
}
.sc-notify-form-content {
  margin-top: 2rem;
  margin-left: 2rem;
}
.sc-notify-form-footer {
  margin-left: 8.5rem;
  margin-top: 2rem;
}
.notify-form-select {
  width: 20rem;
}
.sc-notify-form-add .el-table th:first-child .el-checkbox {
  display: none;
}
.dialog-table {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.dialog-table .el-table-column:hover{
  cursor: pointer;
}
</style>
