<template>
<div id="blog-style">
  <div id="blog-header" class="blog-header clear-fix">
      <div class="logo-box float-left">
        <div class="logo">
          <a href="/">
            <h1>本是人间红尘客</h1>
          </a>
        </div>
      </div>
      <div
        id="login-tips-text-box"
        style="display: none"
        class="login-tips-text-box float-right"
      >
        <span>
          <a :href="'/login' + redirectPath"
            ><i class="sob_blog sobfingermap"></i> 登陆</a
          >
        </span>
        <span>
          <a href="/register"><i class="sob_blog sobmembers-add"></i> 注册</a>
        </span>
      </div>
      <div
        id="user-info-box"
        style="display: none"
        class="user-info-box float-right"
      >
        <div class="header-user-avatar float-left">
          <img
            v-if="userInfo !== null"
            style="object-fit: cover"
            :src="userInfo.avatar"
          />
        </div>
        <div class="header-user-username float-left" v-if="userInfo !== null">
          <el-dropdown @command="handlerCommand">
            <span class="el-dropdown-link">
              {{ userInfo.userName }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">用户信息</el-dropdown-item>
              <el-dropdown-item
                command="adminCenter"
                v-if="userInfo.roles === 'role_admin'"
                >管理中心</el-dropdown-item
              >
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="navigation-box float-left">
        <NuxtLink to="/">
          <span
            :class="
              $store.state.currentActivityTab === 'index'
                ? 'header-title-activity'
                : ''
            "
            ><i class="sob_blog sobhome"></i> 首页</span
          >
        </NuxtLink>
        <!--      <NuxtLink to="/informal">-->
        <!--        <span :class="$store.state.currentActivityTab ==='informal'?'header-title-activity':''"><i-->
        <!--          class="el-icon-edit-outline"></i> 随笔</span>-->
        <!--      </NuxtLink>-->
        <NuxtLink to="/message">
          <span
            :class="
              $store.state.currentActivityTab === 'message'
                ? 'header-title-activity'
                : ''
            "
            ><i class="el-icon-chat-dot-round"></i> 留言</span
          >
        </NuxtLink>
        <NuxtLink to="/about">
          <span
            :class="
              $store.state.currentActivityTab === 'about'
                ? 'header-title-activity'
                : ''
            "
            ><i class="sob_blog sobabout_line"></i> 关于</span
          >
        </NuxtLink>
        <NuxtLink to="/link">
          <span
            :class="
              $store.state.currentActivityTab === 'link'
                ? 'header-title-activity'
                : ''
            "
            ><i class="sob_blog soblink"></i> 友链</span
          >
        </NuxtLink>
        <span
          :class="
            $store.state.currentActivityTab === 'shop'
              ? 'header-title-activity'
              : ''
          "
          <a href="https://shop.romance-to-death.top/" target="_blank"> 
          <i class="el-icon-shopping-cart-full"></i> 商城
          </a>
            
        </span>
      </div>
    </div>
  <div id="blog-box">
    <Nuxt />
    <div class="blog-footer">
      <div class="copy-right-box">
        <p>
          Copyright ©
          <a href="https://www.romance-to-death.top/" target="_blank">
            本是人间红尘客
          </a>
          (2021-2022) 本网站由"本是人间红尘客"驱动
        </p>
      </div>
      <div>
        <div class="keep-on-record clear-fix">
          <div class="float-left">
            <a href="http://beian.miit.gov.cn/" target="_blank"
              >黔ICP备2021002417号-2</a
            >
          </div>
          <!--          <div class="float-left" style="margin-left: 10px;margin-right: 5px">-->
          <!--            <img src="/beian.png">-->
          <!--          </div>-->
          <!--          <div class="float-left">-->
          <!--            <a style="margin-left: 4px;" target="_blank"-->
          <!--               href="http://www.beian.gov.cn/portal/registerSystemInfo">黔公网安备</a>-->
          <!--          </div>-->
        </div>
        <p style="margin-bottom: 5px">{{ operationTime }}</p>
      </div>

      <div class="bottom-link">
        <span>
          <a href="/about" target="_blank">关于我们</a>
        </span>
        |
        <span>
          <a href="/about#contacts" target="_blank">联系我们</a>
        </span>
        |
        <span>
          <a href="/link" target="_blank">友情链接</a>
        </span>
      </div>
    </div>
    <div id="g-to-top" class="g-to-top" style="display: none" @click="toTop">
      <img src="/rocket_top.png" />
    </div>
  </div>
</div>
  
</template>
<script>
import * as api from "../api/api";
export default {
  data() {
    return {
      timer: "",
      formatDateTime: "",
      redirectPath: "",
      userInfo: null,
      operationTime: ""
    };
  },
  methods: {
    getDuringTime() {
      //建站日期
      let createTime = new Date("02/20/2021");
      //当前时间
      let startYear = createTime.getFullYear(); //开始年份
      let startMonth = createTime.getMonth() + 1; //开始月份
      let startDay = createTime.getDate(); //开始日期
      let startMiao = createTime.getTime();
      let currentTime = new Date();
      let endYear = currentTime.getFullYear(); //结束年份
      let endMonth = currentTime.getMonth() + 1; //结束月份
      let endDay = currentTime.getDate(); //结束日期
      let endMiao = currentTime.getTime();
      let years = 0;
      let months = endMonth - startMonth + (endYear - startYear) * 12; //总月
      if (endDay < startDay) {
        months--; //如果结束日期<输入日期，月数要-1
      }
      years = Math.floor(months / 12); //取整计算年数
      //console.log(years+"年份")
      months = months % 12; //取余计算月数
      //console.log(months+"月份")
      let days = Math.floor(
        ((endMiao - createTime.getTime()) / 24 / 60 / 60 / 1000) % 30
      ); //计算天数
      let chaTime = endMiao - startMiao;
      //计算出小时数
      let yu = chaTime % (24 * 3600 * 1000); //86400000
      let hour = Math.floor(yu / (3600 * 1000)); //3600000
      //计算相差分钟数
      let yuH = chaTime % (3600 * 1000);
      let min = Math.floor(yuH / (60 * 1000)); //60000
      //计算相差秒数
      let yuM = chaTime % (60 * 1000);
      let sec = Math.floor(yuM / 1000); //1000
      let chastr =
        "本网站运行时长： " +
        years +
        "年" +
        months +
        "个月" +
        days +
        "天 " +
        hour +
        "个小时" +
        min +
        "分" +
        sec +
        "秒";
      return chastr;
    },

    toTop() {
      document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    onWindowScroll() {
      let offTop = document.documentElement.scrollTop;
      let toTopBox = document.getElementById("g-to-top");
      if (offTop > 500) {
        toTopBox.style.display = "block";
      } else {
        toTopBox.style.display = "none";
      }
    },
    handlerCommand(command) {
      if (command === "logout") {
        api.doLogout().then(result => {
          if (result.code === api.success_code) {
            //跳转到登录页面
            location.href = "/login";
          }
        });
      } else if (command === "adminCenter") {
        location.href = "http://mp.romance-to-death.top/#/index";
        // location.href = 'https://mp.romance-to-death.top/#/index'
      } else if (command === "userInfo") {
        location.href = "/userInfo/" + this.userInfo.id;
      }
    },
    checkToken() {
      api.checkToken().then(result => {
        let loginTips = document.getElementById("login-tips-text-box");
        let userInfoBox = document.getElementById("user-info-box");
        if (result.code === api.success_code) {
          //获取成功
          this.userInfo = result.data;
          //拿到id以后，通过状态树共享，跟其他组件共享
          this.$store.commit("setCurrentUserId", this.userInfo.id);
          //console.log(this.$store.state.currentUserId);
          // console.log(userInfoBox);
          if (userInfoBox) {
            // console.log('show user info box....');
            userInfoBox.style.display = "block";
          }
        } else {
          if (loginTips) {
            //控制顶部登录提示的显示
            loginTips.style.display = "block";
          }
        }
      });
    }
  },

  // 注意在vue实例销毁前，清除我们的定时器
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onWindowScroll);
  },
  mounted() {
    // this.intBg = Math.floor(Math.random() * 11);
    window.addEventListener("scroll", this.onWindowScroll);
    // console.log(this.$store.state.currentActivityTab);
    // this.$store.commit("setCurrentActivityTab", "about");
    // console.log(this.$store.state.currentActivityTab);
    //console.log(this.$route.path);
    if (
      this.redirectPath !== "?redirect=" + location.href &&
      this.$route.path !== "/" &&
      this.$route.path !== "/login" &&
      this.$route.path !== "/register" &&
      this.$route.path !== "/forget"
    ) {
      //排除一些特殊的，比如说登录
      //比如说首页
      this.redirectPath = "?redirect=" + location.href;
    }
    this.checkToken();
    this.getDuringTime();
    let _this = this;
    this.timer = setInterval(function () {
      _this.operationTime = _this.getDuringTime();
    }, 1000);
  }
};
</script>

