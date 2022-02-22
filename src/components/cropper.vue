<template>
  <div class="c_modal">
    <el-dialog
      :visible.sync="visible"
      title="图片裁剪"
      class="cropper-dialog"
      width="480px"
    >
      <div class="cropper-left">
        <div class="cropper-container">
          <no-ssr>
            <VueCropper
              v-if="loadStatus"
              ref="cropper"
              :img="cropperImg"
              :info="false"
              :auto-crop="true"
              output-type="jpeg"
              :can-scale="true"
              :auto-crop-width="cropWidth"
              :enlarge="scaleNum"
              :auto-crop-height="cropHeight"
              :fixed-number="[cropWidth, cropHeight]"
              :fixed="true"
              :view-mode="2"
              :can-move="true"
              :center-box="true"
              :original="false"
              :max-img-size="20000"
              mode="100% auto"
              @realTime="realTime"
            ></VueCropper>
          </no-ssr>
        </div>
      </div>
      <div
        v-if="trueWidth && trueHeight"
        class="true-size"
        :class="!canUpload ? 'red-text' : ''"
      >
        当前尺寸为：{{ trueWidth + "*" + trueHeight }}
        <span v-if="!canUpload"> ，小于允许上传的最小尺寸：375*210</span>
      </div>
      <Upload
        ref="themeUpload"
        class="upload-editor"
        style="height: 0;"
        action
        :multiple="false"
        :before-upload="themeChange"
        accept="image/gif, image/jpeg, image/jpg"
        :show-upload-list="false"
      >
      </Upload>
      <div class="img-refresh" @click="$refs.themeUpload.handleClick()">
        <img
          src=""
          style="vertical-align: text-top; margin-right: 8px;"
        />重新上传
      </div>
      <!-- <div
      class="show-preview"
      :style="{
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '5px'
      }"
    >
      <div :style="previews.div">
        <img :src="cropperImg" :style="previews.img" />
      </div>
    </div> -->
      <div slot="footer">
        <div class="upload-btn">
          <el-button
            :loading="uploadLoading"
            class="upload-btns cancel-upload"
            @click="cancel"
            >取消</el-button
          ><el-button
            :loading="uploadLoading"
            :disabled="!canUpload"
            class="upload-btns"
            :class="!canUpload ? 'not-upload' : 'confirm-upload'"
            @click="upload"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Md5 } from "ts-md5/dist/md5";
import Vue from "vue";
// import { CURRENT_URL } from '@/services/baseUrl'
export default {
  props: {
    file: {
      type: Object
    },
    cropWidth: {
      // 裁剪框宽度
      type: String,
      default: "150"
    },
    cropHeight: {
      // 裁剪框高度
      type: String,
      default: "150"
    }
  },

  data() {
    return {
      SecurityTokenInfo: {},
      AccessKeyId: "",
      AccessKeySecret: "",
      SecurityToken: "",
      secret_key: "ffdsfd",
      appCode: "test",
      timestamp: "",
      auth: "",
      loadStatus: false,
      visible: false,
      cropperImg: "",
      cropperResult: null, // 裁剪后的文件
      uploadLoading: false,
      originalImg: null,
      scaleNum: 1,
      previews: {},
      previewStyle1: {},
      trueWidth: 0,
      trueHeight: 0,
      canUpload: true,
      pictureFile: {
        file: {}
      } // 图片文件
    };
  },
  computed: {},
  watch: {
    file: {
      deep: true,
      handler(val) {
        console.log(val);
        if (val.raw) {
          this.originalImg = URL.createObjectURL(val.raw);
          this.showCropper();
        }
      }
    },
    visible(flag) {
      if (flag) {
        this.cropperImg = URL.createObjectURL(this.file.raw);
      }
    },
    previews: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          if (
            val.img.transform !==
            "scale(1)translate3d(0px, 0px, 0px)rotateZ(0deg)"
          ) {
            const scale =
              val.img.transform.substr(6, 6) * 1
                ? val.img.transform.substr(6, 6) * 1
                : 1;
            const height =
              val.div.height !== "0px"
                ? parseFloat((val.div.height.replace("px", "") * 1).toFixed(4))
                : 210;
            const width =
              val.div.width !== "0px"
                ? parseFloat((val.div.width.replace("px", "") * 1).toFixed(4))
                : 375;
            this.trueWidth = Math.round(width / scale);
            this.trueHeight = Math.round(height / scale);
            if (this.trueWidth >= 375 && this.trueHeight >= 210) {
              this.canUpload = true;
            } else {
              this.canUpload = false;
            }
          }
        });
      }
    }
  },
  // mounted() {
  //   if (process.browser) {
  //     const VueCropper = require('vue-cropper')
  //     Vue.use(VueCropper.default)
  //   }
  // },
  beforeCreate() {
    if (process.browser) {
      const VueCropper = require("vue-cropper");
      Vue.use(VueCropper);
      this.loadStatus = true;
    }
  },
  created() {
    if (process.browser) {
      const VueCropper = require("vue-cropper");
      Vue.use(VueCropper.default);
      this.loadStatus = true;
    }
  },
  beforeMount() {},
  methods: {
    showCropper() {
      this.visible = true;
    },
    themeChange(file) {
      // this.upFile(file)
      // eslint-disable-next-line no-console
      // const data = window.URL.createObjectURL(new Blob([file]))
      this.file.raw = file;
      this.cropperImg = URL.createObjectURL(this.file.raw);

      return true;
    },
    realTime(data) {
      const previews = data;
      const h = 0.5;
      const w = 0.2;

      this.previewStyle1 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: h
      };

      this.previewStyle2 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: w
      };

      this.previewStyle3 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: 100 / previews.w
      };

      this.previewStyle4 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: 100 / previews.h
      };
      this.previews = data;
    },
    aa() {
      //       this.$refs.cropper.getCropBlob((data) => {
      //   console.log(data)
      // })
    },

    async uploadImg(file, mdStr) {
      const timer = setTimeout(() => {
        console.log(file, mdStr);
      }, 500);
      this.$once("hook:beforeDestroy", () => {
        clearTimeout(timer);
      });
    },
    upload() {
      this.scaleNum = (1 / this.$refs.cropper.scale).toFixed(4);

      const _self = this;
      this.uploadLoading = true;
      _self.$refs.cropper.getCropBlob(data => {
        const timestamp = Math.round(new Date().getTime() / 1000).toString();
        const secret_key = "12334fsajhdgasfg";
        const appCode = "test";
        const auth = Md5.hashStr(appCode + secret_key + timestamp);
        const fileName = auth + "." + data.type.split("/")[1];
        data.name = fileName;
        // console.log(data)
        const file = new window.File([data], fileName, { type: data.type }); // blob转file
        this.$refs.cropper.getCropData(data1 => {
          // do something
          _self.uploadImg(file, Md5.hashStr(data1));

          // console.log(data1, Md5.hashStr(data1), 'llll')
        });

        // _self.uploadImg(file)
      });
    },
    cancel() {
      this.visible = false;
      // this.file = {}
    },
    reset() {
      this.cropperImg = this.originalImg;
    }
  }
};
</script>

