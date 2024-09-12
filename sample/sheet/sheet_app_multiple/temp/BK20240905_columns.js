function makeFilter(cell, formatterParams, onRendered){
  return `${cell.getValue()}<span class="filter_obj"></span>`
}

const columnDefinitions = [
  {title:"", field:"",cssClass: "custom",headerSort: false,  width:10, formatter:"rownum"},
  { title: "", field: "id", visible:false},
  { title: "Brand", field: "brand", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Script", field: "script", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "LBC", field: "lbc", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Name", field: "name", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter}, // "input"エディタを使用
  { title: "URL", field: "url", cssClass: "custom", editor: "input" ,headerSort: false,width:150,formatter:"link", formatterParams:{
      labelField:"url",
      target:"_blank",
  }, titleFormatter: makeFilter},
  { title: "Yagou", field: "yagou", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Item1", field: "item1", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Item2", field: "item2", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Records", field: "records", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Date", field: "date", cssClass: "custom", headerSort: false, editor:"date", editorParams:{
      min:"01/01/1955", // the minimum allowed value for the date picker
      //max:"02/12/2022", // the maximum allowed value for the date picker
      format:"yyyy/MM/dd", // the format of the date value stored in the cell
      verticalNavigation:"table", //navigate cursor around table without changing the value
      elementAttributes:{
          title:"slide bar to choose option" // custom tooltip
      }
  }, titleFormatter: makeFilter},
  // 値を中央寄せにする設定(hozAlign:"center") 及び列幅の設定(width:80) の削除
  { title: "Status", field: "status", cssClass: "custom", editor:"list", editorParams:{values:[1,2,3,4,5,6,7,8,8.5,9,10,11,12,13,14,15]} ,headerSort: false, titleFormatter: makeFilter},
  
  { title: "Flag", field: "flag", cssClass: "custom", editor:"list", editorParams:{values:[0,1]} ,headerSort: false, titleFormatter: makeFilter},
  
  { title: "Finish", field: "finish", cssClass: "custom", headerSort: false,
    formatter:function(cell, formatterParams, onRendered){
        // cellClick でのセルの編集後に呼ばれる。
        let val = cell.getValue()
        var row = cell.getRow()
        if (val === true){
            row.getElement().classList.add("row-checked")
            return '<input type="checkbox" checked></input>'
        }else{
            return '<input type="checkbox"></input>'
        }
    } ,
    cellClick:function(e, cell){
      let val = cell.getValue();
      var row = cell.getRow()
      if (val === false){
        cell.setValue(true);
      } else{
        row.getElement().classList.remove("row-checked");
        cell.setValue(false);
      }
    }, titleFormatter: makeFilter
  },

  { title: "Del", field: "erase", cssClass: "custom", headerSort: false, cellClick:function(e, cell){
      let row = cell.getRow()
      row.delete();
  }, },
]