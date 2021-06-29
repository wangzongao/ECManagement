<template>
  <div>
    <!-- 面包屑内容 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input
                v-model="queryInfo.query"
                placeholder="请输入内容"
                clearable
                @clear="getOrdersList">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="getOrdersList"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-table
          :data="ordersList"
          border
          style="width: 100%">
        <el-table-column
            type="index">
        </el-table-column>
        <el-table-column
            prop="order_number"
            label="订单编号"
            width="380">
        </el-table-column>
        <el-table-column
            prop="order_price"
            label="订单价格"
            width="120">
        </el-table-column>
        <el-table-column
            prop="pay_status"
            label="是否付款"
            width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status==='0'" type="danger" size="mini">未付款</el-tag>
            <el-tag v-if="scope.row.pay_status==='1'" type="success" size="mini">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="is_send"
            label="是否发货"
            width="120">
        </el-table-column>
        <el-table-column
            prop="create_time"
            label="下单时间"
            width="250">
          <template slot-scope="scope">
            {{ scope.row.create_time|getTime }}
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template>
            <el-tooltip class="item" effect="dark" content="修改订单地址" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditAddressBox"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流进度" placement="top">
              <el-button type="success" icon="el-icon-location" size="mini"
                         @click="showProgressBox"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          align="center"
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址dialog -->
    <el-dialog
        title="修改地址"
        :visible.sync="editAddressVisible"
        width="50%">
      <el-form ref="form" :model="editAddressForm" label-width="120px" :rules="editAddressFormRules">
        <el-form-item prop="address1" label="省市区/县">
          <el-cascader :options="cityDate" v-model="editAddressForm.address1"
                       :props="{expandTrigger: 'hover'}"></el-cascader>
        </el-form-item>
        <el-form-item prop="address2" label="详细地址">
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度dialog -->
    <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%">
      <!-- 时间线 -->
      <el-timeline :reverse="true">
        <el-timeline-item
            v-for="(data, index) in progressData"
            :key="index"
            :timestamp="data.time">
          {{data.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityDate from './citydata.js'

export default {
  name: "Orders",
  data() {
    return {
      // 订单数据列表
      ordersList: [],
      // 请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单总数
      total: 0,
      // 控制修改地址dialog的显示与隐藏
      editAddressVisible: false,
      // 城市数据
      cityDate: cityDate,
      // 修改地址表单
      editAddressForm: {
        address1: '',
        address2: ''
      },
      // 修改地址表单验证规则
      editAddressFormRules: {
        address1: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        address2: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      },
      // 控制物流进度dialog的显示与隐藏
      progressVisible: false,
      // 物流数据
      progressData: ''
    }
  },
  methods: {
    // 获取订单数据列表
    getOrdersList() {
      this.$http.get('/orders', {
        params: this.queryInfo
      }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('订单数据获取失败')
        this.$message.success(res.data.meta.msg)
        this.ordersList = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    // 当每页数据条数发生改变时触发
    sizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrdersList()
    },
    // 当前页码发生改变时触发
    currentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrdersList()
    },
    // 显示修改订单地址dialog
    showEditAddressBox() {
      this.editAddressVisible = true
    },
    // 显示物流进度dialog
    showProgressBox() {
      // 模拟后台请求0.5s请求到数据
      setTimeout(() => {
        const res = {
          "data": [
            {
              "time": "2018-05-10 09:39:00",
              "ftime": "2018-05-10 09:39:00",
              "context": "已签收,感谢使用顺丰,期待再次为您服务",
              "location": ""
            },
            {
              "time": "2018-05-10 08:23:00",
              "ftime": "2018-05-10 08:23:00",
              "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
              "location": ""
            },
            {
              "time": "2018-05-10 07:32:00",
              "ftime": "2018-05-10 07:32:00",
              "context": "快件到达 [北京海淀育新小区营业点]",
              "location": ""
            },
            {
              "time": "2018-05-10 02:03:00",
              "ftime": "2018-05-10 02:03:00",
              "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
              "location": ""
            },
            {
              "time": "2018-05-09 23:05:00",
              "ftime": "2018-05-09 23:05:00",
              "context": "快件到达 [北京顺义集散中心]",
              "location": ""
            },
            {
              "time": "2018-05-09 21:21:00",
              "ftime": "2018-05-09 21:21:00",
              "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
              "location": ""
            },
            {
              "time": "2018-05-09 13:07:00",
              "ftime": "2018-05-09 13:07:00",
              "context": "顺丰速运 已收取快件",
              "location": ""
            },
            {
              "time": "2018-05-09 12:25:03",
              "ftime": "2018-05-09 12:25:03",
              "context": "卖家发货",
              "location": ""
            },
            {
              "time": "2018-05-09 12:22:24",
              "ftime": "2018-05-09 12:22:24",
              "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
              "location": ""
            },
            {
              "time": "2018-05-08 21:36:04",
              "ftime": "2018-05-08 21:36:04",
              "context": "商品已经下单",
              "location": ""
            }
          ],
          "meta": {"status": 200, "message": "获取物流信息成功！"}
        }
        this.progressData = res.data
      }, 500)
      this.progressVisible = true
    }
  },
  created() {
    this.getOrdersList()
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%
}
</style>