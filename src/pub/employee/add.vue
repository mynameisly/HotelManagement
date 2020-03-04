<template>
  <div id="noticeAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="noticeForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="发布人:" prop="createPerson">
          <el-input v-model="item.createPerson"  palceholder="请输入发布人" clearable/>
        </el-form-item>
        <el-form-item label="发布时间:" prop="createTime">
          <el-date-picker
            v-model="item.createTime"
            type="datetime"
            placeholder="请输入发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题:" prop="title">
          <el-input v-model="item.title"  palceholder="请输入标题" clearable/>
        </el-form-item>
        <el-form-item label="通知内容:" prop="content">
          <el-input type="textarea" :rows="2" v-model="item.content" resize="none" maxlength="200" show-word-limit palceholder="请输入通知内容"></el-input>
        </el-form-item>
         <el-form-item label="附件:" prop="fileId">
           <!-- 调用上传文件接口拿到文件id，在发送新增请求 -->
          <!-- <el-input v-model="item.fileId"  palceholder="请输入文件ID" clearable/> -->
          <el-upload
            action=""
            drag
            :show-file-list="false" 
            :limit="1"
            :before-upload="beforeupload"
            :on-change="onchange"
            :on-progress="uploadFileProcess"
            >
            <i v-if="fileFlag == false" 
              class="el-icon-upload">
            </i>
            <div v-if="fileFlag == false" class="el-upload__text">将文件拖到此处，或<em>点击上传</em>最多可上传1个文件</div>
            <el-progress 
              v-if="fileFlag == true" 
              type="circle" 
              :percentage="fileUploadPercent"
              style="margin-top:20px">
            </el-progress>
            <div class="el-upload__tip" slot="tip">支持doc,docx,txt,xlsx,ppt格式，且不超过10M</div>
          </el-upload>
        </el-form-item>
        <!--<el-form-item label="人员集合:" prop="userIdList">
          <el-input v-model="item.userIdList"  palceholder="请输入人员集合" clearable/>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
      <el-button type="warning" @click="resetForm('noticeForm')">取消</el-button>
      <el-button type="success" @click="submitForm('noticeForm')">提交</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
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
    beforeupload (file) { // 上传文件之前限制格式和大小
      let fileFormat = file.name.substring(file.name.lastIndexOf('.') + 1) // 获取上传的文件的格式
      const extension1 = fileFormat === 'doc'
      const extension2 = fileFormat === 'docx'
      const extension3 = fileFormat === 'txt'
      const extension4 = fileFormat === 'xlsx'
      const extension5 = fileFormat === 'ppt'
      if (!extension1 && !extension2 && !extension3 && !extension4 && !extension5) {
        this.$message({
          type: 'danger',
          message: '附件只能是doc,docx,txt,xlsx,ppt格式'
        })
      }
      const isLt10M = file.size / 1024 / 1024  < 10;
      if (!isLt10M) {
        this.$message.error('附件大小不能超过 10MB!')
        return false
      }
      this.fileList.push(file)
      let myFiles = [...this.fileList]
      // 遍历数组
      myFiles.forEach((f, index) => {
        this.param.append('multipartFiles', f)
      })
      return extension1 || extension2 || extension3 || extension4 || extension5 && isLt10M
    },
    uploadFileProcess(event, file, fileList) {
      this.fileFlag = true;
      this.fileUploadPercent = Math.floor(event.percent)
    },
    onchange (file) { // 当上传图片后，调用onchange方法，获取图片本地路径
      this.param = new FormData()
      this.param.append('type', 'learningResource')
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios({
        method: 'post',
        url: '/json/file/add',
        headers: config,
        data: this.param
      }).then((res) => {
        console.log('通过url接口得到视频url')
        this.item.fileId = res.data.data[0].fileId
        console.log(this.item.fileId)
      }).catch(() => false)
    },
    submitForm (noticeForm) {
      this.item.createTime = this.formateDate(this.item.createTime)
      this.$refs.noticeForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('noticeForm')
          })
        }
      })
    },
    resetForm (noticeForm) {
      this.$nextTick(() => {
        this.$refs.noticeForm.clearValidate()
      })
      this.item = {}
      this.fileFlag = false;
      this.fileUploadPercent = 0
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
