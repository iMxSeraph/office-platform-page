<template>
  <div id="index" class="main">
    <div class="ui grid">
      <div class="sixteen wide column clock">{{ clock }}</div>
      <div id="day-chart" class="ten wide column ct-chart ct-perfect-fourth"></div>
      <div class="six wide column today">
        <p>今日流水：<span class="big">{{ totalFee }}</span>&nbsp;元</p>
        <p>今日单量：<span class="big">{{ totalNum }}</span>&nbsp;单</p>
        <p>本小时流水：<span class="big">{{ hourFee }}</span>&nbsp;元</p>
        <p>本小时单量：<span class="big">{{ hourNum }}</span>&nbsp;单</p>
      </div>
      <div id="month-chart" class="ten wide column ct-chart ct-perfect-fourth"></div>
      <div class="six wide column today">
        <p>本月目标流水：<span class="big">{{ targetFee }}</span>&nbsp;万元</p>
        <p>本月流水：<span class="big" :class="{ red: monthFee < targetFee }">{{ monthFee }}</span>&nbsp;万元</p>
        <p>本月单量：<span class="big">{{ monthNum }}</span>&nbsp;单</p>
      </div>
    </div>
  </div>
</template>
<script>
  import config from '../assets/js/config'
  import SockJS from 'sockjs-client'
  import 'stompjs/lib/stomp.min'
  import dateFormat from 'dateformat'

  export default {
    mounted: function () {
//      this.dayChart = new window.Chartist.Line('#day-chart', this.dayChartData)
      for (let i = 1; i <= this.getTotalDay(); i++) {
        this.monthChartData.labels.push(i)
      }
//      this.monthChart = new window.Chartist.Line('#month-chart', this.monthChartData)
//      this.yearChart = new window.Chartist.Line('#year-chart', this.yearChartData)
      let socket = new SockJS(config.url)
      let stompClient = window.Stomp.over(socket)
      stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame)
        stompClient.subscribe('/monitor/year', (data) => {
          this.year = JSON.parse(data.body)
//          this.yearChartData.series[0] = []
//          for (let i in this.year) {
//            this.yearChartData.series[0].push(this.year[i].totalFee ? this.year[i].totalFee / 1000 : 0)
//          }
//          this.yearChart.update()
        })
        stompClient.subscribe('/monitor/month', (data) => {
          this.month = JSON.parse(data.body)
          this.monthChartData.series[1] = []
          for (let i in this.month) {
            this.monthChartData.series[1].push(this.month[i].totalFee ? this.month[i].totalFee / 100 : 0)
          }
          this.monthChartData.series[0] = []
          for (let i = 0; i < this.getTotalDay(); i++) {
            let date = new Date()
            this.monthChartData.series[0].push(this.target[date.getMonth()].income * 10000 / this.getTotalDay() - 2)
          }
          this.monthChartData.series[2] = []
          let date = new Date()
          let nowTotalFee = 0
          for (let i = 1; i < date.getDate(); i++) {
            nowTotalFee += this.month[i].totalFee / 100
          }
          for (let i = 1; i < date.getDate(); i++) {
            this.monthChartData.series[2].push(nowTotalFee / date.getDate())
          }
          this.monthChart.update()
        })
        stompClient.subscribe('/monitor/day', (data) => {
          this.day = JSON.parse(data.body)
          this.dayChartData.series[0] = []
          for (let i in this.day) {
            this.dayChartData.series[0].push(this.day[i].totalFee ? this.day[i].totalFee / 100 : 0)
          }
          this.dayChart.update()
        })
        stompClient.send('/app/monitor/init', {}, null)
      }, () => {
        setTimeout(() => {
          window.location.reload(false)
        }, 3000)
      })
      this.clock = dateFormat('yyyy年mm月dd日 HH时MM分ss秒')
      setInterval(() => {
        this.clock = dateFormat('yyyy年mm月dd日 HH时MM分ss秒')
      }, 1000)
