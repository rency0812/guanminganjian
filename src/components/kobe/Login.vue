<template>
  <div class="kobe-login-component login-box">
    <slot name="logo">
      <div class="login-logo">
        <a @click.prevent=""><b>{{ title }}</b></a>
      </div>
      <div class="text-response text-center error" v-if="error">
        {{ error }}
      </div>
    </slot>

    <div class="kobe-login-body login-box-body">
      <slot name="login">
        <el-form :model="form">
          <el-form-item>
            <el-input  placeholder="请输入用户名" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入密码" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="space-between">
              <el-col :span="15">
                <el-input class="inline message-input" placeholder="短信验证"></el-input>
              </el-col>
              <el-col :span="8">
                <el-button @click="sendSMS">发送验证码</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="space-around">
              <el-col :span="15">
                <el-button @click="login" class="button-login" type="primary">登录</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </slot>

      <slot name="kobe-login-footer">
        <router-link to="/forgot">忘记密码</router-link>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'kobe-login',
  props: {
    title: {
      type: String,
      default: 'KOBE UI'
    },
    form: {
      type: Object,
      default: (value) => {
        return {
          username: '',
          password: ''
        }
      }
    }
  },
  data () {
    return {
      response: null,
      error: null
    }
  },
  methods: {
    login (event) {
      this.$emit('login', event)
    },
    sendSMS (event) {
      this.$emit('sendSMS', event)
    }
  }
}
</script>

<style scoped>
.inline {
  display: inline;
}
.message-input {
  width: 100px;
}
.button-login {
  width: 200px;
}
</style>
