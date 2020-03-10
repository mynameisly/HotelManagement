<template>
  <div id="finace">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="核对时间：">
            <el-date-picker
              v-model="searchForm.createTimeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getfinList(searchForm)">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      border
      height="400"
      :data="finList"
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
      <el-table-column label="用户名" prop="number"/>
      <el-table-column label="头像" prop="headImg">
        <template slot-scope="scope">
          <img v-if="scope.row.headImg" :src="scope.row.headImg" alt="用户头像" width="30" height="30">
          <img v-else src="../../assets/img/img.jpg" alt="用户头像" width="30" height="30">
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" prop="readName"/>
      <el-table-column label="微信" prop="weiXin"/>
      <el-table-column label="QQ" prop="qq"/>
      <el-table-column label="操作" prop="operation" width="200">
            <template slot-scope="scope">
                <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
                <el-button
                    type="text"
                    icon="el-icon-delete"
                    class="red"
                    @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
            </template>
      </el-table-column>
    </el-table>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import axios from 'axios'
// import { getfinList } from '@/api/finloyee';
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent
  },
  data () {
    return {
      loading: true,
      searchForm: {
        number: '',
        readName: '',
        sex: ''
      },
      finList: [],
      finData: {},
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getfinList(null);
  },
  methods: {
    handlePageChange(item) {
      // console.log(item);// currentPage=1  pageSize=30条
      const para = { currentPage: item.currentPage, pageSize: item.pageSize };
      this.getfinList(para);
    },
    getfinList(param) {
      getfinList(param).then(res => {
        // this.page.currentPage = res.data.page.page
        // this.page.pageSize = res.data.page.limit
        // this.page.totalPage = res.data.page.totalPages
        // this.page.totalSize = res.data.page.totalRows
        console.log('返回的数据是',res.data)
        console.log(res.data.data)
        if (res.data.code === 3) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
        this.finList = res.data.data
        this.loading = false;
      })
    },
    mouseEnter (data) {
      this.finData = Object.assign({}, data)
    },
    handleDelete () {
      this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then((res) => {
        axios.get('/json/academic/delete?finId=' + this.finData.finId).then((res) => {
          if (res.data.msg === '无权限') {
            this.$router.push({path: '/401'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getfinList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // handlePageChange (item) {
    //   axios.get('/HotelManagement/json/finloyee/list?page=' + item.currentPage + '&limit=' + item.pageSize + '&title=' + this.searchForm.title).then((res) => {
    //     if (res.data.code === 0) {
    //       this.page.currentPage = res.data.page.page
    //       this.page.pageSize = res.data.page.limit
    //       this.page.totalPage = res.data.page.totalPages
    //       this.page.totalSize = res.data.page.totalRows
    //       this.finList = res.data.data
    //     }
    //   })
    // }
  }
}
</script>

<style lang="less">

</style>
