import common from './http.js'
export const checkphoto = '/pb/pv/v1/ai/public/aiUser/faceDetect' //校验图片
export const noCheckPhoto = '/pb/pv/v1/ai/public/aiUser/noCheckPhoto' // 不校验
const getFace = '/pb/at/work/v1/manager/WorkForCyCarUser' //获取人脸列表 删除列表
const resetSubmit = '/pb/at/work/v1/aiUser' // 更新人员
const getphoto = '/v1/ai/aiUser/getPhoto/' // 详情获取图片
const faceregister = '/pb/at/work/v1/aiUser/register' // 注册人员
const getcompany = '/pb/at/work/v1/manager/company/page' // 获取公司列表
const inout = '/pb/at/work/v1/workAiInOut/tree/page' // 获取进出记录
const outimg = '/pb/at/work/v1/aiGetCameraFile/inOutPhoto/' // 进出记录图片
const equipment = '/pb/at/work/v1/workcamera/workaiToken/pageByDepartmentId' // 设备列表
const changelocal = '/pb/at/work/v1/workcamera/workForaiToken/update' // 更改通道状态
const open = '/pb/at/work/v1/workcamera/workaiToken/openRelay/' // 一键开闸
const unbind = '/pb/at/work/v1/workcamera/workaiToken/unbindCamera/' // 解绑
const department = '/pb/at/work/v1/manager/updateByDepartment' // 更新部门
const getwifiPNew = '/pb/at/work/v1/visitor/getWifiPNew' // 获取wifi
export const getwifiPNew1 = '/pb/at/work/v1/visitor/getWifiPNew1'
const forworkStyle = '/pb/at/work/v1/cameraType/forWorkStyle' // 设备设置项
const getmac = '/pb/at/work/v1/visitor/getMac' //获取mac
const Setting = '/pb/at/work/v1/camera/setting' //相机设置
const getWxAppletUserInfo = '/pv/v1/wx/getWxAppletUserInfo' // 获取用户信息
const wxlogin = '/pb/at/work/v1/loginApplet' // 微信一键登录
const send = '/pb/at/work/v1/login/' // 发送验证码
const phone = '/pb/at/work/v1/loginForPhone' // 手机号登录
export function faceManage (url, data) {
	return common(getFace + url, data, 'POST')
}
export function faceDlete (data) {
	return common(getFace, data, 'DELETE')
}
export function facePut (data) {
	return common(resetSubmit, data, 'PUT')
}
export function getPhoto (url, data) {
	return common(getphoto + url, data, 'POST')
}
export function faceRegister (data) {
	return common(faceregister, data, 'POST')
}
export function getCompany (data) {
	return common(getcompany, data, 'GET')
}
export function inOut (data) {
	return common(inout, data, 'GET')
}
export function outImg (url,data) {
	return common(outimg + url,data, 'PUT')
}
export function eQuipment (data) {
	return common(equipment,data, 'GET')
}
export function changeLocal (data) {
	return common(changelocal, data, 'PUT')
}
export function oPen (url,data) {
	return common(open + url, 'GET')
}
export function unBind (url,data) {
	return common(unbind + url,data, 'PUT')
}
export function Department (data) {
	return common(department,data, 'PUT')
}
export function getWifiPNew (data) {
	return common(getwifiPNew, data, 'POST')
}
export function forWorkStyle (data) {
	return common(forworkStyle, data, 'GET')
}
export function getMac (data) {
	return common(getmac, data, 'POST')
}
export function setting (data) {
	return common(Setting, data, 'GET')
}
// export function getwxAppletUserInfo (data) {
// 	return common(getWxAppletUserInfo, data, 'GET')
// }
export function getwxAppletUserInfo (data) {
	return common(getWxAppletUserInfo, data, 'GET', true)
}
export function wxLogin (data) {
	return common(wxlogin, data, 'POST', true)
}
export function Send (url, data) {
	return common(send + url, data, 'POST', true)
}
export function phoneLogins (data) {
	return common(phone, data, 'POST', true)
}