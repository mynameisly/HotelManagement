<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">酒店管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img v-if="headImg!=null&&headImg!=''" :src="headImg" />
                    <img v-else src="../../assets/img/img.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{number}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <a href="https://github.com/mynameisly/HotelManagement" target="_blank">
                            <el-dropdown-item>项目仓库</el-dropdown-item>
                        </a>
                        <el-dropdown-item divided command="updatePwd">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus';
import { mapGetters, mapActions } from "vuex";
import { getLoginEmployee, loginout } from '@/api/login'
export default {
    data() {
      return {
        collapse: false,
        fullscreen: false,
        number: '',
        headImg: '',
        message: 2
      };
    },
    // computed: {
    //   ...mapGetters(["employeeId", "number", "headImg"])
    // },
    computed: {
        // username() {
        //   let username = localStorage.getItem('ms_username');
        //   return username ? username : this.name;
        // }
    },
    mounted() {
      // this上还有employeeId
      // console.log(this)
      // this.number = this.$store.getters.number
      // this.headImg = this.$store.getters.headImg
      this.getLoginEmployee();
      // this.$store.dispatch('getInfo')
      if (document.body.clientWidth < 1500) {
        this.collapseChage();
      }
    },
    methods: {
      getLoginEmployee(){
        getLoginEmployee(null).then(res => {
          // console.log('当前用户登录信息是，', res)
          if(res.data.code === 0) {
            this.number = res.data.data.number
            this.headImg = res.data.data.headImg
          }
        })
      },
      handleCommand(command) { // 用户名下拉菜单选择事件
        if (command == 'updatePwd') { // 修改密码
          this.$router.push({path:'/updatePwd'})
        } else if (command == 'loginout') {
          // localStorage.removeItem('ms_username');
          // this.$router.push('/login');
          loginout(null).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '已退出登录',
              })
              // this.setUserdata("");
              // 退出登录时将sessionStorage里的token和store里面的角色都清零
              // removeToken();
              // this.resetToken();
              // sessionStorage.removeItem("store");
            }
          })
          this.$router.push('/login');
        }
      },
      // 侧边栏折叠
      collapseChage() {
        this.collapse = !this.collapse;
        bus.$emit('collapse', this.collapse);
      },
      // 全屏事件
      handleFullScreen() {
        let element = document.documentElement;
        if (this.fullscreen) {
          if (document.exitFullscreen) {
              document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
          }
        } else {
          if (element.requestFullscreen) {
              element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
              element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
              // IE11
              element.msRequestFullscreen();
          }
        }
        this.fullscreen = !this.fullscreen;
      },
      // ...mapActions("user/", ["setUserdata"])
    }
};
</script>

<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
