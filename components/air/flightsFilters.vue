<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{ data.info.departCity }} - {{ data.info.destCity }}
        /
        {{ data.info.departDate }}
      </el-col>
      <!-- 起飞机场 -->
      <el-col :span="4">
        <el-select v-model="airport" @change="runFilters" size="mini" placeholder="起飞机场">
          <el-option v-for="(item,index) in data.options.airport" :key="index" :label="item" :value="item" />
        </el-select>
      </el-col>
      <!-- 起飞时间 -->
      <el-col :span="4">
        <el-select v-model="flightTimes" @change="runFilters" size="mini" placeholder="起飞时间">
          <el-option v-for="(item,index) in data.options.flightTimes" :key="index" :label="`${item.from}:00-${item.to}:00`" :value="`${item.from},${item.to}`" />
        </el-select>
      </el-col>
      <!-- 航空公司 -->
      <el-col :span="4">
        <el-select v-model="company" @change="runFilters" size="mini" placeholder="航空公司">
          <el-option v-for="(item,index) in data.options.company" :key="index" :label="item" :value="item" />
        </el-select>
      </el-col>
      <!-- 机型大小 -->
      <el-col :span="4">
        <el-select v-model="airSize" @change="runFilters" size="mini" placeholder="机型">
          <el-option v-for="(item,index) in sizeOptions " :key="index" :label="item.name" :value="item.size" />
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button @click="handleFiltersCancel" type="primary" round plain size="mini">
        撤销
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      airport: '', // 机场
      flightTimes: '', // 出发时间
      company: '', // 航空公司
      airSize: '', // 机型大小
      sizeOptions: [
        { name: '大', size: 'L' },
        { name: '中', size: 'M' },
        { name: '小', size: 'S' }
      ]
    }
  },
  methods: {
    // 联合触发
    runFilters () {
      let arr = this.data.flights
      if (this.airport) {
        arr = this.handleAirport(arr)
      }
      if (this.flightTimes) {
        arr = this.handleFlightTimes(arr)
      }
      if (this.company) {
        arr = this.handleCompany(arr)
      }
      if (this.airSize) {
        arr = this.handleAirSize(arr)
      }
      this.$emit('setDataList', arr)
    },
    // 选择机场时候触发
    handleAirport (oldFlightsList) {
      const arr = oldFlightsList.filter(v =>
        v.org_airport_name === this.airport
      )
      return arr
    },

    // 选择出发时间时候触发
    handleFlightTimes (oldFlightsList) {
      const arr = oldFlightsList.filter((v) => {
        const start = +v.dep_time.split(':')[0] // +是隐式转换

        const before = +this.flightTimes.split(',')[0]
        const after = +this.flightTimes.split(',')[1]

        return start >= before && start < after
      })
      return arr
    },

    // 选择航空公司时候触发
    handleCompany (oldFlightsList) {
      // 如果flights里的airline_name和选择的值（value）一致，那么将他加入到arr中
      const arr = oldFlightsList.filter(v =>
        v.airline_name === this.company
      )
      return arr
    },

    // 选择机型时候触发
    handleAirSize (oldFlightsList) {
      const arr = oldFlightsList.filter(v =>
        v.plane_size === this.airSize
      )
      return arr
    },

    // 撤销条件时候触发
    handleFiltersCancel () {
      this.airport = ''
      this.flightTimes = ''
      this.company = ''
      this.airSize = ''
      this.runFilters()
    }
  }
}
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>
