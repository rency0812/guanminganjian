<template>
  <div style="width: 50%;">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding:3rem 3rem 0 0;">
      <el-form-item label="广告标题" prop="title" required>
        <el-input v-model="ruleForm.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="广告内容" prop="link" required>
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :file-list="imageList"
          :on-success="onUploadSuccess"
          :on-remove="onRemovePic"
          :on-error="onUploadError"
          :before-upload="beforeAvatarUpload"
          list-type="picture">
          <img v-if="imageURL !== ''" :src="imageURL" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg图片文件，且不超过2M</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="点位类型" prop="linkType" required>
        <el-radio-group v-model="ruleForm.linkType">
          <el-radio label="1">外部链接</el-radio>
          <el-radio label="2">内部链接</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime" required style="display:inline-block">
        <el-date-picker
          v-model="ruleForm.beginTime"
          type="datetime"
          placeholder="选择开始日期时间"
          style="width:322px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime" required style="display:inline-block">
        <el-date-picker
          v-model="ruleForm.endTime"
          type="datetime"
          placeholder="选择结束日期时间"
          style="width:322px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!--弹出框-->
    <el-dialog title="广告点位" :visible.sync="dialogTableVisible">
      <!--<div style="margin: -15px 0 15px">
        <el-button @click="toggleSelection([gridData[1], gridData[2]])">选择</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>-->
      <el-table
        lock-scroll="true"
        ref="multipleTable"
        :data="gridData"
        border
        tooltip-effect="dark"
        style="width: 100%; overflow: auto;height: 400px;"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="创建时间" width="150">
          <template scope="scope">{{ scope.row.createdAt }}</template>
        </el-table-column>
        <el-table-column prop="spacename" label="标题" width="120"></el-table-column>
        <el-table-column prop="typename" label="点位类型" width="120"></el-table-column>
        <el-table-column prop="slug" label="点位" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>
    <!--点位表格-->
    <div class="sc-main-content">
      <el-row class="sc-top-header">
        <el-col :span="19">
          <div class="grid-content"><el-button type="primary" class="sc-top-btn" @click="getGridData()">点位选择</el-button></div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content">
            <el-input placeholder="请输入内容" v-model="keyword">
              <el-button slot="append" icon="search" class="hover-search" @click="searchKeyword()"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column label="操作" width="70">
          <template scope="scope">
            <el-button
              size="small"
              icon="delete2"
              @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="日期">
          <template scope="scope">
            <span>{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="标题">
          <template scope="scope">
            <span>{{ scope.row.spacename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="点位类型">
          <template scope="scope">
            <span>{{ scope.row.typename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="点位">
          <template scope="scope">
            <span>{{ scope.row.slug }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  data () {
    return {
      imageList: [],
      imageURL: '',
      uploadUrl: config.serverURI + config.uploadImgAPI,
      // dialogVisible: false,
      ruleForm: {
        title: '',
        poster: '',
        link: '',
        linkType: '',
        beginTime: null,
        endTime: null,
        list: []
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        poster: [
          { required: true, message: '请输入广告点位', trigger: 'blur' }
        ],
        // imgContentURL: [
        //   { required: true, message: '请输入广告内容', trigger: 'change' }
        // ],
        beginTime: [
          { type: 'date', required: true, message: '请输入开始时间', trigger: 'change' }
        ],
        endTime: [
          { type: 'date', required: true, message: '请输入结束时间', trigger: 'change' }
        ],
        linkType: [
            { required: true, message: '请选择一个点位类型', trigger: 'change' }
        ]
      },
      gridData: null,
      multipleSelection: [],
      tableData: [],
      dialogTableVisible: false
    }
  },
  methods: {
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss
    transformDate (res) {
      res.forEach(v => {
        if (v.createdAt) {
          v.createdAt = this.formatDate(v.createdAt)
        }
        if (v.beginTime) {
          v.beginTime = this.formatDate(v.beginTime)
        }
        if (v.endTime) {
          v.endTime = this.formatDate(v.endTime)
        }
      })
      return res
    },
    // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
    formatDate (value) {
      let date = new Date(value)
      let M = date.getMonth() + 1
      M = M < 10 ? ('0' + M) : M
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      // let h = date.getHours()
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      value = `${date.getFullYear()}-${M}-${d} ${date.getHours()}:${m}:${s}`
      return value
    },
    // 弹出框
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
          console.log(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
        console.log(1)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.tableData = this.multipleSelection
    },
    getGridData () {
      this.dialogTableVisible = true
      if (!this.gridData) {
        api.GET(config.addPointAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.gridData = this.transformDate(response.data.data)
            console.log(response.data.data)
          }
        })
      }
    },
    // 点击 删除
    handleDelete (index, row) {
      console.log(index, row)
      this.tableData.splice(index, 1)
    },
    // 上传
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
        this.ruleForm.link = response.data[0]
        console.log(this.ruleForm.link)
      }
    },
    onUploadError (error, file) {
      this.$message.error(error)
    },
    onRemovePic (file, fileList) {
      this.ruleForm.link = ''
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          var obj = {
            title: '',
            typeId: 2,
            content: '',
            link: '',
            poster: '',
            linkType: null,
            beginTime: null,
            endTime: null,
            createdAt: null,
            list: []
          }
          obj.title = this.ruleForm.title
          obj.poster = this.ruleForm.poster
          obj.link = this.ruleForm.link
          obj.linkType = Number(this.ruleForm.linkType)
          obj.beginTime = new Date(this.ruleForm.beginTime).getTime()
          obj.endTime = new Date(this.ruleForm.endTime).getTime()
          obj.createdAt = new Date().getTime()
          console.log(obj)
          api.POST(config.addAdvertisementAPI, obj)
            .then(response => {
              if (response.status !== 200) {
                this.error = response.statusText
                return
              }
              if (response.data.errcode === '0000') {
                console.log(response)
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
  .sc-main-content {
	  border-top: 1px solid lightgray;
    padding: 1rem 1rem 2rem;
  }
  .sc-top-header {
    margin-bottom: 1rem;
    padding: 0 1rem;
  }
</style>