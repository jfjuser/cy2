/* eslint-disable */
/* eslint-disable */
require("script-loader!file-saver");
import XLSX from "xlsx-style";

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });

      if (typeof cell.v === "number") cell.t = "n";
      else if (typeof cell.v === "boolean") cell.t = "b";
      else if (cell.v instanceof Date) {
        cell.t = "n";
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = "s";

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws["!ref"] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

function export_json_to_excel({
  title,
  multiHeader = [],
  header,
  data,
  filename,
  merges = [],
  autoWidth = true,
  bookType = "xlsx"
} = {}) {
  // const merges = [`A1:${getCharCol(list.length - 2)}1`]; //合并单元格
  /* original data */
  filename = filename || "excel-list";
  data = [...data];

  data.unshift(header);
  if (title) {
    data.unshift(title);
  }
  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i]);
  }
  var ws_name = "SheetJS";
  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  if (merges.length > 0) {
    if (!ws["!merges"]) ws["!merges"] = [];
    merges.forEach(item => {
      ws["!merges"].push(XLSX.utils.decode_range(item));
    });
  }

  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row =>
      row.map(val => {
        /*先判断是否为null/undefined*/
        if (val == null) {
          return {
            wch: 13
          };
        } else if (val.toString().charCodeAt(0) > 255) {
          /*再判断是否为中文*/
          return {
            wch: val.toString().length * 2
          };
        } else {
          return {
            wch: val.toString().length
          };
        }
      })
    );
    // console.log(colWidth);
    /*以第一行为初始值*/
    let result = colWidth[0];
    colWidth[0][0]["wch"] = 13;
    // console.log(colWidth[0][0]["wch"]);
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]) {
          if (result[j]["wch"] < colWidth[i][j]["wch"]) {
            result[j]["wch"] = colWidth[i][j]["wch"];
          }
        }
      }
    }
    ws["!cols"] = result;
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  var dataInfo = wb.Sheets[wb.SheetNames[0]];
  // 标题行
  let arr = [
    "A1",
    "B1",
    "C1",
    "D1",
    "E1",
    "F1",
    "G1",
    "H1",
    "I1",
    "J1",
    "K1",
    "L1",
    "M1",
    "N1",
    "O1",
    "P1",
    "Q1",
    "R1",
    "S1",
    "T1",
    "U1",
    "V1",
    "W1",
    "X1",
    "Y1",
    "Z1"
  ];
  //设置主标题样式
  let style = {
    font: {
      // name: "宋体",
      // sz: 18,
      color: { rgb: "000000" },
      bold: true
      // italic: false,
      // underline: false
    },
    alignment: {
      horizontal: "center",
      vertical: "center"
    }
  };

  //excel标题样式
  for (var i = 0; i < header.length; i++) {
    dataInfo[arr[i]].s = style;
  }
  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: "binary"
  });
  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }),
    `${filename}.${bookType}`
  );
}
function toExportExcel(tHeader, data, filename) {
  import("@/utils/Export2Excel").then(excel => {
    //表头对应字段

    excel.export_json_to_excel({
      header: tHeader,
      data: data,
      filename: filename,
      autoWidth: true,
      bookType: "xlsx"
    });
  });
}
export { toExportExcel, export_json_to_excel };