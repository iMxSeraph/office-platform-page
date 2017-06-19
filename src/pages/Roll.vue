<template>
  <div id="roll" class="ui container text">
    <div class="ui vertical segment">
      <h1>Roll点请慎重，扔出即有效</h1>
      <div class="ui two item pointing menu">
        <a class="item" :class="{ active: active === 0 }" @click="active = 0">谁去拿外卖</a>
        <a class="item" :class="{ active: active === 1 }" @click="active = 1">研发组分享</a>
      </div>
      <div class="ui segment center aligned" v-show="active === 0">
        <button class="ui primary button" @click="roll(0)">试试手气</button>
        <table class="ui celled table">
          <thead>
          <tr>
            <th>姓名</th>
            <th>手气值</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in records.takeout">
            <td>{{ item.employee.gamer ? '最强王者 - ' + item.employee.name : item.employee.name }}</td>
            <td>{{ item.roll }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="ui segment center aligned" v-show="active === 1">
        <button class="ui primary button" @click="roll(1)">试试手气</button>
        <table class="ui celled table">
          <thead>
          <tr>
            <th>姓名</th>
            <th>手气值</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in records.share">
            <td>{{ item.employee.name }}</td>
            <td>{{ item.roll }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="ui active inverted dimmer" v-show="pending">
        <div class="ui text loader">数据加载中</div>
      </div>
    </div>
  </div>
</template>

<script>
  import 'stompjs/lib/stomp.min'
//  import webUtils from '../assets/js/webUtils'
  import cookie from 'cookie'

  export default {
    props: [
      'page',
      'userInfo'
    ],
    mounted: function () {
      let url = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      url += `//${window.location.hostname}/api/webSocket`
      let socket = new WebSocket(url)
      let cookies = cookie.parse(document.cookie)
      this.stompClient = window.Stomp.over(socket)
      this.stompClient.debug = null
      this.stompClient.connect({ TOKEN: cookies.TOKEN }, () => {
        this.pending = false
        // 接收历史消息
        this.stompClient.subscribe('/user/roll/takeout', data => {
          this.records.takeout = JSON.parse(data.body)
        })
        // 接收新消息
        this.stompClient.subscribe('/roll/takeout', data => {
          this.records.takeout.push(JSON.parse(data.body))
        })
        // 接收历史消息
        this.stompClient.subscribe('/user/roll/share', data => {
          this.records.share = JSON.parse(data.body)
        })
        // 接收新消息
        this.stompClient.subscribe('/roll/share', data => {
          this.records.share.push(JSON.parse(data.body))
        })
        this.stompClient.send('/app/roll/init', {}, null)
      })
    },
    data () {
      return {
        active: 0,
        stompClient: null,
        pending: true,
        records: {
          takeout: [],
          share: []
        }
      }
    },
    methods: {
      roll: function (type) {
        switch (type) {
          case 0:
            this.stompClient.send('/app/roll/takeout', {}, null)
            break
          case 1:
            this.stompClient.send('/app/roll/share', {}, null)
            break
        }
      }
    }
  }
</script>

<style scoped>
  h1 {
    text-align: center;
  }
</style>
