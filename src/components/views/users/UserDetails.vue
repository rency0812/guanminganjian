<template>
	<div class="sc-user-details" v-if="response">
		<el-row type="flex">
			<el-col :span="16" class="sc-user-details-content">
				<el-card>
					<div slot="header">
        				<span class="sc-user-card-title">用户登记信息</span>
      				</div>
			        <div class="sc-user-details-box">
			          <div>用户名: <span>{{ response.username }}</span></div>
			          <div>昵称: <span>{{ response.nickname }}</span></div>
			          <div>真实姓名: <span>{{ response.realname }}</span></div>
			          <div>移动/固定电话: <span>{{ response.phone }}</span></div>
			          <div>邮箱: <span>{{ response.email }}</span></div>
			          <div>联系地址: <span>{{ response.address }}</span></div>
			          <div>紧急联系人信息: <span>{{ response.createdAt | toDate }}</span> </div>
			          <div>备注: <span>{{ response.createdAt | toDate }}</span> </div>
			        </div>
				</el-card>
			</el-col>
			<el-col :span="6" class="sc-user-photo">
				<div class="sc-user-photo-box">
					<img :src="response.avatar" class="img-responsive">
				  <p class="sc-user-photo-desc">用户头像</p>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default{
  name: 'sc-user-details',
  data () {
    return {
      response: null,
      error: null
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    getUserDetail (id) {
      api.GET(config.users.userDetail, {
        id: id
      })
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.response = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getUserDetail(this.id)
  }
}
</script>

<style>
.sc-user-details{
	margin-left: 10px;
	margin-top: 10px;
}
.sc-user-details-content{
	line-height: 32px;
}
.sc-user-card-title{
	font-size: 16px;
}
.sc-user-details-box,.sc-user-photo-desc{
	font-size: 14px;
}
.sc-user-photo{
	margin-left: 10px;
	text-align: center;
}
.sc-user-photo-box{
	max-width: 20rem;
	height: 400px;
}
.sc-user-photo-desc{
	padding-bottom: 90px;
}
.sc-user-detail-action{
}
</style>
