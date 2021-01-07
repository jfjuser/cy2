function system (bottom) {
	var system1 = {}
	try {
	    const res = uni.getSystemInfoSync()
		if (bottom) {
			system1 = {
				width: res.windowWidth,
				height: res.windowHeight
			}
		} else {
			system1 = {
				width: res.screenWidth,
				height: res.screenHeight
			}
		}
		return system1
	} catch (e) {
		// error
	}
}
export default system