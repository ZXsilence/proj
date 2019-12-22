<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-row>
            <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true"
                index-text="#" border>
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green;"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level === 2">三级</el-tag>
                </template>
                <template slot="opt">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <el-pagination
              v-model="queryInfo"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </el-card>
		<el-dialog
          @close="addDialogClose"
		  title="添加分类"
		  :visible.sync="addDialogVisible"
		  width="50%"
          :close-on-click-modal="false"
		  :before-close="handleClose">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef" label-width="100px" >
              <el-form-item label="分类名称:" prop="cat_name">
                <el-input  v-model="ruleForm.cat_name" ></el-input>
              </el-form-item>
              <el-form-item label="父级分类:" prop="cat_pid">
                <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChanged"
                clearable
                change-on-select
                change></el-cascader>
              </el-form-item>
            </el-form>
		  <span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addCate">确 定</el-button>
		  </span>
		</el-dialog>

</div>
</template>


<script>
export default {
    data () {
        return {
            cateList: [],
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5,
            },
            total: 0,
            columns: [
                { label: '分类名称', prop: 'cat_name'},
                { label: '是否有效', type: 'template', template: 'isok'  },
                { label: '排序', type: 'template', template: 'order' },
                { label: '操作', type: 'template', template: 'opt' }
            ],
            addDialogVisible: false,
            rules: {
                cat_name: [{required: true, message: 'plz input cat name', trigger: 'blur'} ]
            },
            ruleForm: {
                cat_name: '',
                cat_id: 0,
                cat_level: 0
            },
            parentCateList: [],
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover',
                //checkStrictly: true

            },
            selectedKeys: []
        }
    },
    created () {
        this.getCateList()
    },
    methods: {
        addDialogClose () {
            this.$refs.ruleFormRef.resetFields()
            this.selectedKeys = []
            this.ruleForm.cat_id = ''
            this.ruleForm.cat_level = ''
        },
        addCate () {
            console.log(this.ruleForm)
        },
        parentCateChanged () {
            if (this.selectedKeys.length > 0) {
                this.ruleForm.cat_id = this.selectedKeys[ this.selectedKeys.length -1 ]
                this.ruleForm.cat_level = this.selectedKeys.length
                return
            }
            else{
                this.ruleForm.cat_id = 0
                this.ruleForm.cat_level = 0
                this.ruleForm.cat_name = ''
            }
        },
        showAddCateDialog () {
            this.getParentCateList()
            this.addDialogVisible = true
        },
        async getParentCateList() {
            const {data: res} = await this.$http.get('/categories', { params: { type: 2 } })
            if ( res.meta.status !== 200 ) this.$message.error('fail')
            this.parentCateList = res.data
        },
        handleClose() {
            this.addDialogVisible = false
        },
        handleSizeChange (pagesize) {
            this.queryInfo.pagesize = pagesize
            this.getCateList()
        },
        handleCurrentChange (pagenum) {
            this.queryInfo.pagenum = pagenum
            this.getCateList()
        },
        async getCateList() {
            const { data: res } = await this.$http.get('/categories', { params: this.queryInfo })
            if ( res.meta.status !== 200 ) this.$message.error('fail')
            this.cateList = res.data.result
            this.total = res.data.total
            console.log(this.cateList)
        }
    }
}

</script>

<style lang="less" scoped>
.tree-table {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>