<style>
.keep-on-record {
  /*padding-top: 10px;*/
  display: inline-block;
  margin-bottom: 10px;
}

.keep-on-record p {
  margin-bottom: 10px;
}

.keep-on-record a {
  color: #ffffff;
}

.keep-on-record a:hover {
  color: #000000;
}

.g-to-top {
  border-radius: 50%;
}

#g-to-top {
  cursor: pointer;
  position: fixed;
  right: 0;
  text-align: center;
  bottom: 50px;

  /*border: 1px solid #7f828b;*/
  /*padding: 0 10px 5px 10px;*/
  /*border-radius: 4px;*/
  /*cursor: pointer;*/
  /*position: fixed;*/
  /*right: 20px;*/
  /*text-align: center;*/
  /*bottom: 200px;*/
}

.bottom-link a:hover {
  color: #fc0012;
}

.bottom-link a {
  margin-top: 10px;
  color: #6aff00;
}

.bottom-link {
  margin-top: 10px;
}

.header-title-activity {
  color: #000000 !important;
}

.header-user-username span {
  font-weight: 600;
  cursor: pointer;
  color: #517cc5;
}

.header-user-avatar {
  margin-right: 10px;
}

.header-user-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
}

.el-message {
  min-width: 0 !important;
}

.el-carousel__button {
  height: 8px;
  width: 8px;
  border-radius: 30%;
}

