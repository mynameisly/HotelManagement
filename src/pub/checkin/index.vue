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
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getempList(searchForm)">查询</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="400"
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
      <el-table-column label="房号" prop="number"/>
      <el-table-column label="入住时间" prop="checkinTime"/>
      <el-table-column label="入住天数" prop="checkinDay"/>
      <el-table-column label="价格" prop="money"/>
      <el-table-column label="退房时间" prop="expectCheckoutTime"/>
      <el-table-column label="操作" prop="operation" width="200">
        <template>
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="updateRoom(checkinData)"
          >编辑</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            class="red"
            @click="handleDelete(checkinData)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增"  @confirmData="(item) => addcheckin(item)"/>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import AddDialog from './addCheckin'
import { getCheckinList,addCheckin,updateCheckin,updateRoom } from '@/api/checkin';
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent,
    AddDialog
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
    // getcheckin () {
    //   axios.get('/HotelManagement/json/checkin/list').then((res) =>{
    //     console.log(2222222, res.data)
    //   })
    // },
    handlePageChange(item) {
      // console.log(item);// currentPage=1  pageSize=30条
      const para = { currentPage: item.currentPage, pageSize: item.pageSize };
      this.getCheckinList(para);
    },
    getCheckinList(param) {
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
      console.log('新增通知', item)
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
      const headers = { 'content-type': 'application/json;charset=utf-8'}
      // console.log('param', JSON.stringify(param))
      addCheckin(JSON.stringify(param),headers).then(res => {
        console.log('新增入住',res)
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '新增入住成功'
          })
          this.getCheckinList()
        }
      })
    },
    handleDelete () {
      this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then((res) => {
        // axios.get('/json/academic/delete?checkinId=' + this.checkinData.checkinId).then((res) => {
        //   if (res.data.msg === '无权限') {
        //     this.$router.push({path: '/401'})
        //   } else if (res.data.code === 0) {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功'
        //     })
        //     this.getCheckinList()
        //   }
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // handlePageChange (item) {
    //   axios.get('/HotelManagement/json/checkinloyee/list?page=' + item.currentPage + '&limit=' + item.pageSize + '&title=' + this.searchForm.title).then((res) => {
    //     if (res.data.code === 0) {
    //       this.page.currentPage = res.data.page.page
    //       this.page.pageSize = res.data.page.limit
    //       this.page.totalPage = res.data.page.totalPages
    //       this.page.totalSize = res.data.page.totalRows
    //       this.checkinList = res.data.data
    //     }
    //   })
    // }
  }
}
</script>

<style lang="less">

</style>
