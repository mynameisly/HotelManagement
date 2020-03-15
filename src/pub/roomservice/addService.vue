<template>
  <div id="empAdd">
    <el-dialog :title="title" :visible.sync="visible" top="8rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="serviceForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="房号:" prop="roomNumber">
          <el-input v-model="item.roomNumber"  palceholder="请输入房号" clearable/>
        </el-form-item>
        <el-form-item label="员工:" prop="employeeName">
          <el-select v-model="item.employeeName" palceholder="请选择员工" clearable>
            <el-option
              v-for="(val, idx) in empList"
              :key="idx"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务类型:" prop="categoryName">
          <el-select v-model="item.categoryName" palceholder="请选择服务类型" clearable>
            <el-option
              v-for="(val, idx) in categoryList"
              :key="idx"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">          
          <el-input type="textarea" :rows="2" v-model="item.remark" resize="none" maxlength="200" show-word-limit palceholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="resetForm('serviceForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('serviceForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPositionList } from '@/api/position';
import { getempList } from '@/api/employee';
import { getCategoryList } from '@/api/category';
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
      empList: [], // 保存员工信息
      categoryList: [], // 保存类型信息
      item: {
        roomNumber: '',
        employeeName: '',
        categoryName: '',
        remark: ''
      },
      rules: {
        roomNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
        employeeName: [{ required: true, message: '请选择', trigger: 'change' }],
        categoryName: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.getempList();
    this.getCategoryList();
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
    getempList() {
      getempList(null).then(res => {
        this.empList = this.handleEmp(res.data.data)
      })
    },
    handleEmp(temp) { // 获取员工姓名数组
      const tempArr = temp
      let empList = []
      for (let i = 0; i < tempArr.length; i++){
        empList.push(tempArr[i].readName)
      }
      return empList
    },
    getCategoryList() {
      getCategoryList({type: '客户服务'}).then(res => {
        this.categoryList = this.handleCategory(res.data.data)
      })
    },
    handleCategory (temp) { // 获取类型数组
      const tempArr = temp
      let categoryList = []
      for (let i = 0; i < tempArr.length; i++){
        categoryList.push(tempArr[i].categoryName)
      }
      return categoryList
    },
    submitForm (serviceForm) {
      this.$refs.serviceForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('serviceForm')
          })
        }
      })
    },
    resetForm (serviceForm) {
      this.$nextTick(() => {
        this.$refs.serviceForm.clearValidate()
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

</style>
