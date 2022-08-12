<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- /导航栏 -->

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    
    <!-- /输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      localName: this.value
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止北背景点击
        duration: 0 // 持续展示
      })
      
      try {
        const localName = this.localName
        if (!localName.trim.length) {
          this.$toast('昵称不能为空')
          return
        }

        await updateUserProfile({
          name: localName
        })

        // 更新视图
        this.$emit('input', localName)

        // 关闭弹窗
        this.$emit('close')

        // 提示修改成功
        this.$toast('修改成功')
      } catch (err) {
        this.$toast('修改昵称失败')
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>
