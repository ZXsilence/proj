<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
        <el-button type="primary" @click="goAddPage">添加商品</el-button>
        <el-table
            :data="goodsList"
            border stripe
            style="width: 100%">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="商品名称" prop="goods_name"></el-table-column>
            <el-table-column label="商品价格(元)" prop="goods_price" :formatter="priceFormatter" width="95px"></el-table-column>
            <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
            <el-table-column label="创建时间" prop="add_time" width="140px">
                <template slot-scope="scope">
                    {{ scope.row.add_time | dateFormat }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="130px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById ( scope.row.goods_id )"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
        </el-pagination>
    </el-card>

</div>
</template>

<script>
export default {
    data () {
        return {
            queryInfo: {
                query:'',
                pagenum: 1,
                pagesize:10
            },
            searchInput: '',
            goodsList: [],
            total: 0
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        goAddPage (){
            this.$router.push('/goods/add')
        },
        removeById ( goods_id ) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        
            }).then( async () => {
                const {data: res} = await this.$http.delete(`goods/${goods_id}`)
                if (res.meta.status !== 200) return this.$message.error('error')
                this.$message({
                                type: 'success',
                                message: '删除成功!'
                              
                });
                this.getGoodsList()
                        
            }).catch(() => {
                this.$message({
                                type: 'info',
                                message: '已取消删除'
                              
                });          
                        
            });
        },
        async getGoodsList () {
            const {data: res} = await this.$http.get('goods', {params: this.queryInfo})
            if (res.meta.status !== 200) return this.$message.error('error')
            this.goodsList = res.data.goods
            this.total = res.data.total
            console.log(this.goodsList)
            this.$message.success('success')
        },
        handleSizeChange ( newSize ) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange (newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        priceFormatter (row, column) {
            return row.goods_price /100.
        }
    }
}
</script>

<style lang='less' scoped>
.el-input {
    width: 300px;
    margin-right: 20px;
}
</style>
