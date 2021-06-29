<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="$router.push('/addGoods')">添加商品</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
          :data="goodsList"
          style="width: 100%"
          border>
        <el-table-column
            type="index">
        </el-table-column>
        <el-table-column
            prop="goods_name"
            label="商品名称"
            width="380">
        </el-table-column>
        <el-table-column
            prop="goods_price"
            label="商品价格(元)"
            width="140">
        </el-table-column>
        <el-table-column
            prop="goods_number"
            label="商品数量"
            width="140">
        </el-table-column>
        <el-table-column
            prop="goods_weight"
            label="商品重量(克)"
            width="140">
        </el-table-column>
        <el-table-column
            prop="upd_time"
            label="创建时间"
            width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | getTime() }}
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改商品" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除商品" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          align="center"
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改商品dialog -->
    <el-dialog
        title="修改商品"
        :visible.sync="editGoodsVisible"
        width="30%">
      <el-form ref="editGoodsFormRef" :model="editGoodsForm" :rules="editGoodsFormRules" label-width="80px">
        <el-form-item prop="goods_name" label="商品名称">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item prop="goods_price" label="商品价格">
          <el-input v-model.number="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item prop="goods_price" label="商品数量">
          <el-input v-model.number="editGoodsForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item prop="goods_weight" label="商品重量">
          <el-input v-model.number="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item prop="upd_time" label="创建时间">
          <el-date-picker
              v-model="editGoodsForm.add_time"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditGoodsForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      // 商品列表
      goodsList: [],
      // 请求商品参数列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品总数
      total: 0,
      // 控制修改商品dialog显示与隐藏
      editGoodsVisible: false,
      // 修改商品表单
      editGoodsForm: {},
      // 修改商品表单验证规则
      editGoodsFormRules: {
        goods_name: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        add_time: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 获取商品列表
    getGoodsList() {
      this.$http.get('/goods', {params: this.queryInfo}).then(res => {
        if (res.data.meta.status !== 200) return
        this.$message.success(res.data.meta.msg)
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    // 当每页数据条数发生改变时触发
    sizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 当前页码发生改变时触发
    currentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 修改商品
    editGoods(goods) {
      this.$http.get(`/goods/${goods.goods_id}`).then(res => {
        this.editGoodsForm = res.data.data
      })
      this.editGoodsVisible = true
    },
    // 提交修改商品表单
    submitEditGoodsForm() {
      this.$refs.editGoodsFormRef.validate(valid => {
        if (!valid) return this.$message.error("请输入正确信息")
        this.$http.put(`/goods/${this.editGoodsForm.goods_id}`, this.editGoodsForm).then(res => {
          console.log(res)
          this.editGoodsVisible = false
          this.getGoodsList()
        })
      })
    },
    // 删除商品
    deleteGoods(goods) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`goods/${goods.goods_id}`).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('删除商品失败')
          this.$message.success(res.data.meta.msg)
          this.getGoodsList()
        })
      })
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style scoped>

</style>