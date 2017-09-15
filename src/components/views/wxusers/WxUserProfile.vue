<template>
  <div class="sc-wechat-profile" v-if="response">
    <el-tabs v-model="selectedTab" @click="changeTab" class="wechat-profile-tab">
      <el-tab-pane label="用户信息" name="user">
        <el-row tpye="flex">
          <el-col :span="12">
            <el-card>
              <kobe-info-cell title="姓名" :info="response.realname ? response.realname : '无'"></kobe-info-cell>
              <kobe-info-cell title="微信昵称" :info="response.nickname ? response.nickname : '无'"></kobe-info-cell>
              <kobe-info-cell title="手机" :info="response.mobile ? response.mobile : '无'"></kobe-info-cell>
              <kobe-info-cell title="职位" :info="response.merchant ? response.merchant.name : '无'"></kobe-info-cell>
              <kobe-info-cell>
                <div slot="kobe-cell-content">
                  <el-row type="flex" justify="end">
                    <el-col>标签组:</el-col>
                    <el-col class="sc-wechat-profile-tags">
                      <el-tag type="primary" v-for="tag in response.tagList">{{ tag.name }}</el-tag>
                    </el-col>
                  </el-row>
                </div>
              </kobe-info-cell>
            </el-card>
          </el-col>

          <el-col :span="6" class="sc-wechat-profile-image-content">
            <kobe-image-pane v-if="response.avatar" :image="response.avatar" description="微信头像"></kobe-image-pane>
            <kobe-image-pane v-if="response.fUserInfo.photoUrl" :image="response.fUserInfo.photoUrl" description="个人照片"></kobe-image-pane>
          </el-col>

        </el-row>
      </el-tab-pane>

      <el-tab-pane label="企业信息" name="company">
        <el-row type="flex">
          <el-col :span="12">
            <el-card class="sc-wechat-company-card">
              <div class="sc-wechat-company-card-title" slot="header">
                <span>企业登记信息</span>
              </div>
              <div>企业名称: {{ response.fCompanyInfo.company }}</div>
              <div>企业地址: {{ response.fCompanyInfo.address }}</div>
              <div>企业人数: {{ response.fCompanyInfo.count }}人</div>
              <div>所属行业: {{ response.fCompanyInfo.industryName }}</div>
              <div>安全证书编号: {{ response.fCompanyInfo.safecert }}</div>
              <div>所属街道: {{ response.fCompanyInfo.subDistrictName }}/{{ response.fCompanyInfo.community }}</div>
            </el-card>
            <el-card class="sc-wechat-company-card">
              <div class="sc-wechat-company-card-title" slot="header">
                <span>组织信息</span>
              </div>
              <div>组织名称: {{ response.fCompanyInfo.orgaName }}</div>
              <div>统一信用代码: {{ response.fCompanyInfo.orgaCode }}</div>
              <div>详细地址: {{ response.fCompanyInfo.orgaAddress }}</div>
            </el-card>
          </el-col>
          <el-col :span="6" class="sc-wechat-profile-image-content">
            <kobe-image-pane v-if="response.fCompanyInfo.orgaPhotoUrl" :image="response.fCompanyInfo.orgaPhotoUrl" description="组织机构代码证"></kobe-image-pane>
            <kobe-image-pane v-if="response.fCompanyInfo.safecertUrl" :image="response.fCompanyInfo.safecertUrl" description="企业主要负责人安全培训合格证书"></kobe-image-pane>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-wechat-user-profile',
  data () {
    return {
      response: null,
      error: null,
      selectedTab: 'user',
      userID: this.$route.query.id
    }
  },
  methods: {
    changeTab (tab, event) {
    },
    getUserInfo () {
      api.GET(config.wxUserProfileAPI, {
        id: this.userID
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
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
    this.getUserInfo()
  }
}
</script>

<style>
.wechat-profile-tab {
  margin-top: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
  padding-bottom: 1rem;
}
.sc-wechat-profile .kobe-info-cell {
  margin-bottom: 1rem;
}
.sc-wechat-profile-tags {
  text-align: right;
}
.sc-wechat-profile-image-content {
  margin-left: 1rem;
  text-align: center;
}
.sc-wechat-card-title {
  font-size: 2rem;
}
.sc-wechat-company-card div {
  margin-bottom: 1rem;
}
.sc-wechat-company-card-title {
  font-size: 2rem;
}
</style>
