<template>
  <div id="roomtypeAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="roomtypeForm" :model="item" :rules="rules" label-width="120px">
        <el-form-item label="客房类型：" prop="roomTypeName">
          <el-select v-model="item.roomTypeName" placeholder="请选择客房类型" clearable>
            <el-option
              v-for="item in roomTypeList"
              :key="item.roomTypeId"
              :label="item.roomTypeName"
              :value="item.roomTypeName">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="可住人数：" prop="peopleNum">
          <el-input v-model="item.peopleNum" placeholder="请输入可住人数" clearable/>
        </el-form-item>
        <el-form-item label="楼层：" prop="floor">
          <el-input v-model="item.floor" placeholder="请输入楼层" clearable/>
        </el-form-item>
        <el-form-item label="面积：" prop="area">
          <el-input v-model="item.area" placeholder="请输入面积" clearable/>
        </el-form-item>
        <el-form-item label="价格：" prop="price">
          <el-input v-model="item.price" placeholder="请输入价格" clearable/>
        </el-form-item>
        <el-form-item label="床型：" prop="bedType">
          <el-select v-model="item.bedType" placeholder="请选择床型" clearable>
            <el-option
              v-for="i in bedTypeList"
              :key="i.categoryId"
              :label="i.categoryName"
              :value="i.categoryName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有窗:" prop="window">
          <el-radio-group v-model="item.window">
            <el-radio v-model="item.window" label="有窗" border>有窗</el-radio>
            <el-radio v-model="item.window" label="无窗" border>无窗</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否可加床："  prop="jiaChuang">
          <el-select v-model="item.jiaChuang" placeholder="是否可加床" clearable>
            <el-option key="1" label="可加床（1.8米大床，50/天）" value="可加床（1.8米大床，50/天）"></el-option>
            <el-option key="2" label="不可加床" value="不可加床"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="床型具体说明：" prop="bedDetail">
          <el-input type="textarea" :rows="2" v-model="item.bedDetail" resize="none" maxlength="200" show-word-limit palceholder="床型具体说明"></el-input>
        </el-form-item>
        <el-form-item label="房间设施说明：" prop="facilities">
          <el-input type="textarea" :rows="2" v-model="item.facilities" resize="none" maxlength="200" show-word-limit palceholder="房间设施说明"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="resetForm('roomtypeForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('roomtypeForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { getCategoryList } from '@/api/category'
import { getRoomTypeById,getAllRoomTypeList } from '@/api/roomtype'
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
      bedTypeList: [],// 保存床型
      roomTypeList: [],
      item: {
        roomType: '',
        peopleNum: '',
        area: '',
        floor: '',
        bedType: '',
        bedDetail: '',
        window: '',
        jiaChuang: '',
        facilities: '',
        price: ''
      },
      rules: {
        roomTypeName: [{ required: true, message: '请输入', trigger: 'change' }],
        peopleNum: [{ required: true, message: '请输入', trigger: 'blur' }],
        area: [{ required: true, message: '请输入', trigger: 'blur' }],
        floor: [{ required: true, message: '请输入', trigger: 'blur' }],
        bedType: [{ required: true, message: '请选择', trigger: 'change' }],
        price: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getCategoryList()
    this.getAllRoomTypeList()
  },
  methods: {
    open (item) { // item就是roomTypeData
    console.log('item',item)
      this.visible = true
      if (item === null || item === undefined) {
        this.item = {}
      } else {
        this.getRoomTypeById(item.roomTypeId)
      }
    },
    getAllRoomTypeList() {
      getAllRoomTypeList().then(res => {
        if(res.data.code === 0){
          this.roomTypeList = res.data.data
        }
      })
    },
    getCategoryList() {
      console.log('进入查询所有床类型')
      getCategoryList({type: '床型'}).then(res => {
        console.log('进入查询所有床类型res',res)
        if(res.data.code === 0){
          this.bedTypeList = res.data.data
        }
      })
    },
    getRoomTypeById(id) {
      console.log('进入到根据ID查询客房类型')
      getRoomTypeById(id).then(res => {
        console.log('根据ID查询客房类型返回数据是，', res)
        if(res.data.code === 0){
          this.item = res.data.data
        }
      })
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
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
