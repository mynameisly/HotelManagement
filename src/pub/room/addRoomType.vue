<template>
  <div id="roomtypeAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="roomtypeForm" :model="item" :rules="rules" label-width="120px">
        <el-form-item label="客房类型：" prop="roomTypeName">
          <el-input v-model="item.roomTypeName" placeholder="请输入客房类型" clearable/>
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
        <el-button type="primary" @click="resetForm('roomtypeForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('roomtypeForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { getCategoryList } from '@/api/category'
import { getRoomTypeById } from '@/api/roomtype'
import { uploadFile } from '@/api/uploadFile'
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
      bedTypeList: [],// 保存床型
      fileList: [],
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
  },
  methods: {
    open (item) { // item就是roomTypeData
    // console.log('item',item)
      this.visible = true
      if (item === null || item === undefined) {
        this.item = {}
      } else {
        this.getRoomTypeById(item.roomTypeId)
      }
    },
    getCategoryList() {
      // console.log('进入查询所有床类型')
      getCategoryList({type: '床型'}).then(res => {
        // console.log('进入查询所有床类型res',res)
        if(res.data.code === 0){
          this.bedTypeList = res.data.data
        }
      })
    },
    getRoomTypeById(id) {
      // console.log('进入到根据ID查询客房类型')
      getRoomTypeById(id).then(res => {
        // console.log('根据ID查询客房类型返回数据是，', res)
        if(res.data.code === 0){
          this.item = res.data.data
          let imgList = res.data.data.imgList
          this.fileList = imgList.map(item => ({url:item}))
        }
      })
    },
    beforeUpload(file) {
      // console.log('file信息是',file)
      let files = new FormData();
      files.append('multipartFile',file)
      let headers = {'Content-Type': 'multipart/form-data'}
      uploadFile(files,headers).then((res) => {
        // console.log('文件上传返回数据',res.data.data)
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
      // console.log('file', file);
      // console.log('fileList', fileList);
      this.fileList = this.fileList.filter((val) => {
        (val.url).indexOf(file.url) < 0
      })
    },
    handlePreview(file) {
      console.log(file);
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
            console.log('this.fileList', this.fileList)
            this.$emit('confirmData', this.item,this.fileList)
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
