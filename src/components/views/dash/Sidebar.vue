<template>
  <aside class="main-sidebar">

    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">

      <div class="user-panel">
        <div class="pull-left image">
          <img :src="pictureUrl"/>
        </div>
        <div class="pull-left info">
          <div>
            <p class="white">{{ displayName }}</p>
          </div>
          <a href="javascript:;">
            <i class="fa fa-circle text-success"></i>在线
          </a>
        </div>
      </div>

      <form v-on:submit.prevent class="sidebar-form">
        <div class="input-group">
          <input type="text"
                 name="search"
                 id="search"
                 class="search form-control"
                 data-toggle="hideseek" p
                 laceholder="Search Menus"
                 data-list=".sidebar-menu">
          <span class="input-group-btn">
            <button type="submit" name="search" id="search-btn" class="btn btn-flat">
              <i class="fa fa-search"></i>
            </button>
          </span>
        </div>
      </form>

      <ul class="sidebar-menu">
        <template v-for="item in model">
          <sidebar-menu :model="item"/>
        </template>
      </ul>
    </section>
  </aside>
</template>
<script>
import SidebarMenu from './SidebarMenu'
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'Sidebar',
  props: ['displayName', 'pictureUrl'],
  components: {SidebarMenu},
  data () {
    return {
      model: null,
      error: null,
      menuURL: config.menuAPI
    }
  },
  methods: {
    callMenuLeft () {
      api.GET(this.menuURL)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.model = response.data.data
          }
        })
        .catch(error => {
          this.error = error.response.statusText
          this.$message.error(error)
        })
    }
  },
  mounted () {
    this.callMenuLeft()
  }
}
</script>
<style>
  .user-panel .image img {
    border-radius: 50%;
  }
</style>
