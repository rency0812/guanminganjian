/*
 *  Kobe UI Version 0.0.1
 *
 *  A UI Component Collection Based On ElementUI and AdminLTE
 * */
import Login from './components/kobe/Login'
import Forgot from './components/kobe/Forgot'
import Button from './components/kobe/Button'
import Table from './components/kobe/Table'
import Unknown from './components/kobe/404'
import InfoCell from './components/kobe/InfoCell.vue'
import ImagePane from './components/kobe/ImagePane.vue'

const install = (Vue) => {
  Vue.component('kobe-login', Login)
  Vue.component('kobe-forgot', Forgot)
  Vue.component('kobe-button', Button)
  Vue.component('kobe-table', Table)
  Vue.component('kobe-404', Unknown)
  Vue.component('kobe-info-cell', InfoCell)
  Vue.component('kobe-image-pane', ImagePane)
}

export default install
