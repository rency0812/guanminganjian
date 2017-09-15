<template> 
  <div class="sc-advertisement">
	  <div class="sc-main-content">
		<el-row class="sc-top-header">
		  <el-col :span="19">
        <div class="grid-content"><el-button type="primary" class="sc-top-btn" @click="toAddPoints">新增</el-button></div>
      </el-col>
		  <el-col :span="5">
        <div class="grid-content">
          <el-input placeholder="请输入内容" v-model="keyword">
            <el-button slot="append" icon="search" class="hover-search" @click="searchKeyword()"></el-button>
          </el-input>
        </div>
      </el-col>
		</el-row>
	  	<div class="sc-article-table-content">
	      <el-table :data="data.data" border stripe>
	        <el-table-column type="index" label="ID" width="50"></el-table-column>
	        <el-table-column prop="poster" label="广告点位"></el-table-column>
	        <el-table-column prop="title" label="广告标题" ></el-table-column>
	        <el-table-column label="广告内容" width="120">
	        <template scope="scope">
            <img class="SC-imgContent" :src="scope.row.link" alt="头像">
          </template>
	        </el-table-column>
	        <el-table-column prop="count" label="点击" width="80"></el-table-column>
	        <el-table-column prop="beginTime" label="开始时间" width="180px"></el-table-column>
	        <el-table-column prop="endTime" label="结束时间" width="180px"></el-table-column>
	        <el-table-column prop="createdAt" label="发布时间" width="180px"></el-table-column>
	        <el-table-column label="操作" width="180">
	          <template scope="scope">
	            <el-button size="small" icon="edit" @click="onEditAdvertisement(scope.row.id)" title="修改"></el-button>
	            <el-button size="small" icon="information" @click="toAdvertisementDetail(scope.row.id)" title="查看"></el-button>
	            <el-button size="small" icon="delete2" @click="onDeleteAdvertisement(scope.row.id)" title="删除"></el-button>
	          </template>
	        </el-table-column>
	      </el-table>
	    </div>
	    <div class="sc-article-table-footer">
	      <el-row type="flex" justify="center">
	        <el-col :span="12">
	          <el-pagination
	            @size-change="handleSizeChange"
	            @current-change="handleCurrentChange"
	            :current-page="data.currentPage"
	            :page-sizes="[10, 20, 50, 100]"
	            :page-size="data.pageSize"
	            :total="data.count"
	            layout="total, sizes, prev, pager, next, jumper">
	          </el-pagination>
	        </el-col>
	      </el-row>
	    </div>
	  </div>
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  data () {
    return {
      data: {},
      deleteId: null,
      keyword: null
    }
  },
  computed: {
  },
  methods: {
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss
    transformDate (res) {
      res.data.forEach(v => {
        if (v.createdAt) {
          v.createdAt = this.formatDate(v.createdAt)
        }
        if (v.beginTime) {
          v.beginTime = this.formatDate(v.beginTime)
        }
        if (v.endTime) {
          v.endTime = this.formatDate(v.endTime)
        }
      })
      return res
    },
    // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
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
    // 页面表格列表展示
    showList () {
      console.log(config.advertisementListAPI)
      api.GET(config.advertisementListAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.data = this.transformDate(response.data.data)
          }
        })
    },
    // 跳转新增广告页面
    toAddPoints () {
      console.log('新增')
      this.$router.push({
        path: 'addadvertisement'
      })
    },
    /**
     * 跳转编辑广告页面
     * id ： 当前所在行id
     * */
    onEditAdvertisement (id) {
      console.log('edit')
      this.$router.push({
        path: 'editadvertisement',
        query: {
          id: id
        }
      })
    },
     /**
     * 跳转广告页面详情
     * id ： 当前所在行id
     * */
    toAdvertisementDetail (id) {
      console.log('查看')
      this.$router.push({
        path: 'advertisementdetail',
        query: {
          id: id
        }
      })
    },
     /**
     * 删除该条广告信息
     * id ： 当前所在行deleteId
     * */
    onDeleteAdvertisement (id) {
      this.deleteId = id
      // console.log(this.deleteId)
      this.$confirm('你确定要删除本广告管理吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.deleteAdvertisementAPI, {id: this.deleteId})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.showList()
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
      }).catch(() => {
        console.log('取消')
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 根据搜索关键字来搜索匹配的字段
    */
    searchKeyword () {
      this.updateList({
        keyword: this.keyword
      })
    },
    handleSizeChange (value) {
      this.updateList({
        currentPage: this.data.currentPage,
        pageSize: value
      })
    },
    handleCurrentChange (value) {
      this.updateList({
        currentPage: value,
        pageSize: this.data.pageSize
      })
    },
    // 为调接口
    updateList (obj) {
      api.GET(config.advertisementListAPI, obj)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            // console.log(response.data.data)
            this.data = this.transformDate(response.data.data)
          }
        })
    }
  },
  mounted () {
    this.showList()
  }
}
</script>
<style scoped>
  .sc-advertisement {
    margin-top: 1rem;
    padding:2rem 1rem;
  }
  .sc-main-content {
	  border-top: 1px solid lightgray;
    padding: 1rem 1rem 2rem;
    /*background-color: #fff;*/
  }
  .sc-top-header {
	margin-bottom: 1rem;
	padding: 0 1rem;
  }
  .hover-search:hover {
	color: #108ce8;
  }
  .SC-imgContent {
  	margin-top: 5px;
    margin-bottom: 5px;
    width: 56px;
    height: 56px;
  }
</style>