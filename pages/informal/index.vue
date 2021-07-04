<!--<template>-->
<!--  <div>-->
<!--    <div class="informal-left-part">-->
<!--      <div class="article-content-box default-border-radius">-->
<!--        <div class="comment-input-header">-->
<!--          随笔-->
<!--        </div>-->
<!--        <div class="message-info-list">-->
<!--          <div class="my-reply">-->
<!--            <el-avatar class="header-img" :size="40" :src="''"></el-avatar>-->
<!--            <div class="reply-info" >-->
<!--              <div-->
<!--                tabindex="0"-->
<!--                contenteditable="true"-->
<!--                v-model="messages.content"-->
<!--                spellcheck="false"-->
<!--                placeholder="输入留言..."-->
<!--                class="reply-input"-->
<!--               >-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="reply-btn-box">-->
<!--              <el-button class="reply-btn" size="medium" @click="sendMessage" type="primary">发表评论</el-button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        </div>-->

<!--      &lt;!&ndash;留言列表&ndash;&gt;-->
<!--        <div class="article-content-box-list default-border-radius">-->
<!--          <div class="article-content-box-1">-->
<!--            <div class="comment-input-header">-->
<!--              留言列表-->
<!--            </div>-->
<!--            <div v-for="(item,index1) in messages" :key="index1" class="author-title reply-father">-->
<!--              <el-avatar class="header-img" :size="40" :src="item.headImg"></el-avatar>-->
<!--              <div class="author-info">-->
<!--                <span class="author-name">{{item.name}}</span>-->
<!--                <span class="author-time">{{item.time}}</span>-->
<!--              </div>-->
<!--              <div class="icon-btn">-->
<!--        <span @click="showReplyInput(index1,item.name,item.id)">-->
<!--          <i class="iconfont el-icon-s-comment">-->
<!--        </i>{{item.commentNum}}-->
<!--        </span>-->
<!--                <i class="iconfont el-icon-caret-top"></i>{{item.like}}-->
<!--              </div>-->
<!--              <div class="talk-box">-->
<!--                <p>-->
<!--                  <span class="reply">{{item.comment}}</span>-->
<!--                </p>-->
<!--              </div>-->
<!--              <div class="reply-box">-->
<!--                <div v-for="(reply,index2) in item.reply" :key="index2" class="author-title">-->
<!--                  <el-avatar class="header-img" :size="40" :src="reply.fromHeadImg"></el-avatar>-->
<!--                  <div class="author-info">-->
<!--                    <span class="author-name">{{reply.from}}</span>-->
<!--                    <span class="author-time">{{reply.time}}</span>-->
<!--                  </div>-->
<!--                  <div class="icon-btn">-->
<!--            <span @click="showReplyInput(index1,reply.from,reply.id)"><i class="iconfont el-icon-s-comment">-->

<!--            </i>{{reply.commentNum}}-->
<!--            </span>-->
<!--                    <i class="iconfont el-icon-caret-top"></i>{{reply.like}}-->
<!--                  </div>-->
<!--                  <div class="talk-box">-->
<!--                    <p>-->
<!--                      <span>回复 {{reply.to}}:</span>-->
<!--                      <span class="reply">{{reply.comment}}</span>-->
<!--                    </p>-->
<!--                  </div>-->
<!--                  <div class="reply-box">-->

<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div  v-show="_inputShow(index1)" class="my-reply my-comment-reply">-->
<!--                <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>-->
<!--                <div class="reply-info" >-->
<!--                  <div tabindex="0" contenteditable="true" spellcheck="false" placeholder="输入评论..."   @input="onDivInput($event)"  class="reply-input reply-comment-input"></div>-->
<!--                </div>-->
<!--                <div class=" reply-btn-box">-->
<!--                  <el-button class="reply-btn" size="medium" @click="sendCommentReply(index1,index2)" type="primary">发表评论</el-button>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--    </div>-->

<!--  </div>-->
<!--</template>-->


