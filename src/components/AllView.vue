<template>
  <div id="output">
    <div class="ui secondary menu">
      <a class="item" :class="{ active: showIndex === index }" v-for="(month, index) in months" @click="getSummary(index)">{{ monthText(month) }}</a>
    </div>
    <div class="ui vertical segment">
      <div class="ui active inverted dimmer" v-show="pending">
        <div class="ui text loader">数据加载中...</div>
      </div>
      <table class="ui celled striped table" v-for="(summaries, userIndex) in allSummaries">
        <thead>
        <tr><th colspan="9" class="center aligned">{{ summaries.userInfo.name }}</th></tr>
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
        <tr v-for="(summary, index) in summaries.summaries">
          <td class="center aligned">{{ dateText(summary.date) }}</td>
          <td class="center aligned" :class="{ negative: !summary.work }">
            {{ summary.work ? '是' : '否' }}
          </td>
          <td class="center aligned">{{ summary.arriveTime ? timeText(summary.arriveTime) : 'N/A' }}</td>
          <td class="center aligned">{{ summary.leftTime ? timeText(summary.leftTime) : 'N/A' }}</td>
          <td class="center aligned" :class="{ negative : summary.lateTime }">
            {{ summary.lateTime !== undefined ? summary.lateTime + ' min' : 'N/A' }}
          </td>
          <td class="center aligned" :class="{ negative : summary.lateTime }">{{ summary.lateTime !== undefined ? (summary.lateTime > 30 ? '￥30' : '￥' + summary.lateTime) : 'N/A' }}</td>
          <td class="center aligned" :class="{ negative : summary.afterTime > 20 }">{{ summary.afterTime !== undefined ? summary.afterTime + ' min' : 'N/A' }}</td>
          <td class="center aligned" :class="{ positive : summary.earlyTime }">{{ summary.earlyTime !== undefined ? summary.earlyTime + ' min' : 'N/A' }}</td>
          <td class="center aligned" :class="{ positive : summary.overTime }">{{ summary.overTime !== undefined ? summary.overTime + ' min': 'N/A' }}</td>
        </tr>
        <tr>
          <td class="center aligned" colspan="4">总计</td>
          <td class="center aligned" :class="{ negative : total.lateTime }">{{ total[userIndex] ? total[userIndex].lateTime : 0 }}&nbsp;min</td>
          <td class="center aligned" :class="{ negative : total.fee }">￥{{ total[userIndex] ? total[userIndex].fee : 0 }}</td>
          <td class="center aligned"><i v-show="total.afterTime > 400" class="attention icon"></i>{{ total[userIndex] ? total[userIndex].afterTime : 0 }}&nbsp;min</td>
          <td class="center aligned" :class="{ positive : total.earlyTime }">{{ total[userIndex] ? total[userIndex].earlyTime : 0 }}&nbsp;min</td>
          <td class="center aligned" :class="{ positive : total.overTime }">{{ total[userIndex] ? total[userIndex].overTime : 0 }}&nbsp;min</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import webUtils from '../assets/js/webUtils'
  import dateFormat from 'dateformat'

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
        allSummaries: [],
        total: []
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
        this.allSummaries = []
        this.total = []
        webUtils.getAllSummary(this.months[index], response => {
          this.allSummaries = response
          this.allSummaries.forEach((userSummary, index) => {
            this.total[index] = {
              lateTime: 0,
              fee: 0,
              afterTime: 0,
              earlyTime: 0,
              overTime: 0
            }
            userSummary.summaries.forEach((e) => {
              this.total[index].lateTime += e.lateTime ? e.lateTime : 0
              this.total[index].fee += e.lateTime ? (e.lateTime > 30 ? 30 : e.lateTime) : 0
              this.total[index].afterTime += e.afterTime ? e.afterTime : 0
              this.total[index].earlyTime += e.earlyTime ? e.earlyTime : 0
              this.total[index].overTime += e.overTime ? e.overTime : 0
            })
          })
          this.pending = false
        })
      }
    }
  }

</script>
<style scoped>
  .menu {
    margin-bottom: 0;
  }
</style>
