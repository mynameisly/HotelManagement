<template>
  <div id="finace">
    <el-form v-model="searchForm" :rules="rules" :inline="true">
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
        >
      <el-table-column label="订单总量" prop="orderCount"/>
      <el-table-column label="总收入" prop="money"/>
      <!-- <el-table-column label="趋势" prop="statList"/> -->
    </el-table>
  </div>
</template>

<script>
import { getfinList } from '@/api/finance';
import { formateDate } from '@/utils/formateDate';
export default {
  data () {
    return {
      loading: true,
      searchForm: {
        createTimeRange: '',
        statTime: '',
        endTime: ''
      },
      finList: [],
      rules: {
        createTimeRange: [{ required: true, message: '请输入', trigger: 'blur' }],
      }
    }
  },
  mounted () {
    // this.getfinList(null);
  },
  methods: {
    formateDate,
    getfinList(searchForm) {
      if (this.searchForm.createTimeRange == null || this.searchForm.createTimeRange == '') {
        this.searchForm.statTime = ''
        this.searchForm.endTime = ''
      } else {
        this.searchForm.statTime = this.formateDate(this.searchForm.createTimeRange[0])
        this.searchForm.endTime = this.formateDate(this.searchForm.createTimeRange[1])
      }
      delete this.searchForm.createTimeRange
      getfinList(searchForm).then(res => {
        console.log('财务返回的数据是',res)
        if (res.data.code === 0) {
          this.finList = res.data.data
          this.loading = false;
        } else if (res.data.code === 3) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
