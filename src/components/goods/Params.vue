<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 消息提示 -->
      <el-alert
          title="注意: 只允许为第三级分类设置相关参数，后台数据有些为空，渲染不出来也是正常，请多次尝试。"
          type="warning"
          show-icon>
      </el-alert>
      <el-cascader
          v-model="selectedParams"
          :options="categoryList"
          :props="cateProps"
          @change="handleChange">
      </el-cascader>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 渲染动态参数 -->
          <el-button type="primary">添加参数</el-button>
          <el-table
              :data="manyArr"
              style="width: 100%"
              border>
            <el-table-column
                type="expand"
            ></el-table-column>
            <el-table-column
                type="index"
            ></el-table-column>
            <el-table-column
                prop="attr_name"
                label="参数名称"
                width="480">
            </el-table-column>
            <el-table-column
                label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <!-- 渲染静态参数 -->
          <el-button type="primary">添加参数</el-button>
          <el-table
              :data="onlyArr"
              style="width: 100%"
              border>
            <el-table-column
                type="expand"
            ></el-table-column>
            <el-table-column
                type="index"
            ></el-table-column>
            <el-table-column
                prop="attr_name"
                label="参数名称"
                width="480">
            </el-table-column>
            <el-table-column
                label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 商品参数列表
      categoryList: [],
      // 级联器配置项
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 选中的参数列表
      selectedParams: [],
      // 标签页默认激活
      activeName: 'many',
      // 动态参数列表
      manyArr: [],
      // 静态参数列表
      onlyArr: []
    }
  },
  methods: {
    // 获取商品参数列表
    getCategoryList() {
      this.$http.get(`/categories`).then(res => {
        this.categoryList = res.data.data
      })
    },
    // 当选择分类的时候触发
    handleChange() {
      this.$http.get(`/categories/${this.selectedParams[this.selectedParams.length - 1]}/attributes`, {
        params: {sel: this.activeName}
      }).then(res => {
        if (this.activeName === 'many') {
          this.manyArr = res.data.data
        } else {
          this.onlyArr = res.data.data
        }
      })
    },
    // 切换tabs栏 改变激活activeName值
    handleClick() {
      this.handleChange()
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style scoped>

</style>