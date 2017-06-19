<template>
  <div id="app" class="ui container page">
    <div id="header" class="ui container">
      <div class="ui secondary stackable menu">
        <div class="item">
          <img class="ui mini image" :src="require('./assets/logo.png')">
        </div>
        <a class="item" :class="{ active: currentView === 'Home' }" @click="page('/')">主页</a>
        <a class="item" :class="{ active: currentView === 'Sign' }" @click="page('/sign')">签到系统</a>
        <a class="item" href="/design/renying/总目录" target="_self">交互稿</a>
        <a class="item" :class="{ active: currentView === 'Roll' }" @click="page('/roll')">Roll点</a>
        <a class="item" :class="{ active: currentView === 'Test' }" @click="page('/test')">测试系统</a>
        <div class="right item">
          <a class="item" :class="{ active: currentView === 'Login' }" v-show="!userInfo" @click="page('/login')">登陆</a>
          <a class="item" v-show="userInfo" @click="logout">{{ userInfo && userInfo.name }}，登出</a>
        </div>
      </div>
    </div>
    <div class="ui active inverted dimmer" v-show="pending">
      <div class="ui text loader">请稍候</div>
    </div>
    <component :is="currentView" v-on:update="updateUserInfo" :page="page" :user-info="userInfo"></component>
    <div id="footer">
      <p><a href="https://muxin.io">© 2016 - 2017 方牧心</a></p>
    </div>
  </div>
</template>

<script>
  import NotFound from './pages/NotFound'
  import Home from './pages/Home'
  import Login from './pages/Login'
  import Forgot from './pages/Forgot'
  import Register from './pages/Register'
  import Roll from './pages/Roll'
  import Sign from './pages/Sign'
  import Monitor from './pages/Monitor'
  import Test from './pages/Test'
  import webUtils from './assets/js/webUtils'

  export default {
    created: function () {
      // 设置路由跳转
      webUtils.getUserInfo(userInfo => {
        this.userInfo = userInfo
        this.init()
      }, () => {
        this.init()
      })
    },
    data () {
      return {
        page: null,
        userInfo: null,
        currentView: 'Home',
        pending: true
      }
    },
    methods: {
      updateUserInfo: function (callback) {
        webUtils.getUserInfo(userInfo => {
          this.userInfo = userInfo
          callback()
        })
      },
      logout: function () {
        webUtils.logout()
        this.userInfo = null
      },
      init: function () {
        this.pending = false
        this.page = require('page')
        this.page('/', () => { this.redirect('Home', false) })
        this.page('/login', () => { this.redirect('Login', false) })
        this.page('/forgot', () => { this.redirect('Forgot', false) })
        this.page('/register', () => { this.redirect('Register', false) })
        this.page('/sign', (ctx) => { this.redirect('Sign', true, ctx) })
        this.page('/roll', (ctx) => { this.redirect('Roll', true, ctx) })
        this.page('/test', (ctx) => { this.redirect('Test', true, ctx) })
        this.page('/*', () => { this.currentView = 'NotFound' })
        this.page()
      },
      redirect: function (target, needLogin, ctx) {
        needLogin && !this.userInfo ? this.page.redirect('/login?from=' + ctx.path) : this.currentView = target
      }
    },
    components: {
      Home,
      Login,
      Forgot,
      Roll,
      Sign,
      Monitor,
      Test,
      Register,
      NotFound
    }
  }
</script>

<style scoped>

  div#app {
    position: relative;
    min-height: 100%;
    padding-bottom: 3rem;
  }

  div#footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 3rem;
  }

  div#footer p {
    margin-top: 1rem;
    text-align: center;
  }
</style>
