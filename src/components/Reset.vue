<template>
  <div class="login-box">
    <slot name="logo">
      <div class="login-logo">
        <a @click.prevent=""><b>{{ title }}</b></a>
      </div>
    </slot>

    <div class="reset-box-body">
      <slot name="reset">
        <form method="post">

          <div class="form-group has-feedback">
            <input v-model="username" type="text" class="form-control" placeholder="请输入用户名">
            <span class="glyphicon glyphicon-user form-control-feedback"></span>
          </div>

          <div class="form-group has-feedback">
            <input v-model="password" type="password" class="form-control" placeholder="请输入密码">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>

          <div class="form-group has-feedback">
            <input v-model="confirmPwd" type="password" class="form-control" placeholder="请再次输入密码">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>

          <div class="login-button-group">
            <button @click.prevent="login" type="submit" class="btn btn-primary btn-block btn-flat">确定</button>
          </div>

        </form>
      </slot>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Reset',
  data () {
    return {
      title: 'SHENCOM',
      username: '',
      password: '',
      key: '',
      confirmPwd: ''
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style>
</style>
