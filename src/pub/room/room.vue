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
            <el-input v-model="searchForm.bedType" placeholder="请输入床型" clearable/>
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
        <el-col :span="12">
          <el-form-item label="房费：" prop="startMoney">
            <el-input v-model="searchForm.startMoney" placeholder="最低房费" clearable style="width:48%"/>-
            <el-input v-model="searchForm.endMoney" placeholder="最高房费" clearable style="width:48%"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getroomList(searchForm)">查询</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增</el-button>
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
          <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1  -->
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
      <el-table-column label="操作" prop="operation" width="240">
        <template>
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="$refs.updateDialog.open(roomData)"
          >查看详情</el-button>
          <el-button
            type="text"
            style="margin-left: 16px;"
            icon="el-icon-s-tools"
            @click="drawer = true"
          >查看图片</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            class="red"
            @click="handleDelete"
          >删除</el-button>
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
    <!-- <el-row v-for="(room, index) in roomList" :key="index" v-loading="loading">
      <el-col :span="24">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <div class="imgBox">
            <img v-if="room.imgList.length !== 0" :src="room.imgList[0]" class="image" width="280">
            <img v-else src="../../assets/img/280.jpg" width="240">
          </div>
          <div class="contentBox">
            <div>
              <a>{{ room.number }}</a>
              <a>{{ room.state }}</a>
              <a>可住{{ room.peopleNum }}人</a>
              <a>更新时间：{{ room.updateTime }}</a>
            </div>
            <div>
              <a>{{ room.bedType }}</a>
              <a>{{ room.bedDetail }}</a>
              <a>{{ room.window }}</a>
            </div>
            <div>
              <a>{{ room.jiaChuang }}</a>
              <a>单价：{{ room.price }}</a>
            </div>
            <div>
              <a>{{ room.remark }}</a>
            </div>
            <div>
              <a>{{ room.facilities }}</a>
            </div>
            <div class="bottom clearfix">
              <el-button type="primary" @click="$refs.updateDialog.open(roomData)">查看详情</el-button>
              <el-button type="danger" @click="handleDelete">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row> -->
    <add-dialog ref="addDialog" title="新增"  @confirmData="(item) => addroom(item)"/>
    <update-dialog ref="updateDialog" title="修改"  @confirmData="(item) => updateroom(item)"/>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import AddDialog from './addroom'
import updateDialog from './addroom'
import axios from 'axios'
import { getroomList,addroom,updateroom,delroom } from '@/api/room';
import { getAllRoomTypeList } from '@/api/roomtype'
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent,
    AddDialog,
    updateDialog
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
      roomTypeList: [], // 客房类型
      roomData: '', // 保存该条数据的roomId
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
    this.getAllRoomTypeList()
  },
  methods: {
    mouseEnter (data) {
      this.roomData = Object.assign({}, data)
    },
    handlePageChange(item) {
      // console.log(item);// currentPage=1  pageSize=30条
      const para = { currentPage: item.currentPage, pageSize: item.pageSize };
      this.getroomList(para);
    },
    getroomList(param) {
      getroomList(param).then(res => {
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        // console.log('返回的客房类型数据是',res.data)
        this.roomList = res.data.data
        this.loading = false;
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
      console.log('新增客房类型', item)
      addroom(item).then(res => {
        console.log('新增客房返回数据是', res)
        if(res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '新增客房类型成功'
          })
          this.getroomList()
        }
      })
    },
    updateroom () { // 修改客房类型
      console.log('修改客房类型', item)
      updateroom(item).then(res => {
        console.log('修改客房类型返回数据是', res)
        if(res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '修改客房类型成功'
          })
          this.getroomList()
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
        delroom(this.roomData.roomId).then(res => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getroomList()
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
#room{
  // .el-row {
  //   margin-bottom: 10px;
  //   .el-col-12:first-child {
  //     padding-right: 10px;
  //   }
  //   .el-col-12:last-child{
  //     padding-left: 10px;
  //   }
  // }
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
