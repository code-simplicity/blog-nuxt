<template>
  <div class="message-box">
    <div class="content-box clear-fix">
      <div class="message-part-1 clear-fix">
        <div class="message-title-box">
          <p style="font-family: 华文行楷">
            您想对本是人间红尘客说点什么吗
          </p>
        </div>
      </div>
      <div class="message-input-box-content">
        <div class="message-input-title">
          发表留言
        </div>
        <div class="message-input-userinfo ">
          <el-input
            @focus="checkLogin"
            placeholder="*请输入昵称"
            v-model="message.userName"
          ></el-input>
          <el-input
            @focus="checkLogin"
            placeholder="*请输入邮箱"
            v-model="message.email"
          ></el-input>
          <el-input
            placeholder="您的链接地址(选填),如https://www.bugdr.cn"
            v-model="message.http"
          ></el-input>
        </div>

        <div class="message-input-content">
          <el-input
            @focus="checkLogin"
            rows="4"
            type="textarea"
            v-model="message.content"
            placeholder="写一点好听的吧(づ￣ 3￣)づ"
            maxlength="256"
            show-word-limit
          >
          </el-input>
          <div class="message-input-submit">
            <el-button type="primary" @click="postMessage">
              提交留言
            </el-button>
          </div>
        </div>
      </div>

      <!--      留言模块-->
      <div class="message-list-content-box" id="message-list-content-box">
        <div class="message-list-count">
          <p>
            (づ￣ 3￣)づ您一共收到<span> {{ messageReplyNumber }} </span>条留言
            (づ￣ 3￣)づ
          </p>
        </div>
        <div
          class="message-input-box"
          v-for="(item, index) in messageRes"
          :key="index"
        >
          <div class="message-parent-box">
            <div class="message-user-info">
              <a :href="item.http" target="_blank">
                <img :src="item.avatar" />
                <span class="user-name">{{ item.userName }}</span></a
              >
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
            <div class="message-content">
              <a>{{ item.content }}</a>
              <i
                ><span
                  class="el-icon-chat-dot-round"
                  @click="FuReplyButton(index, item.userName)"
                ></span
              ></i>
            </div>
            <div
              class="message-sub-box"
              style="display: none;"
              :id="'sub_input_' + index"
            >
              <div class="message-input-userinfo">
                <el-input
                  @focus="checkLogin"
                  placeholder="*请输入昵称"
                  v-model="subMessage.userName"
                ></el-input>
                <el-input
                  placeholder="*请输入邮箱"
                  v-model="subMessage.email"
                ></el-input>
                <el-input
                  placeholder="您的链接地址(选填)"
                  v-model="subMessage.http"
                ></el-input>
              </div>
              <div class="message-input-content">
                <el-input
                  @focus="checkLogin"
                  rows="4"
                  type="textarea"
                  :placeholder="subMessagePlaceholder"
                  v-model="subMessage.content"
                  maxlength="256"
                  show-word-limit
                >
                </el-input>
              </div>
              <div class="message-input-submit-1">
                <el-button
                  type="primary"
                  @click="
                    doCommitMessageReply(item.id, item.userName, item.email)
                  "
                >
                  回复</el-button
                >
              </div>
            </div>
          </div>
          <div
            class="message-child-box"
            v-for="(item1, index1) in messageReplyRes"
            :key="index1"
            v-if="item.id === item1.parentId"
          >
            <div class="message-user-info">
              <a :href="item1.http" target="_blank">
                <img :src="item1.avatar" />
                <span class="user-name">{{ item1.userName }}</span></a
              >
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
            <div class="message-child-content">
              <span>{{ item1.content }}</span>
              <i
                ><span
                  class="el-icon-chat-dot-round"
                  @click="replyChildMessage(index1, item1.userName)"
                ></span
              ></i>
            </div>
            <div
              class="message-sub-comment-box"
              style="display: none;"
              :id="'sub_input_child_' + index1"
            >
              <div class="message-child-input-userinfo">
                <el-input
                  @focus="checkLogin"
                  placeholder="*请输入昵称"
                  v-model="subMessage.userName"
                ></el-input>
                <el-input
                  placeholder="*请输入邮箱"
                  v-model="subMessage.email"
                ></el-input>
                <el-input
                  placeholder="您的链接地址(选填),如http://www.bugdr.cn"
                  v-model="subMessage.http"
                ></el-input>
              </div>
              <div class="message-child-input-content">
                <el-input
                  @focus="checkLogin"
                  rows="4"
                  type="textarea"
                  :placeholder="subMessagePlaceholder"
                  v-model="subMessage.content"
                  maxlength="256"
                  show-word-limit
                >
                </el-input>
              </div>
              <div class="message-child-input-submit">
                <el-button
                  type="primary"
                  @click="
                    doCommitMessageReply(item.id, item.userName, item.email)
                  "
                >
                  留言</el-button
                >
              </div>
            </div>
          </div>
          <hr />
        </div>
        <div class="message-navigation-bar">
          <el-pagination
            class="message-list-page-navigation-bar"
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
    </div>
  </div>