//      socket.connect({}, function (frame) {
//        console.log('Connected: ' + frame)
//        socket.subscribe('/topic/greetings', function (greeting) {
//        })
//      })
    },
    computed: {
      totalFee: function () {
        let keys = Object.keys(this.month)
        if (keys.length > 0) {
          return this.month[keys[keys.length - 1]].totalFee ? (this.month[keys[keys.length - 1]].totalFee / 100).toFixed(2) : '0.00'
        } else {
          return '0.00'
        }
      },
      totalNum: function () {
        let keys = Object.keys(this.month)
        if (keys.length > 0) {
          return this.month[keys[keys.length - 1]].totalNum ? this.month[keys[keys.length - 1]].totalNum : 0
        } else {
          return '0'
        }
      },
      hourFee: function () {
        let keys = Object.keys(this.day)
        if (keys.length > 0) {
          return this.day[keys[keys.length - 1]].totalFee ? (this.day[keys[keys.length - 1]].totalFee / 100).toFixed(2) : '0.00'
        } else {
          return '0.00'
        }
      },
      hourNum: function () {
        let keys = Object.keys(this.day)
        if (keys.length > 0) {
          return this.day[keys[keys.length - 1]].totalNum ? this.day[keys[keys.length - 1]].totalNum : 0
        } else {
          return '0'
        }
      },
      monthFee: function () {
        let keys = Object.keys(this.year)
        if (keys.length > 0) {
          return this.year[keys[keys.length - 1]].totalFee ? (this.year[keys[keys.length - 1]].totalFee / 1000000).toFixed(2) : '0.00'
        } else {
          return '0.00'
        }
      },
      monthNum: function () {
        let keys = Object.keys(this.year)
        if (keys.length > 0) {
          return this.year[keys[keys.length - 1]].totalNum ? this.year[keys[keys.length - 1]].totalNum : 0
        } else {
          return '0'
        }
      },
      targetFee: function () {
        let date = new Date()
        return this.target[date.getMonth()].income
      }
    },
    methods: {
      getTotalDay: function () {
        let date = new Date()
        date.setDate(1)
        date.setMonth(date.getMonth() + 1)
        date.setTime(date.getTime() - 24 * 3600 * 1000)
        return date.getDate()
      }
    },
    data () {
      return {
        clock: '',
        target: [{income: 60, profit: 12}, {income: 59.4, profit: 12.474}, {income: 74.4, profit: 16.368},
          {income: 108, profit: 22.08}, {income: 126.8, profit: 26.592}, {income: 140, profit: 30},
          {income: 183, profit: 36.75}, {income: 209.2, profit: 42.952}, {income: 243.6, profit: 54.4},
          {income: 276.76, profit: 67.348}, {income: 328.8, profit: 88.3}, {income: 395.2, profit: 115.2}],
        year: [],
        month: [],
        day: [],
        dayChart: null,
        dayChartData: {
          labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
          series: [[]]
        },
        yearChart: null,
        yearChartData: {
          labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
          series: [[]]
        },
        monthChart: null,
        monthChartData: {
          labels: [],
          series: [[], [], []]
        }
      }
    }
  }
</script>

<style scoped>
  a {
    display: block;
  }

  .grid {
    padding: 0 3rem;
  }

  .clock {
    text-align: center;
    font-size: 3rem;
    margin-top: .5rem;
    margin-bottom: .5rem;
  }

  #day-chart {
    height: 25rem;
  }

  #month-chart {
    height: 25rem;
  }
  .today {
    display: flex !important;
    display: -webkit-flex !important;
    flex-direction: column;
    -webkit-flex-direction: column;
    justify-content: center;
    -webkit-justify-content: center;
    font-size: 2rem;
    height: 25rem;
  }

  span.big {
    font-size: 3rem;
    color: darkorange;
  }

  .red {
    color: red !important;
  }
</style>
