<template>
  <div class="home">
    <h1 class="title">坐标在线转化工具</h1>
    <div class="coord-content">
      <div class="coord-input">
        <div class="remark">
          <span class="remark-subtitle">使用说明:</span>
          <div>
            <p>输入任意坐标系 lng,lat 格式的坐标，其他坐标系会自动转化。</p>
            <p>按下回车或查询按钮，将会在地图上地位。</p>
          </div>
        </div>
        <div class="coord-input-single">
          <span>WGS84:</span>
          <input
            v-model.trim="WGS84Value"
            placeholder="请输入坐标（例如：116.40,39.91)"
            @keyup.enter="search"
            @input="inputChange('WGS84', WGS84Value)"
            @blur="inputBlur(WGS84Value)"
          >
        </div>
        <div class="coord-input-single">
          <span>GCJ02:</span>
          <input
            v-model.trim="GCJ02Value"
            @keyup.enter="search"
            placeholder="请输入坐标（例如：116.40,39.91)"
            @input="inputChange('GCJ02', GCJ02Value)"
            @blur="inputBlur(GCJ02Value)"
          >
        </div>
        <div class="coord-input-single">
          <span>BD09:</span>
          <input
            v-model.trim="BD09Value"
            @keyup.enter="search"
            placeholder="请输入坐标（例如：116.40,39.91)"
            @input="inputChange('BD09', BD09Value)"
            @blur="inputBlur(BD09Value)"
          >
        </div>
        <span class="search-button" @click="search">定位</span>
        <p class="warning" v-show="isWarning">请输入正确格式的坐标</p>
      </div>
      <div class="coord-describe">
        <div>
          <div>
            <span>经度：</span>东经为正数，西经为负数。
          </div>
          <div>
            <span>纬度：</span>北纬为正数，南纬为负数。
            <p class="crs-link">
              <span>注：</span>
              绝大对数坐标系可以用这三个坐标系数据表示
              <a
                href="https://github.com/hujiulong/gcoord#crs"
                target="_blank"
              >说明链接</a>
            </p>
          </div>
        </div>
        <table border="1" cellspacing="0px" class>
          <tr>
            <th>WGS84坐标系</th>
            <td>GeoJson、天地图（CGCS2000与WGS84坐标几乎一致）</td>
          </tr>
          <tr>
            <th>GCJ02坐标系</th>
            <td>高德地图、google中国地图、aliyun地图、mapabc地图和soso地图</td>
          </tr>
          <tr>
            <th>BD09坐标系</th>
            <td>百度地图</td>
          </tr>
        </table>
      </div>
    </div>
    <div id="map" class="map"></div>

    <div class="links">
      <h2 class="links-title">相关链接</h2>
      <div class="links-single" v-for="(item, index) of links" :key="index">
        <a :href="item.link" target="_blank">{{item.name}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import gcoord from 'gcoord';

export default {
  name: 'home',
  data: () => ({
    map: '',
    isWarning: false,
    coordRadio: '',
    WGS84Value: '',
    GCJ02Value: '',
    BD09Value: '',
    // eslint-disable-next-line
    reg: /^(\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?$/,
    links: [
      {
        name: '坐标转化插件gcoord(Github地址)',
        link: 'https://github.com/hujiulong/gcoord'
      },

      {
        name: 'GeoJson数据下载地址',
        link:
          'http://datav.aliyun.com/tools/atlas/#&lat=33.521903996156105&lng=104.29849999999999&zoom=4'
      }
    ]
  }),
  mounted() {
    this.initMap();
  },
  computed: {},
  methods: {
    initMap() {
      /* eslint-disable */
      this.map = new BMap.Map('map'); // 创建Map实例
      this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
      // 添加地图类型控件
      const zoomControl = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_ZOOM
      });
      this.map.addControl(zoomControl);
      this.map.setCurrentCity('北京'); // 设置地图显示的城市 此项是必须设置的
      this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

      this.map.addEventListener('tilesloaded', () => {
        //单击获取点击的经纬度
        this.map.addEventListener('click', this.mapClick);
        this.map.addEventListener('zoomend', () => {
          // 防止发生因为缩放，图层增加而造成的多次点击事件，暂时没取消掉冒泡事件，所以采用此方法
          this.map.removeEventListener('click', this.mapClick);
        });

        // 添加定位控件
        const geolocationControl = new BMap.GeolocationControl();
        geolocationControl.addEventListener('locationSuccess', e => {
          this.BD09Value = `${e.point.lng},${e.point.lat}`;
          this.inputChange('BD09', this.BD09Value);
          this.addMarker(e.point.lng, e.point.lat, 'mouseClick');
          this.inputBlur(this.BD09Value);
        });
        this.map.addControl(geolocationControl);
      });
    },
    mapClick(e) {
      this.BD09Value = `${e.point.lng},${e.point.lat}`;
      this.inputChange('BD09', this.BD09Value);
      this.addMarker(e.point.lng, e.point.lat, 'mouseClick');
      this.inputBlur(this.BD09Value);
    },
    inputChange(ele, value) {
      if (value === '') {
        this.WGS84Value = '';
        this.GCJ02Value = '';
        this.BD09Value = '';
      }
      if (this.reg.test(value)) {
        ['WGS84', 'GCJ02', 'BD09'].forEach(item => {
          if (item !== ele) {
            const valueArr = value.split(',');
            const result = gcoord.transform(
              valueArr, // 经纬度坐标
              gcoord[ele], // 当前坐标系
              gcoord[item] // 目标坐标系
            );
            const coord = [result[0].toFixed(8), result[1].toFixed(8)];
            this[`${item}Value`] = coord.join();
          }
        });
      }
    },
    inputBlur(value) {
      this.isWarning = this.reg.test(value) ? false : true;
    },
    search() {
      this.inputBlur(this.BD09Value);
      if (!this.isWarning) {
        const [lng, lat] = this.BD09Value.split(',');

        this.addMarker(Number(lng), Number(lat), 'search');
      }
    },
    addMarker(lng, lat, type) {
      this.map.clearOverlays();
      const point = new BMap.Point(lng, lat);
      if (type === 'search') {
        this.map.centerAndZoom(point, 11);
      }
      const marker = new BMap.Marker(point);
      this.map.addOverlay(marker);
    }
  }
};
</script>

