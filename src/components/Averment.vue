<template>
  <div class="averment">
    <i v-show="summary.status === 'WAIT'" class="hourglass full icon"></i>
    <div class="ui dropdown" v-show="summary.status === 'NONE'">
      <i class="comment icon"></i>
      <div class="menu">
        <div class="header">需要申辩？</div>
        <div class="item" @click="doAverment(0)">请假</div>
        <div class="item" @click="doAverment(1)">出差</div>
        <div class="item" @click="doAverment(2)">只迟到30分钟</div>
      </div>
    </div>
  </div>
</template>

<script>
  import webUtils from '../assets/js/webUtils'

  export default {
    created: function () {
      console.log(this.summary)
    },
    props: [
      'summary'
    ],
    data () {
      return {
        show: true
      }
    },
    methods: {
      doAverment: function (type) {
        this.summary.status = 'WAIT'
        webUtils.doAverment(this.summary.id, type)
      }
    }
  }
</script>

<style scoped>
  .averment {
    display: inline-block;
  }
</style>