<style lang="scss">
.c_modal {
}
.cropper-box {
  width: 413px;
  height: 250px;
}

.cropper-dialog {
  width: 480px;
  // height: 250px;
  margin: 0 auto;
  .el-dialog {
    box-shadow: 0 2px 12px -2px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
  }
  .el-dialog__headerbtn {
    top: 16px;
  }
  .el-dialog__header {
    text-align: center;
    border-bottom: 1px solid #f1f2f4;
    padding: 16px 20px;
  }
  .el-dialog__title {
    font-size: 16px;
    color: #333333;
    display: inline-block;
  }
  .el-dialog__body {
    padding: 16px 32px 30px 32px;
  }
  .el-dialog__footer {
    padding-top: 8px;
  }
}
.cropper-left {
  height: 250px;
  overflow: hidden;
}
.cropper-container {
  height: 100%;
  width: 413px;
  margin: 0 auto;
}
.upload-btn {
  text-align: right;
  .upload-btns {
    width: 80px;
    height: 32px;
    border: 1px solid #d1d3d8;
    border-radius: 4px;
    font-size: 13px;
    color: #7d7f85;
    &:hover {
      border: 1px solid #acaeb3;
      background: none;
    }
  }
  .not-upload {
    color: #fff;
    background: #fdada5;
    border: 0;
    &:hover {
      color: #fff;
      background: #fdada5;
      border: 0;
    }
  }
  .confirm-upload {
    background: #fc6e5f;
    margin-left: 0;
    border: 0;
    color: #ffffff;
    &:hover {
      border: 0;
      background: #f96351;
    }
  }
  .cancel-upload {
    margin-right: 16px;
  }
}
.true-size {
  font-size: 13px;
  color: #333333;
  margin: 8px 0 12px 0;
}
.img-refresh {
  font-size: 13px;
  color: #47a6ff;
  display: inline-block;
  cursor: pointer;
  &:hover {
    color: #0d8aff;
  }
}

.ivu-modal-footer {
  border: 0;
}
.vue-cropper {
  border-radius: 4px;
  background-color: #000;
  overflow: hidden;
  background-image: none !important;
}
.cropper-view-box {
  outline: 1px solid #fff !important;
  outline-color: rgba(255, 255, 255, 1) !important;
}
.point2,
.point4,
.point5,
.point7 {
  display: none;
}
.crop-point {
  // background-image: url("../assets/img/截图拖动点@2x.png");
  background-color: #fff !important;
  opacity: 1 !important;
  width: 12px !important;
  height: 12px !important;
  background-size: 100% 100%;
}
.point1 {
  top: -6px;
  left: -6px;
}
.point3 {
  top: -6px;
  right: -6px;
}
.point6 {
  bottom: -6px;
  left: -6px;
}
.point8 {
  bottom: -6px;
  right: -6px;
}
.red-text {
  color: red;
}
</style>
