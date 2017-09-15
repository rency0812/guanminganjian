<template>
  <div class="sc-firm-detail-component" v-if="response">
    <el-row type="flex">
      <el-col :span="12" class="sc-firm-detail-content">
        <el-card class="sc-firm-card">
          <div slot="header">
            <span class="sc-firm-card-title">企业登记信息</span>
          </div>
          <div class="sc-firm-detail">
            <div>企业名称: <span>{{ response.company }}</span></div>
            <div>企业地址: <span>{{ response.address }}</span></div>
            <div>所属行业: <span>{{ response.industryName }}</span></div>
            <div>企业人数: <span>{{ response.pnum }}</span></div>
            <div>所属街道: <span>{{ response.regionName }}</span></div>
            <div>安全证书编号: <span>{{ response.safecert }}</span></div>
            <div>提交时间: <span>{{ response.createdAt | toDate }}</span> </div>
          </div>
        </el-card>

        <el-card class="sc-firm-card">
          <div slot="header">
            <span class="sc-firm-card-title">组织信息</span>
          </div>
          <div class="sc-firm-detail">
            <div>组织名称: <span>{{ response.orgaName }}</span></div>
            <div>统一信用代码: <span>{{ response.orgaCode }}</span></div>
            <div>详细地址: <span>{{ response.orgaAddress }}</span> </div>
          </div>
        </el-card>

        <el-card class="sc-firm-card" v-if="response.status !== 0">
          <div slot="header">
            <span class="sc-firm-card-title">受理信息</span>
          </div>
          <div class="sc-firm-detail">
            <div>受理时间: <span>{{ response.updatedAt | toDate }}</span></div>
            <div>受理状态: <span>{{ response.status | statusCodeToMsg }}</span></div>
            <div>受理意见: <span>{{ response.remark }}</span></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6" class="sc-firm-image-content" v-if="response.safecertUrl">
        <div class="sc-firm-detail-safecert">
          <img @click="openImage('企业主要负责人安全培训合格证书', response.safecertUrl)" class="img-responsive" :src="response.safecertUrl">
          企业主要负责人安全培训合格证书
        </div>
        <div class="sc-firm-detail-organphoto" v-if="response.orgaPhotoUrl">
          <img @click="openImage('组织机构代码证', response.orgaPhotoUrl)" class="img-responsive" :src="response.orgaPhotoUrl">
          组织机构代码证
        </div>
      </el-col>
    </el-row>
    <el-row class="sc-firm-detail-action" type="flex" justify="end">
      <el-button @click="dealCase" type="primary">审核</el-button>
      <el-button type="primary" @click="back">返回</el-button>
    </el-row>
    <el-dialog title="企业信息上报处理" v-model="showDialog">
      <el-form :model="form">
        <el-form-item label="处理方式" :label-width="'120px'">
          <el-select v-model="form.status" placeholder="请选择处理方案">
            <el-option label="处理" value="1"></el-option>
            <el-option label="驳回" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见" :label-width="'120px'">
          <el-input type="textarea" :rows="4" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="updateFirmDeatil">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="picDialogTitle" v-model="showPicDialog">
      <img :src="showImage" alt="detail-image" class="img-responsive">
    </el-dialog>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-firm-detail',
  data () {
    return {
      showDialog: false,
      showPicDialog: false,
      picDialogTitle: '',
      showImage: '',
      form: {
        status: '',
        remark: ''
      },
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
    dealCase () {
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    getFirmDetail (id) {
      api.GET(config.firmDetailAPI, {
        id
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
    },
    openImage (title, image) {
      this.showPicDialog = true
      this.picDialogTitle = title
      this.showImage = image
    },
    updateFirmDeatil (id) {
      if (this.form.status === '' | this.form.remark === '') {
        this.$message({
          message: '请填写正确的信息'
        })
        return
      }
      const data = {
        id: this.id,
        remark: this.form.remark,
        status: Number(this.form.status)
      }
      api.POST(config.firmUpdateAPI, data)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.$message({
              message: '处理成功',
              type: 'success'
            })

            setTimeout(this.$router.push({
              path: '/admin/firm'
            }), 2000)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    }
  },
  mounted () {
    this.getFirmDetail(this.id)
  }
}
</script>

<style scoped>
.sc-firm-card-title {
  font-size: 18px;
  line-height: 36px;
}
.sc-firm-card {
  margin-top: 1rem;
  margin-left: 1rem;
}
.sc-firm-image-content {
  margin-left: 1rem;
  margin-top: 1rem;
}
.sc-firm-detail-action {
  margin-top: 10px;
  margin-right: 30rem;
  padding-bottom: 10px;
}
.sc-firm-detail-safecert {
  cursor: pointer;
  max-width: 20rem;
  text-align: center;
}
.sc-firm-detail-organphoto {
  cursor: pointer;
  margin-top: 2rem;
  max-width: 20rem;
  text-align: center;
}
</style>