<!--<script>-->
<!--  import * as api from '../../api/api';-->
<!--  export default {-->
<!--    async asyncData() {-->
<!--      let messageResultList = await api.getListMessage();-->
<!--      return {-->
<!--        messageResultList: messageResultList.data-->
<!--      }-->
<!--    },-->
<!--    data() {-->
<!--      return{-->
<!--        // btnShow: false,-->
<!--        index:'0',-->
<!--        replyMessage:'',-->
<!--        messages:[{-->
<!--            userName: '',-->
<!--            content: '',-->
<!--            sex: '',-->
<!--            email: '',-->
<!--            http: '',-->
<!--            avatar: '',-->
<!--            reply:[{-->
<!--                userName: '',-->
<!--                content: '',-->
<!--                sex: '',-->
<!--                fuUserName: '',-->
<!--                fuId: '',-->
<!--                email: '',-->
<!--                http: '',-->
<!--                avatar: ''-->
<!--              }]-->
<!--          }]-->
<!--      }-->
<!--    },-->
<!--    methods: {-->

<!--      showReplyInput(i,name,id){-->
<!--        this.messages[this.index].inputShow = false;-->
<!--        this.index =i;-->
<!--        this.messages[i].inputShow = true;-->
<!--        this.to = name;-->
<!--        this.toId = id-->
<!--      },-->
<!--      _inputShow(i){-->
<!--        return this.messages[i].inputShow-->
<!--      },-->
<!--      //留言-->
<!--      sendMessage(){-->

<!--        if (this.messages.userName === '') {-->
<!--          this.$message.error("你的名字不可为空噢！");-->
<!--          return;-->
<!--        }-->
<!--        if (this.messages.email === '') {-->
<!--          this.$message.error("邮箱地址不可为空噢！");-->
<!--          return;-->
<!--        }-->
<!--        if (this.messages.content === '') {-->
<!--          this.$message.error("留言内容不可为空噢！");-->
<!--          return;-->
<!--        }-->
<!--        api.postMessage(this.ChildMessage).then(result => {-->
<!--          this.loading = false;-->
<!--          if (result.code === api.success_code) {-->
<!--            this.showSuccess("留言成功，已经通知博主");-->
<!--            this.messageList();-->
<!--            this.resetDataChildMessage();-->
<!--            this.gotoPart2();-->
<!--          }-->
<!--        })-->


<!--      },-->
<!--      sendCommentReply(i,j){-->
<!--        if(!this.replyMessage){-->
<!--          this.$message({-->
<!--            showClose: true,-->
<!--            type:'warning',-->
<!--            message:'评论不能为空'-->
<!--          })-->
<!--        }else{-->
<!--          let a ={};-->
<!--          let timeNow = new Date().getTime();-->
<!--          let time= this.dateStr(timeNow);-->
<!--          a.from= this.myName;-->
<!--          a.to = this.to;-->
<!--          a.fromHeadImg = this.myHeader;-->
<!--          a.messages =this.replyMessage;-->
<!--          a.time = time;-->
<!--          a.commentNum = 0;-->
<!--          a.like = 0;-->
<!--          this.messages[i].reply.push(a);-->
<!--          this.replyMessage = '';-->
<!--          document.getElementsByClassName("reply-comment-input")[i].innerHTML = ""-->
<!--        }-->
<!--      },-->
<!--      onDivInput: function(e) {-->
<!--        this.replyMessage = e.target.innerHTML;-->
<!--      },-->
<!--      dateStr(date){-->
<!--        //获取js 时间戳-->
<!--        var time=new Date().getTime();-->
<!--        //去掉 js 时间戳后三位，与php 时间戳保持一致-->
<!--        time=parseInt((time-date)/1000);-->
<!--        //存储转换值-->
<!--        var s;-->
<!--        if(time<60*10){//十分钟内-->
<!--          return '刚刚';-->
<!--        }else if((time<60*60)&&(time>=60*10)){-->
<!--          //超过十分钟少于1小时-->
<!--          s = Math.floor(time/60);-->
<!--          return  s+"分钟前";-->
<!--        }else if((time<60*60*24)&&(time>=60*60)){-->
<!--          //超过1小时少于24小时-->
<!--          s = Math.floor(time/60/60);-->
<!--          return  s+"小时前";-->
<!--        }else if((time<60*60*24*30)&&(time>=60*60*24)){-->
<!--          //超过1天少于30天内-->
<!--          s = Math.floor(time/60/60/24);-->
<!--          return s+"天前";-->
<!--        }else{-->
<!--          //超过30天ddd-->
<!--          var date= new Date(parseInt(date));-->
<!--          return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--  }-->
<!--</script>-->
<!--<style>-->

<!--  .article-content-box {-->
<!--    margin-top: 20px;-->
<!--    background: #fff;-->
<!--    margin-bottom: 20px;-->
<!--    padding: 20px;-->
<!--  }-->
<!--  .article-content-box-list {-->
<!--    margin-top: 20px;-->
<!--    background: #fff;-->
<!--    margin-bottom: 20px;-->
<!--    padding: 20px;-->
<!--  }-->

<!--  .informal-left-part {-->
<!--    margin-right: 20px;-->
<!--    width: 1140px;-->
<!--  }-->
<!--  .article-content-box-1 {-->
<!--    background: #fff;-->
<!--    margin-top: 20px;-->
<!--    margin-right: 20px;-->
<!--  }-->

<!--  .message-info-list {-->
<!--    background: #fff;-->
<!--    margin-top: 20px;-->
<!--    margin-right: 20px;-->
<!--  }-->

<!--  .my-reply {-->
<!--    margin-top: 20px;-->
<!--    padding: 10px;-->
<!--    background-color: #fafbfc;-->
<!--  }-->

<!--    .header-img{-->
<!--      display: inline-block;-->
<!--      vertical-align: top;-->
<!--    }-->

<!--    .reply-info{-->
<!--      display: inline-block;-->
<!--      margin-left: 5px;-->
<!--      width: 90%;-->
<!--      @media: screen and (max-width:1200px) {-->
<!--      width: 80%;-->
<!--    }-->
<!--      }-->

<!--      .reply-input{-->
<!--        min-height: 20px;-->
<!--        line-height: 22px;-->
<!--        padding: 10px 10px;-->
<!--        color: #ccc;-->
<!--        background-color: #fff;-->
<!--        border-radius: 5px;-->
<!--        /*&:empty:before*/-->
<!--        /*content: attr(placeholder);*/-->
<!--        /*&:focus:before*/-->
<!--        /*content: none;*/-->
<!--        /*&:focus;*/-->
<!--        padding: 8px 8px;-->
<!--        border: 2px solid blue;-->
<!--        box-shadow: none;-->
<!--        outline: none;-->
<!--      }-->

<!--    .reply-btn-box{-->
<!--      height: 25px;-->
<!--      margin: 10px 0;-->
<!--    }-->

<!--      .reply-btn{-->
<!--        position: relative;-->
<!--        float: right;-->
<!--        margin-right :15px;-->
<!--      }-->

<!--  .my-comment-reply{-->
<!--    margin-left: 50px;   }-->

<!--    .reply-input{-->
<!--      }-->

<!--  .author-title:not(:last-child){-->
<!--        border-bottom: 1px solid rgba(178,186,194,.3);-->
<!--      }-->

<!--  .author-title{-->
<!--    padding: 10px;-->
<!--  }-->

<!--    .header-img{-->
<!--      display: inline-block;-->
<!--      vertical-align: top;-->
<!--    }-->

<!--    .author-info{-->
<!--      display: inline-block;-->
<!--      margin-left: 5px;-->
<!--      width: 60%;-->
<!--      height: 40px;-->
<!--      line-height: 20px;-->
<!--    }-->

<!--  .author-info span{-->
<!--        display: block;-->
<!--        cursor: pointer;-->
<!--        overflow: hidden;-->
<!--        white-space: nowrap;-->
<!--        text-overflow: ellipsis;-->
<!--      }-->

<!--      .author-name{-->
<!--        color: #000;-->
<!--        font-size: 18px;-->
<!--        font-weight: bold;-->
<!--      }-->

<!--      .author-time{-->
<!--        font-size: 14px;-->
<!--      }-->

<!--    .icon-btn{-->
<!--      width: 30%;-->
<!--      padding: 0 !important;-->
<!--      float: right;-->
<!--      @media screen and (max-width : 1200px){-->
<!--        width: 20%;-->
<!--        padding: 7px;-->
<!--      }-->
<!--    }-->

<!--  .icon-btn span{-->
<!--    cursor: pointer;-->
<!--  }-->

<!--      .iconfont{-->
<!--        margin: 0 5px;-->
<!--      }-->

<!--    .talk-box{-->
<!--      margin: 0 50px;-->
<!--    }-->
<!--  .talk-box p{-->
<!--    margin: 0;-->
<!--  }-->

<!--      .reply{-->
<!--        font-size: 16px;-->
<!--        color: #000;-->
<!--      }-->

<!--    .reply-box{-->
<!--              margin: 10px 0 0 50px;-->
<!--              background-color: #efefef;-->
<!--            }-->

<!--</style>-->

