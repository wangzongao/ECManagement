<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRoleVisible=true">添加角色</el-button>
      <el-table
          :data="rolesList"
          border
          style="width: 100%">
        <el-table-column
            type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id"
                    :class="['border-bottom',index1===0?'border-top':'']">
              <!-- 渲染一级权限 -->
              <el-col :span="4">
                <el-tag type="primary" closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="20">
                <el-row v-for="(item2,index2) in item1.children" :key="item2.id"
                        :class="[index2!==(item1.children.length-1)?'border-bottom':'']">
                  <el-col :span="5">
                    <el-tag type="success" closable="">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="19">
                    <el-col :span="6" v-for="item3 in item2.children" :key="item3.id">
                      <el-tag type="warning" closable>{{ item3.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
            type="index">
        </el-table-column>
        <el-table-column
            prop="roleName"
            label="角色名称"
            width="380">
        </el-table-column>
        <el-table-column
            prop="roleDesc"
            label="角色描述"
            width="380">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br>
    </el-card>
    <!-- 添加角色dialog -->
    <el-dialog
        title="添加角色"
        :visible.sync="addRoleVisible"
        width="30%">
      <el-form label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="addRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRoleForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色dialog -->
    <el-dialog
        title="编辑角色"
        :visible.sync="editRoleVisible"
        width="30%">
      <el-form label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRoleForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限dialog -->
    <el-dialog
        title="分配权限"
        :visible.sync="rightsVisible"
        width="30%"
        @close="showCheckArr=[]">
      <!-- 树形控件 -->
      <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="showCheckArr"
          :props="rightsProps"
          ref="rightsRef">
      </el-tree>
      <span slot="footer">
        <el-button @click="rightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 控制分配权限dialog对话框的显示和隐藏
      rightsVisible: false,
      // 树形权限列表
      rightsList: [],
      // 展示选中的权限
      showCheckArr: [],
      // props属性选项
      rightsProps: {
        label: 'authName',
        children: 'children'
      },
      // 当前角色的ID
      currentRoleId: 0,
      // 编辑角色信息
      editRoleInfo: {
        roleName: '',
        roleDesc: '',
      },
      // 控制编辑角色dialog对话框的显示和隐藏
      editRoleVisible: false,
      // 控制添加角色dialog对话框的显示和隐藏
      addRoleVisible: false,
      // 添加角色信息
      addRoleInfo: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  methods: {
    // 获取当前角色列表
    getRolesList() {
      this.$http.get('roles').then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('获取角色列表失败')
        this.rolesList = res.data.data
        this.$message.success(res.data.meta.msg)
      })
    },
    // 递归查找选中的权限
    findCheckArr(role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }
      role.children.forEach(item => this.findCheckArr(item, arr))
    },
    // 显示dialog对话框 请求数据
    showRights(role) {
      // 获取当前角色ID
      this.currentRoleId = role.id
      // 请求权限列表树形结构
      this.$http.get('rights/tree').then(res => {
        this.rightsList = res.data.data
      })
      // 存储当前角色的权限，并渲染
      this.findCheckArr(role, this.showCheckArr)
      // 显示对话框
      this.rightsVisible = true
    },
    // 提交添加角色表单
    submitAddRoleForm() {
      this.$http.post('/roles', this.addRoleInfo).then(res => {
        if (res.data.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success(res.data.meta.msg)
        this.addRoleVisible = false
        this.getRolesList()
      })
    },
    // 编辑角色
    editRole(row) {
      this.currentRoleId = row.id
      this.$http.get(`/roles/${row.id}`).then(res => {
        this.editRoleInfo = res.data.data
      })
      this.editRoleVisible = true
    },
    // 提交编辑角色表单
    submitEditRoleForm() {
      this.$http.put(`/roles/${this.currentRoleId}`, this.editRoleInfo).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success(res.data.meta.msg)
        this.editRoleVisible = false
        this.getRolesList()
      })
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，发起后台请求，删除角色
        this.$http.delete(`roles/${row.id}`).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('删除用户失败')
          this.getRolesList()
        })
        this.$message.success('删除角色成功');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 设置权限
    setRights() {
      // 构造rids权限ID列表来请求后台,全选和半选方法
      const rids = [...this.$refs.rightsRef.getCheckedKeys(), ...this.$refs.rightsRef.getHalfCheckedKeys()].join(',')
      this.$http.post(`/roles/${this.currentRoleId}/rights`, {rids}).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error("设置权限失败")
        this.$message.success(res.data.meta.msg)
        // 隐藏dialog
        this.rightsVisible = false
        // 重新渲染角色列表
        this.getRolesList()
      })
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #dddddd;
}

.border-top {
  border-top: 1px solid #dddddd;
}

.el-row {
  display: flex;
  align-items: center;
}

.el-tag {
  margin: 10px 0;
}
</style>