<template>
  <div id="service">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="员工:" prop="employeeName">
          <el-select v-model="searchForm.employeeName" palceholder="请选择员工" clearable>
            <el-option
              v-for="(val, idx) in empList"
              :key="idx"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="6">
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
        <el-col :span="8">
          <el-form-item label="时间：">
            <el-date-picker
              v-model="createTimeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="服务开始时间"
              end-placeholder="服务结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch(searchForm)">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增</el-button>
            <el-button type="primary" icon="el-icon-search" @click="$refs.historyService.open(categoryList)">查询历史服务</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="380"
      :data="serviceList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @cell-mouse-enter="mouseEnter"
        >
       <el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" prop="employeeName"/>
      <el-table-column label="服务类型" prop="categoryName"/>
      <el-table-column label="房号" prop="roomNumber"/>
      <el-table-column label="服务时间" prop="createTime"/>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column label="操作" prop="operation" width="200">
        <template>
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="$refs.updateDialog.open(serviceData)"
          >修改</el-button>
          <el-button
            type="text"
            icon="el-icon-check"
            @click="finishService"
            >服务完成</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            class="red"
            @click="handleDelete(serviceData)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增"  @confirmData="(item) => addservice(item)"/>
    <update-dialog ref="updateDialog" title="修改"  @confirmData="(item) => updateservice(item)"/>
    <history-service ref="historyService" title="历史服务"/>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import AddDialog from './addService'
import updateDialog from './addService'
import historyService from './historyService'
import { getServiceList,addService,updateService,delService,finishService } from '@/api/service';
import { getempList } from '@/api/employee';
import { getCategoryList } from '@/api/category';
import PageComponent from '@/components/Pagenation/index'
import { formateDate } from '@/utils/formateDate';
export default {
  components: {
    PageComponent,
    AddDialog,
    updateDialog,
    historyService
  },
  data () {
    return {
      loading: true,
      empList: [], // 保存员工信息
      categoryList: [], // 保存类型信息
      searchForm: {
        employeeName: '',
        categoryName: ''
      },
      createTimeRange: '',
      serviceList: [],
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
    this.getServiceList(null);
    this.getempList();
    this.getCategoryList();
  },
  methods: {
    formateDate,
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
    handlePageChange(item) {
      const para = { page: item.currentPage, limit: item.pageSize };
      this.getServiceList(para);
    },
    onSearch (param) {
      if (this.createTimeRange == null || this.createTimeRange == '') {
        param.statTime = ''
        param.endTime = ''
      } else {
        param.statTime = this.formateDate(this.createTimeRange[0])
        param.endTime = this.formateDate(this.createTimeRange[1])
      }
      getServiceList(param).then(res => {
        if (res.data.code == 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.serviceList = res.data.data
        } else if (res.data.code === 3) {
          alert('登录已过期，请重新登录')
          this.$router.push({ path:'/login'} );
        }
      })
    },
    getServiceList(param) {
      getServiceList(param).then(res => {
        this.loading = false;
        // console.log('客房服务返回的数据是',res.data)
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        if(res.data.code == 0){
          this.serviceList = res.data.data
        } else if (res.data.code === 3) {
          alert('登录已过期，请重新登录')
          this.$router.push({ path:'/login'} );
        }
      })
    },
    mouseEnter (data) {
      this.serviceData = Object.assign({}, data)
    },
    addservice (item) {
      // console.log('新增客房服务', item)
      addService(item).then(res => {
        // console.log('新增客房服务返回数据是', res)
        if(res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '新增客房服务成功'
          })
          this.getServiceList()
        }
      })
    },
    updateservice(item) {
      // console.log('修改客房服务', item)
      updateService(item).then(res => {
        // console.log('修改客房服务返回数据是', res)
        if(res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '修改客房类型成功'
          })
          this.getServiceList()
        }
      })
    },
    finishService(){
      finishService(this.serviceData.id).then(res => {
        if (res.data.code == 0){
          this.$message({
            type: 'success',
            message: '该服务已完成'
          })
        }
        this.getServiceList()
      })
    },
    handleDelete () {
      this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then((res) => {
        delService(this.serviceData.id).then(res => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getServiceList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less">

</style>
