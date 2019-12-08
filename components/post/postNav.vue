<template>
  <div class="nav">
    <el-row>
      <el-col class="navlist">
        热门推荐
      </el-col>
      <el-col class="navlist">
        热门推荐
      </el-col>
      <el-col class="navlist">
        热门推荐
      </el-col>
      <el-col class="navlist">
        热门推荐
      </el-col>
    </el-row>

    <div class="recommend">
      <span>推荐城市</span>
      <img src="https://p3-q.mafengwo.net/s13/M00/41/C4/wKgEaVyaOs2AA9IKAAj8Lg2YzaU64.jpeg?imageMogr2%2Fthumbnail%2F1360x%2Fstrip%2Fquality%2F90" alt="">
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang='less' scoped>
.nav {
  .navlist {
    padding: 10px 20px;
    border: 1px solid #ddd;
    font-size: 14px;
    border-bottom: none;
    position: relative;
    background-color: #fff;
    z-index: 3;
    &:last-child {
      border-bottom: 1px solid #ddd;
    }
    &:after {
      display: block;
      content: "";
      width: 10px;
      height: 10px;
      border-right: 1px solid #999;
      border-top: 1px solid #999;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      position: absolute;
      right: 20px;
      top: 15px;
    }
    &:hover {
      color: orange;
      border-right-color: #fff;
      .navshow{
          display: block;
      }
    }
  }
  .recommend{
    span{
      display: block;
      padding: 18px 0 10px;
      border-bottom: 1px solid #ddd;
    }
    img{
      margin-top: 10px;
      width: 100%;
      object-fit: cover
    }
  }
}
</style>
