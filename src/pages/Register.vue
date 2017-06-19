<template>
  <div id="register" class="ui container text">
    <h1 class="header">新同学注册</h1>
    <form class="ui form">
      <div class="field" :class="{ error: error.username }">
        <label>域账号</label>
        <input type="text" placeholder="请输入域账号（例如：mxfang）" v-model="input.username" @focus="error.username = false">
      </div>
      <div class="field" :class="{ error: error.password }">
        <label>密码</label>
        <input type="password" placeholder="请输入密码（前端加密传输，请放心填写）" v-model="input.password" @focus="error.password = false" @keyup.enter="register">
      </div>
      <button class="ui primary button" type="button" @click="register">注册</button>
      <div class="ui active inverted dimmer" v-show="pending">
        <div class="ui text loader">{{ notice }}</div>
      </div>
    </form>
  </div>
</template>

<script>
  import webUtils from '../assets/js/webUtils'

  export default {
    props: [
      'page'
    ],
    mounted: function () {
      window.$('.ui.checkbox').checkbox()
    },
    data () {
      return {
        error: {
          username: false,
          password: false
        },
        input: {
          username: '',
          password: ''
        },
        pending: false,
        notice: ''
      }
    },
    methods: {
      register: function () {
        if (!this.checkInput()) {
          this.pending = true
          let input = {}
          Object.assign(input, this.input)
          webUtils.register(input, success => {
            this.notice = success
            setTimeout(() => {
              this.page('/login')
            }, 1500)
          }, fail => {
            this.notice = fail
          })
        }
      },
      checkInput: function () {
        let error = false
        if (this.input.username === '') {
          this.error.username = true
          error = true
        }
        if (this.input.password === '') {
          this.error.password = true
          error = true
        }
        return error
      }
    }
  }
</script>

<style scoped>
  #register {
    margin-top: 8rem;
  }
  .header {
    text-align: center;
  }
</style>
