# 地理坐标在线转换工具

## Demos
- [线上地址](https://kongkong99.github.io/coordinate/#/) 


## 项目相关npm包

- 坐标转化插件: [gcoord](https://www.npmjs.com/package/gcoord)
- 项目脚手架: [jdc-webcli](https://www.npmjs.com/package/jdc-webcli)

## build step

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start

# build for integration with minification
npm run build:test

# build for production with minification
npm run build
```


## CRS
[CRS原文链接](https://github.com/hujiulong/gcoord#crs)  
CRS为坐标系，目标支持以下几种坐标系

| CRS    | 坐标格式   | 说明 |
| --------           | --------- | ----- |
| gcoord.WGS84       | [lng,lat] | WGS-84坐标系，GPS设备获取的经纬度坐标   |
| gcoord.GCJ02       | [lng,lat] | GCJ-02坐标系，google中国地图、soso地图、aliyun地图、mapabc地图和高德地图所用的经纬度坐标   |
| gcoord.BD09        | [lng,lat] | BD-09坐标系，百度地图采用的经纬度坐标    |
| gcoord.BD09LL      | [lng,lat] | 同BD09  |
| gcoord.BD09MC      | [x,y]     | BD-09米制坐标，百度地图采用的米制坐标，单位：米  |
| gcoord.BD09Meter   | [x,y]     | 同BD09MC |
| gcoord.Baidu       | [lng,lat] | 百度坐标系，BD-09坐标系别名，同BD-09  |
| gcoord.BMap        | [lng,lat] | 百度地图，BD-09坐标系别名，同BD-09  |
| gcoord.AMap        | [lng,lat] | 高德地图，同GCJ-02  |
| gcoord.WebMercator | [x,y]     | Web Mercator投影，墨卡托投影，同EPSG3857，单位：米 |
| gcoord.WGS1984     | [lng,lat] | WGS-84坐标系别名，同WGS-84  |
| gcoord.EPSG4326    | [lng,lat] | WGS-84坐标系别名，同WGS-84  |
| gcoord.EPSG3857    | [x,y]     | Web Mercator投影，同WebMercator，单位：米  |
| gcoord.EPSG900913  | [x,y]     | Web Mercator投影，同WebMercator，单位：米  |




