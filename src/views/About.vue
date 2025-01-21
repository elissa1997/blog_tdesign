<template>
  <div id="About">
    <t-row>
      <t-col
        :xs="{ offset: 1, span: 10 }"
        :sm="{ offset: 1, span: 10 }"
        :md="{ offset: 2, span: 8 }"
        :lg="{ offset: 2, span: 8 }"
        :xl="{ offset: 3, span: 6 }"
      >
        <div class="cards">
          <t-card class="card" :bordered="false">
          <t-row :gutter="[22, 22]" align="middle">
            <t-col         
              :xs="{ offset: 0, span: 12 }"
              :sm="{ offset: 0, span: 12 }"
              :md="{ offset: 0, span: 12 }"
              :lg="{ offset: 0, span: 4 }"
              :xl="{ offset: 0, span: 4 }"
            >
              <div class="baseInfoImg">
                <img class="headBg" :src="require('@/assets/img/bg-3.png')" alt="bg-3">
                <img class="headImg" :src="avatarByemail('524948583@qq.com')"/>
              </div>
            </t-col>
            <t-col         
              :xs="{ offset: 0, span: 12 }"
              :sm="{ offset: 0, span: 12 }"
              :md="{ offset: 0, span: 12 }"
              :lg="{ offset: 0, span: 8 }"
              :xl="{ offset: 0, span: 8 }"
            >
              <div class="baseInfoText">   

                  <div class="persion">
                    <div class="name">Elissa_liu</div>
                    <div class="socialNetwork">
                      <Mail class="icon" theme="outline"/>
                      <Github class="icon" theme="outline"/>
                      <Facebook class="icon" theme="outline"/>
                      <Weibo class="icon" theme="outline"/> 
                    </div>
                  </div>

                  <div class="item">
                    <Handbag class="icon" theme="outline" :strokeWidth="3"/>
                    <span>Front-end Developer / Technical Art</span>
                  </div>

                  <div class="item">
                    <City class="icon" theme="outline" :strokeWidth="3"/>
                    <span>Anhui Institute of Hydraulic Research</span>
                  </div>

              </div>
            </t-col>
          </t-row>
          </t-card>

          <t-card class="card" :bordered="false">
          <t-row :gutter="[22, 22]" align="middle">
            <t-col :span="12">
              <div class="cardTitle">Skills</div>
            </t-col>
            <t-col
              v-for="item in skillList"
              :key="item.name"
              :xs="{ offset: 0, span: 12 }"
              :sm="{ offset: 0, span: 12 }"
              :md="{ offset: 0, span: 12 }"
              :lg="{ offset: 0, span: 6 }"
              :xl="{ offset: 0, span: 6 }"
            >

              <div class="skillItem">
                <img class="icon" :src="require(`@/assets/icon/brandIcon/${item.icon}`)"/>
                <div class="bar">
                  <div class="name">{{item.name}}</div>
                  <t-progress :percentage="item.percentage" />
                </div>
              </div>
            </t-col>
          </t-row>
          </t-card>

          <t-card class="card" :bordered="false">
          <t-row :gutter="[22, 22]">
            <t-col :span="12">
              <div class="cardTitle">Projects</div>
            </t-col>

            <t-col
              v-for="item in projectList"
              :key="item.name"
              :xs="{ offset: 0, span: 12 }"
              :sm="{ offset: 0, span: 12 }"
              :md="{ offset: 0, span: 12 }"
              :lg="{ offset: 0, span: 6 }"
              :xl="{ offset: 0, span: 6 }"
              style="height: 100%;"
            >

              <div class="projectItem">
                <div class="imgWarp">
                  <img class="cover" :src="require(`@/assets/img/projects/${item.icon}`)"/>
                  <div class="name">{{item.name}}</div>
                </div>
                
                <div class="brief">
                  <div class="item" v-for="(briefItem, index) in item.brief" :key="index">
                    <Dot class="dot" theme="outline"/>
                    <div>{{briefItem}}</div>
                  </div>
                </div>
              </div>
            </t-col>
          </t-row>
          </t-card>

        </div>
      </t-col>
    </t-row>

  </div>
