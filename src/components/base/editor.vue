<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  import '../../../static/UE/ueditor.config.js'
  import '../../../static/UE/ueditor.all.min.js'
  import '../../../static/UE/lang/zh-cn/zh-cn.js'
  import '../../../static/UE/ueditor.parse.min.js'
  export default {
    name: 'UE',
    data () {
      return {
        editor: null,
        isOver: false,
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      agentCode:{
        type:String,
        default:''
      }
    },
    mounted() {
      var _this = this;
      this.editor = UE.getEditor('editor', this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.execCommand('serverparam', {
          "editorApp": "1",
          "agentCode": _this.agentCode
        });
        if (_this.defaultMsg) {// 确保UE加载完成后，放入默认内容。
          _this.editor.setContent(_this.defaultMsg);
        } else {//载入上次保存本地的草稿，注意一定要延时
          setTimeout(function () {
            _this.editor.execCommand('drafts');
          }, 10);
        }
      });
      this.editor.addListener('wordcountoverflow',function(){
        _this.isOver = true
      });
      this.editor.addListener('contentChange',function(){
        _this.isOver = false
      })
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
      getUEContentTxt() { // 获取纯文本内容方法
        return this.editor.getContentTxt()
      },
      setUEContent(val) { // 设置内容方法
        return this.editor.setContent(val)
      },
      getUEContentIsOver() { // 获取字数是否超限
        return this.isOver
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
<style>
  .edui-default .edui-editor, .edui-default .edui-editor-iframeholder{
    width:100%!important;
  }
  .edui-default .edui-editor-wordcount{
    position:relative;
    padding-right:20px;
  }
</style>
