<template>
  <div id="sign" class="ui container center aligned">
    <div class="ui large breadcrumb" v-show="userInfo && userInfo.admin">
      <a class="section" :class="{ active: active === 1 }" @click="active = 1">个人概况</a>
      <span class="divider">/</span>
      <a class="section" :class="{ active: active === 2 }" @click="active = 2">申辩审批</a>
      <span class="divider">/</span>
      <a class="section" :class="{ active: active === 3 }" @click="active = 3">全部详情</a>
      <span class="divider">/</span>
      <a class="section" :class="{ active: active === 4 }" @click="active = 4">数据导出</a>
    </div>
    <dashboard-view v-show="active === 1" :user-info="userInfo"></dashboard-view>
    <averment-view v-show="active === 2"></averment-view>
    <all-view v-show="active === 3" :user-info="userInfo"></all-view>
    <output-view v-show="active === 4"></output-view>
  </div>
</template>

<script>
  import DashboardView from '../components/DashboardView'
  import AvermentView from '../components/AvermentView'
  import AllView from '../components/AllView'
  import OutputView from '../components/OutputView.vue'

  export default {
    props: [
      'page',
      'userInfo'
    ],
    data () {
      return {
        active: 1
      }
    },
    components: {
      DashboardView,
      AvermentView,
      AllView,
      OutputView
    }
  }
</script>

<style scoped>
  .breadcrumb {
    margin-bottom: 1rem;
  }
</style>
