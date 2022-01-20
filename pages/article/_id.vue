<template>
  <div class="article-box" id="article-box">
    <div class="content-box clear-fix">
      <div class="article-left-part float-left">
        <div class="article-content-box">
          <div class="article-detail-title">
            <h1 v-text="articleRes.title"></h1>
          </div>
          <div style="background: #f7f7fc;margin-top: 20px;border-radius: 8px;">
            <div class="article-info">
              <img :src="articleRes.sobUser.avatar" size="small" />
              <span class="user-name">
                {{ articleRes.sobUser.userName }}
              </span>
              <span class="el-icon-date"> 发表于</span>
              <span>
                {{ articleRes.createTime | formatDate("yyyy-MM-dd hh:mm") }}
              </span>
              <span class="el-icon-view"> {{ articleRes.viewCount }}</span>
            </div>
            <div class="article-labels">
              <el-tag
                type="info"
                size="mini"
                v-for="(item, index) in articleRes.labels"
                :key="index"
              >
                <a
                  :href="'/search?keyword=' + item"
                  target="_blank"
                  style="color: #50a7fc"
                  >{{ item }}</a
                >
              </el-tag>
            </div>
          </div>
          <div class="article-loading-part" v-if="isArticleProcessing">
            <div class="content-loading">
              <div class="loading-title clear-fix"></div>
              <div class="loading-content">
                <div class="loading-text"></div>
                <div class="loading-text animation-delay"></div>
              </div>
            </div>
          </div>
          <div
            class="catalog-box"
            id="article-content-category-box"
            v-show="!isArticleProcessing"
          ></div>
          <div
            id="article-content"
            class="article-content"
            v-html="articleRes.content"
            v-show="!isArticleProcessing"
          ></div>
        </div>

        <div class="article-comment-box">
          <div class="article-comment-input">
            <div class="comment-input-header">
              评论
            </div>
            <div class="comment-input-box">
              <el-input
                @focus="checkLogin"
                placeholder="*请输入昵称"
                v-model="comment.userName"
              ></el-input>
            </div>
            <div class="comment-input-box">
              <el-input
                @focus="checkLogin"
                rows="4"
                type="textarea"
                placeholder="请文明评论"
                v-model="comment.content"
                maxlength="256"
                show-word-limit
              >
              </el-input>
            </div>
            <div class="comment-submit-btn">
              <el-button type="primary" size="medium" @click="doComment"
                >评论</el-button
              >
            </div>
          </div>
          <div class="article-comment-list" id="article-comment-list">
            <div class="comment-list-header">
              文章评论
            </div>
            <div
              class="comment-item-list"
              v-for="(item, index) in commentList"
              :key="index"
            >
              <div class="article-comment-item">
                <div class="article-comment-user-info">
                  <a :href="'/userInfo/' + item.id" target="_blank">
                    <img :src="item.userAvatar" />
                    <span class="user-name">{{ item.userName }}</span>
                  </a>
                  <el-tag size="mini" type="danger" v-if="item.state === '3'"
                    >置顶</el-tag
                  >
                  <el-tag size="small" v-if="item.roles === 'role_admin'"
                    >小站主人
                  </el-tag>
                  <el-tag
                    type="success"
                    size="small"
                    v-if="item.roles === 'role_normal'"
                    >小站成员
                  </el-tag>
                  <el-tag
                    type="info"
                    size="small"
                    v-if="item.roles === 'role_tourist'"
                    >游客
                  </el-tag>
                  <span class="el-icon-date">{{
                    item.createTime | formatDate("yyyy-MM-dd hh:mm")
                  }}</span>
                </div>
                <div class="article-comment-content">
                  {{ item.content }}
                  <i
                    ><span
                      class="el-icon-chat-dot-round"
                      @click="onReplyClick(index, item.userName)"
                    ></span
                  ></i>
                </div>

                <div
                  class="article-sub-comment-box clear-fix"
                  style="display: none;"
                  :id="'sub_input_' + index"
                >
                  <div class="sub-comment-input float-left">
                    <div class="comment-input-box">
                      <el-input
                        placeholder="*请输入昵称"
                        v-model="subComment.userName"
                      ></el-input>
                    </div>
                    <div class="comment-input-box">
                      <el-input
                        @focus="checkLogin"
                        rows="4"
                        type="textarea"
                        :placeholder="subCommentPlaceholder"
                        v-model="subComment.content"
                        maxlength="256"
                        show-word-limit
                      >
                      </el-input>
                    </div>
                    <div class="sub-comment-btn float-right">
                      <el-button
                        type="primary"
                        @click="doCommitNewCommentReply(item.id, item.userName)"
                      >
                        提交回复</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="new-comment-child-box"
                v-for="(item1, index1) in newCommentReplyRes"
                :key="index1"
                v-if="item.id === item1.parentId"
              >
                <div class="article-comment-user-info">
                  <a :href="'/userInfo/' + item1.id" target="_blank">
                    <img :src="item1.userAvatar" />
                    <span class="user-name">{{ item1.userName }}</span>
                  </a>
                  <el-tag size="small" v-if="item1.roles === 'role_admin'"
                    >小站主人
                  </el-tag>
                  <el-tag
                    type="success"
                    size="small"
                    v-if="item1.roles === 'role_normal'"
                    >小站成员
                  </el-tag>
                  <el-tag
                    type="info"
                    size="small"
                    v-if="item1.roles === 'role_tourist'"
                    >游客
                  </el-tag>
                  <span style="line-height: 24px">回复</span>
                  <span class="user-name">{{ item1.parentUserName }}</span>
                  <span class="el-icon-date">{{
                    item1.createTime | formatDate("yyyy-MM-dd hh:mm")
                  }}</span>
                </div>
                <div class="new-comment-child-content">
                  {{ item1.content }}
                  <i
                    ><span
                      class="el-icon-chat-dot-round"
                      @click="replyChildNewComment(index1, item1.userName)"
                    ></span
                  ></i>
                </div>
                <div
                  class="article-sub-comment-box clear-fix"
                  style="display: none;"
                  :id="'sub_input_child_' + index1"
                >
                  <div class="sub-comment-input float-left">
                    <div class="comment-input-box">
                      <el-input
                        @focus="checkLogin"
                        placeholder="*请输入昵称"
                        v-model="subComment.userName"
                      ></el-input>
                    </div>
                    <div class="comment-input-box">
                      <el-input
                        @focus="checkLogin"
                        rows="4"
                        type="textarea"
                        :placeholder="subCommentPlaceholder"
                        v-model="subComment.content"
                        maxlength="256"
                        show-word-limit
                      >
                      </el-input>
                    </div>
                    <div class="sub-comment-btn float-right">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="
                          doCommitNewCommentReply(item.id, item1.userName)
                        "
                        >回复</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
            <div class="no-comment-content" v-if="commentList.length === 0">
              暂时没有评论，赶快来评论吧~
            </div>
            <div
              class="loader-more-comment"
              v-if="!isLastPage"
              @click="doLoadMore"
            >
              加载更多评论>>
            </div>
          </div>
        </div>
        <div class="article-recommend-box">
          <div class="recommend-header-title">
            推荐文章
          </div>
          <div
            class="recommend-item"
            v-for="(item, index) in recommendArticles"
            :key="index"
          >
            <div class="recommend-title">
              <a :href="'/article/' + item.id">
                {{ item.title }}
              </a>
            </div>
            <div class="recommend-summary">
              {{ item.summary }}
            </div>
            <div class="recommend-info">
              <span class="el-icon-date">
                {{ item.createTime | formatDate("yyyy-MM-dd hh:mm") }}
              </span>
              <span class="el-icon-view">
                {{ " " + item.viewCount }}
              </span>
              <el-tag
                type="info"
                size="mini"
                v-for="(tag, tagIndex) in item.labels"
                :key="tagIndex"
              >
                <a :href="'/search?keyword=' + tag" target="_blank">{{
                  tag
                }}</a>
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="article-right-part float-left">
        <div class="article-right-card article-detail-hot-label">
          <div class="right-card-title">
            热门标签
          </div>
          <div class="right-card-content">
            <WordCloud></WordCloud>
          </div>
        </div>
        <!--        <div class="article-right-card" id="article-right-taobao-ad">-->
        <!--          <div class="right-card-title">-->
        <!--            赞助商广告-->
        <!--          </div>-->
        <!--          <div class="right-card-content article-right-taobao-ad">-->
        <!--            <TaobaoLoop></TaobaoLoop>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="article-right-card" id="article-right-subscription-box">
          <div class="right-card-title">
            公众号
          </div>
          <div class="right-card-content">
            <img src="/gongzhonghao.png" />
          </div>
        </div>
        <div class="article-right-card" id="catalog-box">
          <div class="right-card-title">
            文章目录
          </div>
          <div class="right-card-content" id="article-catalog-container"></div>
        </div>
      </div>
    </div>
    <div class="article-detail-part">
      <el-dialog :visible.sync="isImageDialogShow">
        <img :src="targetImagePath" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import hljs from "highlight.js";
