<template>
  <div class="login-box">
    <slot name="logo">
      <div class="login-logo">
        <a @click.prevent=""><b>{{ title }}</b></a>
      </div>
      <div class="text-response text-center error" v-if="response">
        {{ response }}
      </div>
    </slot>

    <div class="forget-box-body">
      <slot name="forget">
        <form :action="mailURL" @submit.prevent="onSubmit">
          <div class="form-group has-feedback">
            <input class="form-control" type="text" name="username" v-model="username" placeholder="请输入用户名">
            <span class="fa fa-user form-control-feedback"></span>
          </div>
          <div class="login-button-group">
            <el-button type="primary" class="btn btn-primary btn-block btn-flat">发送邮件</el-button>
          </div>
        </form>
      </slot>
    </div>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'Forget',
  data () {
    return {
      title: 'SHENCOM',
      username: '',
      response: '',
      mailURL: 'http://test.java.shencom.cn/gm/admin/password/sendEmail'
    }
  },
  methods: {
    onSubmit: function () {
      if (this.username.length === 0) {
        this.$message.error('请填写正确的用户名')
        return false
      }

      api.GET(config.basic.forgetMail, {
        username: this.username
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.errmsg
        }
      })
      .catch(error => {
        this.response = '发送失败'
        console.log(error)
        return
      })
    }
  },
  mounted () {
  },
  components: {
  }
}
</script>

<style>
.forget-box-body {
  background-color: #fff;
  padding: 20px;
  border-top: 0;
  color: #666;
}
</style>