<style lang="stylus" scoped>
.home {
  padding: 25px 100px;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  font-size: 18px;
  color: #303133;
}

.title {
  font-size: 40px;
  text-align: left;
  color: #67C23A;
}

.map {
  width: 100%;
  height: 600px;
}

.warning {
  position: absolute;
  bottom: -26px;
  color: red;
  font-size: 14px;
}

.coord-content {
  margin: 33px 0 28px;
  display: flex;
  justify-content: space-between;
}

.coord-input {
  width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  & > div > span {
    font-weight: bold;
    font-size: 20px;
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 10px;
  }

  & input {
    width: 430px;
    padding: 5px 8px;
    font-size: 18px !important;
  }

  & .warning {
    padding-left: 90px;
    margin-top: 5px;
  }
}

.remark {
  font-size: 17px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;

  & > .remark-subtitle {
    font-weight: bold;
    color: #409EFF;
    font-size: 17px;
  }
}

.coord-input-single + .coord-input-single {
  margin-top: 10px;
}

.coord-describe {
  width: 930px;
  font-size: 18px;

  & > div {
    & >div {
      font-size: 17px;

      & > span {
        font-weight: bold;
      }
    }
  }

  & > table {
    border: 1px solid #DCDFE6;
    margin-top: 15px;

    & th, & td {
      height: 43px;
      padding: 0 28px;
    }

    & th {
      background: #f3f3f3;
    }
  }
}

.search-button {
  display: inline-block;
  position: absolute;
  left: 577px;
  top: 164px;
  padding: 6px 16px;
  background: #409EFF;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}

.links {
  margin-top: 30px;

  &-title {
    font-size: 36px;
  }

  &-single {
    font-size: 23px;
    margin-top: 10px;
    padding-left: 30px;
  }
}

a {
  color: #409EFF !important;
  font-weight: 400;
}

.crs-link {
  display: inline-block;
  margin-left: 20px;

  &> span {
    font-weight: bold;
    font-style: italic;
  }

  & > a {
    font-weight: bold;
  }
}
</style>

