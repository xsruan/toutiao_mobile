<template>
  <div class="my-container">
    <!-- 已登录页面 -->
    <div class="header login" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image
          class="avatar"
          :src="userInfo.photo"
          fit="cover"
          round
          />
          <span class="name">{{ userInfo.name }}}</span>
        </div>
        <div class="right">
          <van-button
            size="mini"
            round
            to="/user/profile"
          >编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>

    <!-- 未登录页面 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img
        src="@/assets/mobile.png"
        alt=""
        >
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 导航栏 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <!-- 默认插槽会覆盖所有内容 -->
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <!-- 消息通知  小智同学  退出登录 -->
    <van-cell-group>
      <van-cell title="消息通知" is-link />
      <van-cell title="小智同学" is-link />
      <van-cell clickable title="退出登录" class="sign-out" v-if="user" @click="onLogout" />
    </van-cell-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  name: 'MyIndex',
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      userInfo: {} // 用户信息
    }
  },
  created () {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    onLogout () {
      // 退出提示，确认后清空登陆状态（容器中的user和本地的user）
      this.$dialog.confirm({
        title: '确认退出'
      }).then(() => {
        // on confirm
        this.$store.commit('setUser', null)
      }).catch(() => {
        // on cancel
      })
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container{
  .header{
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }

  .not-login{
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img{
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text{
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .login{
    .base-info{
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left{
        display: flex;
        align-items: center;
        .avatar{
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 3px solid #fff;
        }
        .name{
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats{
      // height: 130px;
      display: flex;
      .data-item{
        height: 130px;
        flex:1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count{
          font-size: 36px;
        }
        .text{
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav{
    .grid-item{
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang{
        color: #eb5253;
      }
      .toutiao-lishi{
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }

  .sign-out{
    text-align: center;
    color: #e28c8c;
    border-top: 9px solid #f7f5f5;
  }
}
</style>
