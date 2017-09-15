<template>
  <div class="sc-notify-info" v-if="response && countData">
    <div class="sc-notify-header">
      <el-row type="flex">
        <h4>
        发送成功: {{ countData.sent }} | 发送失败: {{ countData.fail }} | 目标用户数: {{ countData.target }}
        </h4>
      </el-row>
      <el-row class="" type="flex" justify="space-around">
        <el-col :span="12">
          <el-date-picker
            type="datetime"
            placeholder="选择起始日期"
            v-model="form.startTime"
            >
          </el-date-picker>
          <el-date-picker
            type="datetime"
            placeholder="选择结束日期"
            v-model="form.endTime"
            >
          </el-date-picker>
        </el-col>
        <el-col :span="12" :offset="8">
          <el-select clearable @change="onSelectStatus" v-model="form.isArrive" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
          <el-input v-model="form.keyword" placeholder="请输入搜索关键字"></el-input>
          <el-button @click="onSearch" icon="search"></el-button>
        </el-col>
      </el-row>
    </div>

    <div class="sc-notify-content">
      <el-table
        :data="response.data"
        >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          prop="id"
          label="序号"
          width="80"
          >
        </el-table-column>
        <el-table-column
          label="微信头像/昵称"
          width="180"
          >
          <template scope="scope">
            <img class="img-avatar" :src="scope.row.user.avatar" alt="头像">
            {{ scope.row.user.nickname }}
          </template>
        </el-table-column>
        <el-table-column
          prop="notifyWx.name"
          label="通知名称"
          >
        </el-table-column>
        <el-table-column
          prop="sendTime"
          label="发送时间"
          width="180"
          >
        </el-table-column>
        <el-table-column
          prop="isArrive"
          label="状态"
          width="120"
          >
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button size="small" @click="sendMsg(scope.row.id)" :disabled="scope.row.isArrive === '发送成功'">发送</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="sc-notify-footer">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="response.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="response.pageSize"
            :total="response.count"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'NotifyIndo',
  data () {
    return {
      response: null,
      countData: null,
      error: null,
      statusOptions: [
        { label: '未发送', value: 0 },
        { label: '发送成功', value: 1 },
        { label: '发送失败', value: 2 }
      ],
      form: {
        notifyId: this.$route.query.id,
        isArrive: '',
        keyword: '',
        startTime: '',
        endTime: ''
      },
      infoURL: config.notifyInfoAPI,
      countURL: config.notifyCountAPI
    }
  },
  methods: {
    handleSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.updateInfo(data)
    },
    handleCurrentChange (value) {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.form
      }
      this.updateInfo(data)
    },
    onSelectStatus (value) {
      this.form.isArrive = value
      const data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.updateInfo(data)
    },
    updateInfo (data) {
      api.GET(this.infoURL, data)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          this.$message.error(this.error)
          return
        }
        if (response.data.errcode === '0000') {
          this.response = this.transformData(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onSearch () {
      this.form.startTime = this.toTimestamp(this.form.startTime)
      this.form.endTime = this.toTimestamp(this.form.endTime)
      const data = {
        currentPage: this.response.currentPage,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.updateInfo(data)
    },
    toTimestamp (date) {
      if (!date) return ''
      return new Date(date).getTime()
    },
    sendMsg (id) {
      api.GET(config.notifyDetailSendAPI, {
        id: id
      })
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          this.$message.error(this.error)
          return
        }
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '发送成功',
            type: 'success'
          })
          this.getInfo()
          this.getInfoCount()
        } else {
          this.$message.error(response.errmsg)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    transformData (response) {
      response.data.forEach(item => {
        switch (item.isArrive) {
          case 0:
            item.isArrive = '未发送'
            break
          case 1:
            item.isArrive = '发送成功'
            break
          case 2:
            item.isArrive = '发送失败'
            break
        }
        if (item.sendTime) {
          let date = new Date(item.sendTime)
          const month = date.getMonth() + 1
          item.sendTime = `${date.getFullYear()}-${month}-${date.getDate()}`
        }
      })
      return response
    },
    getInfo () {
      api.GET(this.infoURL, {
        notifyId: this.$route.query.id
      })
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          this.$message.error(this.error)
          return
        }
        if (response.data.errcode === '0000') {
          this.response = this.transformData(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getInfoCount () {
      api.GET(this.countURL, {
        id: this.$route.query.id
      })
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          this.$message.error(this.error)
          return
        }
        if (response.data.errcode === '0000') {
          this.countData = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getInfo()
    this.getInfoCount()
  }
}
</script>

<style scoped>
.sc-notify-header {
  margin-top: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
}
.sc-notify-header .el-input {
  width: 150px;
}
.sc-notify-content {
  border-top: 1px solid lightgray;
  padding-top: 2rem;
  margin-left: 2rem;
  margin-top: 1rem;
  margin-right: 2rem;
}
.img-avatar {
  margin-top: 5px;
  margin-bottom: 5px;
  width: 56px;
  height: 56px;
}
</style>
