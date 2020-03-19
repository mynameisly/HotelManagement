<template>
  <div id="updateDialog">
    <el-dialog :title="title" :visible.sync="visible" top="8rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="updateForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="入住天数:" prop="checkinDay">
          <el-input v-model="item.checkinDay" type="number" min="1" palceholder="请输入入住天数" clearable/>
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
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
      item: {
        checkinDay: ''
      },
      rules: {
        checkinDay: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
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
      this.visible = false
    }
  }
}
</script>

<style lang="less">

</style>
