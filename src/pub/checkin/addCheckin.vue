<template>
  <div id="checkinAdd">
    <el-dialog :title="title" :visible.sync="visible" top="6rem" width="70%" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="checkinForm" :model="checkinForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="房号:" prop="roomId">
              <el-select v-model="checkinForm.roomId" placeholder="请选择房号" @focus='handleNoRepeat' clearable>
                <el-option
                  v-for="item in roomList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="入住天数:" prop="checkinDay">
              <el-input v-model="checkinForm.checkinDay" type="number" min="1"  placeholder="请输入入住天数" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 先写死三个 -->
        <el-row>
          <el-col :span="10">
            <el-form-item label="姓名:" prop="tenantName">
              <el-input v-model="checkinForm.tenantName" placeholder="请输入姓名" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="身份证:" prop="tenantIdCard">
              <el-input v-model="checkinForm.tenantIdCard"  placeholder="请输入身份证" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="联系电话:" prop="tenantTel">
              <el-input v-model="checkinForm.tenantTel"  placeholder="请输入联系电话" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别:" prop="tenantSex">
              <el-radio-group v-model="checkinForm.tenantSex">
              <el-radio v-model="checkinForm.tenantSex" label="男" border>男</el-radio>
              <el-radio v-model="checkinForm.tenantSex" label="女" border>女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 动态生成 -->
        <div class="moreRules">
          <div class="moreRulesIn" v-for="(item, index) in checkinForm.moreNotifyObject" :key="item.key" >
            <el-row>
              <el-col :span="10">
                <el-form-item label="姓名:" :prop="'moreNotifyObject.' + index +'.tenantName'" :rules="[{required: true, message: '请正确填写信息'}]">
                  <el-input v-model="item.tenantName" placeholder="请输入姓名" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="身份证:" :prop="'moreNotifyObject.' + index +'.tenantIdCard'" :rules="[{required: true, message: '请正确填写信息'}]">
                  <el-input v-model="item.tenantIdCard" placeholder="请输入身份证" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="联系电话:" :prop="'moreNotifyObject.'+ index +'.tenantTel'" :rules="[{required: true, message: '请正确填写信息'}]">
                  <el-input v-model="item.tenantTel" placeholder="请输入联系电话" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="性别:" :prop="'moreNotifyObject.' + index + '.tenantSex'" :rules="[{required: true, message: '请正确填写信息'}]">
                  <el-radio-group v-model="item.tenantSex">
                  <el-radio v-model="item.tenantSex" label="男" border>男</el-radio>
                  <el-radio v-model="item.tenantSex" label="女" border>女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-button type="text" @click="deleteRules(item, index)" ><i class="el-icon-remove-outline">删除</i></el-button>
            </el-row>
          </div>
        </div>
        <el-form-item>
          <el-button type="text" class="addUser" @click="addUser"><i class="el-icon-circle-plus-outline">添加房客</i></el-button>
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
    const cheackCard = (rule, value, callback) => {
      if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) == false) {
        callback(new Error("你的身份证格式不正确"));
      } else {
        // callback();
        // 获取出生日期
        var birth =
          value.substring(6, 10) +
          "-" +
          value.substring(10, 12) +
          "-" +
          value.substring(12, 14);
        this.$set(this.checkinForm, "birthday", birth); // 动态添加
      }
    };
    return {
      // 参考新增el-form选项 https://segmentfault.com/a/1190000019815654?utm_source=tag-newest
      visible: false,
      firstRoomList: [],
      roomList: [],// 保存房号和roomId
      checkinForm: {
        type: 2,
        checkinDay: '',
        roomId: '',
        tenantName: '',
        tenantTel: '',
        tenantIdCard: '',
        tenantSex: '',
        moreNotifyObject:[{
          tenantName: '',
          tenantIdCard:'',
          tenantTel:'',
          tenantSex:''
        }]
      },
      rules: {
        checkinDay: [{ required: true, message: '请输入', trigger: 'blur' }],
        roomId: [{ required: true, message: '请选择房号', trigger: 'change' }],
        tenantName: [{ required: true, message: '请输入', trigger: 'blur' }],
        tenantTel: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^(\+86)?1[3|4|5|7|8][0-9]{9}$/,
            message: "你的手机号格式不正确",
            trigger: "blur"
          }
          ],
        tenantIdCard: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { validator: cheackCard, trigger: "blur" }
          ],
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
        // this.checkinForm = {}
      } else {
        this.checkinForm = item
      }
    },
    getroomList() {
      getroomList({state: '空闲'}).then(res => {
        if(res.data.code == 0) {
          this.firstRoomList = res.data.data
          this.handleRoom(res.data.data)
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
    },
    addUser() {
      this.checkinForm.moreNotifyObject.push({
        tenantIdCard:'',
        tenantTel:'',
        tenantSex:''
      })
    },
    deleteRules(item, index) {
      this.index = this.checkinForm.moreNotifyObject.indexOf(item)
      if (index !== -1) {
        this.checkinForm.moreNotifyObject.splice(index, 1)
      }
    },
    submitForm (checkinForm) {
      // this.$refs.checkinForm.validate(valid => {
        // if (valid) {
      // alert(111111)
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            console.log('新增的数据是',this.checkinForm)
            this.$emit('confirmData', this.checkinForm)
            this.resetForm('checkinForm')
          })
        // }
      // })
    },
    resetForm (checkinForm) {
      this.$nextTick(() => {
        this.$refs.checkinForm.clearValidate()
      })
      this.checkinForm = {}
      this.checkinForm.moreNotifyObject=[{
        tenantName: '',
        tenantIdCard:'',
        tenantTel:'',
        tenantSex:''
      }]
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
