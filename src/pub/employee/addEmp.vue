<template>
  <div id="empAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="empForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="账号:" prop="number">
          <el-input v-model="item.number"  palceholder="请输入账号" clearable/>
        </el-form-item>
        <el-form-item label="姓名:" prop="readName">
          <el-input v-model="item.readName"  palceholder="请输入姓名" clearable/>
        </el-form-item>
        <!-- <el-form-item label="性别:" prop="sex">
          <el-input v-model="item.sex"  palceholder="请输入性别" clearable/>
          <el-radio v-model="item.sex" label="1" border>男</el-radio>
          <el-radio v-model="item.sex" label="2" border>女</el-radio>
        </el-form-item> -->
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="item.sex">
           <el-radio v-model="item.sex" label="男" border>男</el-radio>
          <el-radio v-model="item.sex" label="女" border>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职位:" prop="position">
          <!-- 显示的是职位，传递的是positionId -->
          <el-select v-model="item.position" placeholder="请选择职位" clearable>
            <el-option
              v-for="i in positionList"
              :key="i.positionId"
              :label="i.positionName"
              :value="i.positionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话:" prop="telPhone">
          <el-input v-model="item.telPhone"  palceholder="请输入联系电话" clearable/>        
        </el-form-item>
         <el-form-item label="头像" prop="headImg" >
          <el-upload
            class="avatar-uploader"
            action=""
            :data="uptoken"
            :show-file-list="false"
            :on-change="onchange"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="item.headImg" :src="item.headImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="primary" @click="resetForm('empForm')">取消</el-button>
      <el-button type="primary" @click="submitForm('empForm')">提交</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
// import { uploadFile } from '@/api/uploadFile'
import axios from 'axios'
import { getPositionList } from '@/api/position';
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    const validateTelPhone = (rule, value, callback) => { // 验证手机号码
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else {
        if (value !== '') {
          var regTelPhone = /^1[3456789]\d{9}$/
          if (!regTelPhone.test(value)) {
            callback(new Error('请输入有效的手机号码'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      visible: false,
      uptoken: {
        key: ''
      },
      positionList: [], // 保存职位信息
      param: '', // 表单要提交的参数
      fileFlag: false,
      fileUploadPercent: 0,
      fileList: [],
      item: {
        number: '',
        readName: '',
        sex: '',
        position: '',
        telPhone: '',
        headImg: ''
      },
      rules: {
        number: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        readName: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        position: [{ required: true, message: '请选择职位', trigger: 'blur' }],
        telPhone: [{required: true, validator: validateTelPhone, trigger: 'blur'}]
      }
    }
  },
  mounted () {
    this.getPositionList();
  },
  methods: {
    open (item) {
      this.visible = true
      if (item === null || item === undefined) {
        this.item = {}
      } else {
        this.item = item
      }
    },
    formateDate (date) {
      let theDate = new Date(date)
      let year = theDate.getFullYear()
      let month = theDate.getMonth() + 1
      let day = theDate.getDate()
      let hour = theDate.getHours()
      let minute = theDate.getMinutes()
      let second = theDate.getSeconds()
      return year + '-' + this.formatTen(month) + '-' + this.formatTen(day) + ' ' + this.formatTen(hour) + ':' + this.formatTen(minute) + ':' + this.formatTen(second)
    },
    formatTen (num) {
      return num > 9 ? (num + '') : ('0' + num)
    },
    beforeAvatarUpload (file) {
      this.uptoken.key = file.name
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) { // 如果不是jpg，也不是png的时候就弹出这条信息
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      console.log('上传前事件')
      // 重新写一个表单上传的方法
      // this.param = new FormData()
      this.fileList.push(file) // 把单个文件变成数组
      let images = [...this.fileList] // 把数组存储为一个参数，便于后期操作
      // 遍历数组
      images.forEach((img, index) => {
        this.param.append('multipartFile', img) // 把单个图片重命名，存储起来（给后台）
      })

      return isJPG || isPNG && isLt2M
    },
    onchange (file) { // 当上传图片后，调用onchange方法，获取图片本地路径
      this.param = new FormData()
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // 然后通过下面的方式把内容通过axios来传到后台
      // uploadFile (param).then(res =>{
      //   console.log('通过url接口得到图片url', res.data)
      // })
      // getempList(param).then(res => {
        axios({
          method: 'post',
          url: '/HotelManagement/json/file/add',
          headers: config,
          data: this.param
        }).then((res) => {
          console.log('图片上传成功之后返回的图片的url',res.data) // 图片上传成功之后返回的图片的url
          console.log('图片上传成功之后返回的图片的url',res.data.data)
          this.item.headImg = res.data.data
        }).catch(() => false)
    },
    getPositionList() {
      getPositionList(null).then(res => {
        this.positionList = res.data.data
      })
    },
    submitForm (empForm) {
      this.$refs.empForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('empForm')
          })
        }
      })
    },
    resetForm (empForm) {
      this.$nextTick(() => {
        this.$refs.empForm.clearValidate()
      })
      this.item = {}
      this.fileFlag = false;
      this.fileUploadPercent = 0
      this.visible = false
    }
  }
}
</script>

<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  // position: relative;
  // overflow: hidden;
  // text-align: left;
  width: 28%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.el-upload__tip {
  margin-top: 0;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
