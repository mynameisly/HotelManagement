<template>
  <div id="updateAdd">
    <el-dialog :title="title" :visible.sync="visible" top="8rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="updateForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="房号:" prop="number">
          <el-select v-model="item.number" placeholder="请选择房号" @change="selectChanged">
            <el-option
              v-for="item in roomList"
              :key="item.roomId"
              :label="item.number"
              :value="item.roomId">
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
      roomList: {},// 保存房号和roomId
      item: {
        number: '',
        roomId: ''
      },
      rules: {
        number: [{ required: true, message: '请选择房号', trigger: 'change' }]
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
        this.item.number = item.room.number
      }
    },
    getroomList() {
      getroomList({state: '空闲'}).then(res => {
        if(res.data.code == 0) {
          this.roomList = res.data.data
          // console.log('this.rooLisst空闲', res.data.data)
        }
      })
    },
    selectChanged (value) { // 换房的roomId是传选择之后的roomId
      this.item.roomId = value
      // console.log('this.rooLisstvalue', value)
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
