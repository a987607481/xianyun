<template>
  <div class="container">
    <el-row>
      <el-col :span="6">
        <PostNav />
      </el-col>
      <el-col :span="18">
        <PostContent />
        <PostList />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PostNav from '@/components/post/postNav'
import PostContent from '@/components/post/postContent'
import PostList from '@/components/post/postList'
export default {
  components: {
    PostNav, PostContent, PostList
  }
}
</script>

<style lang='less' scoped>
.container{
  width: 1000px;
  margin: 20px auto;
}

</style>
