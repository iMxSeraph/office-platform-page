<template>
  <div id="output">
    <div class="ui secondary menu">
      <a class="item" :class="{ active: showIndex === index }" v-for="(month, index) in months" @click="getSummary(index)">{{ monthText(month) }}</a>
    </div>
    <div class="ui vertical segment">
      <div class="ui active inverted dimmer" v-show="pending">
        <div class="ui text loader">数据加载中...</div>
      </div>
      <table class="ui celled striped table">
        <thead>
        <tr><th colspan="9" class="center aligned">迟到情况</th></tr>
        <tr>
          <th class="center aligned">工号</th>
          <th class="center aligned">姓名</th>
          <th class="center aligned">日期</th>
          <th class="center aligned">迟到时间</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(lateTime, index) in lateSummaries">
          <td class="center aligned">{{ lateTime.userInfo.jid }}</td>
          <td class="center aligned">{{ lateTime.userInfo.name }}</td>
          <td class="center aligned">{{ dateText(lateTime.summary.date) }}</td>
          <td class="center aligned">{{ lateTime.summary.lateTime + ' min' }}</td>
        </tr>
        </tbody>
      </table>
      <table class="ui celled striped table">
        <thead>
        <tr><th colspan="9" class="center aligned">加班情况</th></tr>
        <tr>
          <th class="center aligned">工号</th>
          <th class="center aligned">姓名</th>
          <th class="center aligned">日期</th>
          <th class="center aligned">加班时间</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(overTime, index) in overSummaries">
          <td class="center aligned">{{ overTime.userInfo.jid }}</td>
          <td class="center aligned">{{ overTime.userInfo.name }}</td>
          <td class="center aligned">{{ dateText(overTime.summary.date) }}</td>
          <td class="center aligned">{{ overTime.summary.overTime + ' min' }}</td>
        </tr>
        </tbody>
      </table>
      <table class="ui celled striped table">
        <thead>
        <tr><th colspan="9" class="center aligned">实习生情况</th></tr>
        <tr>
          <th class="center aligned">工号</th>
          <th class="center aligned">姓名</th>
          <th class="center aligned">日期</th>
          <th class="center aligned">签到时间</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(internshipTime, index) in internshipSummaries">
          <td class="center aligned">{{ internshipTime.userInfo.jid }}</td>
          <td class="center aligned">{{ internshipTime.userInfo.name }}</td>
          <td class="center aligned">{{ dateText(internshipTime.summary.date) }}</td>
          <td class="center aligned">{{ timeText(internshipTime.summary.arriveTime) }}</td>
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
        lateSummaries: [],
        overSummaries: [],
        internshipSummaries: []
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
        this.lateSummaries = []
        this.overSummaries = []
        this.internshipSummaries = []
        webUtils.getAllSummary(this.months[index], response => {
          this.allSummaries = response
          this.allSummaries.forEach((userSummary) => {
            if (!userSummary.userInfo.internship) {
              // 正式员工
              userSummary.summaries.forEach((e) => {
                if (e.lateTime) {
                  this.lateSummaries.push({
                    userInfo: userSummary.userInfo,
                    summary: e
                  })
                }
                if (e.overTime) {
                  this.overSummaries.push({
                    userInfo: userSummary.userInfo,
                    summary: e
                  })
                }
              })
            } else {
              // 实习生
              userSummary.summaries.forEach((e) => {
                if (e.work) {
                  this.internshipSummaries.push({
                    userInfo: userSummary.userInfo,
                    summary: e
                  })
                }
              })
            }
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
