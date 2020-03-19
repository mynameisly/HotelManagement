<template>
  <div id="updatePwd" style="background: transparent;border:1px solid gainsboro">
    <el-form :model="searchForm" :rules="rules" label-width="80px">
      <el-form-item label="原密码">
        <el-input
          v-model="searchForm.oldPassword"
          placeholder="请输入6位原密码">
        </el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input
          v-model="searchForm.newPassword"
          placeholder="新密码长度必须在6-16之间，且必须包含数字和字母"
          show-password >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          style="width:100%;padding:11px;"
          type="primary"
          @click="updatePwd(searchForm)"
        >修 改 密 码</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="14" :offset="4">
        <router-link to="/dashboard">
          <el-button type="primary" size="large">返回首页</el-button>
        </router-link>
      </el-col>
      <el-col :span="6">
        <el-button class="error-btn" type="primary" size="large" @click="goBack">返回上一页</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import { updatePassword } from '@/api/employee'

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{6,}$/ // 密码长度必须在6-16之间，且必须包含数字和字母
      if (value === '' || value === undefined) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 18) {
        callback(new Error('密码长度必须在6-16之间'))
      } else if (/^[a-z]+$/.test(value) || /^[0-9]+$/.test(value)) {
        callback(new Error('密码必须同时包含数字和字母'))
      } else {
        if (reg.test(value)) {
          callback()
        }
      }
    }
    return {
      searchForm: {
        oldPassword: '',
        newPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
        newPassword: [{ required: true, validator: validatePass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    updatePwd (searchForm) { // 修改密码
    console.log('修改密码的参数是', searchForm)
      updatePassword(searchForm).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '修改密码成功,请重新登录'
          })
          setTimeout(() => { 
            this.$router.push({path:'/login'})
          }, 1000);
        } else if(res.data.code === 7) {
          alert(res.data.data)
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
#updatePwd{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 50px 0;
  padding-right: 30px;
  width: 500px;
  background-color: rgba(49,143,254,.4);
  border-radius: 10px;
  box-shadow: 0px 0px 5px lavenderblush;
  .el-form
    .el-form-item:nth-child(1),
    .el-form-item:nth-child(2) {
    margin-bottom: 20px;
  }
}
</style>