</template>

<script>
import * as api from "../../api/api";
import { success_code } from "../../api/api";

let lastInputBox = null;
export default {
  head() {
    return {
      title: "本是人间红尘客-留言",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "本是人间红尘客-留言"
        },
        {
          hid: "keywords",
          name: "keywords",
          content: "本是人间红尘客,Java,android,开发,毕业设计,博客系统,程序员"
        }
      ]
    };
  },

  async asyncData({ params }) {
    //加载第一页评论
    let messageResult = await api.getMessageList(1, 10);
    let messageReplyResult = await api.getMessageReplyList(1, 100);

    let pageNavigation = {
      currentPage: messageResult.data.currentPage,
      totalCount: messageResult.data.totalElements,
      pageSize: messageResult.data.pageSize
    };
    return {
      pageNavigation: pageNavigation,
      messageRes: messageResult.data.content,
      messageReplyRes: messageReplyResult.data.content
    };
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      messageNumber: "",
      messageReplyNumber: "",
      subMessagePlaceholder: "请文明回复",
      loading: false,
      dialogVisible: false,
      message: {
        userId: "",
        userName: "",
        content: "",
        email: "",
        http: "",
        avatar: ""
      },
      subMessage: {
        userId: "",
        userName: "",
        content: "",
        parentUserName: "",
        parentId: "",
        email: "",
        http: "",
        avatar: ""
      }
    };
  },
  methods: {
    onPageChange(page) {
      this.getMessage(page);
      let messageList = document.getElementById("message-list-content-box");
      if (messageList) {
        messageList.scrollIntoView({
          block: "start",
          behavior: "smooth"
        });
      }
    },

    doCommitMessageReply(id, name, email) {
      //检查数据是否为空
      this.checkLogin();
      if (this.subMessage.content === "") {
        this.$message.error("您还没有写评论啊哦o(╥﹏╥)o");
        return;
      }
      this.subMessage.parentId = id;
      this.subMessage.parentUserName = name;
      this.subMessage.email = email;
      //校验邮箱格式
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      if (!reg.test(this.subMessage.email)) {
        this.$message.error("邮箱格式错误");
        return;
      }
      api.postMessageReply(this.subMessage).then(result => {
        if (result.code === success_code) {
          this.$message.success(result.message);
          this.getMessageReply();
          this.resetMessage();
          this.getMessageReplyCount();
        } else {
          this.$message.error(result.message);
        }
      });
    },

    resetMessage() {
      this.message.content = "";
      this.message.userName = "";
      this.message.email = "";
      this.message.avatar = "";
      this.subMessage.userName = "";
      this.subMessage.email = "";
      this.subMessage.avatar = "";
      if (lastInputBox) {
        lastInputBox.style.display = "none";
      }
    },

    //提交回复按钮
    replyChildNewComment(index, userName) {
      this.checkLogin();
      let subInputBox = document.getElementById("sub_input_child_" + index);
      this.subMessage.content = "";
      this.subMessagePlaceholder = "回复@" + userName;
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
          //跳转登录界面
          // location.href = "/login?redirect=" + location.href;
          this.comment.userName = result.data.userName;
          this.comment.avatar = result.data.avatar;
        }
        // if (result.data.roles === 'role_admin') {
        //   this.subComment.isAdmin = '1';
        // } else {
        //   this.subComment.isAdmin = '0';
        // }
      });
    },

    replyChildMessage(index, userName) {
      this.checkLogin();
      let subInputBox = document.getElementById("sub_input_child_" + index);
      this.subMessage.content = "";
      this.subCommentPlaceholder = "回复@" + userName;
      if (subInputBox) {
        if (lastInputBox) {
          lastInputBox.style.display = "none";
        }
        lastInputBox = subInputBox;
        subInputBox.style.display = "block";
      }
    },

    //留言
    FuReplyButton(index, userName) {
      this.checkLogin();
      // this.checkLogin1();
      let subInputBox = document.getElementById("sub_input_" + index);
      this.subMessage.content = "";
      this.subCommentPlaceholder = "回复@" + userName;
      if (subInputBox) {
        if (lastInputBox) {
          lastInputBox.style.display = "none";
        }
        lastInputBox = subInputBox;
        subInputBox.style.display = "block";
      }
    },
    getUserInfo() {
      api.getUserInfoByToken().then(result => {
        if (result.code === api.success_code) {
          api.getUserInfo(result.data.id).then(result => {
            if (result.code === api.success_code) {
              this.message.userName = result.data.userName;
              this.message.email = result.data.email;
              this.message.avatar = result.data.avatar;
              this.subMessage.userName = result.data.userName;
              this.subMessage.email = result.data.email;
              this.subMessage.avatar = result.data.avatar;
            }
          });
        }
      });
    },
    messageList() {
      api.getMessageList().then(result => {
        if (result.code === api.success_code) {
          this.messageResultList = result.data;
        }
      });
    },
    resetDataChildMessage() {
      this.subMessage.userName = "";
      this.subMessage.content = "";
      this.subMessage.email = "";
      this.subMessage.http = "";
      this.subMessage.avatar = "";
      this.subMessage.parentId = "";
      this.subMessage.parentUserName = "";
    },
    resetData() {
      this.message.userName = "";
      this.message.content = "";
      this.message.email = "";
      this.message.http = "";
      this.message.avatar = "";
    },

    getMessageCounts() {
      api.getMessageCounts().then(result => {
        if (result.code === success_code) {
          this.messageNumber = result.data;
        }
      });
    },
    getMessageReplyCount() {
      api.getMessageReplyCount().then(result => {
        if (result.code === success_code) {
          this.messageReplyNumber = result.data;
        }
      });
    },

    getMessageReply() {
      api.getMessageReplyList(1, 20).then(result => {
        if (result.code === success_code) {
          this.messageReplyRes = result.data.content;
        }
      });
    },
    getMessage(page) {
      api.getMessageList(page, this.pageSize).then(result => {
        if (result.code === success_code) {
          this.messageRes = result.data.content;
        }
      });
    },

    postMessage() {
      if (this.message.userName === "") {
        this.$message.error("起一个昵称吧");
        return;
      }
      if (this.message.email === "") {
        this.$message.error("邮箱地址不可以为空");
        return;
      }
      //校验邮箱格式
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      if (!reg.test(this.message.email)) {
        this.$message.error("邮箱格式错误");
        return;
      }
      if (this.message.content === "") {
        this.$message.error("留言内容不可为空");
        return;
      }
      this.loading = true;
      api.postMessage(this.message).then(result => {
        this.loading = false;
        if (result.code === api.success_code) {
          this.$message.success("留言成功，已经通知博主");
          this.getMessage(1);
          let messageList = document.getElementById("message-list-content-box");
          if (messageList) {
            messageList.scrollIntoView({
              block: "start",
              behavior: "smooth"
            });
          }
          this.resetMessage();
          this.getMessageCounts();
        } else {
          this.$message.error(result.message);
        }

        this.messageList();
        this.resetData();
      });
      this.getUserInfo();
    }
  },
  mounted() {
    this.$store.commit("setCurrentActivityTab", "message");
    this.getUserInfo();
    this.getMessageCounts();
    this.getMessageReplyCount();
  }
};
</script>

