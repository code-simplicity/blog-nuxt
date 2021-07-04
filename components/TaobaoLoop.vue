<template>
  <div class="taobao-loop-list" v-loading="isLoading">
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item v-for="(item,index) in loop" :key="index">
        <a :href="item.coupon_share_url" target="_blank">
          <img :src="item.pict_url+'_320x320xzq90.jpg_.webp'" style="object-fit: cover">
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
  import * as api from '../api/api';

  export default {
    data() {
      return {
        isLoading: false,
        loop: []
      }
    },
    methods: {
      getTaobaoLoop() {
        this.isLoading = true;
        api.getTaobaoRecommend(5).then(result => {
          if (result.code === 10000) {
            this.loop = result.data.tbk_dg_optimus_material_response.result_list.map_data;
            // console.log(this.loop);
            this.isLoading = false;
          }
        });
      }
    },
    mounted() {
      this.getTaobaoLoop();
      // console.log('on taobao mounted..');
    }
  }
</script>
<style>
  .taobao-loop-list {
    border-radius: 8px;
    background: #ffffff;
  }

  .taobao-loop-list img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
</style>
