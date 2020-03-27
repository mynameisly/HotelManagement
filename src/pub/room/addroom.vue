<template>
  <div id="roomAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="roomForm" :model="item" :rules="rules" label-width="120px">
        <el-form-item label="房号：" prop="number">
          <el-input v-model="item.number" placeholder="请输入房号" clearable/>
        </el-form-item>
        <el-form-item label="客房类型：" prop="roomType">
          <el-select v-model="item.roomType" placeholder="请选择客房类型" clearable @change="selectChanged">
            <el-option
              v-for="item in roomTypeList"
              :key="item.roomTypeId"
              :label="item.roomTypeName"
              :value="item.roomTypeId">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="面积：" prop="area">
          <el-input v-model="item.area" placeholder="请输入面积" clearable/>
        </el-form-item>
        <el-form-item label="可住人数：" prop="peopleNum">
          <el-input v-model="item.peopleNum" placeholder="请输入可住人数" clearable/>
        </el-form-item>
        <el-form-item label="客房状态：">
          <el-select v-model="item.state" placeholder="请选择客房状态" clearable>
            <el-option key="1" label="空闲" value="空闲"></el-option>
            <el-option key="2" label="在住" value="在住"></el-option>
            <el-option key="3" label="不可用" value="不可用"></el-option>
            <el-option key="4" label="正在打扫" value="正在打扫"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层：" prop="floor">
          <el-input v-model="item.floor" placeholder="请输入楼层" clearable/>
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
        <el-form-item label="是否可加床："  prop="jiaChuang">
          <el-select v-model="item.jiaChuang" placeholder="是否可加床" clearable>
            <el-option key="1" label="可加床（1.8米大床，50/天）" value="可加床（1.8米大床，50/天）"></el-option>
            <el-option key="2" label="不可加床" value="不可加床"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有窗:" prop="window">
          <el-radio-group v-model="item.window">
            <el-radio v-model="item.window" label="有窗" border>有窗</el-radio>
            <el-radio v-model="item.window" label="无窗" border>无窗</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="床型具体说明：" prop="bedDetail">
          <el-input type="textarea" :rows="2" v-model="item.bedDetail" resize="none" maxlength="200" show-word-limit palceholder="床型具体说明"></el-input>
        </el-form-item>
        <el-form-item label="房间设施说明：" prop="facilities">
          <el-input type="textarea" :rows="2" v-model="item.facilities" resize="none" maxlength="200" show-word-limit palceholder="房间设施说明"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imgUrls" >
          <el-upload
            class="upload-demo"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :limit="4"
            :before-upload="beforeUpload"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="primary" @click="resetForm('roomForm')">取消</el-button>
      <el-button type="primary" @click="submitForm('roomForm')">提交</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList } from '@/api/category'
import { getAllRoomTypeList, getRoomTypeById } from '@/api/roomtype'
import { getroomById } from '@/api/room'
import { uploadFile } from '@/api/uploadFile'
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
      roomTypeList: [], // 客房类型
      bedTypeList: [],// 保存床型
      fileList: [],
      item: {
        number: '',
        peopleNum: '',
        roomType: '',
        imgUrls: '',
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
        number: [{ required: true, message: '请输入', trigger: 'blur' }],
        roomType: [{ required: true, message: '请输入', trigger: 'change' }],
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
    open (item) { // item就是roomData
    console.log('查看详情的item',item)
      this.visible = true
      if (item === null || item === undefined) {
        this.item = {}
      } else {
        this.getroomById(item.roomId)
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
      getCategoryList({type:'床型'}).then(res => {
        // console.log('搜索床型结果是',res)
        if(res.data.code === 0){
          this.bedTypeList = res.data.data
        }
      })
    },
    getroomById(id) {
      getroomById(id).then(res => {
        if(res.data.code === 0){
          this.item = res.data.data
          let imgList = res.data.data.imgList
          this.fileList = imgList.map(item => ({url:item}))
        }
      })
    },
    selectChanged (value) {
      console.log('客房类型是切换',value)
      getRoomTypeById(value).then(res => {
        console.log('客房类型id查询到的数据是切换',res.data.data)
        if(res.data.code === 0){
          this.item = res.data.data
          this.item.roomType = value
        }
      })
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
    beforeUpload(file) {
      console.log('file信息是',file)
      let files = new FormData();
      files.append('multipartFile',file)
      let headers = {'Content-Type': 'multipart/form-data'}
      uploadFile(files,headers).then((res) => {
        console.log('文件上传返回数据',res.data.data)
        if (res.data.code === 0){
          let fileChild = {
            // name: file.name,
            url: res.data.data
          }
          this.fileList.push(fileChild)
        }
      })
      // console.log('this.fileList',this.fileList)
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.fileList = this.fileList.filter((val) => {
        (val.url).indexOf(file.url) < 0
      })
    },
    handlePreview(file) {
      console.log(file);
    },
    submitForm (roomForm) {
      this.$refs.roomForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item, this.fileList)
            this.resetForm('roomForm')
          })
        }
      })
    },
    resetForm (roomForm) {
      this.$nextTick(() => {
        this.$refs.roomForm.clearValidate()
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
