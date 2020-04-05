<template>
  <div id="roomstate">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="房号：">
            <el-input v-model="searchForm.number" placeholder="请输入房号" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客房类型：" prop="roomType">
          <el-select v-model="searchForm.roomType" placeholder="请选择客房类型" clearable>
            <el-option
              v-for="item in roomTypeList"
              :key="item.roomTypeId"
              :label="item.roomTypeName"
              :value="item.roomTypeName">
            </el-option>
          </el-select> 
        </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="可住人数：">
            <el-input v-model="searchForm.peopleNum" placeholder="请输入可住人数" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="楼层：">
            <el-input v-model="searchForm.floor" placeholder="请输入楼层" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="床型：">
            <el-select v-model="searchForm.bedType" placeholder="请选择床型" clearable>
              <el-option
                v-for="i in bedTypeList"
                :key="i.categoryId"
                :label="i.categoryName"
                :value="i.categoryName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客房状态：">
            <el-select v-model="searchForm.state" placeholder="请输入客房状态" clearable>
              <el-option key="2" label="空闲" value="空闲"></el-option>
              <el-option key="2" label="在住" value="在住"></el-option>
              <el-option key="1" label="不可用" value="不可用"></el-option>
              <el-option key="2" label="正在打扫" value="正在打扫"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="房费：" prop="startPrice">
            <el-input v-model="searchForm.startPrice" placeholder="最低房费" clearable style="width:48%"/>-
            <el-input v-model="searchForm.endPrice" placeholder="最高房费" clearable style="width:48%"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getroomList(searchForm)">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      border
      height="380"
      :data="roomList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @cell-mouse-enter="mouseEnter"
        >
       <el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房号" prop="number"/>
      <el-table-column label="客房类型" prop="roomType" width="100"/>
      <el-table-column label="楼层" prop="floor"/>
      <el-table-column label="面积" prop="area"/>
      <el-table-column label="可住人数" prop="peopleNum"/>
      <el-table-column label="单价" prop="price"/>
      <el-table-column label="客房状态" prop="state"/>
      <el-table-column label="床型" prop="bedType"/>
      <el-table-column label="床型细节" prop="bedDetail" width="100"/>
      <el-table-column label="是否可加床" prop="jiaChuang" width="100"/>
      <el-table-column label="客房设施" prop="facilities" width="400"/>
      <el-table-column label="备注" prop="remark" width="200"/>
      <el-table-column label="操作" prop="operation" width="100">
        <template>
          <el-button
            type="text"
            icon="el-icon-s-tools"
            @click="drawer = true"
          >查看图片</el-button>
        </template>
      </el-table-column>
      <el-drawer
        title="客房图片详情"
        :visible.sync="drawer"
        :append-to-body='true'
        direction="rtl"
        size="50%">
          <div v-for="(img, index) in roomData.imgList" :key="index">
            <img :src="img">
          </div>
      </el-drawer>
    </el-table>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import { getroomList } from '@/api/room';
import { getAllRoomTypeList } from '@/api/roomtype'
import { getCategoryList } from '@/api/category'
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent
  },
  data () {
    return {
      loading: true,
      drawer: false, // 控制抽屉的显影
      searchForm: {
        number: '',
        searchForm: '',
        peopleNum: '',
        floor: '',
        bedType: '',
        state: '',
        startPrice: '',
        endPrice: ''
      },
      roomList: [],
      roomData: {},
      roomTypeList: [], // 客房类型
      bedTypeList: [],
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getroomList(null);
    this.getAllRoomTypeList();
    this.getCategoryList()
  },
  methods: {
    handlePageChange(item) {
      const para = { page: item.currentPage, limit: item.pageSize };
      this.getroomList(para);
    },
    mouseEnter (data) {
      this.roomData = Object.assign({}, data)
    },
    getCategoryList() {
      getCategoryList({type:'床型'}).then(res => {
        if(res.data.code === 0){
          this.bedTypeList = res.data.data
        }
      })
    },
    getroomList(param) {
      getroomList(param).then(res => {
        if (res.data.code === 0){
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.roomList = res.data.data
          this.loading = false;
        } else if (res.data.code === 3) {
          alert('登录已过期，请重新登录')
          this.$router.push({ path:'/login'} );
        }
      })
    },
    getAllRoomTypeList() {
      getAllRoomTypeList().then(res => {
        if(res.data.code === 0){
          this.roomTypeList = res.data.data
        }
      })
    },
    addroom (item) {
      addroom(item).then(res => {
        if(res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '新增客房类型成功'
          })
          this.getroomList()
        }
      })
    }
  }
}
</script>

<style lang="less">
#room{
   .el-card__body {
    display: flex;
    .contentBox {
      padding: 14px;
      div{
        margin-bottom: 10px;
        a {
          margin: 0 15px 15px 0;
        }
      }
    }
  }
}
</style>
