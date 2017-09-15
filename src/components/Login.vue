<template>
  <div class="login-box">
    <slot name="logo">
      <div class="login-logo">
        <a @click.prevent="">
          <b>{{ title }}</b>
        </a>
      </div>
      <div class="text-response text-center error" v-if="response">
        {{ response }}
      </div>
    </slot>
  
    <div class="login-box-body">
      <slot name="login">
        <form action="" method="post">
          <div class="form-group has-feedback">
            <input v-model="username" type="text" class="form-control" placeholder="请输入用户名">
            <span class="fa fa-user form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input v-model="password" type="password" class="form-control" placeholder="请输入密码">
            <span class="fa fa-lock form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback row">
            <div class="col-xs-7">
              <input v-model="mailCode" type="text" class="form-control" placeholder="请输入短信验证码">
            </div>
            <div class="col-xs-5">
              <el-button @click="sendMail" :disabled="mailSended" type="primary" class="btn btn-primary btn-block btn-flat">{{ mailButtonText }}</el-button>
            </div>
          </div>
          <div class="login-button-group">
            <el-button @click.prevent="login" :disabled="loginSended" type="primary" class="btn btn-primary btn-block btn-flat">登录</el-button>
          </div>
        </form>
      </slot>
    </div>
  </div>
</template>

<script>
/* eslint no-useless-escape: "off" */
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'bs-login',
  data() {
    return {
      title: 'SHENCOM',
      mailButtonText: '发送验证码',
      username: '',
      password: '',
      mailSended: false,
      mailCountDown: 60,
      mailTimer: null,
      mailCode: '',
      loginSended: false,
      response: ''
    }
  },
  computed: {
  },
  methods: {
    sendMail: function () {
      if (this.isStringEmpty(this.username)) {
        this.$message.error('请填写用户名')
        return
      }
      api.GET(config.basic.sendMail, {
        username: this.username
      })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.response = '短信已发送,请查收'
          }
        })
        .catch(error => {
          this.response = '短信发送失败'
          this.$message.error(error)
          return
        })

      this.mailSended = true
      this.mailButtonText = `重新发送(${this.mailCountDown--})`
      // set mail button timer
      this.mailTimer = setInterval(() => {
        if (this.mailCountDown === 0) {
          this.mailSended = false
          this.mailButtonText = '发送验证码'
          this.response = ''
          this.mailCountDown = 60
          clearInterval(this.mailTimer)
          this.mailTimer = null
          return
        }
        this.mailButtonText = `重新发送(${this.mailCountDown--})`
      }, 1000)
    },
    login: function () {
      this.response = ''
      // check input info
      if (this.isStringEmpty(this.username) ||
        this.isStringEmpty(this.password) ||
        this.isStringEmpty(this.mailCode)) {
        this.$message.error('请输入正确的信息')
        return
      }

      this.loginSended = true
      // password encrypt
      this.encrypt()

      // encrypt error
      if (!this.password) {
      }

      // login request
      api.POST(config.basic.login, {
        username: this.username,
        password: this.password,
        // mail code
        code: this.mailCode
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$store.commit('SET_USER_INFO', response.data.data)
          this.$store.commit('SET_TOKEN', response.data.data.token)
          this.$router.push('/admin')
        } else if (response.data.errcode === '0') {
          this.response = response.data.errmsg
          this.loginSended = false
        } else {
          this.$message.error(response.errmsg)
        }
      })
      .catch(error => {
        this.loginSended = false
        this.$message.error(error)
      })
    },
    encrypt(string) {
      const pubkey = config.basic.key

      try {
        let content = this.password
        let crypt = new window.JSEncrypt()
        crypt.setKey(pubkey)
        let crypted = crypt.encrypt(content)
        this.password = crypted
      } catch (ex) {
        return false
      }
    },
    isStringEmpty(string) {
      if (string.length === 0) {
        return true
      }
      return false
    }
  },
  mounted() {
  },
  components: {
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
