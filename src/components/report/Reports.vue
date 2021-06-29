<template>
  <div>
    <!-- 面包屑内容 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 2.为 ECharts 准备一个具备大小（宽高） 的 DOM -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts
import * as echarts from 'echarts';
import _ from 'loadsh'

export default {
  name: "Reports",
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    // 4.准备配置项
    const {data: res} = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    const result = _.merge(res.data,this.options)
    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  }
}
</script>

<style scoped>

</style>