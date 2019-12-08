export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    // console.log(to.path)
    if (to.path === '/user/login') {
    //   const token = app.store.state.user.userInfo.token // 是否登录
      const token = JSON.parse(localStorage.getItem('login')).user.userInfo.token
      console.log(token)
      //   console.log(app.store.state.user.userInfo.token)
      if (token) {
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      next()
    }
  })
}
