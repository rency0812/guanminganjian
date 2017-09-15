<template>
  <div class="sc-top-line">
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding:3rem 3rem 0 0;">
          <el-form-item label="点位名称">
            <p v-text="ruleForm.spacename"></p>
          </el-form-item>
          <el-form-item label="点位标识">
            <p v-text="ruleForm.slug"></p>
          </el-form-item>
          <el-form-item label="点位分类">
            <p v-text="ruleForm.typename"></p>
          </el-form-item>
          <el-form-item label="具体描述" prop="description">
            <el-tag
              v-for="tag in tags"
              type="danger"
              style="margin: 0 5px;"
            >
            {{tag}}
            </el-tag>
          </el-form-item>
            <el-form-item label="有效控制">
            <el-switch
              v-model="ruleForm.state"
              on-text="开"
              off-text="关"
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="具体描述">
            <p v-text="ruleForm.description"></p>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="toEdit()">修改基本信息</el-button>
            <el-button type="primary" @click="goback()">返回管理首页</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="上画情况" name="second">
        <div class="sc-article-table-content">
          <el-table :data="response.data" border stripe>
            <el-table-column type="index" label="ID" width="50"></el-table-column>
            <el-table-column prop="spacename" label="广告内容名称" min-width="100"></el-table-column>
            <el-table-column prop="slug" label="投放方式" width="150"></el-table-column>
            <el-table-column prop="typename" label="内容" width="120"></el-table-column>
            <el-table-column prop="count" label="展示量"></el-table-column>
            <el-table-column prop="createdAt" label="上画时间" width="180px"></el-table-column>
            <el-table-column prop="upCount" label="下画时间" width="100px"></el-table-column>
            <el-table-column label="状态" width="100px">
              <template scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  on-text="开"
                  off-text="关"
                  on-color="#13ce66"
                  off-color="#ff4949"
                  @change="toswitch(scope.row.state)">
                </el-switch>
              </template> 
            </el-table-column>
          </el-table>
          <el-button type="primary"  @click="goback()" class="sc-footer">返回管理首页</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="点击统计" name="third">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  export default {
    data () {
      return {
        activeName2: 'first',
        tags: ['标签一', '标签二', '标签三', '标签四', '标签五'],
        ruleForm: {
          description: '',
          slug: '',
          spacename: '',
          typename: '',
          createdAt: null
        },
        response: {}
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
        const id = this.$route.query.id
        // api.GET(config.showAdvertisementAPI, {id: id})
        api.GET(config.showAdvPointAPI, {id: id})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000' && response.data.data) {
              const res = response.data.data
              this.ruleForm = res
              this.ruleForm.createdAt = this.formatDate(res.createdAt)
              console.log(res)
            }
          })
      },
      toEdit () {
        console.log('submit!')
        const id = this.$route.query.id
        this.$router.push({
          path: 'editpoint',
          query: {
            id: id
          }
        })
      },
      goback () {
        console.log('restSubmit!')
        this.$router.push({
          path: 'advpoint'
        })
      },
      handleSizeChange (value) {
        this.updateList({
          currentPage: this.response.currentPage,
          pageSize: value
        })
      },
      handleCurrentChange (value) {
        this.updateList({
          currentPage: value,
          pageSize: this.response.pageSize
        })
      },
      // 为调接口
      updateList (obj) {
        api.GET(config.advPointListAPI, obj)
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.response = this.transformDate(response.data.data)
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
	.sc-top-line {
    margin-top: 2rem; 
    padding: 1rem 2rem;
    border-top: 1px solid lightgray;
    background-color: #fff;
  }
  .sc-footer {
    float: right;
    margin-top: 10px;
  }
</style>
