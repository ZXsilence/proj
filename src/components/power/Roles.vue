<template>
<div>
	<el-breadcrumb separator-class="el-icon-arrow-right">
	  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
	  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
	</el-breadcrumb>
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary">添加角色</el-button>
            </el-col>
        </el-row>
        <el-table
        :data="rolesList"
        style="width: 100%"
        border stripe>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom', i1 === 0 ? 'bdtop': '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                        <el-col :span=5>
                            <el-tag>{{ item1.authName  }}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span=19>
                            <el-row :class="[ i2 === 0 ? '' : 'bdtop' , 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                <el-col :span=6>
                                    <el-tag type="success" >{{ item2.authName }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span=18>
                                    <el-tag type="warning" v-for=" (item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="角色名称"
              prop="roleName">
            </el-table-column>
            <el-table-column
              label="角色描述"
              prop="roleDesc">
            </el-table-column>
            <el-table-column
              label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog( scope.row.id )">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById( scope.row.id )">删除</el-button>
                    <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false"
                      >
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog( scope.row )">分配权限</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="setRightDialogClose"
      >
      <el-tree :data="rightsList" :props="treeProps" 
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="defKeys"
          ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data () {
        return {
            rolesList: [],
            dialogVisible: false,
            rightsList: [],
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            defKeys: [],
            roleId: ''
        }
    },
    created () {
        this.getRolesList()
    },
    methods: {
        async allotRights () {
            const  keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
            const idStr = keys.join(',')
            const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
            if (res.meta.status !== 200) return this.$message.error('error')
            this.$message.success('ok')
            this.getRolesList()
            this.dialogVisible = false
        },
        setRightDialogClose() {
            this.defKeys = []
        },
        getLeafKeys(node, arr) {
            if(!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach( item => this.getLeafKeys(item, arr) )
        },
        async showSetRightDialog ( role ) {
            this.roleId = role.id
            const {data: res} = await this.$http.get('rights/tree')
            if ( res.meta.status !== 200 ) return this.$message.error('fail')
            console.log(res.data)
            this.rightsList = res.data
            this.getLeafKeys( role, this.defKeys)
            this.dialogVisible = true
        },
        async getRolesList() {
            const {data: res} = await this.$http.get('roles')
            if (res.meta.status !== 200 ) return this.$message.error('请求失败')
            this.rolesList = res.data
        },
        async removeRightById(role, rightId) {
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
            console.log(res)
            console.log(role.id, rightId)
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            console.log(res)
            console.log(role, rightId)
            if (res.meta.status !== 200) return this.$message.error('fail')
            this.$message.success('success')
            role.children = res.data
        },
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdbottom {
    border-top: 1px solid #eee;
}
.bdtop {
    border-top: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
