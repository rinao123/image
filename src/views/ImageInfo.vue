<template>
  <div class="image-info">
    <div class="container">
      <input
        class="file-select"
        type="file"
        accept="image/x-png,image/gif,image/jpeg"
        @change="onFileSelect"
      />
      <img class="image" :src="base64" v-if="base64" />
      <div
        class="color"
        :style="{
          backgroundColor: `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`,
        }"
        v-if="color"
      />
      <div class="histogram" id="histogram" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import * as echarts from "echarts";
import ImageUtil, { Color, HistogramData } from "../utils/imageUtil";

export default class ImageInfo extends Vue {
  base64: string;
  color?: Color | null;
  redData: Array<number>;
  blueData: Array<number>;
  greenData: Array<number>;
  histogramData: HistogramData | null;

  constructor(props: unknown) {
    super(props);
    this.base64 = "";
    this.color = null;
    this.redData = [];
    this.blueData = [];
    this.greenData = [];
    this.histogramData = null;
  }

  onFileSelect = async (event: Event): Promise<void> => {
    try {
      const target = event.target as HTMLInputElement | null;
      if (!target || !target.files) {
        return;
      }
      const file = target.files[0];
      this.base64 = await ImageUtil.fileToBase64(file);
      const imageData = await ImageUtil.getImageData(this.base64);
      console.log(imageData);
      this.color = ImageUtil.getImageThemeColor(imageData);
      console.log(this.color);
      this.histogramData = HistogramData.fromImageData(imageData);
      console.log(this.histogramData);
      this.updateEchart();
    } catch (error) {
      console.warn(error);
    }
  };

  updateEchart = (): void => {
    const dom = document.getElementById("histogram");
    if (!dom || !this.histogramData) {
      return;
    }
    const chart = echarts.init(dom);
    const option = {
      color: ["#FF0000", "#00FF00", "#0000FF"],
      title: {
        text: "rgb直方图",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: Array.from(this.histogramData.red.keys())
        }
      ],
      yAxis: [
        {
          type: "value",
        }
      ],
      series: [
        {
          name: "red",
          type: "line",
          stack: "总量",
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            color: "#FF0000"
          },
          emphasis: {
            focus: "series",
          },
          data: Array.from(this.histogramData.red.values()),
        },
        {
          name: "green",
          type: "line",
          stack: "总量",
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            color: "#00FF00"
          },
          emphasis: {
            focus: "series",
          },
          data: Array.from(this.histogramData.green.values()),
        },
        {
          name: "blue",
          type: "line",
          stack: "总量",
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            color: "#0000FF"
          },
          emphasis: {
            focus: "series"
          },
          data: Array.from(this.histogramData.blue.values()),
        }
      ]
    };
    chart.setOption(option);
  };
}
</script>

<style lang="scss">
.image-info {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow-y: overlay;
}

.container {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  width: 100%;
}

.file-select {
  margin-top: 20px;
}

.image {
  margin-top: 20px;
  max-width: 100%;
}

.color {
  margin: 20px 0;
  width: 200px;
  height: 200px;
}

.histogram {
  width: 100%;
  height: 500px;
}
</style>
