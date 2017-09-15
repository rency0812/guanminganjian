<template>
  <div :class="['wrapper', classes]">
    <header class="main-header">
      <a href="/" class="logo">
        <span class="logo-mini"><img src="static/img/copilot-logo-white.svg" alt="Logo"
                                     class="img-responsive center-block"></span>
        <div class="logo-lg">
          <img src="static/img/copilot-logo-white.svg" alt="Logo" class="img-responsive">
          <span>{{ appInfo ? appInfo.appName : '深传互动' }}</span>
        </div>
      </a>

      <nav class="navbar navbar-static-top" role="navigation">
        <!-- <a href="javascript:;" class="sidebar-toggle" data-toggle="offcanvas" role="button"> -->
        <!--   <span class="sr-only">Toggle navigation</span> -->
        <!-- </a> -->
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">
            <!-- <li class="dropdown messages-menu"> -->
            <!--   <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> -->
            <!--     <i class="fa fa-envelope-o"></i> -->
            <!--     <span class="label label-success">{{ userInfo.messages | count }}</span> -->
            <!--   </a> -->
            <!--   <ul class="dropdown-menu"> -->
            <!--     <li class="header">You have {{ userInfo.messages | count }} message(s)</li> -->
            <!--     <li v-if="userInfo.messages.length > 0"> -->
            <!--       <ul class="menu"> -->
            <!--         <li> -->
            <!--           <a href="javascript:;"> -->
            <!--             <h4> -->
            <!--               Support Team -->
            <!--               <small><i class="fa fa-clock-o"></i> 5 mins</small> -->
            <!--             </h4> -->
            <!--             <p>Why not consider this a test message?</p> -->
            <!--           </a> -->
            <!--         </li> -->
            <!--       </ul> -->
            <!--     </li> -->
            <!--     <li class="footer" v-if="userInfo.messages.length > 0"><a href="javascript:;">See All Messages</a></li> -->
            <!--   </ul> -->
            <!-- </li> -->

            <!-- <li class="dropdown notifications-menu"> -->
            <!--   <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> -->
            <!--     <i class="fa fa-bell-o"></i> -->
            <!--     <span class="label label-warning">{{ userInfo.notifications | count }}</span> -->
            <!--   </a> -->
            <!--   <ul class="dropdown-menu"> -->
            <!--     <li class="header">You have {{ userInfo.notifications | count }} notification(s)</li> -->
            <!--     <li v-if="userInfo.notifications.length > 0"> -->
            <!--       <ul class="menu"> -->
            <!--         <li> -->
            <!--           <a href="javascript:;"> -->
            <!--             <i class="fa fa-users text-aqua"></i> 5 new members joined today -->
            <!--           </a> -->
            <!--         </li> -->
            <!--       </ul> -->
            <!--     </li> -->
            <!--     <li class="footer" v-if="userInfo.notifications.length > 0"><a href="javascript:;">View all</a></li> -->
            <!--   </ul> -->
            <!-- </li> -->

            <!-- <li class="dropdown tasks-menu"> -->
            <!--   <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> -->
            <!--     <i class="fa fa-flag-o"></i> -->
            <!--     <span class="label label-danger">{{ userInfo.tasks | count }} </span> -->
            <!--   </a> -->
            <!--   <ul class="dropdown-menu"> -->
            <!--     <li class="header">You have {{ userInfo.tasks | count }}  task(s)</li> -->
            <!--     <li v-if="userInfo.tasks.length > 0"> -->
            <!--       <ul class="menu"> -->
            <!--         <li> -->
            <!--           <a href="javascript:;"> -->
            <!--             <h3> -->
            <!--               Design some buttons -->
            <!--               <small class="pull-right">20%</small> -->
            <!--             </h3> -->
            <!--             <div class="progress xs"> -->
            <!--               <div class="progress-bar progress-bar-aqua" -->
            <!--                    style="width: 20%" -->
            <!--                    role="progressbar" -->
            <!--                    aria-valuenow="20" -->
            <!--                    aria-valuemin="0" -->
            <!--                    aria-valuemax="100"> -->
            <!--                 <span class="sr-only">20% Complete</span> -->
            <!--               </div> -->
            <!--             </div> -->
            <!--           </a> -->
            <!--         </li> -->
            <!--       </ul> -->
            <!--     </li> -->
            <!--     <li class="footer" v-if="userInfo.tasks.length > 0"> -->
            <!--       <a href="javascript:;">View all tasks</a> -->
            <!--     </li> -->
            <!--   </ul> -->
            <!-- </li> -->

            <li class="dropdown user user-menu">
              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                <img v-bind:src="demo.avatar" class="user-image" alt="User Image">
                <span class="hidden-xs">{{ demo.displayName }}</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <sidebar :display-name="demo.displayName"
             :picture-url="demo.avatar"/>

    <div class="content-wrapper">
      <section class="content-header">
        <h1>
          {{ $route.name.toUpperCase() }}
          <small>{{ $route.meta.description }}</small>
        </h1>
        <ol class="breadcrumb">
          <li><router-link to="/admin"><i class="fa fa-home"></i>主页</router-link></li>
          <li class="active">{{$route.name.toUpperCase()}}</li>
        </ol>
      </section>

      <router-view></router-view>
    </div>

    <footer class="main-footer">
      <strong>Copyright &copy; {{year}} <a href="http://www.shencom.cn/">{{ appInfo ? appInfo.systemAuthor : '深传互动' }}</a>.</strong> All rights reserved.
    </footer>
  </div>
</template>

<script>
import api from 'src/api'
import {mapState} from 'vuex'
import config from '../config'
import Sidebar from './views/dash/Sidebar'
import 'hideseek'

export default {
  name: 'Dash',
  components: {
    Sidebar
  },
  data: function () {
    return {
      // section: 'Dash',
      year: new Date().getFullYear(),
      classes: {
        fixed_layout: config.fixedLayout,
        hide_logo: config.hideLogoOnMobile
      },
      error: '',
      appInfo: {}
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    demo () {
      return {
        displayName: this.userInfo.username,
        avatar: this.userInfo.avatar
      }
    }
  },
  methods: {
    changeloading () {
      this.$store.commit('TOGGLE_SEARCHING')
    },
    getAppInfo () {
      this.appInfo = this.$store.state.appInfo
    },
    setAppInfo () {
      const URI = config.appInfoAPI
      api.GET(URI, {id: 1})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          this.appInfo = response.data.data
        })
        .catch(error => {
          this.$message.error(error)
        })
    }
  },
  created () {
    this.setAppInfo()
  }
}
</script>

<style lang="scss">
.wrapper.fixed_layout {
  .main-header {
    position: fixed;
    width: 100%;
  }

  .content-wrapper {
    padding-top: 50px;
  }

  .main-sidebar {
    position: fixed;
    height: 100vh;
  }
}

.wrapper.hide_logo {
  @media (max-width: 767px) {
    .main-header .logo {
      display: none;
    }
  }
}

.logo-mini, .logo-lg {
  text-align: left;

  img {
    padding: .4em;
  }
}

.logo-lg {
  img {
    display: -webkit-inline-box;
    width: 25%;
  }
}

.user-panel {
  height: 4em;
}

hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}
.wrapper {
  min-height: 100%;
  overflow-y: scroll;
}
.content-wrapper {
  min-height: 90vh;
}
</style>
