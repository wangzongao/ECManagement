<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary">添加分类</el-button>
      <tree :data="categoriesList"
            :columns="columns"
            show-header
            show-index
            index-text="#"
            :expand-type="false"
            :selection-type="false"
            border>
        <template slot="isEffective" slot-scope="scope">
          <i v-if="scope.row.cat_deleted" class="el-icon-error" style="color:red"></i>
          <i v-else class="el-icon-success" style="color:lightgreen"></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level===1" type="success" size="mini">二级</el-tag>
          <el-tag v-if="scope.row.cat_level===2" type="info" size="mini">三级</el-tag>
        </template>
        <template slot="operation">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Categories",
  data() {
    return {
      // 商品分类列表
      categoriesList: [],
      queryInfo: {
        type: [1, 2, 3],
        pagenum: 1,
        pagesize: 10
      },
      columns: [
        {label: "分类名称", prop: 'cat_name'},
        {label: "是否有效", prop: 'cat_deleted', type: 'template', template: 'isEffective'},
        {label: "分类等级", prop: 'cat_level', type: 'template', template: 'level'},
        {label: "操作", type: 'template', template: 'operation'},
      ],
      total: 0
    }
  },
  methods: {
    getCategoriesList() {
      const loading = this.$loading({
        lock: true,
        text: '拼命获取数据中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.5)'
      })
      // 获取商品分类列表
      this.$http.get('/categories', {
        params: this.queryInfo
      }).then(res => {
        this.categoriesList = res.data.data.result
        this.total = res.data.data.total
        loading.close()
      })
    },
    // 当每页数据条数发生改变时触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCategoriesList()
    },
    // 当前页码发生改变时触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCategoriesList()
    }
  },
  created() {
    this.getCategoriesList()
  }
}
</script>

<style scoped>

</style>