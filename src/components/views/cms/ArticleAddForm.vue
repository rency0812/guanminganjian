<template>
  <div class="articleAddForm" v-if="catlgList">
    <el-row>
      <el-col class="content-left" :span="5">
        <el-form class="left-form" label-position="top" ref="form" :model="form" labelWidth="80px" :rules="leftFormRules">
          <el-form-item prop="pictures" class="upload-item">
            <el-upload
              class="upload-picture"
              :action="uploadUrl"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :file-list="imageList"
              :on-success="onUploadSuccess"
              :on-remove="onRemovePic"
              :on-error="onUploadError"
              list-type="picture">
              <img v-if="imageURL !== ''" :src="imageURL" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <div class="item-label">栏目</div>
          <el-form-item prop="categoryId">
            <el-cascader
              expand-trigger="hover"
              :options="catlgList"
              v-model="selectedOptions"
              @change="handleCatlgChange">
            </el-cascader>
          </el-form-item>
          <div class="item-label">作者</div>
          <el-form-item class="item-author" prop="author">
            <el-input v-model="form.author" type="text" placeholder="请输入作者"></el-input>
          </el-form-item>
          <el-button class="reset-button" @click="resetForm('form')">重置</el-button>
        </el-form>
      </el-col>
      <el-col class="content-main" :span="18">
        <el-form class="main-form" ref="form" :model="form" labelWidth="80px" :rules="formRules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" type="text" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="摘要" prop="digest">
            <el-input v-model="form.digest" type="text" placeholder="摘要,分享时或图文的摘要或简述"></el-input>
          </el-form-item>
          <el-form-item label="正文" prop="content">
            <vue-html5-editor :content="form.content" @change="updateData"></vue-html5-editor>
          </el-form-item>
          <el-form-item class="item-tag" label="标签" prop="tags">
            <el-tag
              :key="tag"
              v-for="tag in tagsList"
              type="success"
              :closable="true"
              :close-transition="false"
              @close="handleTagClose(tag)"
              >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-add-tag"
              v-if="isShowTag"
              v-model="newTag"
              ref="saveTagInput"
              size="large"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm">
            </el-input>
            <el-button 
              v-else-if="!isShowTag && !onTagsDone" 
              class="button-add-tag"
              size="small"
              @click="showTagInput">
              添加
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.isPrime">推荐</el-checkbox>
            <el-checkbox v-model="form.isTrend">热点</el-checkbox>
          </el-form-item>
          <el-button class="submit-button" type="primary" @click="addArticle('form')">提交</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'

