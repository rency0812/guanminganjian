<template>
  <div class="sc-wechat-add-user-tag">
    <el-form>
      <el-form-item>
        <span>标签组名称：</span>
        <el-input v-model="tag" placeholder="请输入标签组名称"></el-input>
      </el-form-item>
    </el-form>
    <el-row type="flex" class="sc-wechat-add-button-group">
      <el-button @click="submit" type="primary">提交</el-button>
      <el-button @click="cancelSubmit">取消</el-button>
    </el-row>
    <el-dialog
      title="提示"
      v-model="showDialog"
      >
      <span>创建标签用户成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="linkUser">关联用户</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-wechat-add-user-tag',
  data () {
    return {
      tag: '',
      response: null,
      error: null,
      showDialog: false
    }
  },
  methods: {
    closeDialog () {
      this.showDialog = false
    },
    linkUser () {
      this.$router.push({
        path: '/admin/wxuser/link',
        query: {
          id: this.response
        }
      })
    },
    cancelSubmit () {
      this.$router.go(-1)
    },
    submit () {
      if (this.tag === '') {
        this.$message.error('请填写正确的标签名')
        return
      }
      api.GET(config.wxUserGroupCheckAPI, {
        name: this.tag
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          if (response.data.data === true) {
            this.createTag()
          } else {
            this.$message.error('名字有冲突')
          }
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    createTag () {
      api.POST(config.wxUserGroupCreateAPI, {
        name: this.tag
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          this.showDialog = true
          this.response = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  }
}
</script>

<style>
.sc-wechat-add-user-tag {
  margin-left: 2rem;
  margin-top: 2rem;
  width: 300px;
}
.sc-wechat-add-button-group {
  margin-top: 1rem;
}
</style>
