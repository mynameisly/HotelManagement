<template>
  <div id="updateAdd">
    <el-dialog :title="title" :visible.sync="visible" top="8rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="updateForm" :model="item" :rules="rules" label-width="100px">
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
      </el-form>
      <span slot="footer">
      <el-button type="primary" @click="resetForm('updateForm')">取消</el-button>
      <el-button type="primary" @click="submitForm('updateForm')">提交</el-button>
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
        roomId: ''
      },
      rules: {
        roomId: [{ required: true, message: '请选择房号', trigger: 'change' }]
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
    handleNoRepeat () { // 去重
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
    submitForm (updateForm) {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('updateForm')
          })
        }
      })
    },
    resetForm (updateForm) {
      this.$nextTick(() => {
        this.$refs.updateForm.clearValidate()
      })
      this.item = {}
      this.visible = false
    }
  }
}
</script>

<style lang="less">

</style>
