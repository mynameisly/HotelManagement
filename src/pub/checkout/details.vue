<template>
  <div id="checkinAdd">
    <el-dialog :title="title" :visible.sync="visible" top="2rem" width="80%" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
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
        height="240"
        :data="tenantInfo"
        element-loading-text="拼命加载中"
        >
        <el-table-column label="住客信息">
          <el-table-column label="姓名" prop="tenantName"/>
          <el-table-column label="性别" prop="tenantSex"/>
          <el-table-column label="联系方式" prop="tenantTel"/>
          <el-table-column label="身份证号码" prop="tenantIdCard"/>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button type="primary" @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCheckoutById } from '@/api/checkout';
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
      item: {},
      tenantInfo: []
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
        this.getCheckoutById(item.checkoutId);
      }
    },
    getCheckoutById(checkoutId) {
      getCheckoutById(checkoutId).then(res => {
        // console.log('根据id查询退房信息',res.data)
        if (res.data.code == 0){
          this.item = res.data.data.roomInfo
          this.tenantInfo = res.data.data.tenantInfo
        }
      })
    },
    cancel () {
      this.visible = false
    }
  }
}
</script>

<style lang="less">

</style>
