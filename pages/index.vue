<template>
  <div id="index-page-box" class="index-page-box clear-fix">
    <div id="index-left-part" class="index-left-part float-left">
      <div class="index-left-user-info">
        <div class="user-avatar">
          <img :src="userInfo.avatar" />
        </div>
        <div class="user-name">
          <span v-text="userInfo.userName"></span>
        </div>
        <div class="user-sign">
          <span v-text="userInfo.sign"></span>
        </div>
      </div>
      <div class="left-user-self--links">
        <el-popover
          popper-class="wechat-pop-container"
          placement="bottom"
          trigger="click"
        >
          <div class="index-wechat-pop-content">
            <div class="wechat-subscription">
              <img src="/gongzhonghao.png" />
            </div>
          </div>
          <span slot="reference" class="sob_blog sobwechat"></span>
        </el-popover>
        <a href="https://github.com/dpy0912" target="_blank">
          <span class="sob_blog sobgithub"></span>
        </a>
        <a target="_blank" href="https://space.bilibili.com/388255491">
          <span class="sob_blog sobbilibili-line"></span>
        </a>
      </div>
      <div class="left-categories-box">
        <div
          :class="
            currentCategoryId === item.id
              ? 'category-item-active default-border-radius'
              : 'category-item default-border-radius'
          "
          v-for="(item, index) in categories"
          :key="index"
        >
          <span
            v-text="item.name"
            @click="listArticlesByCategoryId(item)"
          ></span>
        </div>
      </div>
    </div>
    <div
      id="index-center-part"
      class="index-center-part float-left default-border-radius"
    >
      <!--轮播图-->
      <div class="loop-box">
        <el-carousel :interval="4000" arrow="always" height="270px">
          <el-carousel-item v-for="(item, index) in loop" :key="index">
            <img :src="item.imageUrl" style="object-fit: cover" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <!--置顶文章-->
      <div class="top-article-box">
        <div
          class="article-item clear-fix"
          v-for="(item, index) in topArticle"
          :key="index"
        >
          <div class="article-left float-left">
            <div class="article-title">
              <span class="top-tips">置顶</span>
              <span class="title">
                <a :href="'/article/' + item.id">{{ item.title }}</a>
              </span>
            </div>
            <div class="article-summary">
              <p>
                {{ item.summary }}
                <span>...</span>
                <a :href="'/article/' + item.id">
                  <span class="read-more">阅读全文</span>
                </a>
              </p>
            </div>
            <div class="labels">
              <el-tag
                size="medium"
                v-for="(tag, tagIndex) in item.labels"
                :key="tagIndex"
                type="info"
              >
                <a :href="'/search?keyword=' + tag" target="_blank">{{
                  tag
                }}</a>
              </el-tag>
            </div>
          </div>
          <div class="article-right float-right">
            <div class="article-cover">
              <img :src="'/portal/image/' + item.cover" />
            </div>
          </div>
        </div>
      </div>
      <div class="last-articles-box" v-loading="isLoading">
        <div
          class="article-item default-border-radius clear-fix"
          v-for="(item, index) in articles"
          :key="index"
        >
          <div class="article-left float-left">
            <div class="article-title">
              <span class="title">
                <a :href="'/article/' + item.id">{{ item.title }}</a>
              </span>
            </div>
            <div class="article-summary">
              <p>
                {{ item.summary }}
                <span>...</span>
                <a :href="'/article/' + item.id">
                  <span class="read-more">阅读全文</span>
                </a>
              </p>
            </div>
            <div class="labels">
              <el-tag
                size="medium"
                v-for="(tag, tagIndex) in item.labels"
                :key="tagIndex"
                type="info"
              >
                <a :href="'/search?keyword=' + tag" target="_blank">{{
                  tag
                }}</a>
              </el-tag>
            </div>
          </div>
          <div class="article-right float-right">
            <div class="article-cover">
              <img :src="'/portal/image/' + item.cover" />
            </div>
          </div>
        </div>
      </div>
      <div class="article-page-navigation-bar">
        <el-pagination
          class="user-list-page-navigation-bar"
          background
          @current-change="onPageChange"
          :current-page="pageNavigation.currentPage"
          :page-size="pageNavigation.pageSize"
          layout="prev, pager, next"
          :total="pageNavigation.totalCount"
        >
        </el-pagination>
      </div>
    </div>
    <div class="index-right-part float-left">
      <div class="right-card">
        <div class="card-title">
          内容搜索
        </div>
        <div class="card-content">
          <el-input
            @keyup.enter.native="toSearchPage"
            size="medium"
            placeholder="请输入你想搜索的内容"
            prefix-icon="el-icon-search"
            v-model="keyword"
          >
          </el-input>
        </div>
      </div>
      <div id="hot-labels-box" class="right-card">
        <div class="card-title">
          热门标签
        </div>
        <div class="card-content">
          <div class="labels-list-box">
            <WordCloud></WordCloud>
          </div>
        </div>
      </div>
      <div class="right-card">
        <div class="card-title">
          公众号
        </div>
        <div class="card-content">
          <div class="we-chat-subscription" id="we-chat-subscription">
            <img src="/gongzhonghao.png" />
          </div>
        </div>
      </div>
      <!--&lt;!&ndash;置顶文章&ndash;&gt;-->
      <!--      <div class="article-top-title" id="right-card">-->
      <!--        <div class="card-title">-->
      <!--          置顶文章-->
      <!--        </div>-->
      <!--        -->
      <!--      </div>-->
      <!--      <div id="taobao-ad-box" class="taobao-ad-box">-->
      <!--        <TaobaoLoop></TaobaoLoop>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import * as api from "../api/api";
