<template>
  <div id="averment" class="ui vertical segment">
    <table class="ui celled striped table">
      <thead>
        <tr>
          <th class="center aligned">日期</th>
          <th class="center aligned">姓名</th>
          <th class="center aligned">是否到岗</th>
          <th class="center aligned">原签到时间</th>
          <th class="center aligned">原迟到时间</th>
          <th class="center aligned">申辩原因</th>
          <th class="center aligned">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(averment, index) in averments" v-show="averment.averment.status === 'WAIT'">
          <td class="center aligned">{{ dateText(averment.averment.summary.date) }}</td>
          <td class="center aligned">{{ averment.userInfo.name }}</td>
          <td class="center aligned">{{ averment.averment.summary.work ? '是' : '否' }}</td>
          <td class="center aligned">{{ averment.averment.summary.arriveTime ? timeText(averment.averment.summary.arriveTime) : 'N/A' }}</td>
          <td class="center aligned">{{ averment.averment.summary.lateTime !== undefined ? averment.averment.summary.lateTime + ' min' : 'N/A' }}</td>
          <td class="center aligned">{{ reasonText(averment.averment.type) }}</td>
          <td class="center aligned">
            <div class="ui buttons">
              <button class="ui button" @click="doAver(index, false)">拒绝</button>
              <div class="or"></div>
              <button class="ui positive button" @click="doAver(index, true)">通过</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import webUtils from '../assets/js/webUtils'
  import dateFormat from 'dateformat'

  export default {
    mounted: function () {
      webUtils.getAverment('WAIT', response => {
        this.averments = response
      })
    },
    data () {
      return {
        averments: []
      }
    },
    methods: {
      doAver: function (index, approve) {
        webUtils.updateAverment(this.averments[index].averment.id, approve)
        this.averments.splice(index, 1)
      },
      dateText: function (date) {
        return dateFormat(date, 'yyyy-mm-dd')
      },
      timeText: function (time) {
        return dateFormat(time, 'HH:MM')
      },
      reasonText: function (type) {
        switch (type) {
          case 'ERRAND':
            return '出差'
          case 'VACATE':
            return '请假'
          case 'LATE':
            return '只迟到30分钟'
        }
      }
    }
  }

</script>

<style scoped>
</style>