import "highlight.js/styles/github-gist.css";
import * as api from "../../api/api";
import Catelog from "../../utils/headerLineHandler";
import { success_code } from "../../api/api";

// const highlightCode = () => {
//   const block = document.querySelectorAll('pre code')
//   hljs.configure({useBR: true});
//   block.forEach((el) => {
//     hljs.highlightBlock(el)
//   })
// };

let lastInputBox = null;
export default {
  head() {
    return {
      title: "本是人间红尘客-" + this.articleRes.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "本是人间红尘客-" + this.articleRes.summary
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.labelsStr
        }
      ]
    };
  },
  data() {
    return {
      isArticleProcessing: true,
      subComment: {
        content: "",
        userName: "",
        parentId: "",
        parentUserName: "",
        userAvatar: "",
        articleId: ""
      },
      comment: {
        content: "",
        articleId: "",
        userAvatar: "",
        roles: ""
      },
      isImageDialogShow: false,
      targetImagePath: "",
      currentPage: 1,
      pageSize: 10,
      subCommentPlaceholder: "请文明回复"
    };
  },

  /*加载文章详情,需要把文章的ID传过来*/
  async asyncData({ params }) {
    let articleResult = await api.getArticleDetailById(params.id);
    let recommendArticleRes = await api.getRecommendArticle(
      articleResult.data.id,
      10
    );
    //加载第一页评论数据
    let commentRes = await api.getCommentsByArticleId(
      articleResult.data.id,
      1,
      10
    );
    let newCommentReplyResult = await api.getNewCommentReplyList(1, 30);
    // console.log(newCommentReplyResult.data.content);
    let labels = "";
    let labelsList = articleResult.data.labels;
    labelsList.forEach((label, index) => {
      labels += label;
      if (index < labelsList.length - 1) {
        // console.log(index);
        labels += ",";
      }
    });
    // console.log(labels);
    return {
      articleRes: articleResult.data,
      recommendArticles: recommendArticleRes.data,
      commentList: commentRes.data.contents,
      isLastPage: commentRes.data.last,
      labelsStr: labels,
      newCommentReplyRes: newCommentReplyResult.data.content
    };
  },
  methods: {
    // updated() {
    //   highlightCode()
    // },

    replyChildNewComment(index, userName) {
      this.checkLogin();
      // this.checkLogin1();
      let subInputBox = document.getElementById("sub_input_child_" + index);
      this.subComment.content = "";
      this.subCommentPlaceholder = "回复@" + userName;
      if (subInputBox) {
        if (lastInputBox) {
          lastInputBox.style.display = "none";
        }
        lastInputBox = subInputBox;
        subInputBox.style.display = "block";
      }
    },

    getNewCommentReply() {
      api.getNewCommentReplyList(1, 30).then(result => {
        if (result.code === success_code) {
          this.newCommentReplyRes = result.data.content;
        }
      });
    },

    //二级评论
    doCommitNewCommentReply(id, name) {
      if (this.subComment.userName === "") {
        this.$message.error("请填写一个昵称吧");
        return;
      }
      if (this.subComment.content === "") {
        this.$message.error("您还没有写评论啊哦o(╥﹏╥)o");
        return;
      }
      this.subComment.parentId = id;
      this.subComment.parentUserName = name;
      this.subComment.articleId = this.articleRes.id;
      this.loading = true;
      api.postNewCommentReply(this.subComment).then(result => {
        if (result.code === success_code) {
          this.$message.success(result.message);
          this.getArticleCommentByPage(1);
          this.getNewCommentReply();
          this.resetComment();
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      });
      if (this.dialogVisible === true) {
        this.dialogVisible = false;
      }
    },

    doLoadMore() {
      this.currentPage++;
      api
        .getCommentsByArticleId(
          this.articleRes.id,
          this.currentPage,
          this.pageSize
        )
        .then(result => {
          if (result.code === api.success_code) {
            //处理成功的结果
            this.commentList = this.commentList.concat(result.data.contents);
            //处理是否有更多
            this.isLastPage = result.data.last;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onReplyClick(index, userName) {
      this.checkLogin();
      // this.checkLogin1();
      let subInputBox = document.getElementById("sub_input_" + index);
      this.subComment.content = "";
      this.subCommentPlaceholder = "回复@" + userName;
      if (subInputBox) {
        if (lastInputBox) {
          lastInputBox.style.display = "none";
        }
        lastInputBox = subInputBox;
        subInputBox.style.display = "block";
      }
    },
    checkLogin() {
      //检查是否有效
      api.checkToken().then(result => {
        //console.log(result)
        if (result.code === success_code) {
          this.comment.userName = result.data.userName;
          this.comment.avatar = result.data.avatar;
        } else {
          //跳转登录界面
          location.href = "/login?redirect=" + location.href;
        }
        // if (result.data.roles === 'role_admin') {
        //   this.subComment.isAdmin = '1';
        // } else {
        //   this.subComment.isAdmin = '0';
        // }
      });
    },
    doComment() {
      // //检查是否有登录,只检查token
      let sobBlogTokenIndex = document.cookie.indexOf("sob_blog_token");
      //console.log('sobBlogTokenIndex' + sobBlogTokenIndex);
      if (sobBlogTokenIndex === -1) {
        location.href = "/login?redirect=" + location.href;
        return;
      }
      //检查内容
      if (this.comment.userName === "") {
        this.$message.error("请填写一个昵称吧");
        return;
      }
      if (this.comment.content === "") {
        this.$message.error("您没有填写评论内容呢！");
        return;
      }
      //补全内容
      this.comment.articleId = this.articleRes.id;
      //获取父id

      //提交内容
      //console.log(this.comment);
      api.postComment(this.comment).then(result => {
        if (result.code === api.success_code) {
          //刷新评论列表
          this.getArticleCommentByPage(1);
          this.resetComment();
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    resetComment() {
      this.comment.content = "";
      this.comment.parentUserName = "";
      if (lastInputBox) {
        lastInputBox.style.display = "none";
      }
    },
    getArticleCommentByPage(page) {
      api
        .getCommentsByArticleId(this.articleRes.id, page, this.pageSize)
        .then(result => {
          this.commentList = result.data.contents;
          this.currentPage = page;
        });
    },

    getNewComment(page) {
      api
        .getNewCommentsByArticleId(this.articleRes.id, page, this.pageSize)
        .then(result => {
          if (result.code === success_code) {
            this.newCommentRes = result.data.contents;
          }
        });
    },

    onWindowScroll() {
      let catalogBox = document.getElementById("catalog-box");
      let weixinBox = document.getElementById("article-right-subscription-box");
      let parentPart = document.getElementById("article-box");
      if (catalogBox) {
        //console.log(weixinBox.offsetHeight);
        let bottomOfWC = weixinBox.offsetTop + weixinBox.offsetHeight;
        let scrolledTop = document.documentElement.scrollTop;
        let scrolledLeft = document.documentElement.scrollLeft;
        if (scrolledTop >= bottomOfWC) {
          // console.log('显示悬浮内容...');
          catalogBox.style.position = "fixed";
          catalogBox.style.top = "60px";
          catalogBox.style.width = "210px";
          //显示我们的悬浮内容
        } else {
          catalogBox.style.position = "fixed";
          catalogBox.style.top = bottomOfWC - scrolledTop + 12 + "px";
          // console.log('隐藏悬浮内容...')
        }

        //处理左右滑动
        if (scrolledLeft > 0) {
          catalogBox.style.left =
            parentPart.offsetLeft +
            parentPart.offsetWidth -
            catalogBox.offsetWidth -
            scrolledLeft +
            "px";
        } else {
          //正常状态的，左边应该它老爸的左边
          catalogBox.style.left =
            parentPart.offsetLeft +
            parentPart.offsetWidth -
            catalogBox.offsetWidth +
            "px";
        }
      }
    },
    showImage(event) {
      this.isImageDialogShow = true;
      //显示dialog
      this.targetImagePath = event.target.src;
    },
    handleContentImages() {
      //遍历图片
      let contentBox = document.getElementById("article-content");
      let images = contentBox.querySelectorAll("img");
      images.forEach(item => {
        //console.log(item);
        item.addEventListener("click", this.showImage);
      });
    }
  },
  mounted() {
    new Catelog({
      contentEl: "article-content",
      catalogEl: "article-catalog-container",
      selector: ["h1", "h2", "h3"]
    });
    hljs.initHighlighting();
    // console.log(hljs)
    this.handleContentImages();
    //添加滚动监听
    this.onWindowScroll();
    window.addEventListener("scroll", this.onWindowScroll);
    let that = this;
    let timer = setInterval(function() {
      that.isArticleProcessing = false;
      clearInterval(timer);
    }, 1000);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onWindowScroll);
  }
};
</script>

<style>
hr {
  background-color: #d9d0d0;
  border: none;
  display: block;
  height: 1px;
  margin: 0.5em 0;
  display: block;
}

.new-comment-child-box {
  margin-left: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
}

.parent-reply-btn:hover,
.child-reply-btn:hover {
  color: #1900ff;
  cursor: pointer;
}

.parent-reply-btn,
.child-reply-btn {
  font-size: 16px;
  font-weight: 600;
  float: right;
}

.new-comment-child-content {
  font-size: 16px;
  margin-left: 60px;
}

.new-comment-child-content i {
  font-size: 18px;
  margin-right: 60px;
  color: #1900ff;
}
.new-comment-child-content i:hover {
  color: #f8225f;
}

.comment-input-box {
  background: #fff;
  margin-top: 10px;
  border-radius: 8px;
}

.article-detail-title h1 {
  text-align: center;
}

.article-loading-part .content-loading {
  padding: 10px;
  background: #f3f3f3;
  margin-top: 5px;
}

.article-loading-part .loading-title {
  width: 200px;
  height: 24px;
  background-color: #eaeaea;
}

.article-loading-part .loading-content {
  margin-left: 10px;
  margin-top: 10px;
  width: 600px;
}

.article-loading-part .loading-text {
  width: 100%;
  height: 16px;
  margin: 0 0 10px;
  background-color: #eaeaea;
  -webkit-animation: loading 1s ease-in-out infinite;
  animation: loading 1s ease-in-out infinite;
}

.article-loading-part {
  margin-top: 20px;
}

.article-loading-part .animation-delay {
  -webkit-animation: loading 1s ease-in-out -0.5s infinite;
  animation: loading 1s ease-in-out -0.5s infinite;
}

@keyframes loading {
  0% {
    width: 20%;
  }
  50% {
    width: 100%;
  }
  100% {
    width: 20%;
  }
}

.sub-comment-btn {
  margin-top: 10px;
}

.article-sub-comment-box {
  margin-top: 10px;
}

.sub-comment-input {
  width: 640px;
  margin-left: 40px;
}

.loader-more-comment,
.no-comment-content {
  text-align: center;
  padding: 10px;
  cursor: pointer;
  margin-top: 20px;
}

.item-reply-btn:hover,
.loader-more-comment:hover {
  color: #1900ff;
}

.item-reply-btn {
  cursor: pointer;
}

.article-comment-reply {
  padding: 10px;
  background: #f5f5f5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: auot;
  overflow: hidden;
  margin-left: 30px;
}

.article-comment-content {
  font-size: 16px;
  margin-left: 60px;
}

.article-comment-content i {
  font-size: 18px;
  margin-right: 60px;
  color: #1900ff;
}
.article-comment-content i:hover {
  color: #f8225f;
}

.article-comment-action {
  color: #7f828b;
  margin-right: 30px;
  text-align: right;
}

.article-comment-user-info .user-name {
  font-weight: 600;
  color: #7f828b;
  margin-left: 5px;
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
}

.article-comment-user-info .user-name:hover {
  color: #1900ff;
}

.article-comment-user-info {
  margin-bottom: 10px;
}

.article-comment-user-info img {
  width: 30px;
  height: 30px;
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
}

#article-catalog-container {
  max-height: 300px;
  overflow: hidden;
}

.cl-link > span {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.cl-link > span:hover {
  color: #1900ff;
}

.cl-link-active > span {
  display: block;
  padding-left: 5px;
  color: #1900ff !important;
  background: #f2f2f2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

#article-catalog-container ul {
  margin-left: 30px;
  line-height: 30px;
}

#article-catalog-container {
  padding: 10px;
}

#article-content-category-box {
  margin-top: 16px;
  padding-bottom: 6px;
  border-bottom: 1px solid #454546;
}

.content-category-title {
  padding: 10px 0;
  font-size: 20px;
  font-weight: 600;
}

#article-content-category-box li > span,
#article-catalog-container li > span {
  padding-left: 5px;
  font-weight: 600;
}

#article-content-category-box li,
#article-catalog-container li {
  cursor: pointer;
}

#article-content-category-box ul {
  margin-left: 35px;
  line-height: 30px;
}

.recommend-info span {
  margin-right: 10px;
}

.recommend-info a {
  color: #7f828b;
}

.recommend-info {
  font-size: 14px;
  color: #7f828b;
}

.recommend-summary {
  font-size: 16px;
  color: #7f828b;
  margin: 10px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.recommend-title a:hover,
.recommend-info a:hover {
  color: #001aff96;
}

.recommend-title a {
  color: #47494e;
}

.recommend-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  font-size: 18px;
  line-height: 30px;
  font-weight: 600;
}

.recommend-item {
  border-bottom: #353333 solid 1px;
  padding-bottom: 16px;
  padding-top: 16px;
}

.comment-submit-btn {
  margin-top: 10px;
  text-align: right;
}

.article-comment-input {
  padding: 16px;
  background: #fff;
  margin-bottom: 12px;
}

.article-comment-list {
  background: #fff;
  margin-bottom: 12px;
  padding: 16px;
}

.comment-item-list {
  margin-top: 10px;
}

.comment-input-header {
  padding: 10px 0 12px;
}

.recommend-header-title,
.comment-input-header,
.comment-list-header {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
}

.article-recommend-box {
  background: #fff;
  padding: 16px;
}

.right-card-content img {
  width: 300px;
  height: 300px;
}

#article-right-subscription-box {
  height: 345px;
}

#article-right-taobao-ad {
  height: 361px;
}