export default {
  head() {
    return {
      title: "本是人间红尘客",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "本是人间红尘客,个人技术博客,主要包括系统定制(AOSP),JavaWeb,前端,Android开发,Vue.js等"
        },
        {
          hid: "keywords",
          name: "keywords",
          content: "本是人间红尘客,Java,Android,开发,毕业设计,博客系统,"
        }
      ]
    };
  },
  data() {
    return {
      isLoading: false,
      keyword: "",
      currentCategoryId: ""
    };
  },
  mounted() {
    this.$store.commit("setCurrentActivityTab", "index");
    this.onWindowScroll();
    window.addEventListener("scroll", this.onWindowScroll);
    let that = this;
    window.onresize = function() {
      that.onWindowScroll();
    };
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onWindowScroll);
  },
  methods: {
    toSearchPage() {
      //如果没有输入内容无效
      this.keyword = this.keyword.trim();
      if (this.keyword === "") {
        console.log("内容为空");
        return;
      }
      //跳转到搜索界面
      location.href = "/search?keyword=" + encodeURIComponent(this.keyword);
    },
    listArticlesByCategoryId(item) {
      if (this.currentCategoryId === item.id) {
        return;
      }
      this.isLoading = true;
      //console.log(item);
      //重置页码
      this.pageNavigation.currentPage = 1;
      this.currentCategoryId = item.id;
      //请求数据
      api
        .getArticles(
          this.currentCategoryId,
          this.pageNavigation.currentPage,
          this.pageNavigation.pageSize
        )
        .then(result => {
          //处理结果
          this.handlerArticleResult(result);
        });
    },
    onWindowScroll() {
      let scrolledTop = document.documentElement.scrollTop;
      let scrolledLeft = document.documentElement.scrollLeft;
      let centerPart = document.getElementById("index-center-part");
      let parentPart = document.getElementById("index-page-box");
      //计算我们leftPart顶部
      let leftPart = document.getElementById("index-left-part");
      //左边内容悬浮控制
      if (centerPart && leftPart && parentPart) {
        //处理上下滑动
        let baseTop = centerPart.offsetTop;
        if (scrolledTop <= baseTop) {
          leftPart.style.top = baseTop - scrolledTop + "px";
        } else {
          leftPart.style.top = "60px";
        }
        //处理左右滑动
        if (scrolledLeft > 0) {
          leftPart.style.left = -scrolledLeft + "px";
        } else {
          //正常状态的，左边应该它老爸的左边
          leftPart.style.left = parentPart.offsetLeft + "px";
        }
      }
      //右边内容悬浮控制
      // let taobaoAd = document.getElementById('taobao-ad-box');
      let subscriptionAd = document.getElementById("we-chat-subscription");
      let hotLabelBox = document.getElementById("hot-labels-box");
      if (hotLabelBox && subscriptionAd) {
        // let bootomOfTB = taobaoAd.offsetTop + taobaoAd.offsetHeight;
        let bootomOfTB = subscriptionAd.offsetTop + subscriptionAd.offsetHeight;
        //console.log('bootomOfTB == > ' + bootomOfTB);
        if (scrolledTop >= bootomOfTB) {
          // console.log('显示悬浮内容...');
          hotLabelBox.style.position = "fixed";
          hotLabelBox.style.top = "60px";
          hotLabelBox.style.width = "210px";
          //显示我们的悬浮内容
        } else {
          hotLabelBox.style.position = "";
          hotLabelBox.style.top = "";
          // console.log('隐藏悬浮内容...')
        }
      }
      //console.log('onscroll...' + scrolledTop);
    },
    handlerArticleResult(result) {
      if (result.code === api.success_code) {
        this.articles = result.data.contents;
        //回到顶部
        let topHeader = document.getElementById("blog-header");
        if (topHeader) {
          topHeader.scrollIntoView({
            block: "start",
            behavior: "smooth"
          });
        }
        //处理页码
        this.pageNavigation.currentPage = result.data.currentPage;
        this.pageNavigation.totalCount = result.data.totalCount;
        this.pageNavigation.pageSize = result.data.pageSize;
      } else {
        this.$message.error(result.message);
      }
      this.isLoading = false;
    },
    onPageChange(page) {
      this.isLoading = true;
      //客户端
      console.log(page);
      //去加载当前页的内容
      api
        .getArticles(this.currentCategoryId, page, this.pageNavigation.pageSize)
        .then(result => {
          this.handlerArticleResult(result);
        });
    }
  },
  async asyncData({ params }) {
    let userInfoRes = await api.getAdminInfo();
    let categoriesRes = await api.getCategories();
    let loopRes = await api.getLoops();
    let topArticleRes = await api.getTopArticle();
    //在服务器渲染的
    let articleRes = await api.getArticles("", 1, 10);
    // console.log(articleRes.data);
    let pageNavigation = {
      currentPage: articleRes.data.currentPage,
      totalCount: articleRes.data.totalCount,
      pageSize: articleRes.data.pageSize
    };
    let tempCategories = [];
    tempCategories.push({
      name: "全部分类",
      id: ""
    });
    tempCategories = tempCategories.concat(categoriesRes.data);
    return {
      pageNavigation: pageNavigation,
      articles: articleRes.data.contents,
      topArticle: topArticleRes.data,
      loop: loopRes.data,
      categories: tempCategories,
      userInfo: userInfoRes.data
    };
  }
};
</script>
<!--1140px 240px 660px 240px-->
<style>
.wechat-pop-container {
  padding: 0 !important;
}

