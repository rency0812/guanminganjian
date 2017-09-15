<template>
  <div v-if="response">
    <el-row type="flex">
      <el-col class="article-detail" :span="16">
        <div class="article-header">
          <el-row>
            <h3>{{ response.title }}</h3>
          </el-row>
          <el-row class="summary-text">
            <h4>{{ response.digest }}</h4>
          </el-row>
          <el-row class="extra-text" type="flex" justify="space-between">
            <el-col :span="8">
              发布时间:{{ response.createdAt | toDate }}
            </el-col>
            <el-col :span="8">
              作者:{{ response.author }}
            </el-col>
            <el-col :span="8">
              浏览次数:{{ response.click }}
            </el-col>
          </el-row>
        </div>

        <div class="article-content">
          <div v-html="response.content">
          </div>
        </div>

        <div class="article-footer">
          <el-row type="flex" justify="space-between">
            <el-col :span="15">
              <el-tag type="primary" class="article-tag" v-for="tag in response.tags">{{ tag.name }}</el-tag>
            </el-col>
            <el-button disabled icon="star-on" size="mini">{{ response.upvote }}</el-button>
          </el-row>
        </div>
      </el-col>
      <el-col class="action-pane" :span="4">
        <el-select
          v-model="status"
          placeholder="文章状态"
          >
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
        <el-row type="flex" justify="center">
          <el-button @click="onDelete" class="ion-close-round" type="danger">删除</el-button>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button @click="onEdit" class="ion-edit" type="primary">编辑</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import api from 'src/api'
import config from 'src/config'

export default {
  data () {
    return {
      status: -1,
      options: [{
        value: 0,
        label: '未审核'
      }, {
        value: 2,
        label: '审核未通过'
      }, {
        value: 1,
        label: '审核通过'
      }],
      response: null
    }
  },
  methods: {
    updateData (data) {
      this.form.comment = data
    },
    onDelete () {
      this.$confirm('是否确认删除该篇文章？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.request('POST', config.deleteArticleAPI, {
          id: this.response.id
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            this.$router.push({
              path: '/admin/article'
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除失败'
            })
          }
        })
      })
    },
    onEdit () {
      this.$router.push({
        path: '/admin/article/add',
        query: {
          id: this.response.id
        }
      })
    }
  },
  watch: {
    status (newVal, oldVal) {
      if (oldVal === -1) {
        return
      }

      const data = {
        id: this.response.id,
        state: newVal
      }
      api.POST(config.updateArticleStatusAPI, data)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            this.$message.error(this.error)
            return
          }
          if (response.data.errcode === '0000') {
            this.$message({
              type: 'success',
              message: '修改文章状态成功'
            })
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    }
  },
  created () {
    const id = this.$route.query.id
    const URL = config.articleDetailAPI
    api.GET(URL, {
      id: id
    })
    .then(response => {
      if (response.status !== 200) {
        this.error = response.statusText
        this.$message.error(this.error)
        return
      }

      if (response.data.errcode === '0000') {
        this.response = response.data.data
        this.status = this.response.state
      }
    })
    .catch(error => {
      this.$message.error(error)
    })
  }
}
</script>
<style scoped>
  .article-detail {
    margin-left: 1rem;
    margin-top: 2rem;
    padding: 2rem;
    border-top: 1px solid lightgray;
    background-color: white;
    box-shadow: 1px 1px 1px 1px lightgrey;
  }
  .summary-text {
    overflow-x: hidden;
  }
  .summary-text h4 {
    color: gray;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
  }
  .extra-text {
    color: gray;
    text-align: center;
  }
  .article-header {
    border-bottom: 1px solid gray;
    margin-bottom: 1rem;
  }
  .article-footer {
    margin-top: 1rem;
    border-top: 1px solid gray;
    padding: 1rem;
  }
  .article-tag {
    margin-right: 1rem;
  }
  .action-pane {
    margin-top: 2rem;
    margin-left: 1rem;
    padding: 2rem;
    border-top: 1px solid lightgray;
    box-shadow: 1px 1px 1px 1px lightgray;
    background-color: white;
    height: 15rem;
  }
  .action-pane .el-button {
    width: 200px;
    margin-top: 10px;
  }
</style>
