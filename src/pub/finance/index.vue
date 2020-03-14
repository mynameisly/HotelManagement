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
      <el-table-column label="趋势" prop="statList"/>
    </el-table>
  </div>
</template>

<script>
import { getfinList } from '@/api/finance';
export default {
  data () {
    return {
      loading: true,
      searchForm: {
        createTimeRange: ''
      },
      finList: [],
      finData: {},
      rules: {
        createTimeRange: [{ required: true, message: '请输入', trigger: 'blur' }],
      }
    }
  },
  mounted () {
    this.getfinList(null);
  },
  methods: {
    getfinList(param) {
      getfinList(param).then(res => {
        console.log('财务返回的数据是',res.data)
        if (res.data.code === 3) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
        this.finList = res.data.data
        this.loading = false;
      })
    }
  }
}
</script>

<style lang="less">

</style>
