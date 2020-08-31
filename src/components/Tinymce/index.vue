<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ height: containerHeight, width: containerWidth }"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <!-- <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
    </div> -->
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from "./components/EditorImage";
import plugins from "./plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";

import { goodsUploadFile } from "@/api/file";

let debounce = require('lodash/debounce')

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN =
  "https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js";

export default {
  name: "Tinymce",
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function() {
        return (
          "vue-tinymce-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      }
    },
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    menubar: {
      type: String,
      default: "file edit insert view format table"
    },
    height: {
      type: [Number, String],
      required: false,
      default: 600
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto"
    },
    customOptions: {
      type: Object,
      required: false,
      default: {
        height: 600
      }
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
        es: "es_MX",
        ja: "ja"
      }
    };
  },
  computed: {
    containerWidth() {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    },
    containerHeight() {
      const height = this.customOptions.height;
      if (/^[\d]+(\.[\d]+)?$/.test(height)) {
        // matches `100`, `'100'`
        return `${height}px`;
      }
      return height;
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || "")
        );
      }
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, err => {
        if (err) {
          this.$message.error(err.message);
          return;
        }
        this.initTinymce();
      });
    },
    initTinymce() {
      const _this = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList["zh"],
        height: this.height,
        body_class: "panel-body ",
        placeholder: "此处编辑图文",
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        resize: false,
        autoresize_bottom_margin: 20, 
        // autoresize_max_height: 650, // 编辑区域的最大高
        autoresize_min_height: 400, //编辑区域的最小高度
        autoresize_on_init: true,
        autoresize_overflow_padding: 0,
        formats:{
            p: { inline: 'span', styles: {'line-height': '20px'} }
        },
        block_formats: 'Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3',
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif',
        fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        // imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        images_upload_url: "",
        images_upload_base_path: "",
        default_link_target: "_blank",
        link_title: false,
        branding: false, //隐藏由tiny驱动
        elementpath: false, //隐藏元素路径
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        toolbar_mode: 'floating', 
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", 
            debounce(() => {
              this.hasChange = true;
              this.$emit("input", editor.getContent());
            }, 300)
          );
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", e => {
            _this.fullscreen = e.state;
          });
        },
        ...this.customOptions,
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        images_upload_handler(blobInfo, success, failure, progress) {
          progress(0);
          const formData = new FormData();
          formData.append("file", blobInfo.blob());
          goodsUploadFile(formData).then(res => {
            success(res.data);
            progress(100);
          });
        }
      });
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }

      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      const _this = this;
      arr.forEach(v => {
        window.tinymce
          .get(_this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`);
      });
    }
  }
};
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
