<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.jpg" alt="安徽大学">
        <span>电商管理系统</span>
      </div>
      <div>
        <el-button type="info" @click="logOut">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 收起导航栏 -->
        <div class="menu-tools" @click="isCollapse=!isCollapse">|||</div>
        <!-- 左边菜单部分 -->
        <el-menu
            :default-active="activePath"
            :collapse="isCollapse"
            :collapse-transition="false"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            router>
          <!-- 一级导航 -->
          <el-submenu :index="item.id+''"
                      v-for="item in menuList"
                      :key="item.id">
            <template slot="title">
              <i :class="objIcon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级导航 -->
            <el-menu-item
                :index="'/'+item2.path"
                v-for="item2 in item.children"
                :key="item2.id"
                @click="changeActive('/'+item2.path)">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      objIcon: {
        "125": 'iconfont icon-icon_user',
        "103": 'iconfont icon-shangpin',
        "101": 'iconfont icon-danju',
        "102": 'iconfont icon-tijikongjian',
        "145": 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ""
    }
  },
  methods: {
    logOut() {
      window.sessionStorage.removeItem('token');
      this.$router.push('/login')
    },
    // 后台发送请求获取菜单数据
    getMenuList() {
      this.$http.get('menus').then(res => {
        if (res.data.meta.status !== 200) {
          this.$message.error('请求导航栏失败')
        }
        this.menuList = res.data.data
      })
    },
    // 点击二级菜单，激活当前的index值，实现状态记忆
    changeActive(path) {
      // 保存当前点击的path
      window.localStorage.setItem('path',path)
      this.activePath = path
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.localStorage.getItem('path')
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #363c42;
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  height: 60px;
  color: #FFFFFF;
  font-size: 24px;
}

.el-header img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.el-header span {
  position: relative;
  top: -20px;
  left: 10px;
}

.el-aside {
  background-color: #313743;
}

.el-menu {
  width: 200px;
  overflow: hidden;
}

.menu-tools {
  text-align: center;
  color: #FFFFFF;
  background-color: #363c42;
  cursor: pointer;
}

.el-main {
  background-color: #e9edf1;
}
</style>
