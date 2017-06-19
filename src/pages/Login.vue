<template>
  <div id="login" class="ui container text">
    <h1 class="header">用户登录</h1>
    <form class="ui form">
      <div class="field" :class="{ error: error.username }">
        <label>域账号</label>
        <input type="text" placeholder="请输入域账号（例如：mxfang）" v-model="input.username" @focus="error.username = false">
      </div>
      <div class="field" :class="{ error: error.password }">
        <label>密码</label>
        <input type="password" placeholder="请输入密码（前端加密传输，请放心填写）" v-model="input.password" @focus="error.password = false" @keyup.enter="login">
      </div>
      <div class="field">
        <div class="ui checkbox" @click="input.remember = !input.remember">
          <input type="checkbox" tabindex="0">
          <label>请在这台计算机上保存我的登录信息</label>
        </div>
      </div>
      <button class="ui primary button" type="button" @click="login">登陆</button>
      <button class="ui button" type="button" @click="page('/register')">还不是老司机？点此注册</button>
      <button class="ui button" type="button" @click="page('/forgot')">忘记密码</button>
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
          password: '',
          remember: false
        },
        pending: false,
        notice: ''
      }
    },
    methods: {
      login: function () {
        if (!this.checkInput()) {
          this.pending = true
          let input = {}
          Object.assign(input, this.input)
          webUtils.login(input, success => {
            this.notice = success
            const queryString = require('query-string')
            const params = queryString.parse(window.location.search)
            this.$emit('update', () => {
              if (params.from) {
                params.from.startsWith('/design') ? window.location.href = '/design' : this.page.redirect(params.from)
              } else {
                this.page.redirect('/')
              }
            })
          }, fail => {
            this.notice = fail
            setTimeout(() => {
              this.pending = false
              this.notice = ''
            }, 1500)
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
  #login {
    margin-top: 8rem;
  }
  .header {
    text-align: center;
  }
</style>