</template>

<script>
import { avatarByemail } from "@/util/tool.js";
import { Handbag, City, Github, Facebook, Weibo, Mail, Dot } from "@icon-park/vue"
export default {
  name: "About",
  props: {},
  components: {
    Handbag, City, Github, Facebook, Weibo, Mail, Dot
  },
  data() {
    return {
      skillList: [
        {
          name: "Vue.js",
          icon: "Vue.png",
          percentage: 80
        },
        {
          name: "Node.js",
          icon: "nodejs.png",
          percentage: 70
        },
        {
          name: "PhotoShop / Figma",
          icon: "ui.png",
          percentage: 40
        },
        {
          name: "Unreal Engine",
          icon: "UnrealEngine.png",
          percentage: 60
        },
        {
          name: "ArcGIS",
          icon: "ArcgisPro.png",
          percentage: 70
        }
      ],
      projectList: [
        {
          name: "Anhui Province flood control early warning platform",
          icon: "FloodWarningPlatform.jpg",
          brief: [
            "Participated in the early development of the platform's UI framework and was involved in the construction of the public map.",
            "Developed business modules and optimized the real-time video component delay issue.",
          ]
        },
        {
          name: "Anhui Province water transfer platform water transmission lines",
          icon: "HuaiRiveTransferLine.jpg",
          brief: [
            "Independently completed the frontend development of the water pipeline business function.",
            "Implemented multi-layer overlay, management, and query functions based on ArcGIS JS.",
            "Implemented data charting, report querying, frontend exporting, and other functions."
          ]
        },
        {
          name: "Based on HEC-RAS hydrological calculations",
          icon: "HEC-RAS.jpg",
          brief: [
            "Use HEC-RAS to simulate the dynamic characteristics of mountain flood independently.",
            "The results of calculation under different conditions such as water level and discharge relation, specific drop and open boundary are tried.",
            "Use nodejs to batch clean the output data and output to ArcGIS Pro."
          ]
        },
        {
          name: "Based on MIKE Zero® 21 hydrodynamic simulation",
          icon: "Mike21.jpg",
          brief: [
            "Independently completed DEM data extraction and pre-processing for oblique photography in a certain region.",
            "Simulated and calculated the mountain flood situation in a two-dimensional hydraulic model using the water level-flow relationship curve.",
            "Extracted the calculation results to an SHP file and displayed them using ArcGIS for JS."
          ]
        },
        {
          name: "Anhui Province Water Saving Platform & Water Resources Platform APP",
          icon: "wsAndswApp.jpg",
          brief: [
            "Independently completed the frontend development of the H5 pages within the APP.",
            "Implemented business data query functions for both water conservation and water resource platforms.",
            "Enabled access to internal network IP and public domain name via HTTPS, and launched a WeChat mini-program version simultaneously."
          ]
        },
        {
          name: "Based on Unreal engine visualization scene of XiangHongDian Reservoir",
          icon: "UnReal.jpg",
          brief: [
            "Independently completed surface reduction optimization, block merging, and manually modeled the sluice gate of the Xianghongdian Reservoir using 3Dmax's oblique photography model.",
            "Integrated oblique photography data, DEM elevation data, and remote sensing image data to build a virtual scene.",
            "Collaborated with the designer to complete the UI interface design and functionality interaction.",
            "Used the Fluid Flux plug-in to achieve physical water flow effects and used the Niagara system to create water jet particle effects."
          ]
        },
      ]
    }
  },
  methods: {
    avatarByemail
  },
  mounted() {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#About{
  background-color: var(--td-bg-color-page);
  min-height: calc(100vh - 56px);
  .cards {
    margin: var(--td-comp-paddingTB-xxl) 0px;
  
    .card:not(:last-of-type) {
      margin-bottom: var(--td-comp-paddingTB-l);
    }

    .cardTitle {
      font-size: var(--td-font-size-headline-small);
      // font-style: italic;
      font-weight: bold;
      background: linear-gradient(to right, var(--td-brand-color-active), var(--td-brand-color-hover));
      -webkit-background-clip: text;
      color: transparent;
      width: fit-content;
    }

    .baseInfoImg {
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
  
      .headImg {
        border-radius: 50%;
        width: 80px;
        height: 80px;
        border: 2px solid transparent;
        background-clip: padding-box, border-box;
        background-origin: padding-box, border-box;
        background-image: linear-gradient(to right, #222, #222), linear-gradient(270deg, #00c6ff, #0072ff);
  
        box-shadow: 0px 0px 10px 1px #1890ff;

        position: relative;
        // top: 10px;
      }

      .headBg {
        position: absolute;
        width: calc(80px * 1.2);
        height: calc(80px * 1.2);
        filter: blur(20px);
      }
    }
  
    .baseInfoText {
      
      display: flex;
      flex-direction: column;
      justify-content: center;
  
  
        .persion {
          display: flex;
          align-items: center;
          .name {
            font-size: var(--td-font-size-title-large);
            font-weight: 700;
            line-height: calc(var(--td-font-size-title-large) + 8px);
            color: var(--td-text-color-secondary);
            margin-right: var(--td-comp-margin-xl);
          }
          .socialNetwork {
            font-size: var(--td-font-size-title-large);
            color: var(--td-brand-color-active);
            .icon:not(:last-of-type) {
              margin-right: var(--td-comp-margin-s);
            }
          }
          margin-bottom: var(--td-comp-margin-m);
        }
  
        .item {
          display: flex;
          align-items: center;
          font-size: var(--td-font-size-mark-medium);
          line-height: calc(var(--td-font-size-mark-medium) + 8px);
          .icon {
            margin-right: var(--td-comp-margin-s);
            color: var(--td-text-color-brand);
          }
  
          span {
            color: var(--td-text-color-placeholder);
          }
        }
  
        .item:not(:last-of-type) {
          margin-bottom: var(--td-comp-margin-s);
        }
  
      
  
  
    }

    .skillItem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--td-brand-color-light);
      // background: linear-gradient(to left, var(--td-brand-color-light), var(--td-brand-color-focus));
      border-radius: var(--td-radius-medium);
      padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-m);
      .icon {
        height: 38px;
        width: 38px;
        object-fit: cover;
      }

      .bar {
        width: calc(100% - 34px - var(--td-comp-margin-xl));
        .name {
          font-size: var(--td-font-size-link-medium);
          font-weight: 500;
          color: var(--td-text-color-primary);
        }
      }
    }

    .projectItem {
      .imgWarp {
        position: relative;
        width: 100%;
        height: 50%;
        .cover {
          border-top-left-radius: var(--td-radius-medium);
          border-top-right-radius: var(--td-radius-medium);
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }
        .name{
          box-sizing: border-box;
          position: absolute;
          bottom: 0px;
          padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-l) var(--td-comp-paddingLR-l);

          width: 100%;
          // height: 30px;

          color: #fff;
          // color: var(--td-bg-color-container);
          font-size: var(--td-font-size-link-medium);
          background-image: linear-gradient(0deg, hsla(0, 0%, 0%, 0.6), #00000000);
        }
      }

      .brief {
        border-bottom-left-radius: var(--td-radius-medium);
        border-bottom-right-radius: var(--td-radius-medium);
        background-color: var(--td-brand-color-light);
        padding: var(--td-comp-paddingLR-l);
        height: 220px;
        overflow-y: auto;
        .item {
          display: flex;
          align-items: baseline;
          font-size: var(--td-font-size-link-small);
          color: var(--td-text-color-secondary);
          .dot {
            margin-right: var(--td-comp-margin-xs);
          }
        }
        .item:not(:last-of-type) {
          margin-bottom: var(--td-comp-margin-xs);
        }
      }
    }
  }
  
}
</style>