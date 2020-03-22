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
        <el-col :span="12">
          <el-form-item label="房费：" prop="startMoney">
            <el-input v-model="searchForm.startMoney" placeholder="最低房费" clearable style="width:48%"/>-
            <el-input v-model="searchForm.endMoney" placeholder="最高房费" clearable style="width:48%"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="入住时间：">
            <el-date-picker
              v-model="checkinTimeRange"
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
              v-model="checkoutTimeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="起始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch(searchForm)">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      border
      height="380"
      :data="CheckoutList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @cell-mouse-enter="mouseEnter"
        >
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
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
    <update-details ref="updateDetails" title="退房详情"/>
  </div>
</template>

<script>
import UpdateDetails from './details'
import { getCheckoutList } from '@/api/checkout';
import { formateDate } from '@/utils/formateDate';
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
        statCheckinTime: '',
        endCheckinTime: '',
        statCheckoutTime: '',
        endCheckoutTime: '',
        startMoney: '',
        endMoney: ''
      },
      checkinTimeRange: '',
      checkoutTimeRange: '',
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
    formateDate,
    handlePageChange(item) {
      const para = { page: item.currentPage, limit: item.pageSize };
      this.getCheckoutList(para);
    },
    onSearch(param) {
      if (this.checkinTimeRange == null || this.checkinTimeRange == '') {
        param.statCheckinTime = ''
        param.endCheckinTime = ''
      } else {
        param.statCheckinTime = this.formateDate(this.checkinTimeRange[0])
        param.endCheckinTime = this.formateDate(this.checkinTimeRange[1])
      }
      if (this.checkoutTimeRange == null || this.checkoutTimeRange == '') {
        param.statCheckoutTime = ''
        param.endCheckoutTime = ''
      } else {
        param.statCheckoutTime = this.formateDate(this.checkoutTimeRange[0])
        param.endCheckoutTime = this.formateDate(this.checkoutTimeRange[1])
      }
      getCheckoutList(param).then(res => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.CheckoutList = res.data.data
          this.loading = false;
        }else if (res.data.code === 3) {
          alert('登录已过期，请重新登录')
          this.$router.push({ path:'/login'} );
        }
      })
    },
    getCheckoutList(param) {
      getCheckoutList(param).then(res => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.CheckoutList = res.data.data
          this.loading = false;
        }else if (res.data.code === 3) {
          alert('登录已过期，请重新登录')
          this.$router.push({ path:'/login'} );
        }
      })
    },
    mouseEnter (data) {
      this.checkoutData = Object.assign({}, data)
    },
    addCheckout (item) {
      // console.log('新增通知', item)
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
      // console.log('param', param)
      const headers = { 'content-type': 'application/json;charset=utf-8'}
      // console.log('param', JSON.stringify(param))
      addCheckout(JSON.stringify(param),headers).then(res => {
        // console.log('新增入住',res)
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
