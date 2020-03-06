<template>
  <div id="noticeAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="empForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="账号:" prop="number">
          <el-input v-model="item.number"  palceholder="请输入账号" clearable/>
        </el-form-item>
        <el-form-item label="姓名:" prop="readName">
          <el-input v-model="item.readName"  palceholder="请输入姓名" clearable/>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-input v-model="item.sex"  palceholder="请输入性别" clearable/>
        </el-form-item>
        <el-form-item label="联系电话:" prop="content">
          <el-input v-model="item.sex"  palceholder="请输入联系电话" clearable/>        
        </el-form-item>
         <el-form-item label="头像" prop="headImg" >
          <!-- 图片的url和数据库里面的varchar是一样的 -->
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
        <!--<el-form-item label="人员集合:" prop="userIdList">
          <el-input v-model="item.userIdList"  palceholder="请输入人员集合" clearable/>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
      <el-button type="warning" @click="resetForm('empForm')">取消</el-button>
      <el-button type="success" @click="submitForm('empForm')">提交</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile } from '@/api/uploadFile'
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
      uptoken: {
        key: ''
      },
      param: '', // 表单要提交的参数
      fileFlag: false,
      fileUploadPercent: 0,
      fileList: [],
      item: {
        createPerson: '',
        createTime: '',
        title: '',
        content: '',
        fileId: '',
        userIdList: ''
      },
      rules: {
        createPerson: [{ required: true, message: '请输入发布人', trigger: 'blur' }],
        createTime: [{ required: true, message: '请输入发布时间', trigger: 'change' }],
        title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入通知内容', trigger: 'blur' }],
        // fileId: [{ required: true, message: '请输入文件ID', trigger: 'blur' }],
        // userIdList: [{ required: true, message: '请输入人员集合', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open (item) {
      this.visible = true
      if (item === null || item === undefined) {
        // this.item = null
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
        this.param.append('multipartFiles', img) // 把单个图片重命名，存储起来（给后台）
      })

      return isJPG || isPNG && isLt2M
    },
    onchange (file) { // 当上传图片后，调用onchange方法，获取图片本地路径
      this.param = new FormData()
      this.param.append('type', 'headImg')
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // 然后通过下面的方式把内容通过axios来传到后台
      uploadFile (param).then(res =>{
        console.log('通过url接口得到图片url', res.data)
      })
      // getempList(param).then(res => {
      // axios({
      //   method: 'post',
      //   url: '/json/file/add',
      //   headers: config,
      //   data: this.param
      // }).then((res) => {
      //   console.log(res.data.data[0].previewUrl) // 图片上传成功之后返回的图片的url
      //   this.item.headImg = res.data.data[0].previewUrl
      // }).catch(() => false)
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
