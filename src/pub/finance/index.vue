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
              end-placeholder="结束时间"
            />
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
      height="100"
      :data="finList"
      style="color:#409EEF"
    >
      <el-table-column label="订单总量" prop="orderCount" />
      <el-table-column label="总收入（元）" prop="money" />
    </el-table>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <schart ref="line1" class="schart" canvasId="line1" :options="options1" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <schart ref="line2" class="schart" canvasId="line2" :options="options2" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Schart from 'vue-schart';
import { getfinList } from '@/api/finance';
import { formateDate } from '@/utils/formateDate';
export default {
  components: {
    Schart
  },
  data () {
    return {
      searchForm: {
        createTimeRange: '',
        statTime: '',
        endTime: ''
      },
      finList: [
        {
          orderCount: '',
          money: ''
        }
      ],
      rules: {
        createTimeRange: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      options1: {
        type: 'line',
        title: {
          text: '搜索时间内总收入'
        },
        labels: [],
        // labels: ['2020-03', '2020-04', '2020-05', '2020-06'],
        datasets: [
          {
            label: '总收入',
            data: []
            // data: [555, 1111, 2222, 1122]
          }
        ]
      },
       options2: {
        type: 'line',
        title: {
          text: '搜索时间内订单总量'
        },
        labels: [],
        // labels: ['2020-03', '2020-04', '2020-05', '2020-06'],
        datasets: [
          {
            label: '订单总量',
            data: []
            // data: [5, 11, 22, 12]
          }
        ]
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
        // console.log('财务返回的数据是', res)
        if (res.data.code === 0) {
          this.finList[0].orderCount = res.data.data.orderCount
          this.finList[0].money = res.data.data.money
          this.handleStatList(res.data.data.statList)
        } else if (res.data.code === 3) {
          // this.$message({
          //   type: 'error',
          //   message: res.data.msg
          // })
          alert('登录已过期，请重新登录')
          this.$router.push({ path:'/login'} );
        }
      })
    },
    handleStatList (statList) {
      const temp = statList
      // 每次点击搜索之前把数组置空，否则会一直push进数组
      this.options1.labels = []
      this.options2.labels = []
      this.options1.datasets[0].data = []
      this.options2.datasets[0].data = []
      temp.forEach((ele, idx) => {
        this.options1.labels.push(ele.month)
        this.options2.labels.push(ele.month)
        this.options1.datasets[0].data.push(ele.money)
        this.options2.datasets[0].data.push(ele.orderCount)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.schart {
  width: 100%;
  height: 300px;
}
</style>
