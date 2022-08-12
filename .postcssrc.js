module.exports = {
    plugins: {
      // 'autoprefixer': {
      //   browsers: ['Android >= 4.0', 'iOS >= 8']
      // },
      'postcss-pxtorem': {
        rootValue({file}){
          return file.indexOf('vant') !== -1? 37.5 : 75
        },
        propList: ['*'],

        // 配置不要转化的样式资源
        exclude: 'github-markdown'
      }
    }
  }