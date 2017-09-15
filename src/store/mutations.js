export default {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_USER_INFO (state, userinfo) {
    state.userInfo = userinfo
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_CURRENT_CASE (state, object) {
    state.selectedCase = object
  },
  SET_ARTICLE_CATLG (state, array) {
    state.articleCatlg = array
  },
  SET_NOTIFY_ACTIVE_FORM (state, form) {
    state.activeFormData = form
  }
}
