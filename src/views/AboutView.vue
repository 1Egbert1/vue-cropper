<template>
  <div class="">
    <el-upload
      ref="coverUpload"
      accept="image/gif, image/jpeg, image/jpg, image/png"
      action
      :on-change="themeChange"
      :auto-upload="false"
      :show-file-list="false"
    >
      <div v-if="!previewThemeUrl" class="img-upload">
        <div class="main">
          <img src="" alt />
          <p>
            1.推荐上传大于1125*630尺寸的封面图片
            <br />2.请选择准确、清晰、美观的图片作为封面
          </p>
        </div>
      </div>
      <div v-else class="img-wrap">
        <img
          :src="$img + previewThemeUrl + '?x-oss-process=image/resize,l_500'"
          class="preview-img"
          alt
          @click.stop
        />
        <div class="button-group">
          <div class="content-item">
            <img src="" alt />
          </div>
        </div>
      </div>
    </el-upload>
    <Cropper
      :file="pictureFile"
      crop-width="375"
      crop-height="210"
      @uploadSuccess="posterSuccess"
    ></Cropper>
  </div>
</template>
<script>
import Cropper from "@/components/cropper";
export default {
  components: { Cropper },
  data() {
    return {
      pictureFile: {
        file: {}
      }, // 图片文件
      previewThemeUrl: ""
    };
  },
  computed: {},
  watch: {},
  // mounted() {
  //   if (process.browser) {
  //     const VueCropper = require('vue-cropper')
  //     Vue.use(VueCropper.default)
  //   }
  // },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  methods: {
    themeChange(file) {
      this.pictureFile = file;
    },
    posterSuccess(response) {
      this.previewThemeUrl = response;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss"></style>