.article-detail-hot-label {
  height: 345px;
}

.article-right-taobao-ad {
  padding: 10px;
}

.article-right-card {
  width: 300px !important;
  margin-bottom: 12px;
  background: #fff;
}

.right-card-content .wordCloud {
  height: 300px;
}

.right-card-title {
  font-size: 16px;
  color: #000000;
  border-bottom: #d7d8db solid 1px;
  padding: 10px;
  margin: 0 10px 0 10px;
  font-weight: 600;
}

.article-detail-part .el-dialog {
  width: fit-content;
}

.article-detail-part .el-dialog__body {
  padding: 10px;
}

.article-detail-part .el-dialog__header {
  padding: 0;
}

.article-content pre {
  font-weight: bold;
  border-radius: 8px;
  color: #000000;
  background: #f6f6f6;
  max-height: 750px;
  padding: 10px 10px;
  overflow: auto;
}

.article-content pre code {
  font-weight: bold;
  border-radius: 8px;
  color: #000000;
  margin-bottom: 10px;
  padding: 10px;
  background: #f6f6f6;
  display: block;
  font-size: 16px;
}

.article-content ul {
  margin-left: 20px;
}

.article-content a {
  color: #50a7fc;
}

.article-content li {
  color: #a612ff;
  font-size: 16px;
  padding: 5px;
  margin-left: 40px;
}

