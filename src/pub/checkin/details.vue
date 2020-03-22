<template>
  <div id="checkinAdd">
    <el-dialog :title="title" :visible.sync="visible" top="8rem" width="80%" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form :model="item" label-width="100px">
        <el-row>
            <el-col :span="6">
                <el-form-item label="房号:">
                    <el-input v-model="item.number" disabled/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="房型:">
                    <el-input v-model="item.roomType" disabled/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="面积:">
                    <el-input v-model="item.area" disabled/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="人数:">
                    <el-input v-model="item.peopleNum" disabled/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-form-item label="楼层:">
                    <el-input v-model="item.floor" disabled/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="单价:">
                    <el-input v-model="item.price" disabled/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="床型:">
                    <el-input v-model="item.bedType" disabled/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="是否加床:">
                    <el-input v-model="item.jiaChuang" disabled/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-form-item label="是否有窗:">
                    <el-input v-model="item.window" disabled/>
                </el-form-item>
            </el-col>
            <el-col :span="18">
                <el-form-item label="床型描述:">
                    <el-input v-model="item.bedType" disabled/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="房间设施:">
                    <el-input type="textarea" v-model="item.facilities" disabled/>
                </el-form-item>
            </el-col>
        </el-row>
      </el-form>
      <el-table
        border
        height="220"
        :data="tenants">
        <el-table-column label="住客姓名" prop="tenantName"/>
        <el-table-column label="性别" prop="tenantSex"/>
        <el-table-column label="联系方式" prop="tenantTel"/>
        <el-table-column label="身份证" prop="tenantIdCard"/>
      </el-table>
      <span slot="footer">
        <el-button type="primary" @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCheckinById } from '@/api/checkin';
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
      item: {},
      tenants: []
    }
  },
  mounted () {
      
  },
  methods: {
    open (item) {
      this.visible = true
      if (item === null || item === undefined) {
        this.item = {}
      } else {
        this.item = item
        this.getCheckinById(item.checkinId);
      }
    },
    getCheckinById(checkinId) {
      getCheckinById(checkinId).then(res => {
        // console.log('根据id查询入住信息',res.data)
        if (res.data.code == 0){
          this.item = res.data.data.room
          this.tenants = res.data.data.tenants
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
    cancel () {
      this.visible = false
    }
  }
}
</script>

<style lang="less">

</style>