h1 {
  color: #424344;
  font-size: 24px;
  font-weight: 600;
}

.default-border-radius {
  border-radius: 4px;
}
.navigation-box span:hover,
.login-tips-text-box span:hover {
  color: #ff8873;
}
.navigation-box a:hover,
.login-tips-text-box span:hover {
  color: #ff8873;
}
.navigation-box span {
  color: #003cff;
  margin-right: 16px;
  font-size: 18px;
  cursor: pointer;
}

.navigation-box a {
  color: #003cff;
  margin-right: 40px;
  font-size: 18px;
  cursor: pointer;
}

.navigation-box i {
  font-size: 18px;
  font-weight: 600;
}

.navigation-box {
  position: absolute;
  left: 400px;
}

.login-tips-text-box a:hover {
  color: #cd2916;
}
.login-tips-text-box a {
  font-size: 17px;
  margin-right: 10px;
}
.login-tips-text-box {
  color: #6d93ff;
}

.logo-box {
  margin-left: 10px;
}

.logo-box h1 {
  font-family: 华文行楷;
  color: #000000;
  font-size: 26px;
  font-weight: 600;
  margin-left: 20px;
}

.logo-box .logo {
  color: #464646;
  font-size: 22px;
  font-weight: 600;
}

* {
  padding: 0;
  margin: 0;
}

a {
  text-decoration: none;
}

body {
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 100%;
  background-image: url('https://w.wallhaven.cc/full/rd/wallhaven-rddgwm.jpg');
  width: 100%;
}

.copy-right-box {
  margin-bottom: 20px;
}

.copy-right-box p {
  color: #fff;
}
.copy-right-box a {
  color: #00ff85;
}
.copy-right-box a:hover {
  color: #ff0000;
}

.blog-footer {
  font-size: 16px;
  color: #ffffff;
  padding-bottom: 30px;
  text-align: center;
}

.blog-header {
  position: fixed;
  line-height: 30px;
  background: #ffffff;
  padding: 10px 0;
  width: 100%;
  top: 0;
  z-index: 99;
}

#blog-box {
  width: 1140px;
  margin: 0 auto;
  margin-top: 60px;
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}

.clear-fix {
  overflow: hidden;
  zoom: 1;
}

#blog-style {
  width: 100%;
}

/* —滚动条默认显示样式– */
::-webkit-scrollbar {
  width: 4px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #000;
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #fff;
}
</style>
