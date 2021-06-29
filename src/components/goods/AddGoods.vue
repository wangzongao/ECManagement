<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/goods'}">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert center title="添加商品信息" type="info" show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeName-0" finish-status="success" align-center :space="230">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品描述"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏选项卡 -->
      <el-form ref="goodsRef" :model="addForm" label-width="80px" :rules="addFormRules">
        <el-tabs tab-position="left" @tab-click="changeTabs" v-model="activeName" :before-leave="beforeLeaveTabs">
          <el-tab-pane label="商品名称" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addForm.goods_price" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                  v-model="addForm.goods_cat"
                  :options="categoryList"
                  :props="cateProps"
                  @change="cateChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item,index1) in manyArr" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="attrValsObj[index1]">
                <el-checkbox border v-for="(val,index2) in attrValsObj[index1]" :label="val" :key="index2">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyArr" :key="item.attr_id" :label="item.attr_name" label-width="150px">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片组件 -->
            <el-upload
                :action="url"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :headers="uploadHeader"
                list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品描述" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片dialog -->
    <el-dialog
        :visible.sync="imgPreviewVisible"
        width="80%">
      <img :src="previewUrl">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'loadsh'

export default {
  name: "AddGoods",
  data() {
    return {
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 商品分类参数
        goods_cat: [],
        // 商品描述
        goods_introduce: '',
        // 存放图片的数组
        pics: [],
        // 商品的参数，包含动态参数和静态参数
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
      },
      // 商品参数列表
      categoryList: [],
      // 级联器配置项
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数
      manyArr: [],
      attrValsObj: {},
      // 静态参数
      onlyArr: [],
      // 上传图片的地址
      url: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片请求头token
      uploadHeader: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 控制预览图片dialog的显示与隐藏
      imgPreviewVisible: false,
      // 预览图片地址
      previewUrl: ''
    }
  },
  methods: {
    // 获取商品参数列表
    getCategoryList() {
      this.$http.get(`/categories`).then(res => {
        this.categoryList = res.data.data
      })
    },
    // 分类级联选择框发生变化时触发
    cateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 离开当前tabs之前触发
    beforeLeaveTabs(activeName, oldActiveName) {
      if (oldActiveName === '0') {
        if (this.addForm.goods_name === '') {
          this.$message.error('请输入商品名称')
          return false
        } else if (this.addForm.goods_price === '') {
          this.$message.error('请输入商品价格')
          return false
        } else if (this.addForm.goods_weight === '') {
          this.$message.error('请输入商品重量')
          return false
        } else if (this.addForm.goods_number === '') {
          this.$message.error('请输入商品数量')
          return false
        } else if (this.addForm.goods_cat.length === 0) {
          this.$message.error('请选择三级商品分类')
          return false
        }
      }
    },
    // 切换tabs触发
    changeTabs() {
      if (this.activeName === '1') {
        // 如果切换到商品参数，请求动态参数
        this.$http.get(`/categories/${this.addForm.goods_cat[2]}/attributes`, {
          params: {sel: 'many'}
        }).then(res => {
          this.manyArr = res.data.data
          this.manyArr.forEach((item, index) => {
            this.attrValsObj[index] = item.attr_vals.split(',')
          })
        })
      } else if (this.activeName === '2') {
        // 如果切换到商品属性，请求静态参数
        this.$http.get(`/categories/${this.addForm.goods_cat[2]}/attributes`, {
          params: {sel: 'only'}
        }).then(res => {
          this.onlyArr = res.data.data
        })
      }
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.imgPreviewVisible = true
      this.previewUrl = file.response.data.url
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      const index = this.addForm.pics.findIndex(item => item.img === file.response.data.tmp_path)
      this.addForm.pics.splice(index, 1)
    },
    // 文件上传成功时的钩子
    handleSuccess(res) {
      this.addForm.pics.push({img: res.data.tmp_path})
    },
    // 添加商品
    addGoods() {
      // 1.处理参数
      // 深拷贝addForm
      const deepAddForm = _.cloneDeep(this.addForm)
      // goods_cat 转化成字符串
      deepAddForm.goods_cat = deepAddForm.goods_cat.join(',')
      // 处理attrs，包含动态参数和静态参数
      this.manyArr.forEach((item, index) => {
        deepAddForm.attrs.push({attr_id: item.attr_id, attr_value: this.attrValsObj[index].join(',')})
      })
      this.onlyArr.forEach(item => {
        deepAddForm.attrs.push({attr_id: item.attr_id, attr_value: item.attr_vals})
      })
      // 2.发送请求
      this.$http.post('/goods', deepAddForm).then(res => {
        if (res.data.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$message.success(res.data.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style scoped>
</style>