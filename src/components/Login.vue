<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box" >
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form ref="login_form" :model="login_form" :rules="rules" label-width="0px" class="login_form">
          <el-form-item prop="username">
            <el-input v-model="login_form.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="login_form.password" prefix-icon="iconfont icon-3702mima"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="resetLoginForm" type="info">重置</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      login_form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur'  },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'  }
        ],
          password: [
              { required: true, message: '用户名不能为空', trigger: 'blur'  },
              { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'  }
          ]
      }
    }
  },
    methods: {
        resetLoginForm () {
            this.$refs.login_form.resetFields();
        },
        login () {
            this.$refs.login_form.validate( async (valid) => {
                if(!valid) return;
                const {data: res} = await this.$http.post('login', this.login_form);
                if( res.meta.status !== 200 ) return this.$message.error("登录失败")
                this.$message.success("登陆成功")
                window.sessionStorage.setItem('token', res.data.token);
                this.$router.push('/home')
            } )
        }
    }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login_box {
    width: 540px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
    }
}
.login_form {
    padding: 120px 25px 0px;
    border: 50px;
    width: 100%;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
