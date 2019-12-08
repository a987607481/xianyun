<template>
  <div class="main">
    <!-- 剩机人 -->
    <div class="air-column">
      <h2>剩机人</h2>
      <el-form class="member-info">
        <div v-for="(item,index) in users" :key="index" class="member-info-item">
          <el-form-item label="乘机人类型">
            <el-input v-model="item.username" placeholder="姓名" class="input-with-select">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1" />
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input v-model="item.id" placeholder="证件号码" class="input-with-select">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option :checked="true" label="身份证" value="1" />
              </el-select>
            </el-input>
          </el-form-item>
          <span @click="handleDeleteUser(index)" class="delete-user"><i class="el-icon-delete-solid" /></span>
        </div>
      </el-form>

      <el-button @click="handleAddUsers" class="add-member" type="primary">
        添加乘机人
      </el-button>
    </div>
    <!-- 保险 -->
    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div v-for="(item,index) in infoData.insurances" :key="index" class="insurance-item">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×${users.length}  最高赔付${item.compensation}`"
            @change="handleInsurance(item.id)"
            border
          />
        </div>
      </div>
    </div>
    <!-- 联系人 -->
    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName" />
          </el-form-item>

          <el-form-item label="手机">
            <el-input v-model="contactPhone" placeholder="请输入内容">
              <template slot="append">
                <el-button @click="handleSendCaptcha">
                  发送验证码
                </el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha" />
          </el-form-item>
        </el-form>
        <el-button @click="handleSubmit" type="warning" class="submit">
          提交订单
        </el-button>
      </div>
    </div>
    <input :value="allPrice" type="hidden">
  </div>
</template>

<script>
export default {
  props: {
    infoData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      users: [
        {
          username: '',
          id: ''
        }
      ],
      insurances: [], // 保险数据
      contactName: '', // 联系人名字
      contactPhone: '', // 联系人电话
      captcha: '000000', // 验证码
      invoice: false // 发票
    }
  },
  computed: {
    allPrice () {
      let price = 0
      const len = this.users.length

      if (this.infoData.seat_infos) {
        price += this.infoData.seat_infos.org_settle_price * len
      }

      this.insurances.forEach((v) => {
        this.infoData.insurances.forEach((item) => {
          if (item.id === v) {
            price += item.price * len
          }
        })
      })

      price += this.infoData.airport_tax_audlet * len

      // 触发设置总金额事件
      this.$emit('setAllPrice', {
        numUsers: this.users.length,
        allPrice: price
      })

      return price
    }
  },
  methods: {
    // 移除乘机人
    handleDeleteUser (index) {
      this.users.splice(index, 1)
    },
    // 添加乘机人
    handleAddUsers () {
      this.users = [
        ...this.users,
        {
          username: '',
          id: ''
        }
      ]
    },
    // 发送手机验证码
    handleSendCaptcha () {
      if (!this.contactPhone) {
        this.$confirm('手机号码不能为空', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        return
      }

      if (this.contactPhone.length !== 11) {
        this.$confirm('手机号码格式错误', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        return
      }

      this.$axios({
        url: `/captchas`,
        method: 'POST',
        data: {
          tel: this.contactPhone
        }
      }).then((res) => {
        const { code } = res.data
        this.$confirm(`模拟手机验证码为：${code}`, '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
      })
    },
    // 选择保险
    handleInsurance (id) {
      // 存在则去除
      if (this.insurances.includes(id)) {
        const arr = this.insurances.slice(0)
        arr.splice(this.insurances.indexOf(id), 1)
        this.insurances = arr
      } else { // 不存在添加到insurances
        this.insurances = [...new Set([...this.insurances, id])]
      }
    },
    // 提交订单
    handleSubmit () {
      const orderData = {
        users: this.users,
        insurances: this.insurances,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        invoice: this.invoice,
        captcha: this.captcha,
        seat_xid: this.infoData.seat_infos.seat_xid,
        air: this.infoData.id
      }
      //   const token = this.$store.state.user.userInfo.token
      const { user: { userInfo } } = this.$store.state

      //   this.$message({
      //     message: '正在生成订单！请稍等',
      //     type: 'success'
      //   })
      this.$axios({
        url: `/airorders`,
        method: 'POST',
        data: orderData,
        headers: {
          Authorization: `Bearer ${userInfo.token || 'NO TOKEN'}`
        }
      }).then((res) => {
        const { data: { id } } = res.data

        // 跳转到付款页
        this.$router.push({
          path: '/air/pay',
          query: {
            id
          }
        })
        console.log(res.data)
      })
      // .catch((err) => {
      //   const { message } = err.response.data
      //   // 警告提示
      //   this.$confirm(message, '提示', {
      //     confirmButtonText: '确定',
      //     showCancelButton: false,
      //     type: 'warning'
      //   })
      // })
      console.log(orderData)
    }

  }
}
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  font-size: 18px;
  text-align: center;
  line-height: 16px;
  cursor: pointer;
  position: absolute;
  right: -40px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>