.wechat-subscription img {
  object-fit: cover;
  width: 180px;
  height: 180px;
}
#index-left-part {
  position: fixed;
  top: 91px;
}
.taobao-ad-box .el-carousel__button {
  height: 5px;
  width: 5px;
  border-radius: 50%;
}

.taobao-ad-box .el-carousel__container {
  height: 230px;
}
.we-chat-subscription img {
  object-fit: cover;
  width: 210px;
  height: 210px;
}
.wordCloud .text {
  cursor: pointer;
}
.labels-list-box {
  height: 220px;
}
.labels-list-box .wordCloud {
  width: 100%;
  height: 220px;
}
.right-card {
  background: #ffffff;
  padding: 10px;
  margin-bottom: 12px;
}
.right-card .card-title {
  color: #000000;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
}

.article-page-navigation-bar {
  text-align: center;
}

.article-page-navigation-bar .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: #ffffff;
}

.labels .el-tag a:hover {
  color: #2336ab;
}

.labels .el-tag a {
  color: #909399;
  padding: 0 8px;
}

.labels .el-tag--medium {
  height: 22px;
  line-height: 22px;
}

.labels .el-tag {
  margin-top: 14px;
  margin-right: 10px;
  cursor: pointer;
}

.labels {
  margin-top: 20px;
}
.read-more:hover {
  color: #4d4853;
}

