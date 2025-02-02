import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'login' // 读取本地存储的数据到store
    })(store)
  })
}
