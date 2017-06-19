<template>
  <div id="forgot" class="ui container text">
    <h1 class="header">重置密码</h1>
    <form class="ui form" id="form">
      <div class="field">
        <label>域账号</label>
        <div class="ui action input">
          <input type="text" placeholder="请输入域账号（例如：mxfang）" v-model="input.username" @focus="error.username = false">
          <button class="ui button positive" type="button">{{ button.text }}</button>
        </div>
      </div>
      <div class="field" :class="{ error: error.verifyCode }">
        <label>验证码</label>
        <input type="text" placeholder="请输入微信收到的验证码" v-model="input.verifyCode" @focus="error.verifyCode = false">
      </div>
      <div class="field" :class="{ error: error.password }">
        <label>新密码</label>
        <input type="password" placeholder="请输入密码（前端加密传输，请放心填写）" v-model="input.password" @focus="error.password = false">
      </div>
      <button class="ui primary button" type="button">确认修改</button>
      <div class="ui active inverted dimmer" v-show="pending">
        <div class="ui text loader">{{ notice }}</div>
      </div>
    </form>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        pending: false,
        error: {
          username: false,
          password: false,
          verifyCode: false
        },
        input: {
          username: '',
          password: '',
          verifyCode: ''
        },
        button: {
          text: '发送验证码'
        },
        notice: ''
      }
    },
    components: {
    }
  }
</script>

<style scoped>
  #forgot {
    margin-top: 8rem;
  }
  .header {
    text-align: center;
  }
</style>
