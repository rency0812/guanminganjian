<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding:3rem 3rem 0 0;">
    <el-form-item label="广告标题">
      <p v-text="ruleForm.title"></p>
    </el-form-item>
    <el-form-item label="广告点位">
      <p v-text="ruleForm.poster"></p>
    </el-form-item>
    <el-form-item label="广告内容">
      <img class="SC-imgContent" :src="ruleForm.link" alt="头像">
    </el-form-item>
    <el-form-item label="点击次数">
      <p v-text="ruleForm.count"></p>
    </el-form-item>
    <el-form-item label="开始时间">
      <p v-text="ruleForm.beginTime"></p>
    </el-form-item>
    <el-form-item label="结束时间">
      <p v-text="ruleForm.endTime"></p>
    </el-form-item>
    <el-form-item label="发布时间">
      <p v-text="ruleForm.createdAt"></p>
    </el-form-item>
    <el-form-item>
      <el-button @click="goback()">返回</el-button>
      <el-button @click="toEdit()">修改</el-button>
    </el-form-item>
    </el-form>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  export default {
    data () {
      return {
        ruleForm: {}
      }
    },
    methods: {
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
      getData () {
        let id = this.$route.query.id
        console.log(id)
        api.GET(config.showAdvertisementAPI, {id: id})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            const res = response.data.data
            this.ruleForm = response.data.data
            this.ruleForm.beginTime = this.formatDate(res.beginTime)
            this.ruleForm.endTime = this.formatDate(res.endTime)
            this.ruleForm.createdAt = this.formatDate(res.createdAt)
            console.log(response.data.data)
          }
        })
      },
      goback () {
        this.$router.push({
          path: 'advertisementcontent'
        })
      },
      toEdit () {
        let id = this.$route.query.id
        this.$router.push({
          path: 'editadvertisement',
          query: {
            id: id
          }
        })
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style scoped>
	.SC-imgContent {
  	margin-top: 5px;
    margin-bottom: 5px;
    width: 56px;
    height: 56px;
  }
</style>