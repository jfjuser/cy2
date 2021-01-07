/* eslint-disable */
import ElementUI from 'element-ui'
let idTmr;
const getExplorer = () => {
	let explorer = window.navigator.userAgent;
	//ie
	if (explorer.indexOf("MSIE") >= 0) {
		return 'ie';
	}
	//firefox

	else if (explorer.indexOf("Firefox") >= 0) {
		return 'Firefox';
	}
	//Chrome
	else if (explorer.indexOf("Chrome") >= 0) {
		return 'Chrome';
	}
	//Opera
	else if (explorer.indexOf("Opera") >= 0) {
		return 'Opera';
	}
	//Safari
	else if (explorer.indexOf("Safari") >= 0) {
		return 'Safari';
	}
}
// 判断浏览器是否为IE
const exportToExcel = (data, name) => {

	// 判断是否为IE
	if (getExplorer() == 'ie') {
		tableToIE(data, name)
	} else {
		tableToNotIE(data, name)
	}
}

const Cleanup = () => {
	window.clearInterval(idTmr);
}

// ie浏览器下执行
const tableToIE = (data, name) => {
	let curTbl = data;
	let oXL = new ActiveXObject("Excel.Application");

	//创建AX对象excel
	let oWB = oXL.Workbooks.Add();
	//获取workbook对象
	let xlsheet = oWB.Worksheets(1);
	//激活当前sheet
	let sel = document.body.createTextRange();
	sel.moveToElementText(curTbl);
	//把表格中的内容移到TextRange中
	sel.select;
	//全选TextRange中内容
	sel.execCommand("Copy");
	//复制TextRange中内容
	xlsheet.Paste();
	//粘贴到活动的EXCEL中

	oXL.Visible = true;
	//设置excel可见属性

	try {
		let fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
	} catch (e) {
		print("Nested catch caught " + e);
	} finally {
		oWB.SaveAs(fname);

		oWB.Close(savechanges = false);
		//xls.visible = false;
		oXL.Quit();
		oXL = null;
		// 结束excel进程，退出完成
		window.setInterval("Cleanup();", 1);
		idTmr = window.setInterval("Cleanup();", 1);
	}
}

// 非ie浏览器下执行
const tableToNotIE = (function () {
	// 编码要用utf-8不然默认gbk会出现中文乱码
	const uri = 'data:application/vnd.ms-excel;base64,',
		template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';

	const base64 = function (s) {
		return window.btoa(unescape(encodeURIComponent(s)));
	}

	const format = (s, c) => {
		return s.replace(/{(\w+)}/g,
			(m, p) => {
				return c[p];
			})
	}

	return (table, name) => {
		const ctx = {
			worksheet: name,
			table
		}

		const url = uri + base64(format(template, ctx));

		if (navigator.userAgent.indexOf("Firefox") > -1){
			window.location.href = url
		} else {
			const aLink = document.createElement('a');
			aLink.href = url;
			aLink.download = name || '';
			let event;
			if (window.MouseEvent) {
				event = new MouseEvent('click');
			} else {
				event = document.createEvent('MouseEvents');
				event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			}
			aLink.dispatchEvent(event);
		}
	}
})()
// 导出函数
const table2excel = (column, data, excelName) => {
	const typeMap = {
		image: getImageHtml,
		text: getTextHtml
	}
	let index = 0
	let htmllist = ''
  column.forEach((item, index1) => {
		// console.log(item.children)
    if (item.children) {
			item.children.forEach((item2, index2) => {
        htmllist += `<th>${item.title}</th>`
			})
			// console.log(2222)
			index++
		}
	})
	// console.log(htmllist)
	let thead = column.reduce((result, item) => {
		// console.log(item.key)
		let obj = false
		if (item.children) {
			obj = true
		}
		// console.log(index)
		if (index) {
			if (obj) {
				result += `<th rowspan="1" colspan="3">${item.title}</th>`
			} else {
				result += `<th rowspan="2">${item.title}</th>`
			}
		} else {
			result += `<th>${item.title}</th>`
		}
		return result
	}, '')
  // console.log(thead)
  if (index) {
    thead = `<thead><tr>${thead}</tr><tr>${htmllist}</tr></thead>`
	} else {
		thead = `<thead><tr>${thead}</tr></thead>`
	}
	let arr = JSON.parse(JSON.stringify(column))
	let index1
	arr.forEach((item, index) => {
		if (item.children) {
			index1 = index / 1 + item.children.length
      item.children.unshift(index, 0)
      Array.prototype.splice.apply(arr, item.children)
		}
	})
	if (index1) {
		arr.splice(index1, 1)
	  column = arr
	}
	let tbody = data.reduce((result, row) => {
		const temp = column.reduce((tds, col) => {
			if (row[col.key] !== 0 && !row[col.key]) {
				row[col.key] = ''
			}
			tds += typeMap[col.type || 'text'](row[col.key], col)
			return tds
		}, '')
		result += `<tr>${temp}</tr>`
		return result
	}, '')
	// return
	tbody = `<tbody>${tbody}</tbody>`
	const table = thead + tbody
  // console.log(table)

	// 导出表格
	ElementUI.MessageBox.confirm('确定要导出吗?', '提示', {}).then(() => {
	  exportToExcel(table, excelName)
  }).catch(() => {})
	function getTextHtml(val) {
		return `<td style="text-align: center;vnd.ms-excel.numberformat:@">${val}</td>`
	}

	function getImageHtml(val, options) {
		options = Object.assign({width: 40, height: 60}, options)
		return `<td style="width: ${options.width}px; height: ${options.height}px; text-align: center; vertical-align: middle"><div><img src="${val}" width=${options.width} height=${options.height}></div></td>`
	}
}
// console.log(table2excel)
export default table2excel