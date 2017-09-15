<template>
  <li class="treeview">
    <a v-if="isFolder" href="#">
      <i :class="model.icon"></i>
      <span>{{ model.displayName }}</span>
      <span class="pull-right-container">
          <i class="fa fa-angle-left fa-fw pull-right" v-show="isFolder"></i>
      </span>
    </a>
    <router-link v-if="!isFolder" :to="{ path: model.url }">
      <i :class="model.icon"></i>
      <span>{{ model.displayName }}</span>
      <span class="pull-right-container">
          <i class="fa fa-angle-left fa-fw pull-right" v-show="isFolder"></i>
      </span>
    </router-link>
    <ul class="treeview-menu" v-if="isFolder">
      <template v-for="item in model.children" v-if="(model.children && model.children.length)">
        <router-link :to="{ path: item.url }">
          <sidebar-menu class="siderbar-menu-item" :model="item"/>
        </router-link>
      </template>
    </ul>
  </li>
</template>
<script>
export default {
  name: 'SidebarMenu',
  props: ['model'],
  components: {},
  data () {
    return {
      showopen: false
    }
  },
  computed: {
    isFolder: function () {
      return this.model.children && this.model.children.length
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.showopen = !this.showopen
      }
    }
  }
}
</script>
<style>
  /* override default */
  .sidebar-menu > .pageLink:hover {
    background-color: #233;
    cursor: pointer;
  }

  .sidebar-menu > .pageLink > ul {
    background-color: #344;
  }

  .sidebar-menu > .pageLink ul {
    padding-left: 2rem;
  }

  .sidebar-menu > .pageLink > ul .display-text {
    color: #bbb;
  }

  .sidebar-menu > .pageLink > ul .display-text:hover {
    color: white;
  }

  .sidebar-menu > li > a {
    padding: 12px 15px 12px 15px;
  }

  .siderbar-menu-item {
    padding: 5px 5px 5px 15px;
    font-size: 12px;
  }

  .arrow {
    padding-right: 1rem;
    float: right;
  }

  .sidebar-menu li.active > a > .fa-angle-left, .sidebar-menu li.active > a > .pull-right-container > .fa-angle-left {
    animation-name: rotate;
    animation-duration: .2s;
    animation-fill-mode: forwards;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(-90deg);
    }
  }

  .display-text {
    font-size: 1rem;
    color: white;
    padding: 1rem;
  }

  .fa-mobile {
    font-size: 20px;
  }

</style>
