<template>
  <div id="checkout">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="客房信息：" prop="roomInfo	">
            <el-input v-model="searchForm.roomInfo	" placeholder="请输入客房信息" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="住客信息：" prop="tenantInfo">
            <el-input v-model="searchForm.tenantInfo" placeholder="请输入住客信息" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最低房价：" prop="startMoney">
            <el-input v-model="searchForm.startMoney" placeholder="请输入最低房价" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最高房价：" prop="endMoney">
            <el-input v-model="searchForm.endMoney" placeholder="请输入最高房价" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="入住时间：">
            <el-date-picker
              v-model="searchForm.CheckinTimeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="起始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="退房时间：">
            <el-date-picker
              v-model="searchForm.checkoutTimeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="起始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getempList(searchForm)">查询</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      border
      height="370"
      :data="CheckoutList"
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
      <el-table-column label="房号" prop="roomInfo.number"/>
      <!-- 住客不止是一个人数组对象 -->
      <el-table-column label="入住天数" prop="checkinDay"/>
      <el-table-column label="入住时间" prop="checkinTime"/>
      <el-table-column label="退房时间" prop="checkoutTime"/>
      <el-table-column label="房费" prop="money"/>
      <el-table-column label="操作" prop="operation" width="200">
        <template>
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="$refs.updateDetails.open(checkoutData)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <add-dialog ref="addDialog" title="新增"  @confirmData="(item) => addCheckout(item)"/> -->
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
    <update-details ref="updateDetails" title="退房详情"/>
  </div>
</template>

<script>
import UpdateDetails from './details'
import { getCheckoutList } from '@/api/checkout';
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent,
    UpdateDetails
  },
  data () {
    return {
      loading: true,
      searchForm: {
        roomInfo: '',
        tenantInfo: '',
        CheckinTimeRange: '',
        CheckoutTimeRange: '',
        startMoney: '',
        endMoney: ''
      },
      CheckoutList: [],
      checkoutData: {},
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getCheckoutList(null);
  },
  methods: {
    handlePageChange(item) {
      const para = { currentPage: item.currentPage, pageSize: item.pageSize };
      this.getCheckoutList(para);
    },
    getCheckoutList(param) {
      getCheckoutList(param).then(res => {
        console.log('退房记录返回的数据是',res.data)
        this.CheckoutList = res.data.data
        this.loading = false;
      })
    },
    mouseEnter (data) {
      this.checkoutData = Object.assign({}, data)
    },
    addCheckout (item) {
      console.log('新增通知', item)
      const param = {
        "CheckoutDay": item.CheckoutDay,
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
      const headers = { 'content-type': 'application/json;charset=utf-8'}
      // console.log('param', JSON.stringify(param))
      addCheckout(JSON.stringify(param),headers).then(res => {
        console.log('新增入住',res)
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '新增入住成功'
          })
          this.getCheckoutList()
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
