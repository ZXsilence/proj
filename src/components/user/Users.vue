<template>
    <div>
	<el-breadcrumb separator-class="el-icon-arrow-right">
	  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
	  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
	</el-breadcrumb>
    <el-card>
		<el-row :gutter="20">
		  <el-col :span="7">
                <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear="getUserList">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                  </el-input>
          </el-col>
		  <el-col :span="4">
            <el-button type="primary" @click="dialogVisible = true">
                添加用户
            </el-button>
          </el-col>
		</el-row>
        <el-table :data="userList" border stripe>

            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态" prop="mg_state">

                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
					</el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">

                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog( scope.row.id )"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById( scope.row.id )"></el-button>
                    <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false"
                      >
                    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="queryInfo.pagenum"
			:page-sizes="[1 ,2 ,5 ,10]"
			:page-size="queryInfo.pagesize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total">
		</el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogVisibleClose"
      >
	<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
	  <el-form-item label="用户名称" prop="username">
		<el-input v-model="addForm.username"></el-input>
	  </el-form-item>
	  <el-form-item label="密码" prop="password">
		<el-input v-model="addForm.password"></el-input>
	  </el-form-item>
	  <el-form-item label="邮箱" prop="email">
		<el-input v-model="addForm.email"></el-input>
	  </el-form-item>
	  <el-form-item label="手机" prop="mobile">
		<el-input v-model="addForm.mobile"></el-input>
	  </el-form-item>
	</el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
      >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" status-icon  label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" ></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile" ></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        var checkEmail = (rule, value, cb) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                cb()
            }
            cb( new Error('请输入合法邮箱') )
        }
        var checkMobile = (rule, value, cb) => {
            const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
            if (regMobile.test(value)) {
                cb()
            }
            cb( new Error('请输入合法手机号码') )
        }
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            userList: [],
            total: 0,
            dialogVisible: false,
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addFormRules: {
                username:[
                    {required: true, message:'请输入用户邮箱', trigger: 'blur'}, { min: 3, max: 10, message: '用户名长度3-10', trigger: 'blur' }
                ],
                password: [ { required: true, message: '请输入密码', trigger: 'blur' }, {min:6, max: 15, message: '长度在6-15', trigger: 'blur'} ],
                email: [ { required: true, message: '请输入密码', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }],
                mobile: [ { required: true, message: '请输入密码', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' } ]
            },
            editDialogVisible: false,
            editForm: {},
            editFormRules: {}
        }
    },
    created () {
        this.getUserList()
    },
    methods: {
        async removeUserById( id ) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });       
                  });       
            if (confirmResult !== 'confirm') return 
            const { data: res } = await this.$http.delete('users/' + id ) 
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getUserList()
        },
        editUserInfo (id) {
            this.$refs.editFormRef.validate( async valid => {
                if (!valid) return
                const {data: res} = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
                if (res.meta.status !== 200) return this.$message.error("请求失败")
                this.editDialogVisible = false
                this.getUserList()
                this.$message.success("数据更新成功")
            } )
        },
        async showEditDialog ( id ) {
            const {data: res} = await this.$http.get('users/' + id )
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error('获取数据失败')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        addUser () {
            this.$refs.addFormRef.validate( async valid => {
                const { data: res  } = await this.$http.post('users', this.addForm)
                if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
                this.$message.success('添加用户成功')
                this.dialogVisible = false
                this.getUserList()
            } )
        },
        editDialogClose () {
            this.$refs.editFormRef.resetFields()
        },
        dialogVisibleClose () {
            this.$refs.addFormRef.resetFields()
        },
        async getUserList() {
            const {data: res} = await this.$http.get('users', { params: this.queryInfo })
            if (res.meta.status !== 200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userList = res.data.users
            this.total = res.data.total
        },
        handleSizeChange ( newSize ) {
            console.log(newSize)
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        handleCurrentChange ( newPage ) {
            console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        async userStateChanged( row ) {
            const {data: res} = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
            row.ms_state = ! row.ms_state
            if (res.meta.status !== 200) return this.$message.error('更新用户状态失败')
            this.$message.success({message:'更新用户状态成功', duration: 1000})
        }
    }
}
</script>


<style lang='less' scoped>

</style>
