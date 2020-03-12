<template>
  <div id="checkinAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="checkinForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="姓名:" prop="tenantName">
          <el-input v-model="item.tenantName"  palceholder="请输入姓名" clearable/>
        </el-form-item>
        <el-form-item label="房号:" prop="roomId">
          <el-select v-model="item.roomId" placeholder="请选择房号" @focus='handleNoRepeat' clearable>
              <el-option
                v-for="item in roomList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="身份证:" prop="tenantIdCard">
          <el-input v-model="item.tenantIdCard"  palceholder="请输入房客身份证" clearable/>
        </el-form-item>
        <el-form-item label="联系电话:" prop="tenantTel">
          <el-input v-model="item.tenantTel"  palceholder="请输入联系电话" clearable/>
        </el-form-item>
        <el-form-item label="性别:" prop="tenantSex">
          <el-radio-group v-model="item.tenantSex">
           <el-radio v-model="item.tenantSex" label="男" border>男</el-radio>
          <el-radio v-model="item.tenantSex" label="女" border>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入住天数:" prop="checkinDay">
          <el-input v-model="item.checkinDay"  palceholder="请输入入住天数" clearable/>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="primary" @click="resetForm('checkinForm')">取消</el-button>
      <el-button type="primary" @click="submitForm('checkinForm')">提交</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { getroomList } from '@/api/room';
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
      firstRoomList: [],
      roomList: [],// 保存房号和roomId
      item: {
        checkinDay: '',
        roomId: '',
        tenantName: '',
        tenantTel: '',
        tenantIdCard: '',
        tenantSex: ''
      },
      rules: {
        checkinDay: [{ required: true, message: '请输入', trigger: 'blur' }],
        roomId: [{ required: true, message: '请选择房号', trigger: 'change' }],
        tenantName: [{ required: true, message: '请输入', trigger: 'blur' }],
        tenantTel: [{ required: true, message: '请输入', trigger: 'blur' }],
        tenantIdCard: [{ required: true, message: '请输入', trigger: 'blur' }],
        tenantSex: [{ required: true, message: '请选择', trigger: 'change' }],
      }
    }
  },
  mounted () {
    this.getroomList();
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
    getroomList() {
        getroomList().then(res => {
            if(res.data.code == 0) {
                this.firstRoomList = res.data.data
                this.handleRoom(res.data.data)
                // console.log('this.roomList',this.roomList)
            }
        })
    },
    handleRoom (data) {
      const uploadArr = data
      let upload
      for (var k in uploadArr) {
        upload = uploadArr[k]
        upload.number = upload.number // 房号
      }
      return uploadArr
    },
    handleNoRepeat () { // 去重，构建出el-select的label是用戶名，value是用户ID
      let object = {}
      let roomList = []
      let data = this.firstRoomList
      let objres = data.reduce((item, next) => {
        object[next.roomId] ? ' ' : object[next.roomId] = true && item.push(next)
        return item
      }, [])
      for (let i = 0; i < objres.length; i++) {
        roomList.push({label: objres[i].number, value: objres[i].roomId})
      }
      this.roomList = roomList
      console.log('this.rooLisst', this.roomList)
    },
    submitForm (checkinForm) {
      this.$refs.checkinForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('checkinForm')
          })
        }
      })
    },
    resetForm (checkinForm) {
      this.$nextTick(() => {
        this.$refs.checkinForm.clearValidate()
      })
      this.item = {}
      this.visible = false
    }
  }
}
</script>

<style lang="less">

</style>
