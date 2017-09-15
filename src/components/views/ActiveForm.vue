<template>
  <el-form 
    ref="active-form" 
    v-if="form"
    :rules="rules"
    :model="form" 
    label-width="120px"
    >
    <template v-for="item in activeData">
      <el-form-item :label="item.name" required>
        <el-input 
          :disabled="item.name === '标题' && urlDisabled"
          class="notify-form-input"
          v-if="item.type === 0" 
          v-model="form[item.key]"
          :placeholder="'请输入'+item.name"
          @change="handleChange"
          >
        </el-input>
        <el-date-picker
          v-else-if="item.type === 1"
          v-model="form[item.key]"
          :placeholder="'请输入'+item.name"
          @change="handleChange"
          type="datetime"
          >
        </el-date-picker>
        <el-input
          :disabled="item.name === '内容' && urlDisabled"
          type="textarea"
          class="notify-form-input"
          v-else-if="item.type === 2"
          v-model="form[item.key]"
          @change="handleChange"
          :placeholder="'请输入'+item.name"
          >
        </el-input>
      </el-form-item>
    </template>
    <el-form-item
      class="url-form-item"
      >
      <el-checkbox-group
        class="radio"
        v-model="hasURL"
        >
        <el-checkbox
        :disabled="urlDisabled"
          >
        链接
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item 
      v-if="hasURL">
      <el-input
        class="notify-form-input"
        v-model="form.url"
        placeholder="请输入链接地址"
        required
        >
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'sc-active-form',
  props: {
    data: {
      type: Object
    },
    change: {
      type: Function
    },
    disabled: {
      type: Boolean,
      default: false
    },
    article: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      activeData: null,
      hasURL: false,
      urlDisabled: false,
      rules: {
      },
      form: this.data.model
    }
  },
  watch: {
    hasURL (newVal, oldVal) {
      if (newVal === true) {
        this.rules.url = [{
          required: true,
          message: '请填写链接地址',
          trigger: 'change'
        }]
      }
    },
    article (newVal, oldVal) {
      this.urlDisabled = true
      this.form['first.DATA'] = newVal.title
      this.form['remark.DATA'] = newVal.digest
    }
  },
  methods: {
    handleChange (event) {
      this.change(this.form)
    }
  },
  mounted () {
    this.activeData = this.$store.state.activeFormData
    this.activeData.forEach(item => {
      this.form[item.key] = ''
      this.rules[item.key] = [{
        required: true,
        message: `请填写${item.name}`,
        trigger: 'change'
      }]
    })
  }
}
</script>

<style scoped>
.notify-form-input {
  width: 300px;
}
.url-form-item {
  margin-bottom: 0;
}
</style>
