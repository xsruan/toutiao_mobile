<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" size="18" @click="$router.back()" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        type='number'
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        maxlength='11'
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        type='number'
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        maxlength='6'
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
           <van-count-down v-if="isCountDownShow" :time="60*1000" format="ss s" @finish="isCountDownShow = false" />
           <van-button v-else class="send-sms-btn" size="small" round type="default" native-type="button" @click="onSendSms">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '请输入正确的手机号'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码错误'
        }]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      // 1.获取表单数据
      const user = this.user

      // 2.表单验证
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      // 3.提交表单请求登录
      try {
        const res = await login(user)
        console.log('登陆成功', res)

        this.$store.commit('setUser', res.data.data)

        this.$toast.success('登陆成功')

        // 成功后，跳转回原来的页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          console.log('请输入正确的验证码或手机号', err)
          this.$toast.fail('请输入正确的验证码或手机号')
        } else {
          console.log('登陆失败', err)
          this.$toast.fail('登录失败')
        }
      }

      // 4.根据请求响应结果处理后续操作
    },
    async onSendSms () {
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败')
      }
      this.isCountDownShow = true

      try {
        await sendSms(this.user.mobile)
      } catch (err) {
        if (err.response.status === 429) {
          this.$toast('发送过于频繁')
        } else {
          this.$toast('发送失败')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 200px;
    height: 60px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
