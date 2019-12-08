<template>
  <el-form ref="form" :model="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input v-model="form.username" placeholder="用户名/手机" />
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input v-model="form.password" placeholder="密码" type="password" />
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">
        忘记密码
      </nuxt-link>
    </p>

    <el-button @click="handleLoginSubmit" class="submit" type="primary">
      登录
    </el-button>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleLoginSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
        //   return this.$axios({
        //     url: '/accounts/login',
        //     method: 'POST',
        //     data: this.form
        //   }).then((res) => {
        //     console.log(res)
        //     const data = res.data
        //     // 保存到state
        //     this.$store.commit('user/setUserInfo', data)
        //     return data
        //   })
          this.$store.dispatch('user/login', this.form).then((res) => {
            // 成功提示
            this.$message({
              message: '登录成功，正在跳转',
              type: 'success'
            })
            setTimeout(() => {
              this.$router.replace('/')
            }, 1000)
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>