.article-detail-title h1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: #000;
}

.article-content p,
.article-content ul {
  line-height: 24px;
  color: #1c1c1c;
  font-size: 16px;
  padding: 5px 0;
}

.article-content h1 {
  color: #000000;
  line-height: 30px;
  font-size: 22px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.article-content h2 {
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 20px;
  color: #2a2a2a;
}

.article-content h3 {
  dpadding-top: 10px;
  padding-bottom: 10px;
  font-size: 18px;
  color: #2f2f2f;
}

.article-content table td {
  padding: 0;
  width: 86px;
  vertical-align: middle;
  background: #fdfcf8 no-repeat center;
  border: 1px solid #ddd;
}

.article-content table th {
  padding: 0;
  height: 36px;
  vertical-align: middle;
  text-align: center;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

.article-content table {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  width: 100%;
  border-collapse: collapse;
}

.article-content {
  margin-top: 20px;
}

.article-content img {
  max-width: 740px;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.15) 0 0 6px;
  cursor: zoom-in;
  display: block;
  margin: 10px auto;
}

.article-labels .el-tag {
  margin-right: 10px;
  cursor: pointer;
}

.article-labels {
  margin-left: 34px;
  margin-top: 10px;
  padding-bottom: 10px;
}

.article-info .user-name {
  font-weight: 600;
}

.article-info {
  padding-left: 20px;
  margin-top: 20px;
}

.article-info span {
  line-height: 32px;
  font-size: 16px;
  color: #737f90;
}

.article-info img {
  width: 24px;
  margin-right: 5px;
  height: 24px;
  border-radius: 50%;
  vertical-align: middle;
}

.article-content-box {
  background: #fff;
  margin-bottom: 12px;
  padding: 16px;
}

.article-left-part {
  margin-right: 20px;
  width: 820px;
}

.article-right-part {
  width: 300px;
}

.article-box {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
