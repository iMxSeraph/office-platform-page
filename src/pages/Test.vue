<template>
  <div id="test" class="ui container text">
    <div class="ui vertical segment">
      <h1 class="ui header center aligned">录音宝提取音频提取</h1>
      <form class="ui form" id="form">
        <div class="field">
          <div class="ui action input">
            <input type="text" placeholder="请输入待提取的URL" v-model="url">
            <button class="ui button positive" type="button" @click="analyse()">提取</button>
          </div>
        </div>
      </form>
      <div class="ui vertical segment">
        <p>abc</p>
      </div>
    </div>
  </div>
</template>

<script>
  import webUtils from '../assets/js/webUtils'

  export default {
    mounted: function () {
    },
    data () {
      return {
        url: ''
      }
    },
    methods: {
      analyse: function () {
        webUtils.getBody(this.url, body => {
          console.log(body)
        })
      }
    }
  }
</script>

<style>
</style>
