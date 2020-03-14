<template>
  <div id="employee">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="房号：" prop="number">
            <el-input v-model="searchForm.number" placeholder="请输入房号" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客房类型：" prop="roomType">
            <el-input v-model="searchForm.roomType" placeholder="请输入客房类型" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="床型：" prop="bedType">
            <el-input v-model="searchForm.bedType" placeholder="请输入床型" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态：" prop="state">
            <el-select v-model="searchForm.state" placeholder="请选择状态" clearable>
              <el-option key="1" label="未退房未到期" value="未退房未到期"></el-option>
              <el-option key="2" label="未退房已到期" value="未退房已到期"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="时间：">
            <el-date-picker
              v-model="searchForm.createTimeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="入住时间"
              end-placeholder="退房时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房费区间：" prop="startMoney">
            <el-input v-model="searchForm.startMoney" placeholder="最低房费" clearable style="width:48%"/>-
            <el-input v-model="searchForm.endMoney" placeholder="最高房费" clearable style="width:48%"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getCheckinList(searchForm)">查询</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      border
      height="370"
      :data="checkinList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @cell-mouse-enter="mouseEnter"
        >
      <el-table-column type="selection" align="center" />
       <el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1  -->
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房号" prop="room.number"/>
      <el-table-column label="入住时间" prop="checkinTime"/>
      <el-table-column label="入住天数" prop="checkinDay"/>
      <el-table-column label="价格" prop="money"/>
      <el-table-column label="退房时间" prop="expectCheckoutTime"/>
      <el-table-column label="操作" prop="operation" width="260">
        <template>
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="$refs.updateDetails.open(checkinData)"
          >查看详情</el-button>
          <el-button
            type="text"
            icon="el-icon-edit"
            class="red"
            @click="$refs.updateRoom.open(checkinData)"
          >换房</el-button>
          <el-button
            type="text"
            icon="el-icon-edit"
            class="red"
            @click="$refs.updateDialog.open(checkinData)"
          >修改</el-button>
          <el-button
            type="text"
            icon="el-icon-edit"
            class="red"
            @click="checkout(checkinData)"
          >退房</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增入住" @confirmData="(item) => addcheckin(item)"/>
    <update-details ref="updateDetails" title="入住详情"/>
    <update-dialog ref="updateDialog" title="修改入住天数" @confirmData="(item) => updateCheckin(item)"/>
    <update-room ref="updateRoom" title="换房" @confirmData="(item) => updateRoom(item)"/>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import AddDialog from './addCheckin'
import UpdateDetails from './details'
import UpdateDialog from './updateDialog'
import UpdateRoom from './updateroom'
import { getCheckinList,addCheckin,updateCheckin,updateRoom } from '@/api/checkin';
import { addCheckout } from '@/api/checkout';
import PageComponent from '@/components/Pagenation/index'
import { formateDate } from '@/utils/formateDate';
export default {
  components: {
    PageComponent,
    AddDialog,
    UpdateDetails,
    UpdateDialog,
    UpdateRoom
  },
  data () {
    return {
      loading: true,
      searchForm: {
        number: '',
        roomType: '',
        bedType: '',
        state: '',
        createTimeRange: '',
        startMoney: '',
        endMoney: ''
      },
      checkinList: [],
      checkinData: {},
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getCheckinList(null);
  },
  methods: {
    formateDate,
    handlePageChange(item) {
      // console.log(item);// currentPage=1  pageSize=30条
      const para = { currentPage: item.currentPage, pageSize: item.pageSize };
      this.getCheckinList(para);
    },
    getCheckinList(param) {
      if (this.searchForm.createTimeRange == null || this.searchForm.createTimeRange == '') {
        this.searchForm.statTime = ''
        this.searchForm.endTime = ''
      } else {
        this.searchForm.statTime = this.formateDate(this.searchForm.createTimeRange[0])
        this.searchForm.endTime = this.formateDate(this.searchForm.createTimeRange[1])
      }
      console.log('查询蚕食是param',this.searchForm)
      getCheckinList(param).then(res => {
        console.log('返回的数据是',res.data)
        this.checkinList = res.data.data
        this.loading = false;
      })
    },
    mouseEnter (data) {
      this.checkinData = Object.assign({}, data)
    },
    addcheckin (item) {
      console.log('新增入住通知', item)
      const param = {
        "checkinDay": item.checkinDay,
        "errorInfo": {},
        "roomId": item.roomId,
        "tenants": [{
          "tenantIdCard": item.tenantIdCard,
          "tenantName": item.tenantName,
          "tenantSex": item.tenantSex,
          "tenantTel": item.tenantTel
        }]
      }
      console.log('param', param)
      const headers = { 'Content-type': 'application/json;charset=utf-8'}
      addCheckin(JSON.stringify(param),headers).then(res => {
        console.log('新增入住',res)
        if (res.data.code == 5) {
          this.$message({
            type: 'warning',
            message: res.data.data
          })
        } else if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '新增入住成功'
          })
          this.getCheckinList()
        }
      })
    },
    updateCheckin(item) {
      const param = {
        checkinId: item.checkinId,
        checkinDay: item.checkinDay
      }
      console.log('修改入住天数的参数是',param)
      updateCheckin(param).then(res => {
        console.log('修改入住天数的参数是',res.data)
        if(res.data.code == 0){
          this.$message({
            type: 'success',
            message: '修改入住天数成功'
          })
        }
        this.getCheckinList()
      })
    },
    updateRoom(item) {
      const param = {
        checkinId: item.checkinId,
        roomId: item.roomId
      }
      console.log('换房的参数是',param)
      updateRoom(param).then(res => {
        console.log('换房的返回的数据是',res.data)
        if(res.data.code == 0){
          this.$message({
            type: 'success',
            message: '换房成功'
          })
        }
        this.getCheckinList()
      })
    },
    checkout(checkinData){ // money怎末搞
      const param = {
        checkinId: checkinData.checkinId,
        money: 100
      }
      addCheckout(param).then(res => {
        console.log('换房的返回的数据是',res.data)
        if(res.data.code == 0){
          this.$message({
            type: 'success',
            message: '换房成功'
          })
        }
        this.getCheckinList()
      })
    }
  }
}
</script>

<style lang="less">

</style>
