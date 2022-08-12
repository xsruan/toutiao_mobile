<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >
      {{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
      class="grid-item"
      v-for="(channel, index) in myChannels"
      :key="index"
      @click="onMychannelClick(channel, index)">
        <!-- v-bind：class语法
             一个对象，对象中的key表示要作用的css类名
                       对象中的value表示要计算出布尔值
                         true 则作用该类名
                         false 则不作用类名
        -->
        <van-icon
          v-show="isEdit && !fixChannels.includes(channel.id)"
          name="clear"
          slot="icon"
        ></van-icon>
        <span
          class="text"
          :class="{ active: index === active }"
          slot="text"
        >
          {{ channel.name }}
        </span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
      icon="plus"
      class="grid-item"
      v-for="(channel, index) in recommendChannels"
      :key="index"
      :text="channel.name"
      @click="onAddChannel(channel)" />
    </van-grid>
  </div>
</template>

<script>
// 调用获取频道列表的接口
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels
} from '@/api/channel'

import { mapState } from 'vuex'

// 加载本地存储模块
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制清除图标显示
      fixChannels: [0] // 固定不允许删除的频道
    }
  },
  // 计算属性会观测内部依赖数据的变化
  // 若依赖的数据发生变化，计算属性会重新执行
  computed: {
    ...mapState(['user']),
    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     const res = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //     if (!res) {
    //       channels.push(channel)
    //     }
    //   })
    //   return channels
    // }

    // 函数优化
    // filter方法：遍历数组，把符合条件的元素存储到新数组里
    recommendChannels () {
      return this.allChannels.filter(channel => {
        // find方法：遍历数组，找到符合条件的第一个元素后返回
        return !this.myChannels.find(mychannel => {
          return mychannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  created () {
    this.loadAllChannels() 
  },
  mounted () {},
  methods: {
    // async loadMyChannels () {
    //   try {
    //     const { data } = await getUserChannels()
    //     // console.log(data)
    //     this.myChannels = data.data.channels
    //   } catch (err) {
    //     this.$toast('获取数据失败')
    //   }
    // },

    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取数据失败')
      }
    },

    async onAddChannel (channel) {
      this.myChannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          await addUserChannels({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    onMychannelClick (channel, index) {
      if (this.isEdit) {
        // 1.如果是固定频道，则不删除
        if (this.fixChannels.includes(index)) {
          return
        }

        // 2.编辑状态，执行删除频道
        // 参数1: 要删除的元素开始索引
        // 参数2: 要删除的个数，若不指定，从参数1开始一直删除
        this.myChannels.splice(index, 1)

        // 3.如果删除的是激活的频道项之前的频道，则更新激活的频道项
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1)
        }
        
        // 4.调用删除方法
        this.deleteChannel(channel)

      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      // 删除数据持久化
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          await deleteUserChannels(channel.id)
        } catch (err) {
          console.log('操作失败', err)
        }
      } else {
        // 未登录，数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }

  // .van-cell {
  //   padding-bottom: unset;
  // }

  .edit-btn {
    transform:translateY(-20%);
    width: 104px;
    height: 38px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    margin-top: unset;
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text, .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item{
      .van-grid-item__content {
        white-space: nowrap;
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
