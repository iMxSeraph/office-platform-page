/**
 * Created by muxin on 2017/2/26.
 */
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

import cookie from 'cookie'
import page from 'page'

import dateFormat from 'dateformat'

const tokenResource = Vue.resource('/api/tokens')
const userResource = Vue.resource('/api/user')
const summaryResource = Vue.resource('/api/summaries/{month}')
const allSummaryResource = Vue.resource('/api/summaries/all/{month}')
const avermentResource = Vue.resource('/api/averments{/status}{/id}')

export default {
  // 登陆
  login: function (input, success, fail) {
    let md5 = require('md5')
    input.password = md5(input.password)
    tokenResource.save({}, input).then(response => {
      if (response.body.error) {
        fail && fail(response.body.error)
      } else {
        let token = cookie.serialize('TOKEN', response.body.message, input.remember ? { maxAge: 3600 * 24 * 30 } : null)
        document.cookie = token
        success && success('登陆成功')
      }
    }, response => {
      fail && fail(response.status)
    })
  },
  // 注册
  register: function (input, success, fail) {
    let md5 = require('md5')
    input.password = md5(input.password)
    userResource.save({}, input).then(response => {
      if (response.body.error) {
        fail && fail(response.body.error)
      } else {
        success && success(response.body.message)
      }
    }, response => {
      fail && fail(response.status)
    })
  },
  // 登出
  logout: function () {
    tokenResource.delete({}).then(() => {
      let cookie = require('cookie')
      let token = cookie.serialize('TOKEN', '', { maxAge: 0 })
      document.cookie = token
      page('/')
    })
  },
  // 获取用户信息
  getUserInfo: function (success, fail) {
    userResource.get({}).then(response => {
      success && success(response.body)
    }, response => {
      fail && fail(response.status)
    })
  },
  getSummary: function (month, callback) {
    summaryResource.get({ month: dateFormat(month, 'yyyymm') }).then(response => {
      callback && callback(response.body)
    })
  },
  getAllSummary: function (month, callback) {
    allSummaryResource.get({ month: dateFormat(month, 'yyyymm') }).then(response => {
      callback && callback(response.body)
    })
  },
  doAverment: function (id, type) {
    avermentResource.save({}, {id: id, type: type})
  },
  getAverment: function (status, callback) {
    avermentResource.get({ status: status }).then(response => {
      callback && callback(response.body)
    })
  },
  updateAverment: function (id, approve, callback) {
    avermentResource.update({ id: id }, { approve: approve }).then(response => {
      callback && callback(response.body)
    })
  },
  getBody: function (url, callback) {
    Vue.http.get(url).then(response => {
      callback && callback(response)
    })
  }
}
