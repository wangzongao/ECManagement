<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input
                v-model="queryInfo.query"
                placeholder="请输入内容"
                clearable
                @clear="getUserList">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addUserVisible=true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
          :data="userList"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            width="50"
        >
        </el-table-column>
        <el-table-column
            prop="username"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="180">
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="电话"
            width="180">
        </el-table-column>
        <el-table-column
            prop="role_name"
            label="角色"
            width="180">
        </el-table-column>
        <el-table-column
            prop="mg_state"
            label="状态"
            width="180">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.mg_state"
                @change="changeStatus(scope.row.id,$event)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改用户" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRoles(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          align="center"
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 4, 8]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户dialog对话框 -->
    <el-dialog
        title="添加用户"
        :visible.sync="addUserVisible"
        width="50%"
        @close="closeAddUserDialog">
      <span slot="footer">
        <el-form ref="addUserFormRef" :model="addUserForm" label-width="80px"
                 :rules="addUserFormRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
           <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
           <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
           <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户dialog对话框 -->
    <el-dialog
        title="修改用户"
        :visible.sync="editUserVisible"
        width="50%">
      <span slot="footer">
        <el-form ref="editUserFormRef" :model="editUserParams" label-width="80px"
                 :rules="editUserParamsRules">
          <el-form-item label="用户名">
            <el-input v-model="editUserParams.username" disabled></el-input>
          </el-form-item>
           <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserParams.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
           <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserParams.mobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserList">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog
        title="分配角色"
        :visible.sync="rolesVisible"
        width="30%">
      <p>当前的用户:{{ currentUserInfo.username }}</p>
      <p>当前的角色:{{ currentUserInfo.role_name }}</p>
      <p>分配新角色:
        <el-select v-model="roleId" placeholder="请选择" clearable>
          <el-option
              v-for="item in roleRightsList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    // 验证邮箱规则
    let checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error("请输入合法的邮箱"))
    }
    // 验证手机号码的规则
    let checkMobile = (rule, value, cb) => {
      const regMobile = /^1[345789]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error("请输入合法的手机号码"))
    }
    return {
      // 请求用户列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },
      // 用户列表数据
      userList: [],
      // 当前数据总额
      total: 0,
      // 添加用户dialog显示或隐藏
      addUserVisible: false,
      // 添加用户参数
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户验证规则
      addUserFormRules: {
        username: [
          {required: true, message: '姓名不能为空', trigger: 'blur'},
          {min: 5, max: 16, message: '长度应为5~16位', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 5, max: 16, message: '长度应为5~16位', trigger: 'blur'},
        ],
        email: [
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      // 修改用户dialog显示或隐藏
      editUserVisible: false,
      // 存储获取到的用户信息
      editUserParams: {
        username: '',
        email: '',
        mobile: '',
        id: '',
        rid: ''
      },
      // 修改用户信息对话框规则
      editUserParamsRules: {
        email: [
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      // 分配角色dialog显示或隐藏
      rolesVisible: false,
      // 当前角色信息
      currentUserInfo: {},
      // 角色权限列表
      roleRightsList: [],
      // 角色Id
      roleId: ''
    }
  },
  methods: {
    // 请求用户列表数据
    getUserList() {
      this.$http.get('/users', {
        // 通过双向绑定输入框可以搜索
        params: this.queryInfo
      }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error("请求用户列表失败")
        this.$message.success("请求用户列表成功")
        this.userList = res.data.data.users
        this.total = res.data.data.total
      })
    },
    // 当每页数据条数发生改变时触发
    sizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 当前页码发生改变时触发
    currentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 修改用户状态
    changeStatus(id, status) {
      this.$http.put(`users/${id}/state/${status}`).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('用户状态修改失败')
        }
        this.getUserList()
      })
    },
    // 添加用户
    addUser() {
      this.$refs.addUserFormRef.validate(valid => {
        if (!valid) return alert("请输入正确的信息")
        this.$http.post('/users', this.addUserForm).then(() => {
          // 关闭dialog对话框
          this.addUserVisible = false
          // 再次获取用户列表
          this.getUserList()
        })
      })
    },
    // 关闭对话框
    closeAddUserDialog() {
      // 重置表单
      this.$refs.addUserFormRef.resetFields()
    },
    // 修改用户信息
    editUser(row) {
      this.editUserVisible = true
      // 获取当前用户信息
      this.$http.get(`users/${row.id}`).then(res => {
        this.editUserParams = res.data.data
      })
    },
    // 点击确认编辑，发送修改请求
    editUserList() {
      this.$refs.editUserFormRef.validate(valid => {
        if (!valid) return this.$message.error("请输入正确的信息")
        this.$http.put(`users/${this.editUserParams.id}`, this.editUserParams).then(() => {
          this.editUserVisible = false
          this.getUserList()
        })
      })
    },
    // 删除用户
    deleteUser(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，发起后台请求，删除用户
        this.$http.delete(`users/${row.id}`).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('删除用户失败')
          this.getUserList()
        })
        this.$message.success('删除用户成功');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 分配角色
    showRoles(role) {
      this.rolesVisible = true
      this.currentUserInfo = role
      // 获取角色权限列表
      this.$http.get('/roles').then(res => {
        if (res.data.meta.status !== 200) return;
        this.roleRightsList = res.data.data
      })
    },
    // 设置角色
    setRoles() {
      this.$http.put(`/users/${this.currentUserInfo.id}/role`, {rid: this.roleId}).then(res => {
        if (res.data.meta.status !== 200) return
        this.getUserList()
        this.rolesVisible = false
        this.roleId = ''
      })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style scoped>
</style>