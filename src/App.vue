<template>
  <div id="app">
    <div class="container">
      <form-render
        :schema="schema2"
        :form-data="formData"
        @change="changeFormData"
      />
    </div>
  </div>
</template>

<script>
import FormRender from './index'
const schema1 = {
  type: 'object',
  properties: {
    string: {
      title: '字符串',
      type: 'string',
      maxLength: 12,
      'ui:disabled': true,
    },
    number: {
      title: '数字',
      type: 'number',
    },
    select: {
      title: '单选',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      'ui:width': '50%', // uiSchema 合并到 schema 中（推荐写法，书写便捷）
    },
  },
}
const schema2 = {
  type: 'object',
  properties: {
    string: {
      title: '字符串',
      type: 'string',
    },
    select: {
      title: '单选',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['选项1', '选项2', '选项3'],
    },
  },
}

export default {
  name: 'App',
  components: {
    FormRender,
  },
  data() {
    return {
      schema1: schema1,
      schema2: schema2,
      formData: {},
    }
  },
  watch: {
    formData: {
      deep: true,
      handler: function(val) {
        console.log(val)
      },
    },
  },
  methods: {
    changeFormData(data) {
      this.formData = data
    },
  },
}
</script>

<style scoped>
#app {
  padding: 24px 0;
}
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
