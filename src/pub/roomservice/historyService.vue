<template>
  <div id="currentServiceAdd">
    <el-dialog :title="title" :visible.sync="visible" top="2rem" width="80%" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form :model="searchForm" label-width="100px">
        <el-row>
            <el-col :span="5">
              <el-form-item label="员工姓名:">
                <el-input v-model="searchForm.employeeName" placeholder="员工姓名" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="服务类型:" prop="categoryName">
                <el-select v-model="searchForm.categoryName" palceholder="请选择服务类型" clearable>
                <el-option
                    v-for="(val, idx) in categoryList"
                    :key="idx"
                    :label="val"
                    :value="val">
                </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="服务时间：">
                <el-date-picker
                    v-model="createTimeRange"
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
        height="300"
        :data="currentServiceInfo"
        element-loading-text="拼命加载中"
        @cell-mouse-enter="mouseEnter"
        >
        <el-table-column label="住客信息">
          <el-table-column label="房号" prop="roomNumber"/>
          <el-table-column label="员工" prop="employeeName"/>
          <el-table-column label="服务类型" prop="categoryName"/>
          <el-table-column label="开始时间" prop="serviceStartTime"/>
          <el-table-column label="结束时间" prop="serviceEndTime"/>
        </el-table-column>
      </el-table>
      <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
      <span slot="footer">
        <el-button type="primary" @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getServiceHistoryList } from '@/api/service';
import PageComponent from '@/components/Pagenation/index'
import { formateDate } from '@/utils/formateDate';
export default {
  components: {
    PageComponent
  },
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
      searchForm: {
        employeeName: '',
        categoryName: ''
      },
      createTimeRange: '',
      currentServiceInfo: [],
      categoryList: [],
      serviceData: {},
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getServiceHistoryList(null)
  },
  methods: {
    formateDate,
    open (categoryList) {
      this.visible = true
      this.categoryList = categoryList
    },
    onSearch (param) {
      if (this.createTimeRange == null || this.createTimeRange == '') {
        param.statTime = ''
        param.endTime = ''
      } else {
        param.statTime = this.formateDate(this.createTimeRange[0])
        param.endTime = this.formateDate(this.createTimeRange[1])
      }
      getServiceHistoryList(param).then(res => {
        if (res.data.code == 0){
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.currentServiceInfo = res.data.data
        } else if (res.data.code === 3) {
          alert('登录已过期，请重新登录')
          this.$router.push({ path:'/login'} );
        }
      })
    },
    getServiceHistoryList(param) {
      getServiceHistoryList(param).then(res => {
        // console.log('历史服务信息res是', res)
        if (res.data.code == 0){
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.currentServiceInfo = res.data.data
        } else if (res.data.code === 3) {
          alert('登录已过期，请重新登录')
          this.$router.push({ path:'/login'} );
        }
      })
    },
    handlePageChange(item) {
      const para = { page: item.currentPage, limit: item.pageSize };
      this.getServiceHistoryList(para);
    },
    mouseEnter (data) {
      this.serviceData = Object.assign({}, data)
      // console.log('h行信息',this.serviceData)
    },
    cancel () {
      this.visible = false
    }
  }
}
</script>

<style lang="less">

</style>
