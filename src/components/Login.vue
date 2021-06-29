<template>
  <div class="login">
    <div class="login-context">
      <img src="../assets/logo.jpg">
      <el-form ref="loginFormRef" :model="user" :rules="formRules">
        <el-form-item prop="username">
          <el-input v-model="user.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="user.password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      user: {
        username: 'admin',
        password: '123456'
      },
      formRules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: "blur"},
          {min: 5, max: 16, message: '长度为5~16位', trigger: "blur"}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    submitForm() {
      // 登录之前先校验，只有校验成功后才可以登录
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('login', this.user)
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('登录失败')
        } else {
          this.$message.success('登录成功！')
          // 保存当前的token
          window.sessionStorage.setItem('token', res.data.token)
          // 登录成功跳转到home页面
          this.$router.push('/home')
        }
        // this.$router.push('/home')
      })
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    }
  },
  created() {
    // 实现回车登录功能
    let _self = this
    document.onkeydown = function (e) {
      if (e.keyCode === 13) {
        _self.submitForm()
      }
    }
  }
}
</script>

<style scoped>
.login {
  height: 100%;
  background-color: #28496d;

  display: flex;
  justify-content: center;
  align-items: center;
}

.login-context {
  position: relative;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
}

img {
  position: absolute;
  width: 150px;
  height: 150px;

  left: 50%;
  top: -25%;
  transform: translate(-50%);

  border-radius: 50%;
}

.el-form {
  text-align: center;
  position: absolute;
  left: 20%;
  right: 20%;
  bottom: 20px;
}
</style>