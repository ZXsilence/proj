<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-alert
        title="警告提示的文案"
        type="warning"
        :closable="false"
        >
        </el-alert>
        <el-row class="cat_opt" :gutter=0 type="flex" align="center">
            <el-col :span=9 >
                <span style="margin-right: 10px;">选择商品分类:</span> 
                <el-cascader
                v-model="selectedCateKeys"
                :options="catList"
                :props="catProps"
                @change="handleChange"></el-cascader>
            </el-col>
        </el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                <el-table
                :data="manyTableData"
                border stripe    
                >
                  <el-table-column type="expand" label="#">
                      <template slot-scope="scope">
                          <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose( i, scope.row)">{{ item }}</el-tag>
                          <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm ( scope.row )"
                            @blur="handleInputConfirm ( scope.row )"
                            >
                          </el-input>
                          <el-button v-else class="button-new-tag" size="small" @click="showInput (scope.row)">+ New Tag</el-button>
                      </template>
                  </el-table-column>
                  <el-table-column type="index" label="#"></el-table-column>
                  <el-table-column type="" prop="attr_name" label="参数名称"></el-table-column>
                  <el-table-column type="" label="操作">
                      <template slot-scope="scope">
                          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog (scope.row.attr_id)">编辑</el-button>
                          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams( scope.row.attr_id )">删除</el-button>
                      </template>
                  </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="only">
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
                <el-table
                :data="onlyTableData"
                border stripe    
                >
                  <el-table-column type="expand" label="#"></el-table-column>
                  <el-table-column type="index" label="#"></el-table-column>
                  <el-table-column type="" prop="attr_name" label="参数名称"></el-table-column>
                  <el-table-column type="" label="操作">
                      <template slot-scope="scope">
                          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog (scope.row.attr_id)">编辑</el-button>
                          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams ( scope.row.attr_id )">删除</el-button>
                      </template>
                  </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
    <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
          <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
        :title="'编辑' + titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
          <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data () {
        return {
            catList: [],
            catProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover'
            },
            selectedCateKeys: [],
            activeName: 'many',
            manyTableData: [],
            onlyTableData: [],
            addDialogVisible: false,
            addForm: {},
            addFormRules: {
                attr_name: [ { required: true, message: '请输入参数名称', trigger: 'blur' } ]
            },
            editDialogVisible: false,
            editForm: {},
            editFormRules: {
                attr_name: [ { required: true, message: '请输入参数名称', trigger: 'blur' } ]
            },
            inputVisible: false,
            inputValue: ''
        }
    },
    created () {
        this.getCateList()
    },
    methods: {
        async saveAttrVals ( row ) {
            const {data : res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' ')
            })
            console.log('111')
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error('fail')
            this.$message.success('success')
        },
        handleClose ( index, row) {
            row.attr_vals.splice(index, 1)
            this.saveAttrVals( row )

        },
        showInput ( row ) {
            row.inputVisible = true
            this.$nextTick(_ => {
              this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        async handleInputConfirm ( row ) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            this.saveAttrVals( row )
        },
        async removeParams (attr_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        
            })
            if (confirmResult !== 'confirm') return 
            const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if (res.meta.status !== 200) return
            this.$message.success('sucess')
            this.getParamsData()
        },
        editParams () {
            this.$refs.editFormRef.validate( async valid => {
                if (!valid ) return
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                    attr_name: this.editForm.attr_name, attr_sel: this.activeName
                })
                console.log(res)
                if (res.meta.status !== 200) return this.$message.error('error')
                this.getParamsData()
                this.editDialogVisible = false
                return this.$message.success('sucess')
            })
        },
        editDialogClose () {
            this.$refs.editFormRef.resetFields()
        },
        async showEditDialog ( attr_id ) {
            console.log(attr_id)
            const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
                params: {attr_sel: this.activeName}
            })
            console.log(`categories/${this.cateId}/attributes/${attr_id}`)
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error('error')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        addParams () {
            this.$refs.addFormRef.validate( async valid => {
                if (!valid) return
                const {data : res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                console.log(res)
                if (res.meta.status !== 201)  return this.$message.error('error')
                this.$message.success('sucess')
                this.addDialogVisible = false
                this.getParamsData()
            } )
        },
        addDialogClose () {
            this.$refs.addFormRef.resetFields()
        },
        async getParamsData() {
            console.log(this.cateId, this.activeName)
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
                this.manyTableData = []
                this.onlyTableData = []
                return
            }
            const {data: res} =  await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
            res.data.forEach( item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                item.inputVisible = false
                item.inputValue = ''
            } )
            if (this.activeName === 'many')
            {
                this.manyTableData = res.data
            }
            else{
                this.onlyTableData = res.data
            }
        },
        handleClick () {
            this.getParamsData()
        },
        handleChange () {
            console.log(this.selectedCateKeys)
            this.getParamsData()
        },
        async getCateList () {
            const { data: res  } =  await this.$http.get('categories')
            this.catList = res.data
        }
    },
    computed: {
        titleText () {
            if (this.activeName === 'many') {
                return '动态参数'
            }
            else{
                return '静态属性'
            }
        },
        isBtnDisabled() {
            if ( this.selectedCateKeys.length !== 3 ) return true
            return false
        },
        cateId () {
            if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2]
            return null
        }
    }
}
</script>


<style lang="less" scoped>
.cat_opt {
    margin: 15px 0px;
}
.el-col {
    display: flex;
    align-items: center;
}
.el-tag {
    margin: 5px;
}
.input-new-tag {
    width: 120px;
}
</style>
