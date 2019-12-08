<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon" />
        {{ item.name }}
      </span>
    </el-row>

    <el-form ref="form" class="search-form-content" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          @select="handleDepartSelect"
          v-model="form.departCity"
          placeholder="请搜索出发城市"
          class="el-autocomplete"
        />
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          @select="handleDestSelect"
          v-model="form.destCity"
          placeholder="请搜索到达城市"
          class="el-autocomplete"
        />
      </el-form-item>
      <!-- change 用户确认选择日期时触发 -->
      <el-form-item label="出发时间">
        <el-date-picker @change="handleDate" v-model="form.departDate" type="date" placeholder="请选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label>
        <el-button @click="handleSubmit" style="width:100%;" type="primary" icon="el-icon-search">
          搜索
        </el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      tabs: [
        {
          icon: 'iconfont icondancheng', name: '单程'
        },
        {
          icon: 'iconfont icondancheng', name: '往返'
        }
      ],
      currentTab: 0,
      form: {
        departCity: '', // 出发城市
        departCode: '', // 出发城市代码
        destCity: '', // 到达城市
        destCode: '', // 到达城市代码
        departDate: '' // 日期字符串
      }
    }
  },
  methods: {
    // 查询操作封装
    // queryString是查询关键字
    querySearchAsync (queryString) {
      // Promise的构造函数接收一个参数，是函数，并且传入两个参数：resolve，reject，分别表示异步操作执行成功后的回调函数和异步操作执行失败后的回调函数
      return new Promise((resolve, reject) => {
        // 如果关键字是空，则直接返回
        if (!queryString) {
          return resolve([])
        }

        this.$axios({
          url: `/airs/city`,
          params: {
            name: queryString
          }
        }).then((res) => {
          const { data } = res.data
          const arr = data.map((v) => {
            return {
              ...v,
              value: v.name.replace('市', '')
            }
          })
          resolve(arr)
        })
      })
    },
    // tab切换时触发
    handleSearchTab (item, index) {
      if (index === 1) {
        this.$confirm('目前暂不支持往返，请使用单程选票！', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
      }
    },
    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDepartSearch (value, cb) {
      const arr = await this.querySearchAsync(value)
      if (arr.length > 0) {
        this.form.departCode = arr[0].sort
      }

      // if (!arr || arr.length === 0) {
      //   arr = [{ value: '暂不支持该城市' }]
      // }

      cb(arr)
    },
    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDestSearch (value, cb) {
      const arr = await this.querySearchAsync(value)
      // 默认选中第一个
      if (arr.length > 0) {
        this.form.destCode = arr[0].sort
      }
      cb(arr)
    },
    // 出发城市下拉选择时触发
    // item代表当前选中项
    handleDepartSelect (item) {
      this.form.departCity = item.value
      this.form.departCode = item.sort
      console.log(item)
    },

    // 目标城市下拉选择时触发
    // item代表当前选中项
    handleDestSelect (item) {
      this.form.destCity = item.value
      this.form.destCode = item.sort
    },
    // 触发和目标城市切换时触发
    handleReverse () {
      const { departCity, departCode, destCity, destCode } = this.form
      this.form.departCity = destCity
      this.form.departCode = destCode
      this.form.destCity = departCity
      this.form.destCode = departCode
    },
    // 修改时间
    handleDate (value) {
      this.form.departDate = moment(value).format('YYYY-MM-DD')
    },
    // 提交表单是触发
    handleSubmit () {
      // 表单验证数据
      const rules = {
        depart: {
          value: this.form.departCity,
          message: '请选择出发城市'
        },
        dest: {
          value: this.form.destCity,
          message: '请选择到达城市'
        },
        departDate: {
          value: this.form.departDate,
          message: '请选择出发时间'
        }
      }

      let valid = true // 表单验证结果

      Object.keys(rules).forEach((v) => {
        if (!valid) { return }
        const item = rules[v]

        if (!item.value) {
          valid = false
          this.$confirm(item.message, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
          })
        }
      })

      if (!valid) { return }

      // 添加到本地存储
      const airs = JSON.parse(localStorage.getItem('airs') || `[]`)
      airs.push(this.form)
      localStorage.setItem('airs', JSON.stringify(airs))

      this.$router.push({
        path: '/air/flights',
        query: this.form
      })
    }
  }
}
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
