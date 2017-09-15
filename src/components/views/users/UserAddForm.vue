<template>
  <div class="userAddForm">
    <el-row type="flex">
      <el-col :span="14" :offset="3">
        <el-form :model="dataForm" :rules="rules" ref="dataForm"
          labelWidth="120px" class="addUser">
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
            		<el-input v-model="dataForm.username"></el-input>
          		</el-form-item>
            </el-col>
            <el-col :offset="2" :span="12">
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="dataForm.nickname"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-form-item :offset="4" label="密码" prop="password">
            		<el-input v-model="dataForm.password" type="password"></el-input>
          		</el-form-item>
            </el-col>
            <el-col :offset="2" :span="12">
              <el-form-item label="确认密码" prop="confirmPwd">
                <el-input v-model="dataForm.confirmPwd" type="password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-form-item label="移动电话" prop="phone">
                <el-input v-model="dataForm.phone" :maxlength="11"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="2" :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="dataForm.email" type="email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="formGap"></div>
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-form-item label='真实姓名' prop="realName">
                <el-input v-model="dataForm.realName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="2" :span="12">
              <el-form-item label="备注">
                <el-input v-model="dataForm.info"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-form-item label="联系地址">
                <el-input v-model="dataForm.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="usericon" label="用户头像">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="onUploadSuccess"
              :on-remove="onRemovePic"
              :on-error="onUploadError"
              :before-upload="beforeAvatarUpload"
              >
              <img v-if="imageURL" :src="imageURL" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="space-around">
            	<el-col :offset="6"><el-button @click="submitForm">创建用户</el-button></el-col>
            	<el-col :offset="-8"><el-button @click="resetForm('dataForm')">重置</el-button></el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'

export default {
  name: 'sc-user-add-form',
  data () {
    return {
      uploadUrl: config.serverURI + config.uploadImgAPI,
      dataForm: {
        username: '',
        password: '',
        confirmPwd: '',
        nickname: '',
        email: '',
        phone: '',
        realName: '',
        avatar: '',
        address: '',
        info: ''
      },
      imageURL: '',
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        confirmPwd: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入用户昵称', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入移动电话', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onUploadError (error, file) {
      this.$message.error(error)
    },
    onRemovePic (file, fileList) {
      this.dataForm.avatar = ''
    },
    onUploadSuccess (response, file, fileList) {
      if (response.errcode === '0000') {
        this.imageURL = file.url
        this.dataForm.avatar = response.data[0]
      }
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
    encrypt (pwd) {
      let crypt = new window.JSEncrypt()
      crypt.setKey(config.basic.key)
      const crypted = crypt.encrypt(pwd)
      console.log(crypted)
      return crypted
    },
    submitForm () {
      if (this.dataForm.password !== this.dataForm.confirmPwd) {
        this.$message.error('两次填写的密码不一致')
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.password = this.encrypt(this.dataForm.password)
          this.dataForm.confirmPwd = this.dataForm.password

          api.POST(config.users.userCreate, this.dataForm)
          .then(response => {
            if (response.status !== 200) {
              this.$message.error(response.statusText)
              return
            }
            if (response.data.errcode === '0000') {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success'
              })
              setTimeout(this.$router.push('users'), 2000)
            } else {
              this.$message.error(response.statusText)
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
        } else {
          this.$message.info('请填写正确的信息')
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
<style>

  .userAddForm {
    border-top: 1px solid lightgray;
    padding-top: 4rem;
    margin-top: 2rem;
  }

  .formGap {

  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .usericon{
  	padding-left: 30%;
  }
</style>