export default {
  data () {
    return {
      isEdit: false,
      form: {
        categoryId: null,
        pictures: [],
        title: '',
        digest: '',
        content: '',
        author: '',
        isPrime: false,
        isTrend: false,
        tags: []
      },
      selectedOptions: [],
      imageURL: '',
      leftFormRules: {
        categoryId: [
          { required: true, message: '请选择文章板块', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入文章作者', trigger: 'change' }
        ]
      },
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'change' }
        ],
        digest: [
          { required: true, message: '请输入文章摘要', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' }
        ]
      },
      imageList: [],
      tagsList: [],
      isShowTag: false,
      onTagsDone: false,
      newTag: '',
      catlgList: null,
      error: null,
      uploadUrl: config.serverURI + config.uploadImgAPI
    }
  },
  methods: {
    backToList () {
      this.$router.go(-1)
    },
    handleCatlgChange (value) {
      this.form.categoryId = value[value.length - 1]
    },
    resetForm (form) {
      this.$refs[form].resetFields()
    },
    updateArticle () {
      const form = {
        ...this.form,
        id: this.$route.query.id
      }
      api.POST(config.updateArticleAPI, form)
        .then(response => {
          if (response.status !== 200) {
            this.$message.error(response.statusText)
            return
          }
          if (response.data.errcode === '0000') {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '修改文章成功'
            })
            setTimeout(this.$router.push({
              path: '/admin/article'
            }), 3000)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    addArticle (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let data = this.form
          data.isPrime = data.isPrime === true ? 1 : 0
          data.isTrend = data.isTrend === true ? 1 : 0
          if (this.isEdit) {
            this.updateArticle()
            return
          }
          api.POST(config.addArticleAPI, this.form)
            .then(response => {
              if (response.status !== 200) {
                this.$message.error(response.statusText)
                return
              }
              if (response.data.errcode === '0000') {
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message: '添加文章成功'
                })
                setTimeout(this.$router.push({
                  path: '/admin/article'
                }), 3000)
              } else {
                this.$message.error(response.data.errmsg)
              }
            })
            .catch(error => {
              this.$message.error(error)
            })
        } else {
          this.$message.error('请填写完整的信息')
        }
      })
    },
    updateData (data) {
      this.form.content = data
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    onUploadSuccess (response, file, fileList) {
      if (response.errcode === '0000') {
        console.log(response)
        this.imageURL = file.url
        this.form.pictures[0] = response.data[0]
      }
    },
    onUploadError (error, file) {
      this.$message.error(error)
    },
    onRemovePic (file, fileList) {
      this.form.pictures.pop()
    },
    handleTagClose (tag) {
      let index = this.tagsList.indexOf(tag)
      this.tagsList.splice(index, 1)
      this.form.tags.splice(index, 1)
      this.onTagsDone = false
    },
    handleInputConfirm () {
      let value = this.newTag
      if (value) {
        this.tagsList.push(value)
        this.postTagValue(value)
        if (this.tagsList.length === 3) {
          this.onTagsDone = true
        }
      }
      this.isShowTag = false
      this.newTag = ''
    },
    showTagInput () {
      this.isShowTag = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    getCategoryList () {
      const URL = config.articleCatlgAPI
      api.GET(URL)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            const data = response.data.data
            this.catlgList = this.transformData(data)
            if (this.$route.query.id) {
              this.getArticleDetail(this.$route.query.id)
              this.isEdit = true
            }
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    postTagValue (tag) {
      const URL = config.addTagAPI
      api.POST(URL, {
        name: tag
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }
        if (response.data.errcode === '0000') {
          this.form.tags.push(response.data.data.id)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    transformData (data) {
      let object = []
      data.forEach(item => {
        let category = {}
        category.value = item.id
        category.label = item.displayName
        if (item.children && item.children.length !== 0) {
          const children = this.transformData(item.children)
          category.children = children
        } else {
          category.children = null
        }
        object.push(category)
      })

      return object
    },
    getArticleDetail (id) {
      const URL = config.articleDetailAPI
      api.GET(URL, {
        id: id
      })
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          this.$message.error(this.error)
        }
        if (response.data.errcode === '0000') {
          const data = response.data.data
          if (data.picture) {
            this.imageURL = data.picture
            let array = data.picture.split('/')
            this.form.pictures.push(array[array.length - 1])
          }
          data.categories.forEach(item => {
            this.selectedOptions.push(item.id)
          })
          data.tags.forEach(item => {
            this.tagsList.push(item.name)
            this.form.tags.push(item.id)
          })
          this.form.categoryId = data.category.id
          this.form.content = data.content
          this.form.title = data.title
          this.form.author = data.author
          this.form.digest = data.digest
          this.form.isPrime = data.isPrime === 1
          this.form.isTrend = data.isTrend === 1
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>
<style scoped>
  .articleAddForm {
    padding-top: 2rem;
    margin-left: 20px;
    margin-right: 20px;
    border: 1px solid lightgray;
  }
  .content-left {
    height: 630px;
    border-right: 1px solid lightgray;
  }
  .left-form {
    margin-left: 20px;
    margin-right: 20px;
  }
  .upload-item {
    height: 178px;
    width: 178px;
  }
  .item-author {
    width: 178px;
  }
  .item-tag {
    margin-bottom: 0 !important;
  }
  .item-label {
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1;
    vertical-align: middle;
    padding-left: 10px;
    color: #48576a;
    font-weight: 700;
  }
  .item-label:before {
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
  .upload-picture {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .input-add-tag {
    width: 200px;
  }
  .reset-button {
    width: 178px;
  }
  .submit-button {
    margin-left: 300px;
    margin-bottom: 20px;
    width: 300px;
  }
  .upload-picture {
    border-color: #20a0ff;
  }
  .btnWrapper {
    margin-top: 2rem;
    padding-top: 2rem;
  }
</style>
