<template>
  <el-form ref="form" :model="form" :rules="rules" status-icon class="form">
    <!-- 用户名手机 -->
    <el-form-item class="form-item" prop="username">
      <el-input v-model="form.username" placeholder="用户名手机" />
    </el-form-item>

    <!--验证码  -->
    <el-form-item class="form-item" prop="captcha">
      <el-input v-model="form.captcha" placeholder="验证码">
        <template slot="append">
          <el-button @click="handleSendCaptcha">
            发送验证码
          </el-button>
        </template>
      </el-input>
    </el-form-item>

    <!-- 你的名字 -->
    <el-form-item class="form-item" prop="nickname">
      <el-input v-model="form.nickname" placeholder="你的名字" />
    </el-form-item>

    <!--密码  -->
    <el-form-item class="form-item" prop="password">
      <el-input v-model="form.password" placeholder="密码" type="password" />
    </el-form-item>

    <!-- 确认密码 -->
    <el-form-item class="form-item" prop="checkPassword">
      <el-input v-model="form.checkPassword" placeholder="确认密码" type="password" />
    </el-form-item>

    <el-button @click="handleRegSubmit" class="submit" type="primary">
      注册
    </el-button>
  </el-form>
</template>

<script>
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: '', // 登录用户名/手机
        password: '', // 登录密码
        checkPassword: '', // 确认密码
        nickname: '', // 昵称
        captcha: ''// 手机验证码
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
        ],
        checkPassword: [
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        nickname: [
          {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          }
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取验证码
    handleSendCaptcha () {
      if (!this.form.username) {
        this.$confirm('手机号码不能为空', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        return 0
      }

      if (this.form.username.length !== 11) {
        this.$confirm('手机号码格式错误', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        return 0
      }

      this.$axios({
        url: '/captchas',
        method: 'POST',
        data: {
          tel: this.form.username
        }
      })
        .then((res) => {
          const { code } = res.data
          this.$confirm(`模拟手机验证码为：${code}`, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
          })
        })
    },
    handleRegSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { checkPassword, ...props } = this.form

          this.$axios({
            url: `/accounts/register`,
            method: 'POST',
            data: props
          }).then((res) => {
            this.$message({
              message: '恭喜你注册成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$router.replace('/')
            }, 1000)
            console.log(res.data)
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
