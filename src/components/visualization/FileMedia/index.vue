<template lang="html">
  <div class="qwui-file">
    <p class="qwui-file_count">附件({{ filesCount }})</p>

    <ul class="qwui-file_list">
      <li v-for="file in fileList"
        :key="file.src"
      >
        <i class="qwui-file_ext"
          :class="fileExtClass(file)"
        ></i>
        <p class="qwui-file_function">
          <a href="javascript: void(0)"
            class="qwui-file_preview qwui-file_function_icon"
            @click="filePreview(file)"
          ></a>
          <a href="javascript: void(0)"
            class="qwui-file_download qwui-file_function_icon"
            @click="fileDownload(file)"
          ></a>
        </p>
        <p class="qwui-file_name"
          v-text="file.filename"
        ></p>
        <p class="qwui-file_size"
          v-text="file.size"
        ></p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'QwFileMedia',
  props: {
    fileList: {
      type: Array,
      required: true,
      validator (arr) {
        return arr.every(file => {
          return (file.filename && typeof file.filename === 'string') &&
            (file.preview && typeof file.preview === 'string') &&
            (file.src && typeof file.src === 'string') &&
            (file.size && typeof file.src === 'string') &&
            (file.ext && typeof file.ext === 'string');
        });
      }
    }
  },
  computed: {
    filesCount () {
      return this.fileList.length;
    }
  },
  methods: {
    fileExtClass (file) {
      return file.ext.toUpperCase();
    },
    filePreview (file) {
      _.wxqyh_previewFile(file.id, file.url, file.filename, file.ext);
    },
    fileDownload (file) {
      _.wxqyh_downloadFile(file.id, file.url, file.filename);
    }
  }
}
</script>

<style lang="scss" src="./index.scss" scoped>
</style>