<style>
.message-input-box-content {
  padding: 16px;
  background: #fff;
  margin-top: 12px;
}

hr {
  background-color: #d9d0d0;
  border: none;
  display: block;
  height: 1px;
  margin: 1em 0;
  display: block;
}

/*.message-input-box .hr {*/
/*  background-color: #fa0707;*/
/*  border: none;*/
/*  display: block;*/
/*  height: 2px;*/
/*  margin: 1.5rem 0;*/
/*}*/

.message-child-box {
  margin-left: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.message-child-content {
  font-size: 16px;
  margin-left: 60px;
}

.message-child-content i {
  font-size: 16px;
  margin-right: 60px;
  color: #2d81db;
}
.message-child-content i:hover {
  color: #f8225f;
}

.message-child-input-content .el-textarea {
  width: 910px;
  margin-left: 30px;
  margin-top: 20px;
}

.message-child-input-content {
  padding-left: 80px;
}

.message-child-input-userinfo {
  padding-left: 80px;
}
.message-child-input-userinfo .el-input {
  width: 280px;
  margin-left: 30px;
  margin-top: 20px;
  border-radius: 8px;
}

.message-child-input-userinfo .el-input .el-input__inner {
  border: 1px solid #4e65f8;
}

.message-child-input-content .el-textarea .el-textarea__inner {
  border: 1px solid #4e65f8;
}

.message-child-input-submit {
  margin-left: 950px;
  margin-top: 20px;
}

.message-list-count p {
  padding-top: 20px;
  font-size: 22px;
  font-weight: 400;
  text-align: center;
}

.message-input-submit {
  margin-left: 960px;
  margin-top: 20px;
}

.message-input-submit-1 {
  margin-left: 990px;
  margin-top: 20px;
}

.message-child-input-content .el-textarea .el-textarea__inner {
  border: 1px solid #4e65f8;
}
.message-input-content .el-textarea .el-textarea__inner {
  border: 1px solid #4e65f8;
}

.message-child-input-userinfo .el-input .el-input__inner {
  border: 1px solid #4e65f8;
}
.message-input-userinfo .el-input .el-input__inner {
  border: 1px solid #4e65f8;
}
.message-input-userinfo .el-input {
  width: 300px;
  margin-left: 50px;
  margin-top: 20px;
  border-radius: 6px;
}

.message-input-content .el-textarea {
  width: 1010px;
  margin-left: 50px;
  margin-top: 20px;
}

.message-input-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

.message-input-box {
  background: #fff;
}

.message-navigation-bar {
  text-align: center;
}

.message-navigation-bar .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: #ffffff;
}

