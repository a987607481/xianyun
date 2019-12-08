<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @setDataList="setDataList" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item" />

        <el-row type="flex" justify="center" style="margin-top:10px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            :total="flightsData.total"
            v-if="dataList.length>0"
            layout="total, sizes, prev, pager, next, jumper"
          />
          <div v-else-if="!loading">
            暂无航班信息！
          </div>
        </el-row>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <FlightsAside />
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from '@/components/air/flightsListHead.vue'
import FlightsItem from '@/components/air/flightsItem.vue'
import FlightsFilters from '@/components/air/flightsFilters.vue'
import FlightsAside from '@/components/air/flightsAside.vue'
export default {
  components: {
    FlightsListHead, FlightsItem, FlightsFilters, FlightsAside
  },
  data () {
    return {
      cacheFlightsData: {
        flights: [],
        info: {},
        options: {}
      }, // 缓存一份数据，只会修改一次
      flightsData: {
        flights: [],
        info: {},
        options: {}
      }, // 航班总数据
      // dataList: [], // 航班列表数据，用于循环flightsItem组件，单独出来是因为要分页
      pageIndex: 1, // 当前页数
      pageSize: 5, // 显示条数
      loading: true
    }
  },
  computed: {
    dataList () {
      // 从第几条开始截取
      const start = (this.pageIndex - 1) * this.pageSize
      // 截取到第几条结束
      const end = start + this.pageSize
      return this.flightsData.flights.slice(start, end)
    }
  },
  watch: {
    $route () {
      this.getData()
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$axios({
        url: `airs`,
        params: this.$route.query
      }).then((res) => {
        this.flightsData = res.data
        this.cacheFlightsData = { ...res.data }
        this.loading = false
      })
    },
    // 设置获取的数据的数量
    setDataList (arr) {
      if (arr) {
        this.pageIndex = 1
        this.flightsData.flights = arr
        this.flightsData.total = arr.length
      }
      this.flightsData.flights = arr
    },
    // 切换条数时触发
    handleSizeChange (value) {
      this.pageSize = value
      this.pageIndex = 1
    },
    // 切换页数时触发
    handleCurrentChange (value) {
      this.pageIndex = value
    }
  }
}
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>
