<template>
  <div class="about-box  clear-fix" id="about-box">
    <div class="about-left-part float-left" id="about-left-part">
      <el-tabs
        tab-position="left"
        v-model="target"
        @tab-click="onLeftItemClick"
      >
        <el-tab-pane label="本是人间红尘客(about)" name="about"></el-tab-pane>
        <el-tab-pane label="心情寄语(message)" name="message"></el-tab-pane>
        <el-tab-pane label="我们的愿景(vision)" name="vision"></el-tab-pane>
        <el-tab-pane label="旗下网站(websites)" name="websites"></el-tab-pane>
        <el-tab-pane label="联系我们(contacts)" name="contacts"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="about-right-part float-left" id="about-right-part">
      <div class="about-item">
        <h1 id="about">
          本是人间红尘客
        </h1>
        <p>
          总有几分钟，其中的每一秒，你都愿意拿一年去换取。
          总有几颗泪，其中的每一次抽泣，你都愿意拿满手的承诺去代替。
          总有几段场景，其中的每幅画面，你都愿意拿全部的力量去铭记。
          总有几段话，其中的每个字眼，你都愿意拿所有的夜晚去回忆。
          愿岁月可回首，佳人依旧。
        </p>
      </div>
      <div class="about-item">
        <h1 id="message">
          心情寄语
        </h1>
        <p>
          你站在桥上看风景， 看风景的人在楼上看你。 明月装饰了你的窗子，
          你装饰了别人的梦。
        </p>
      </div>
      <div class="about-item">
        <h1 id="vision">
          我们的愿景
        </h1>
        <p>
          春风与我皆过客，只留余香在肩头。
        </p>
      </div>
      <div class="about-item">
        <h1 id="websites">
          旗下网站
        </h1>
        <div class="websites">
          <ul>
            <li>
              <a href="https://www.romance-to-death.top/" target="_blank"
                >本是人间红尘客主站</a
              >
            </li>
            <li>
              <a href="https://mu.romance-to-death.top/#/home" target="_blank"
                >在线音乐网站</a
              >
            </li>
            <li>
              <a href="https://shop.romance-to-death.top/" target="_blank"
                >本是人间红尘客商城</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="about-item">
        <h1 id="contacts">
          联系我们
        </h1>
        <p class="contact">
          广告投放（来日方长）
          <br />
          商务合作（来日方长）
          <br />
          内容反馈（来日方长）
        </p>
      </div>
      <div class="about-img">
        <img src="/gongzhonghao.png" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "本是人间红尘客-关于",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "本是人间红尘客-关于"
        },
        {
          hid: "keywords",
          name: "keywords",
          content: "本是人间红尘客,java,android,开发,毕业设计,博客系统,程序员"
        }
      ]
    };
  },
  data() {
    return {
      target: "about",
      contentHeaders: [],
      isClickLeftSwitch: false
    };
  },
  methods: {
    onLeftItemClick() {
      this.isClickLeftSwitch = true;
      this.$router.push({
        path: "/about#" + this.target
      });
      // console.log(this.target);
    },
    onWindowScroll() {
      let dy = document.documentElement.scrollTop;
      let dx = document.documentElement.scrollLeft;
      let leftBox = document.getElementById("about-left-part");
      let parentBox = document.getElementById("about-box");
      if (leftBox && parentBox) {
        let parentBoxTop = parentBox.offsetTop;
        // console.log(parentBoxTop);
        if (dy > parentBoxTop) {
          leftBox.style.top = "0px";
        } else {
          leftBox.style.top = parentBoxTop - dy + "px";
        }
        //处理横向滑动
        if (dx > 0) {
          leftBox.style.left = -dx + "px";
        } else {
          leftBox.style.left = parentBox.offsetLeft + "px";
        }
      }
      if (!this.isClickLeftSwitch) {
        //处理标签的滚动范围
        for (let i = 0; i < this.contentHeaders.length - 1; i++) {
          let first = this.contentHeaders[i];
          let second = this.contentHeaders[i + 1];
          if (dy >= first.offTop && dy < second.offTop) {
            this.target = first.id;
            //console.log(this.target);
            break;
          }
        }
      } else {
        this.isClickLeftSwitch = false;
      }
      //console.log("scroll...");
      // if (dy === 0) {
      //
      // }
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onWindowScroll);
  },
  mounted() {
    //处理内容部分的H1标签距离，如果是后台获取数据
    //那就在数据获取完以后进行处理
    let rightContent = document.getElementById("about-right-part");
    let h1List = rightContent.querySelectorAll("h1");
    h1List.forEach(item => {
      this.contentHeaders.push({
        offTop: item.offsetTop,
        id: item.id
      });
      //console.log(item.id);
    });

    let that = this;
    window.onresize = function() {
      that.onWindowScroll();
    };
    window.addEventListener("scroll", this.onWindowScroll);
    this.$store.commit("setCurrentActivityTab", "about");
    this.onWindowScroll();
  }
};
</script>

<style>
.about-left-part,
.el-tabs {
  font-family: 华文行楷;
  font-size: 24px;
}

.about-item p {
  font-family: 华文行楷;
  font-size: 20px;
  color: #444444;
}

.about-item h1 {
  font-family: 华文行楷;
  color: #000000;
  font-size: 22px;
  font-weight: 600;
}

.about-box {
  /*background: #e8f3ff;*/
  margin-top: 60px;
  /* margin-bottom: 20px; */
}

.about-left-part .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0;
}

.about-item .contact {
  color: #444444;
}

.about-left-part .el-tabs__item {
  border-right: 1px dashed #e0e0e0;
  height: fit-content;
  color: #ffffff;
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 20px;
  transition: all 0.3s;
}

.about-left-part .el-tabs__nav {
  padding-right: 30px;
}

.about-left-part .el-tabs__item.is-active {
  color: #f53d3d;
  font-size: 24px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-weight: 600;
  transition: all 0.3s;
}

.about-left-part .el-tabs__item.is-active::after {
  content: " ";
  display: inline-block;
  position: absolute;
  right: -20px;
  width: 27px;
  height: 27px;
  border: 6px solid #8da8f1;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  background-color: #fff;
  -webkit-transform: scale(0.5);
  -moz-transform: scale(0.5);
  -ms-transform: scale(0.5);
  transform: scale(0.5);
}

.about-left-part .el-tabs__nav-wrap::after {
  background: rgba(0, 0, 0, 0);
}

.about-left-part .el-tabs__active-bar {
  width: 0 !important;
}

.about-left-part .el-tabs {
  text-align: right;
}

.about-item .websites a {
  color: #8da8f1;
}

.about-item .websites {
  margin-left: 20px;
}

.about-left-part .el-tabs--left .el-tabs__header.is-left {
  float: none;
}

.about-left-part {
  /*1140 - 300 == > 840px*/
  padding-top: 80px;
  width: 320px;
  min-height: 300px;
  position: fixed;
}

.about-item {
  background: #fff;
  padding: 16px;
  box-shadow: 2px 2px 2px #000000;
}

.about-right-part .about-item {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
  font-size: 16px;
}

.about-right-part .about-img {
  margin-bottom: 60px;
}

.about-right-part .about-img img {
  width: 100%;
  border-radius: 4px;
  box-shadow: 2px 2px 2px #000;
}

.about-right-part h1 {
  margin-bottom: 20px;
}

.about-right-part {
  /*background: #e8f3ff;*/
  padding: 20px 20px 20px 20px;
  width: 710px;
  margin-left: 300px;
  display: absolute;
}
</style>