.message-content {
  font-size: 16px;
  margin-left: 60px;
}

.message-content i {
  font-size: 14px;
  margin-right: 60px;
  color: #2d81db;
}
.message-content i:hover {
  color: #f8225f;
}

.message-child-content i {
  font-size: 20px;
  margin-right: 60px;
  color: #2d81db;
}

.message-child-content i:hover {
  color: #f8225f;
}

.el-dialog__body {
  padding: 10px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}

.message-parent-box .user-name {
  font-weight: 600;
  color: #5680ef;
  margin-left: 5px;
  display: inline-block;
  line-height: 30px;
  font-size: 16px;
}

.message-parent-box .user-name:hover {
  color: #171515;
}

.message-parent-box img {
  width: 30px;
  height: 30px;
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
}

.item-one .tag-role1 .el-tag {
  color: #fff;
}

.dialog .el-dialog {
  border-radius: 8px;
}

.message-user-info {
  color: #47494e;
  font-size: 16px;
  margin-bottom: 10px;
  margin-top: 12px;
}

.message-user-info .user-name {
  color: #5680ef;
  font-size: 16px;
}
.message-user-info .user-name:hover {
  color: #373b3b;
  font-size: 16px;
}

.message-user-info img {
  width: 30px;
  height: 30px;
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
}

.message-title-box p {
  font-weight: 600;
  font-size: 40px;
  margin-top: 5px;
}

.message-title-box {
  color: #000;
  text-align: center;
  margin: 15px 15px 15px 0px;
}

.message-box {
  margin-top: 20px;
}

.message-list-content-box {
  margin-top: 12px;
  background: #fff;
  padding: 16px;
  margin-bottom: 12px;
}

.message-part-1 {
  background: #fff;
}
</style>
