<template>
  <div class="content">
    <div class="search-wrapper">
      <el-row class="search-bar">
        <el-input v-model="input" placeholder="请输入想去的地方，比如: '广州' " />
        <i class="el-icon-search icon" />
      </el-row>
      <el-row class="search-recommend">
        推荐：
        <span><a href="">广州</a></span>
        <span><a href="">上海</a></span>
        <span><a href="">北京</a></span>
      </el-row>
    </div>
    <el-row type="flex" justify="space-between" class="search-title" align="middle">
      <h4>推荐攻略</h4>
      <el-button type="primary" icon="el-icon-edit">
        写游记
      </el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: ''
    }
  }
}
</script>

<style lang='less' scoped>
.content {
   margin-left: 36px;
  .search-wrapper {
    .search-bar {
      position: relative;
      border: 3px solid orange;
      /deep/.el-input {
        input {
          height: 34px;
          border: none;
          outline: none;
        }
      }
      .icon {
        position: absolute;
        right: 10px;
        top: 6px;
        font-size: 24px;
        color: orange;
        font-weight: 700;
      }
    }
    .search-recommend {
      font-size: 12px;
      color: #666;
      padding: 10px 0;
      span{
          &:hover{
              color: orange;
          }
      }
    }
  }
  .search-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    position: relative;
    h4 {
      font-size: 18px;
      color: orange;
      font-weight: 400;
      &:after {
        display: block;
        content: "";
        width: 72px;
        height: 2px;
        background: orange;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }
}
</style>
