<template>
  <div class="sc-top-line">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding:3rem 3rem 0 0;width:50%;">
      <el-form-item label="点位名称" prop="spacename" required>
        <el-input v-model="ruleForm.spacename" placeholder="简单为宜"></el-input>
      </el-form-item>
      <el-form-item label="点位标识" prop="slug" required>
        <el-input v-model="ruleForm.slug" placeholder="缩写，全英文，64字以内，如：app.weicome.first，用于引用的"></el-input>
      </el-form-item>
      <el-form-item label="点位标签" prop="slug" required>
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          :closable="true"
          :close-transition="false"
          @close="handleClose(tag)"
          type="danger"
          style="margin:0 5px"
        >
        {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">新增</el-button>
      </el-form-item>
      <el-form-item label="点位分类" prop="typeId" required>
        <template>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
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
      <el-form-item label="点位说明" prop="description">
        <el-input type="textarea" v-model="ruleForm.description" placeholder="分类描述50字以内"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交保存</el-button>
        <el-button type="primary" @click="goBack()">返回管理首页</el-button>
      </el-form-item>
    </el-form>
  </div> 
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  export default {
    data () {
      return {
        dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: '',
        ruleForm: {
          description: '',
          slug: '',
          spacename: '',
          typeId: null
        },
        rules: {
          // spacename: [
          //   { required: true, message: '请输入点位名称', trigger: 'blur' }
          // ],
          // slug: [
          //   { required: true, message: '请输入点位标识', trigger: 'change' }
          // ],
          // typeId: [
          //   { required: true, message: '请选择一个点位类型', trigger: 'change' }
          // ],
          // description: [
          //   { required: false, message: '分类描述50字以内', trigger: 'blur' },
          //   { min: 0, max: 50, message: '分类描述长度在50字以内', trigger: 'blur' }
          // ]
        }
      }
    },
    methods: {
      handleClose (tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
        }
        // console.log(this.dynamicTags)
        this.inputVisible = false
        this.inputValue = ''
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // console.log(this.ruleForm)
            var obj = {}
            obj.description = this.ruleForm.description
            obj.slug = this.ruleForm.slug
            obj.spacename = this.ruleForm.spacename
            obj.type_id = Number(this.ruleForm.typeId)
            console.log(obj)
            api.POST(config.addAdvPointAPI, obj)
            .then(response => {
              if (response.status !== 200) {
                this.error = response.statusText
                return
              }
              if (response.data.errcode === '0000') {
                console.log(response)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      goBack () {
        this.$router.push({
          path: 'advpoint'
        })
      }
    }
  }
</script>
<style scoped>
	.sc-top-line {
    margin-top: 2rem; 
     border-top: 1px solid lightgray;
  }
</style>