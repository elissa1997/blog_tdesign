<template>
  <div id="Login">
    <t-row>
      <t-col
        :xs="{ offset: 1, span: 10 }"
        :sm="{ offset: 1, span: 10 }"
        :md="{ offset: 2, span: 8 }"
        :lg="{ offset: 2, span: 8 }"
        :xl="{ offset: 3, span: 6 }"
      >
        <div class="loginCard">
          <div class="pic" :style="`background-image: url(${bingPic_url})`" v-if="bingPic">
            <div class="oneWord">
              <div class="copyright">{{bingPic.copyright}}</div>
            </div>
          </div>

          <div class="login">
            <t-space direction="vertical" :size="30" class="formWarp">
              
              <div class="title">
                <div class="text">后台登录</div>
                <div class="subText">Welcome back.</div>
              </div>

              <t-input v-model="username"  placeholder="请输入用户名"/>

              <t-input v-model="password" type="password" placeholder="请输入密码"/>

              <div class="btnWarp">
                <t-button @click="handleLogin">确定</t-button>
                <t-button theme="default">清空</t-button>
              </div>

            </t-space>

          </div>
        </div>


      </t-col>
    </t-row>
  </div>
</template>

<script>
import { bingPic } from "@/network/thirdParty.js";
import { login } from "@/network/user.js";
import { loginSuccess } from "@/util/auth.js";
import { handleResponseMsg } from "@/util/tool.js";
export default {
  name: "Login",
  props: {},
  components: {

  },
  data() {
    return {
      bingPic: undefined,
      username: undefined,
      password: undefined
    }
  },
  methods: {
    getBingPic() {
      bingPic(this.bingPic_params).then((res) => {
        this.bingPic = res.images[0];
      });
    },

    // 点击登录按钮
    handleLogin() {
      login(this.login_data).then((res) => {
        console.log(res);
        if (res.code == 200) {
          loginSuccess(res.token);
        }else{
          this.$message.error(handleResponseMsg(res.msg));
        }
      });
    }
  },
  mounted() {
    this.getBingPic();
  },
  computed: {
    bingPic_params: function () {
      return {
        format: "js",
        idx: "0",
        n: "1",
        nc: "1614319565639",
        pid: "hp",
        FORM: "BEHPTB",
        uhd: "0"
      };
    },
    bingPic_url: function () {
      return process.env.VUE_APP_PROXY_BING + this.bingPic.url;
    },
    login_data: function () {
      return {
        name: this.username,
        password: this.password,
      }
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#Login{
  background-color: var(--td-bg-color-page);
  // @include respond-to('desktop') {

  // }
  // @include respond-to('phone') {

  // }
  padding: 15vh 0;


  .loginCard {
    background-color: var(--td-bg-color-container);
    border-radius: var(--td-radius-medium);
    

    @include respond-to('desktop') {
      display: flex;
      min-height: 10vh;
    }
    @include respond-to('phone') {

    }



    .pic{
      @include respond-to('desktop') {
        width: 50%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-top-left-radius: var(--td-radius-medium);
        border-bottom-left-radius: var(--td-radius-medium);
        position: relative;
        .oneWord {
          box-sizing: border-box;
          backdrop-filter: blur(5px);
          border-bottom-left-radius: var(--td-radius-medium);
          width: 100%;
          position: absolute;
          bottom: 0px;
          padding: 10px 20px;
          color:#fff;
          background-image: linear-gradient(0deg,#00000099 ,#ffffff00);
          .hitokoto{
            font-size: 18px;
            // font-weight: bold;
          }

          .author{
            text-align: end;
            font-size: 14px;
            // font-weight: bold;
          }
        }
      }
      @include respond-to('phone') {
        display: none;
      }
    }

    .login {
      box-sizing: border-box;

      @include respond-to('desktop') {
        width: 50%;
      }
      @include respond-to('phone') {
        width: 100%;
      }

      padding: var(--td-comp-paddingTB-m);
      .formWarp {
        width: 100%;
        box-sizing: border-box;
        @include respond-to('desktop') {
          padding: 15% 20%;
        }
        @include respond-to('phone') {
          padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-s);
        }
        .title{
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: var(--td-comp-paddingTB-l);
  
          .text{
            font-size: var(--td-font-size-headline-small);
            font-weight: 100;
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-image: -webkit-linear-gradient(180deg,#379eff,#00ceab);

          }

          .subText{
            font-size: var(--td-font-size-title-small);
            font-weight: 100;
          }
        }

        .btnWarp {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }

  }
}
</style>