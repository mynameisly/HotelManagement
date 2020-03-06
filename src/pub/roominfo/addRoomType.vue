<template>
  <div id="roomtypeAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="roomtypeForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="房号：">
          <el-input v-model="item.number" placeholder="请输入房号" clearable/>
        </el-form-item>
        <el-form-item label="客房类型：">
          <el-input v-model="item.roomType" placeholder="请输入客房类型" clearable/>
        </el-form-item>
        <el-form-item label="可住人数：">
          <el-input v-model="item.peopleNum" placeholder="请输入可住人数" clearable/>
        </el-form-item>
        <el-form-item label="楼层：">
          <el-input v-model="item.floor" placeholder="请输入楼层" clearable/>
        </el-form-item>
        <el-form-item label="床型：">
          <el-input v-model="item.bedType" placeholder="请输入床型" clearable/>
        </el-form-item>
          <el-form-item label="状态：">
              <el-select v-model="item.state" placeholder="请输入状态" clearable>
                  <el-option key="2" label="空闲" value="空闲"></el-option>
                  <el-option key="2" label="在住" value="在住"></el-option>
                  <el-option key="1" label="不可用" value="不可用"></el-option>
                  <el-option key="2" label="正在打扫" value="正在打扫"></el-option>
              </el-select>
          </el-form-item>
        <el-form-item label="最低价：">
          <el-input v-model="item.startPrice" placeholder="请输入最低价" clearable/>
        </el-form-item>
        <el-form-item label="最高价：">
          <el-input v-model="item.endPrice" placeholder="请输入最高价" clearable/>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="warning" @click="resetForm('roomtypeForm')">取消</el-button>
      <el-button type="success" @click="submitForm('roomtypeForm')">提交</el-button>
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
        number: '',
        roomType: '',
        peopleNum: '',
        floor: '',
        bedType: '',
        state: '',
        startPrice: '',
        endPrice: ''
      },
      rules: {
        number: [{ required: true, message: '请输入', trigger: 'blur' }],
        roomType: [{ required: true, message: '请输入', trigger: 'change' }],
        peopleNum: [{ required: true, message: '请输入', trigger: 'blur' }],
        floor: [{ required: true, message: '请输入', trigger: 'blur' }],
        bedType: [{ required: true, message: '请输入', trigger: 'blur' }],
        state: [{ required: true, message: '请输入', trigger: 'blur' }],
        startPrice: [{ required: true, message: '请输入', trigger: 'blur' }],
        endPrice: [{ required: true, message: '请输入', trigger: 'blur' }]
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
    submitForm (roomtypeForm) {
      this.item.createTime = this.formateDate(this.item.createTime)
      this.$refs.roomtypeForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('roomtypeForm')
          })
        }
      })
    },
    resetForm (roomtypeForm) {
      this.$nextTick(() => {
        this.$refs.roomtypeForm.clearValidate()
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
