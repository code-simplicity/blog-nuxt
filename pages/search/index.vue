<template>
  <div class="search-box" id="search-box">
    <div class="default-border-radius search-input-parent">
      <div class="search-input-box">
        <div class="search-input-container clear-fix">
          <div class="search-logo float-left">
            <span class="logo">本是人间红尘客</span>
            <span>|</span>
            <span>搜索</span>
          </div>
          <div class="search-input float-left">
            <el-input @keyup.enter.native="toSearchPage" v-model="keyword" placeholder="请输入您要搜索的内容"></el-input>
          </div>
          <div class="search-btn float-left">
            <el-button type="primary" icon="el-icon-search" @click="toSearchPage">搜索</el-button>
          </div>
        </div>
      </div>
      <div class="search-condition-box">
        <div class="select-item">
          <span :class="sort===''?'sort-active':''" @click="doSearchBySort('')">综合排序</span><span
          @click="doSearchBySort('2')" :class="sort==='2'||sort==='1'?'sort-active':''">时间</span><span
          @click="doSearchBySort('4')" :class="sort==='3'||sort==='4'?'sort-active':''">浏览量</span>
        </div>
        <div class="select-item">
          <span :class="categoryId===''?'category-active':''" @click="doSearchByCategory('')">全部分类</span><span
          @click="doSearchByCategory(item.id)" :class="categoryId===item.id?'category-active':''"
          v-for="item in categories" :key="item.id">{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="search-result-box default-border-radius clear-fix">
      <div class="search-left-part float-left">
        <div class="search-result-list">
          <!--1140-20 = 1120 == > 1120-300 == > 820px-->
          <div class="search-result-count-info">
            找到约 <span v-text="searchResult.totalCount"></span> 条结果
          </div>
          <div class="search-result-list-box" v-if="searchResult.contents.length!==0">
            <div class="search-result-item" v-for="(item,index) in searchResult.contents" :key="index">
              <a :href="'/article/'+item.id">
                <div class="result-item-title" v-html="item.blogTitle">

                </div>
              </a>
              <div class="result-item-content" v-html="item.blogContent">

              </div>
              <div class="search-info-box">
              <span class="sob_blog sobicon">
                {{item.blogCreateTime | formatDate("yyyy-MM-dd hh:mm")}}
              </span>
                <span class="sob_blog sobview">
                {{item.blogViewCount}}
              </span>
                <span>
                <el-tag
                  size="mini"
                  v-for="(tag,tagIndex) in item.blogLabels"
                  :key="tagIndex"
                  type="info">
                  {{ tag }}
                </el-tag>
              </span>
              </div>
            </div>
          </div>
          <div class="search-result-empty-box" v-else>
            <div class="empty-box">
              <div class="sob_blog sobemptybox"></div>
              <div class="empty-text">没有找到相关内容哦</div>
            </div>
          </div>
        </div>
        <div class="search-result-page-navigation-box clear-fix default-border-radius">
          <div class="search-pre float-left" disabled="false">
            <el-link disabled v-if="isFirst">&lt;&lt;上一页</el-link>
            <el-link v-else
                     :href="'/search?keyword='+keyword +'&page='+(page-1)+'&sort='+sort+'&categoryId='+categoryId">&lt;&lt;上一页
            </el-link>
          </div>
          <div class="search-next float-right">
            <el-link disabled v-if="isLast">下一页
              &gt;&gt;
            </el-link>
            <el-link v-else
                     :href="'/search?keyword='+keyword +'&page='+(page+1)+'&sort='+sort+'&categoryId='+categoryId">下一页
              &gt;&gt;
            </el-link>
            <a></a>
          </div>
        </div>
      </div>
      <div class="search-right-part float-left">
        <div class="search-hot-word default-border-radius" id="search-hot-word">
          <div class="card-header">
            热门标签
          </div>
          <WordCloud></WordCloud>
        </div>
        <div class="search-right-box default-border-radius" id="search-right-subscription-box">
          <div class="card-header-g">
            公众号
          </div>
          <div class="right-card-content">
            <img src="/gongzhonghao.png">
          </div>
        </div>
<!--        <div class="search-taobao-ad default-border-radius">-->
<!--          <div class="card-header">-->
<!--            赞助商广告-->
<!--          </div>-->
<!--          <div class="search-taobao-ad-box">-->
<!--            <TaobaoLoop></TaobaoLoop>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>
<script>

  import * as api from '../../api/api';

  export default {
    head() {
      return {
        title: '本是人间红尘客-搜索',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: '本是人间红尘客-搜索页面'
          },
          {
            hid: 'keywords',
            name: 'keywords',
            content: '本是人间红尘客,java,android,开发,毕业设计,博客系统,程序员'
          }
        ]
      }
    },
    mounted() {
      this.$store.commit("setCurrentActivityTab", "index");
      //添加滚动监听
      this.onWindowScroll();
      window.addEventListener('scroll', this.onWindowScroll);
      let that = this;
      let timer = setInterval(function () {
        that.isArticleProcessing = false;
        clearInterval(timer)
      }, 1000);
    },

    beforeDestroy() {
      window.removeEventListener('scroll', this.onWindowScroll);
    },

    async asyncData({query}) {
      let categoryId = query.categoryId ? query.categoryId : '';
      let keyword = query.keyword ? query.keyword : '';
      let page = query.page ? query.page : 1;
      let size = query.size ? query.size : 10;
      let sort = query.sort ? query.sort : '';

      //发起请求，获取搜索内容
      let result = await api.getSearchContent(categoryId, keyword,
        page,
        size,
        sort);

      //console.log(result.data);
      //处理一下标签再返回
      let temResult = result.data;
      let contents = temResult.contents;
      contents.forEach(item => {
        item.blogLabels = item.blogLabels.split("-");
        //console.log(item.blogLabels);
      });

      //获取分类内容
      let categoriesRes = await api.getCategories();
      //console.log(categoriesRes.data);
      return {
        categories: categoriesRes.data,
        categoryId: categoryId,
        keyword: keyword,
        page: parseInt(page),
        size: parseInt(size),
        sort: sort,
        isFirst: temResult.first,
        isLast: temResult.last,
        searchResult: temResult
      }
    },
    methods: {


      onWindowScroll() {
        let searchHotBox = document.getElementById('search-hot-word');
        let weixinBox = document.getElementById('search-right-subscription-box');
        let parentPart = document.getElementById('search-box');
        if (weixinBox) {
          //console.log(weixinBox.offsetHeight);
          let bottomOfWC = searchHotBox.offsetTop + searchHotBox.offsetHeight;
          let scrolledTop = document.documentElement.scrollTop;
          let scrolledLeft = document.documentElement.scrollLeft;
          if (scrolledTop >= bottomOfWC) {
            // console.log('显示悬浮内容...');
            weixinBox.style.position = 'fixed';
            weixinBox.style.top = '20px';
            weixinBox.style.width = '210px';
            //显示我们的悬浮内容
          } else {
            weixinBox.style.position = 'fixed';
            weixinBox.style.top = (bottomOfWC - scrolledTop + 20) + 'px';
            // console.log('隐藏悬浮内容...')
          }

          //处理左右滑动
          if (scrolledLeft > 0) {
            weixinBox.style.left = parentPart.offsetLeft + parentPart.offsetWidth
              - weixinBox.offsetWidth - scrolledLeft + 'px';
          } else {
            //正常状态的，左边应该它老爸的左边
            weixinBox.style.left = parentPart.offsetLeft + parentPart.offsetWidth
              - weixinBox.offsetWidth + 'px';
          }
        }
      },

      doSearchByCategory(categoryId) {
        location.href = "/search?keyword=" + encodeURIComponent(this.keyword) + '&sort=' + this.sort + '&categoryId=' + categoryId;
      },
      doSearchBySort(sort) {
        //console.log(sort);
        //首先进来的不是空,是2,表示按时间排序
        //如果跟当前的sort一样,那变换成1
        if (sort === '2' && this.sort === '2') {
          sort = '1';
        }

        //如果是4，表是按浏览量降序DESC
        if (sort === '4' && this.sort === '4') {
          sort = '3';
        }
        // console.log(sort);
        location.href = "/search?keyword=" + encodeURIComponent(this.keyword) + '&sort=' + sort + '&categoryId=' + this.categoryId;
      },
      toSearchPage() {
        location.href = "/search?keyword=" + encodeURIComponent(this.keyword);
      }
    }
  }