.read-more {
  font-size: 12px;
  color: #68b7e1;
  border-radius: 8px;
  padding: 3px 10px;
  cursor: pointer;
}

.article-summary {
  margin-top: 16px;
  color: #909399;
  max-width: 500px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.article-title .top-tips {
  vertical-align: middle;
  padding: 2px 10px;
  background: #ff0021;
  color: #ffffff;
  font-size: 12px;
  border-radius: 8px;
}

.article-title {
  max-width: 500px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  margin-top: 10px;
}

.article-title .title a:hover {
  color: #2336ab;
}

.article-title .title a {
  cursor: pointer;
  vertical-align: middle;
  font-size: 19px;
  color: #4c4e52;
}

.article-item {
  padding: 10px;
  background: #ffffff;
  margin-bottom: 12px;
}

.top-article-box {
  margin-top: 12px;
}

.article-cover img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.loop-box {
  /* padding: 10px; */
  background: #000;
}

.loop-box img {
  /* border-radius: 6px; */
  width: 100%;
  height: 300px;
}

.left-categories-box .category-item:hover,
.left-categories-box .category-item-active {
  background: #dedcdf;
  color: #4e4e4e !important;
}

.left-categories-box .category-item,
.left-categories-box .category-item-active {
  padding: 10px 5px;
  cursor: pointer;
  margin-left: 15px;
  margin-right: 15px;
  color: #517cc5;
}

.left-categories-box {
  margin-bottom: 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
  color: #517cc5;
}

.left-user-self--links .sob_blog:hover {
  font-family: "sob_blog", serif !important;
  font-size: 30px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-left: 10px;
  display: inline-block;
  color: #3268ca;
  margin-right: 10px;
}

.left-user-self--links .sob_blog {
  font-family: "sob_blog", serif !important;
  font-size: 30px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-left: 10px;
  display: inline-block;
  color: #b3b3b3;
  margin-right: 10px;
}

.left-user-self--links {
  background: #ffffff;
  margin-top: 20px;
  font-size: 20px;
  text-align: center;
}

/*.left-user-self-links a > span, .left-user-self-links .sobwechat {*/
/*font-size: 30px;*/
/*font-weight: 600;*/
/*cursor: pointer;*/
/*margin-left: 70px;*/
/*display: inline-block;*/
/*color: #CACACA;*/
/*margin-right: 20px;*/
/*}*/

.index-left-user-info {
  background: #ffffff;
  text-align: center;
  margin-top: 10px;
}

.index-left-user-info .user-sign {
  font-size: 16px;
  margin-top: 14px;
  color: #bbbbbb;
}

.index-left-user-info .user-name {
  margin-top: 14px;
  font-size: 18px;
  color: #464646;
}

.index-left-user-info .user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.index-page-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.index-left-part {
  background: #ffffff;
  margin-right: 10px;
  width: 230px;
}

.index-right-part {
  margin-left: 10px;
  width: 230px;
}

.index-center-part {
  margin-right: 10px;
  margin-left: 250px;
  width: 640px;
}
</style>
