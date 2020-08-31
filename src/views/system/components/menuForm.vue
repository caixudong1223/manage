<template>
  <div class="content">
    <el-form ref="form" :model="menuForm" label-width="80px">
      <el-form-item label="类型" prop="isLeaf">
        <el-radio-group v-model="menuForm.isLeaf">
          <el-radio
            v-for="(item, index) in typeList"
            :label="index"
            :key="index"
            >{{ item }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="typeList[menuForm.isLeaf] + '名称'" prop="menuName">
        <el-input
          v-model="menuForm.menuName"
          maxlength="10"
          :placeholder="typeList[menuForm.isLeaf] + '名称'"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="上级菜单"
        prop="upperName"
        v-if="menuForm.upperMenuId !== 0"
      >
        <!-- <el-popover
        ref="menuListPopover"
        placement="bottom-start"
        trigger="click"
        v-model="popoverMenuVisible"
      >
        <el-tree
          accordion
          ref="menuListTree"
          :data="menuList"
          :props="menuListTreeProps"
          :default-expand-all="false"
          :highlight-current="true"
          :expand-on-click-node="false"
          node-key="menuId"
          @current-change="handleMenuListTreeCurrentChange"
        >
        </el-tree>
      </el-popover> -->
        <!-- <el-input
        v-popover:menuListPopover
        v-model="menuForm.upperName"
        :readonly="true"
        placeholder="点击选择上级菜单"
        class="menu-list__input"
      ></el-input> -->
        {{ menuForm.upperMenuName }}
      </el-form-item>
      <el-form-item
        v-if="menuForm.isLeaf === 0 || menuForm.isLeaf === 1"
        label="菜单路由"
        prop="menuUrl"
      >
        <el-input v-model="menuForm.menuUrl" placeholder="菜单路由"></el-input>
      </el-form-item>
      <el-form-item v-if="menuForm.isLeaf !== 2" label="排序号" prop="sort">
        <el-input-number
          v-model="menuForm.sort"
          :min="0"
          controls-position="right"
          label="排序号"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="图标" prop="menuIcon">
        <el-popover
          ref="iconListPopover"
          placement="bottom-start"
          trigger="click"
          popper-class="mod-menu__icon-popover"
          v-model="popoverIconVisible"
        >
          <div class="mod-menu__icon-list">
            <el-button
              v-for="(item, index) in iconList"
              :key="index"
              :class="{ 'is-active': item === menuForm.menuIcon }"
              @click="handleIconActive(item)"
            >
              <svg-icon :iconClass="item"></svg-icon>
            </el-button>
          </div>
        </el-popover>
        <svg-icon :iconClass="menuForm.menuIcon"></svg-icon>
        <el-button type="text" v-popover:iconListPopover>选择图标</el-button>
      </el-form-item>

      <el-form-item label="是否显示" prop="show">
        <el-radio-group v-model="menuForm.show">
          <el-radio :label="0" :key="0">不显示</el-radio>
          <el-radio :label="1" :key="1">显示</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="menuForm.state">
          <el-radio :label="1" :key="1">启用</el-radio>
          <el-radio :label="0" :key="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="操作">
        <el-button
          type="primary"
          :loading="saveloading"
          v-if="flag"
          @click="handleUpdateMenu"
          >保存</el-button
        >
        <el-button type="primary" :loading="addloading" v-else @click="handleAddMenu">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Icon from "@/icons/index.js";
import { updateMenu, addMenu } from "@/api/menu";
export default {
  name: "MenuForm",
  props: {
    menuForm: Object,
    flag: Boolean,
    reload: Function
  },
  data() {
    return {
      iconList: [],
      typeList: ["目录", "菜单"],
      popoverIconVisible: false,
      saveloading: false,
      addloading: false
    };
  },
  created() {
  },
  mounted() {
    this.iconList = Icon.getNameList();
  },
  methods: {
    // 图标选中
    handleIconActive(iconName) {
      this.popoverIconVisible = false;
      this.menuForm.menuIcon = iconName;
    },
    // 更新菜单信息
    handleUpdateMenu() {
      this.saveloading = true;
      updateMenu({
        id: this.menuForm.id,
        menuName: this.menuForm.menuName,
        menuIcon: this.menuForm.menuIcon,
        menuUrl: this.menuForm.menuUrl,
        sort: this.menuForm.sort,
        isLeaf: this.menuForm.isLeaf,
        state: this.menuForm.state,
        show: this.menuForm.show,
        upperMenuId: this.menuForm.upperMenuId
      })
        .then(res => {
          if (res.rescode === 2000) {
            this.saveloading = false;
            this.$emit("reload"); //刷新菜单
            this.$message({
              type: "success",
              message: "菜单信息修改成功"
            });
          } else {
            this.saveloading = false;
          }
        })
        .catch(err => {
          this.saveloading = false;
        });
    },
    // 新增菜单
    handleAddMenu() {
      this.addloading = true
      addMenu({
        menuName: this.menuForm.menuName,
        menuIcon: this.menuForm.menuIcon,
        menuUrl: this.menuForm.menuUrl,
        sort: this.menuForm.sort,
        isLeaf: this.menuForm.isLeaf,
        state: this.menuForm.state,
        show: this.menuForm.show,
        upperMenuId: this.menuForm.upperMenuId
      })
        .then(res => {
          if (res.rescode === 2000) {
            this.addloading = false;
            this.$emit("reload"); //刷新菜单
            this.$message({
              type: "success",
              message: "菜单新增成功"
            });
          } else {
            this.addloading = false;
          }
        })
        .catch(err => {
          this.addloading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.mod-menu__icon-popover {
  width: 200px;
}
.content {
  height: 100%;
  overflow-y: auto;
}
</style>
