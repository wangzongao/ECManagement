<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
          :data="rightsList"
          border
          style="width: 100%">
        <el-table-column
            type="index"
        >
        </el-table-column>
        <el-table-column
            prop="authName"
            label="权限名称"
            width="380">
        </el-table-column>
        <el-table-column
            prop="path"
            label="路径"
            width="380">
        </el-table-column>
        <el-table-column
            prop="level"
            label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'" size="mini">一级</el-tag>
            <el-tag v-if="scope.row.level==='1'" type="success" size="mini">二级</el-tag>
            <el-tag v-if="scope.row.level==='2'" type="info" size="mini">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    // 获取权限列表
    getRightsList() {
      this.$http.get('rights/list').then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('获取权限列表失败')
        this.rightsList = res.data.data
        this.$message.success(res.data.meta.msg)
      })
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style scoped>

</style>