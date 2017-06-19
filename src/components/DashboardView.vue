<template>
  <div id="dashboard">
    <div class="ui secondary menu">
      <a class="item" :class="{ active: showIndex === index }" v-for="(month, index) in months" @click="getSummary(index)">{{ monthText(month) }}</a>
    </div>
    <div class="ui vertical segment">
      <div class="ui active inverted dimmer" v-show="pending">
        <div class="ui text loader">数据加载中...</div>
      </div>
      <table class="ui celled striped table">
        <thead>
          <tr><th colspan="9" class="center aligned">{{ userInfo.name }}</th></tr>
          <tr>
            <th class="center aligned">日期</th>
            <th class="center aligned">是否到岗</th>
            <th class="center aligned">签到时间</th>
            <th class="center aligned">签退时间</th>
            <th class="center aligned">迟到时间</th>
            <th class="center aligned">水果费</th>
            <th class="center aligned">晚到时间</th>
            <th class="center aligned">早到时间</th>
            <th class="center aligned">加班时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(summary, index) in summaries">
            <td class="center aligned">{{ dateText(summary.date) }}</td>
            <td class="center aligned" :class="{ negative: !summary.work }">
              {{ summary.work ? '是' : '否' }}
              <averment v-if="!summary.work" :summary="summary"></averment>
            </td>
            <td class="center aligned">{{ summary.arriveTime ? timeText(summary.arriveTime) : 'N/A' }}</td>
            <td class="center aligned">{{ summary.leftTime ? timeText(summary.leftTime) : 'N/A' }}</td>
            <td class="center aligned" :class="{ negative : summary.lateTime }">
              {{ summary.lateTime !== undefined ? summary.lateTime + ' min' : 'N/A' }}
              <averment v-if="summary.work && summary.lateTime" :summary="summary"></averment>
            </td>
            <td class="center aligned" :class="{ negative : summary.lateTime }">{{ summary.lateTime !== undefined ? (summary.lateTime > 30 ? '￥30' : '￥' + summary.lateTime) : 'N/A' }}</td>
            <td class="center aligned" :class="{ negative : summary.afterTime > 20 }">{{ summary.afterTime !== undefined ? summary.afterTime + ' min' : 'N/A' }}</td>
            <td class="center aligned" :class="{ positive : summary.earlyTime }">{{ summary.earlyTime !== undefined ? summary.earlyTime + ' min' : 'N/A' }}</td>
            <td class="center aligned" :class="{ positive : summary.overTime }">{{ summary.overTime !== undefined ? summary.overTime + ' min': 'N/A' }}</td>
          </tr>
          <tr>
            <td class="center aligned" colspan="4">总计</td>
            <td class="center aligned" :class="{ negative : total.lateTime }">{{ total.lateTime }}&nbsp;min</td>
            <td class="center aligned" :class="{ negative : total.fee }">￥{{ total.fee }}</td>
            <td class="center aligned"><i v-show="total.afterTime > 400" class="attention icon"></i>{{ total.afterTime }}&nbsp;min</td>
            <td class="center aligned" :class="{ positive : total.earlyTime }">{{ total.earlyTime }}&nbsp;min</td>
            <td class="center aligned" :class="{ positive : total.overTime }">{{ total.overTime }}&nbsp;min</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import webUtils from '../assets/js/webUtils'
  import dateFormat from 'dateformat'
  import Averment from './Averment'

  export default {
    props: [
      'userInfo'
    ],
    mounted: function () {
      let now = new Date()
      if (now.getDate() > 25) now.setMonth(now.getMonth() + 1)
      for (let i = 0; i < 6; i++) {
        let date = new Date(now)
        date.setMonth(now.getMonth() - i)
        this.months.push(date)
      }
      this.getSummary(0)
    },
    data () {
      return {
        pending: false,
        months: [],
        showIndex: 0,
        summaries: [],
        total: {
          lateTime: 0,
          fee: 0,
          afterTime: 0,
          earlyTime: 0,
          overTime: 0
        }
      }
    },
    methods: {
      monthText: function (month) {
        return dateFormat(month, 'yyyy年mm月')
      },
      dateText: function (date) {
        return dateFormat(date, 'yyyy-mm-dd')
      },
      timeText: function (time) {
        return dateFormat(time, 'HH:MM')
      },
      getSummary: function (index) {
        this.pending = true
        this.showIndex = index
        this.summaries = []
        this.total = {
          lateTime: 0,
          fee: 0,
          afterTime: 0,
          earlyTime: 0,
          overTime: 0
        }
        webUtils.getSummary(this.months[index], response => {
          this.summaries = response
          this.summaries.forEach((e) => {
            this.total.lateTime += e.lateTime ? e.lateTime : 0
            this.total.fee += e.lateTime ? (e.lateTime > 30 ? 30 : e.lateTime) : 0
            this.total.afterTime += e.afterTime ? e.afterTime : 0
            this.total.earlyTime += e.earlyTime ? e.earlyTime : 0
            this.total.overTime += e.overTime ? e.overTime : 0
          })
          this.pending = false
          setTimeout(function () {
            window.$('.ui.dropdown').dropdown()
          }, 500)
        })
      }
    },
    components: {
      Averment
    }
  }

</script>
<style scoped>
  .menu {
    margin-bottom: 0;
  }
</style>
