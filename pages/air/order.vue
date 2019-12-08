<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <OrderForm :infoData="infoData" @setAllPrice="setAllPrice" />

      <!-- 侧边栏 -->
      <OrderAside :data="infoData" :allPrice="allPrice" />
    </el-row>
  </div>
</template>

<script>
import OrderForm from '@/components/air/orderForm.vue'
import OrderAside from '@/components/air/orderAside.vue'
export default {
  components: {
    OrderForm, OrderAside
  },
  data () {
    return {
      infoData: {
        insurances: [] // 初始化保险数据
      },
      allPrice: {
        numUsers: 0,
        allPrice: 0
      }

    }
  },
  mounted () {
    const { query } = this.$route
    this.$axios({
      url: `airs/${query.id}`,
      params: {
        seat_xid: query.seat_xid
      }
    }).then((res) => {
      this.infoData = res.data
      console.log(res.data)
    })
  },
  methods: {
    setAllPrice (price) {
      this.allPrice = price
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>