</script>
<style>

.search-right-box {
  width: 300px !important;
  margin-bottom: 20px;
  background: #fff;
}

.right-card-content img {
  width: 300px;
  height: 300px;
}

  .search-input-parent {
    background: #ffffff;
  }

  .search-hot-word, .search-taobao-ad {
    margin-bottom: 20px;
    background: #ffffff;
    padding: 20px;
  }

  .search-taobao-ad-box .el-carousel__container {
    height: 260px;
  }

  .search-taobao-ad-box {
    width: 260px;
  }

  .card-header {
    color: #A612FF;
    font-weight: 600;
    padding-top: 5px;
    padding-bottom: 15px;
    border-bottom: solid 1px #DCDFE6;
  }

.card-header-g {
  font-size: 16px;
  color: #A612FF;
  border-bottom: #d7d8db solid 1px;
  padding: 10px;
  margin: 0 10px 0 10px;
  font-weight: 600;
}

  .search-result-empty-box .sobemptybox {
    font-size: 70px;

  }

  .search-result-empty-box .empty-text {
    font-size: 20px;
    line-height: 40px;
  }

  .search-result-empty-box {
    height: 380px;
    color: #50A7FC;
    margin-top: 120px;
    text-align: center;
  }

  .category-active, .sort-active {
    background: dodgerblue;
    border-radius: 4px;
    color: #fff !important;
  }

  .select-item span:hover {
    color: dodgerblue;
  }

  .select-item span {
    color: #7f828b;
    margin-left: 8px;
    font-size: 13px;
    cursor: pointer;
    margin-right: 8px;
    padding: 5px 15px;
  }

  .select-item {
    margin-top: 10px;
    line-height: 24px;
  }

  .search-logo .logo {
    font-size: 26px;
  }

  .search-logo {
    color: dodgerblue;
    margin-right: 20px;
    font-size: 20px;
  }

  .search-input-container {
    line-height: 40px;
    display: inline-block;
  }

  .search-input .el-input__inner {
    border-width: 2px;
  }

  .search-input {
    width: 250px;
    margin-right: 20px;
  }

  .search-pre:hover, .search-next:hover {
    color: dodgerblue;
  }

  .search-pre-disable, .search-next-disable {
    cursor: not-allowed;
  }

  .search-pre, .search-next {
    cursor: pointer;

  }

  .search-result-list {
    padding-top: 20px;
    background: #fff;
  }

  .search-result-page-navigation-box {
    background: #fff;
    margin-top: 20px;
    padding: 20px;
  }

  .search-info-box span {
    margin-right: 10px;
  }

  .search-info-box {
    color: #999;
    font-size: 14px;
  }

  .result-item-content {
    margin-top: 10px;
    margin-bottom: 10px;
    color: #4d5156;
    font-size: 18px;
    line-height: 24px;
    height: 48px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .search-result-item {
    margin-bottom: 20px;
  }

  .result-item-title {
    color: dodgerblue;
    margin-top: 10px;
    margin-bottom: 10px;
    line-height: 26px;
    cursor: pointer;
    height: 26px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    font-size: 18px;
  }

  .search-result-list-box {
    padding: 20px;
  }

  .search-result-count-info {
    color: #70757a;
    line-height: 20px;
    font-size: 16px;
    margin-left: 20px;
  }

  .search-condition-box {
    border-top: solid 1px #DCDFE6;
    margin-bottom: 20px;
    padding: 20px 20px 30px;
  }

  .search-input-box {
    text-align: center;
    padding: 20px;
  }

  .search-box {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .search-left-part {
    margin-right: 20px;
    width: 820px;
  }

  .search-hot-word .wordCloud {
    width: 260px;
    height: 260px;
  }

  .search-right-part {
    width: 300px;
  }
</style>
