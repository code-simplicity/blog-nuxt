<template>
    <div class="settings-email-box">
      <div class="setting-email-text">
        <span class="update-email">修改邮箱</span>
      </div>
      <div class="setting-email-container">
        <el-form label-width="100px" size="medium">
          <el-form-item
            label="新邮箱地址" required>
            <el-input v-model="newEmail"></el-input>
            <el-button v-if="!isCountDowning" type="primary" @click="getVerifyCode"
                       class="email-get-verify-code-btn">获取验证码
            </el-button>
            <el-button v-else type="primary" @click="getVerifyCode" class="email-get-verify-code-btn" disabled>
              {{countDownText}}
            </el-button>
          </el-form-item>
          <el-form-item
            label="人类验证码" required>
            <el-input v-model="captchaCode" placeholder="请输入右侧验证码"></el-input>
            <img
              :src="captchaPath"
              @click="updateVerifyCode" class="captcha-code">
          </el-form-item>
          <el-form-item
            label="邮箱验证码" required>
            <el-input v-model="verifyCode"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateEmailAddress">修改邮箱</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>
<script>
    import * as api from '../../api/api';

    export default {
      head() {
        return {
          title: '本是人间红尘客-修改邮箱',
          meta: [
            {
              hid: 'description',
              name: 'description',
              content: '本是人间红尘客,修改邮箱'
            },
            {
              hid: 'keywords',
              name: 'keywords',
              content: '本是人间红尘客,java,android,开发,毕业设计,博客系统,程序员'
            }
          ]
        }
      },
      data() {
        return {
          newEmail: '',
          isCountDowning: false,
          verifyCode: '', countDownText: '重新发送(60)',
          captchaCode: '',
          captchaPath: '/user/captcha',
        }
        },
      methods: {
        updateVerifyCode() {
          this.captchaPath = '/user/captcha' + "?random=" + Date.parse(new Date());
          //console.log(this.captchaPath);
          },
        getVerifyCode() {
          //第一步：校验邮箱格式是否正确
          let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
          if (!reg.test(this.newEmail)) {
            this.$message.error('邮箱格式错误');
            return
          }
          //this.$message.success('邮箱地址正确');
          //第三步：发起请求，获取验证码
          api.sendEmailCode(this.captchaCode,this.newEmail, 'update').then(result => {
            if (result.code === api.success_code) {
              this.startCountDown();
              this.$message.success(result.message);
            } else {
              this.$message.error(result.message);
            }
          });
        },
        startCountDown() {
          let time = 60;
          this.isCountDowning = true;
          let that = this;
          let interval = setInterval(function () {
            //执行倒计时内容
            time--;
            if (time <= 0) {
              that.isCountDowning = false;
              clearInterval(interval);
            }
            that.countDownText = '重新发送(' + time + ')';
            // console.log('倒计时 == >  ' + time + '  ' + that.countDownText);
          }, 1000);
            },
        updateEmailAddress() {
          //内容校验
          if (this.newEmail === '') {
            this.$message.error('邮箱地址不可以为空');
            return;
          }
          if (this.captchaCode === '') {
            this.$message.error("证明一下你是人类");return;
          }
          if (this.verifyCode === '') {
            this.$message.error('邮箱验证码不可以为空');
            return;
          }
          api.updateEmailAddress(this.newEmail, this.verifyCode).then(result => {
            if (result.code === api.success_code) {
              //更新成功
              //给出toast
              this.$message.success(result.message);
              //重置表单
              this.newEmail = '';
              this.verifyCode = '';
              this.captchaCode = '';
            } else {
              this.verifyCode = '';
              this.captchaCode = '';
              this.$message.error(result.message);
              //给出提示。
            }
          });
        }
      }
    }
</script>
<style>

  .captcha-code {
    cursor: pointer;
    vertical-align: middle;
    margin-left: 10px;
    border: solid 1px #f2fff8;
    width: 118px;
    padding-left: 10px;
    padding-right: 10px;
    height: 36px;
  }

  .setting-email-container {
    margin-top: 20px;
  }

  .setting-email-text {
    font-size: 20px;
    color: #999999;
  }

  .settings-email-box .el-input {
    width: auto;
  }

  .settings-email-box .el-input__inner {
    width: 250px;
  }


  .settings-email-box {
    background: #fff;
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 20px;
  }

  .email-get-verify-code-btn {
        margin-left: 20px;
  }

  .settings-email-box .el-input {
        max-width: 250px;
  }

  .setting-email-container .el-input__inner {
    border: solid 1px #E6E6E6;
    height: 38px;
    border-radius: 0;
  }

  .setting-email-container .el-form-item__label {
    background: #FBFBFB;
    border-left: solid 1px #E6E6E6;
    border-top: solid 1px #E6E6E6;
    border-bottom: solid 1px #E6E6E6;
    text-align: center;
  }

</style>
