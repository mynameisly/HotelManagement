<template>
  <div id="roomtype">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="6" :offset="1">
          <el-form-item label="房号：">
            <el-input v-model="searchForm.number" placeholder="请输入房号" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="客房类型：">
            <el-input v-model="searchForm.roomType" placeholder="请输入客房类型" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="可住人数：">
            <el-input v-model="searchForm.peopleNum" placeholder="请输入可住人数" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-form-item label="楼层：">
            <el-input v-model="searchForm.floor" placeholder="请输入楼层" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="床型：">
            <el-input v-model="searchForm.bedType" placeholder="请输入床型" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item>
                <el-select v-model="searchForm.state" placeholder="请输入状态" clearable>
                    <el-option key="2" label="空闲" value="空闲"></el-option>
                    <el-option key="2" label="在住" value="在住"></el-option>
                    <el-option key="1" label="不可用" value="不可用"></el-option>
                    <el-option key="2" label="正在打扫" value="正在打扫"></el-option>
                </el-select>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-form-item label="最低价：">
            <el-input v-model="searchForm.startPrice" placeholder="请输入最低价" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最高价：">
            <el-input v-model="searchForm.endPrice" placeholder="请输入最高价" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getRoomTypeList(searchForm)">查询</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增</el-button>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- v-loading不生效，elementUI官网上是对table使用的 -->
    <el-row v-for="(room, index) in roomTypeList" :key="index" v-loading="loading">
      <!-- <el-col :span="11" v-for="(o, index) in 2" :key="o" :offset="index > 0 ? 1 : 0"> -->
      <el-col :span="12" v-for="o in 2" :key="o">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" @cell-mouse-enter="mouseEnter">
          <div class="imgBox">
            <img v-if="room.imgList.length !== 0" :src="room.imgList[0]" class="image" width="280">
            <img v-else src="../../assets/img/280.jpg" width="280">
          </div>
          <div style="padding: 14px;">
            <div>
              <el-tag>{{ room.number }}</el-tag>
              <el-tag>{{ room.roomType }}</el-tag>
              <el-tag>可住{{ room.peopleNum }}人</el-tag>
            </div>
            <div>
              <el-tag>{{ room.bedType }}</el-tag>
              <el-tag>{{ room.bedDetail }}</el-tag>
              <el-tag>{{ room.window }}</el-tag>
            </div>
            <div>
              <el-tag>{{ room.jiaChuang }}</el-tag>
              <el-tag>价格：{{ room.price }}</el-tag>
            </div>
            <div>
              <el-tag>{{ room.state }}</el-tag>
              <el-tag>{{ room.updateTime }}</el-tag>
            </div>
            <div>
              <el-tag>{{ room.remark }}</el-tag>
            </div>
            <div>
              <el-tag>{{ room.facilities }}</el-tag>
            </div>
            <div class="bottom clearfix">
            <!-- <update-dialog ref="updateDialog" title="修改"  @confirmData="(item) => updateroomtype(item)"/> -->
              <el-button type="primary" @click="$refs.updateDialog.open(roomTypeData)">查看详情</el-button>
              <el-button type="danger" @click="handleDelete">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <add-dialog ref="addDialog" title="新增"  @confirmData="(item) => addroomtype(item)"/>
    <update-dialog ref="updateDialog" title="修改"  @confirmData="(item) => updateroomtype(item)"/>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import AddDialog from './addRoomType'
import updateDialog from './addRoomType'
import axios from 'axios'
import { getRoomTypeList,addRoomType,updateRoomType,delRoomType } from '@/api/roomtype';
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
      searchForm: {
        number: '',
        roomType: '',
        peopleNum: '',
        floor: '',
        bedType: '',
        state: '',
        startPrice: '',
        endPrice: ''
      },
      roomTypeList: [],
      roomTypeData: {},
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getRoomTypeList(null);
  },
  methods: {
    handlePageChange(item) {
      // console.log(item);// currentPage=1  pageSize=30条
      const para = { currentPage: item.currentPage, pageSize: item.pageSize };
      this.getRoomTypeList(para);
    },
    getRoomTypeList(param) {
      getRoomTypeList(param).then(res => {
        console.log('返回的客房类型数据是',res.data)
        console.log(res.data.data)
        this.roomTypeList = res.data.data
        this.loading = false;
      })
    },
    mouseEnter (data) { // 这个数据拿不到
      this.roomTypeData = Object.assign({}, data)
    },
    addroomtype (item) {
      console.log('新增客房类型', item)
      addRoomType(item).then(res => {
        console.log('新增客房返回数据是', res)
        if(res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '新增客房类型成功'
          })
          this.getRoomTypeList()
        }
      })
    },
    updateroomtype () { // 修改客房类型
      console.log('修改客房类型', item)
      updateRoomType(item).then(res => {
        console.log('修改客房类型返回数据是', res)
        if(res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '修改客房类型成功'
          })
          this.getRoomTypeList()
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
        delRoomType(this.roomTypeData.roomTypeId).then(res => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getRoomTypeList()
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
#roomtype{
  .el-row {
    margin-bottom: 10px;
    .el-col-12:first-child {
      padding-right: 10px;
    }
    .el-col-12:last-child{
      padding-left: 10px;
    }
  }
   .el-card__body {
    display: flex;
    .el-tag {
      margin: 0 5px 5px 0;
    }
  }
}
</style>
