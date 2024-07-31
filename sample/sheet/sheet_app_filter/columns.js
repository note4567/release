// var custom_check = function(cell, onRendered, success, cancel, editorParams){
//     // input イベントの処理
//     var editor = document.createElement('input');
//     // bull では結局 Enter キーなどの key 自体を押す事が出来ないのでイベントが取得出来なかった。
//     //var editor = document.createElement(null);
//     //editor.setAttribute("type", "checkbox");
//     editor.setAttribute("type", "text");
//     editor.value = 12
//     console.log(`cell ${cell.getValue()}`)
//     console.log(`editorParams: ${editorParams}`)
//     // タブイベント
//     var tabEvent = new KeyboardEvent('keydown', {
//         key: 'Tab',
//         code: 'Tab',
//         which: 9,
//         keyCode: 9,
//         bubbles: true
//       });
//     // enter イベント
//     var enterEvent = new KeyboardEvent('keydown', { 
//         key: 'Enter',
//         code: 'Enter',
//         which: 13, 
//         keyCode: 13,
//         bubbles: true
//       });
    
//     // セルの値を取得
//     let val = cell.getValue()
//     if (val === false){
//         console.log(`True`);
//         cell.setValue(true);
//         // tabキーを押す
//         // c = cell.getElement();
//         //c.dispatchEvent(tabEvent);
//         //c.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Tab'}));
//         // Enterキーを押す
//         //c.dispatchEvent(enterEvent);
//         // 編集可能な左側のセルに移動
//         // table.navigateLeft(); 
//         // チェックボックスをチェックする
//         //editor.checked = true
//     }else{
//         console.log(`False`)
//         cell.setValue(false); 
//     }

//     // editor 要素がレンダリングされたらフォーカスを当てる
//     onRendered(function(){
//         editor.focus();
//         //editor.blur();
//         editor.style.css = "100%";
//     });

//     // success() により編集状態を終了させる
//     function successFunc(){
//         success();
//     }

//     // input ボックスに対するイベント処理
//     // successFunc を登録して編集状態を完了させる。
//     editor.addEventListener("change", successFunc);
//     editor.addEventListener("blur", successFunc);
//     editor.addEventListener("keydown", successFunc);
//     // editor.addEventListener("keydown", (e) => {
//     //     if( e.key === 'Enter' ){
//     //         console.log("eeeenter")
//     //         successFunc()
//     //     }
//     // })
//     // function successFunc(){
//     //     if (cell.getValue() === true){
//     //         editor.checked = true;
//     //         editor.blur();
//     //     }else{
//     //         editor.checked = false;
//     //         editor.blur();
//     //     }
//     // }

//     // [重要 !!] この success() 関数を実行する事で編集状態が終了する
//     // このコメントアウトを消すと編集状態から直ぐに編集完了になる。
//     // 一見すると良さそうだが、セルの移動を tab キーで行って編集状態にした場合にもセルの値が変わってしまう。
//     //success();
    
//     return editor;
// };
function makeFilter(cell, formatterParams, onRendered){
  // console.log('aaaa',cell.getValue())
  // n = cell.getValue()
  return `${cell.getValue()}<span class="filter_obj"></span>`
}
const columnDefinitions = [
  {title:"", field:"",cssClass: "custom",headerSort: false,  width:10, formatter:"rownum"},
  { title: "", field: "id", visible:false},
  // { title: "Brand", field: "brand", cssClass: "custom", editor: "input" ,headerSort: false,titleFormatter:a},
  // { title: "Script", field: "script", cssClass: "custom", editor: "input" ,headerSort: false,titleFormatter:a},
  { title: "Brand", field: "brand", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Script", field: "script", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "LBC", field: "lbc", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Name", field: "name", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter}, // "input"エディタを使用
  { title: "URL", field: "url", cssClass: "custom", editor: "input" ,headerSort: false,width:150,formatter:"link", formatterParams:{
      labelField:"url",
      // urlPrefix:"mailto://",
      target:"_blank",
  }, titleFormatter: makeFilter},
  { title: "Yagou", field: "yagou", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Item1", field: "item1", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Item2", field: "item2", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Records", field: "records", cssClass: "custom", editor: "input" ,headerSort: false, titleFormatter: makeFilter},
  { title: "Date", field: "date", cssClass: "custom", headerSort: false, editor:"date", editorParams:{
      min:"01/01/1955", // the minimum allowed value for the date picker
      //max:"02/12/2022", // the maximum allowed value for the date picker
      format:"yyyy/mm/dd", // the format of the date value stored in the cell
      verticalNavigation:"table", //navigate cursor around table without changing the value
      elementAttributes:{
          title:"slide bar to choose option" // custom tooltip
      }
  }, titleFormatter: makeFilter},
  { title: "Status", field: "status", cssClass: "custom", editor:"list", width:80,hozAlign:"center",editorParams:{values:[1,2,3,4,5,6,7,8,8.5,9,10,11,12,13,14,15]} ,headerSort: false, titleFormatter: makeFilter},
  { title: "Flag", field: "flag", cssClass: "custom", editor:"list", width:60,editorParams:{values:[0,1]} ,hozAlign:"center",headerSort: false, titleFormatter: makeFilter},
  //{ title: "Finish", field: "finish", cssClass: "custom", formatter:"rowSelection",width:70, hozAlign:"center",headerSort: false},
//   { title: "Finish", field: "finish", cssClass: "custom",editor:custom_check,editorParams:{
//   //{ title: "Finish", field: "finish", cssClass: "custom",editor:"tickCross",editorParams:{  
//     trueValue:true,falseValue:false}, formatter:"tickCross", formatterParams:{
//         allowEmpty:false,
//         allowTruthy:false,
//         tickElement:"<i class='fa fa-check'><input type='checkbox' checked></i>",
//         crossElement:"<i class='fa fa-times'><input type='checkbox'></i>",
//     },width:70, hozAlign:"center",headerSort: false},

//  これはカスタムエディターを使う場合
//   { title: "Finish", field: "finish", cssClass: "custom",editor:custom_check,formatter:function(cell, formatterParams, onRendered){
//     let val = cell.getValue()
//     if (val === true){
//         //editor.checked = true
//         return '<input type="checkbox" checked></input>'
//     }else{
//         return '<input type="checkbox"></input>'
//     }
//   },width:70, hozAlign:"center",headerSort: false},

  //{ title: "Finish", field: "finish", cssClass: "custom",editor:custom_check,width:70, hozAlign:"center",headerSort: false},
  // editor 属性でカスタムエディターを用いなくても cellClick イベントでチェックボックスは対応可能
  { title: "Finish", field: "finish", cssClass: "custom",width:70, hozAlign:"center",headerSort: false,
    formatter:function(cell, formatterParams, onRendered){
        // cellClick でのセルの編集後に呼ばれる。
        console.log(`format`);
        let val = cell.getValue()
        var row = cell.getRow()
        if (val === true){
            //editor.checked = true
            row.getElement().classList.add("row-checked")
            //row.getElement().classList.remove("tabulator-row-even")
            console.log(row.getElement())
            return '<input type="checkbox" checked></input>'
        }else{
            //row.getElement().classList.remove("row-checked")
            // row.getElement().classList.add("tabulator-row-even")
            return '<input type="checkbox"></input>'
        }
    } ,
    cellClick:function(e, cell){
      //e - the click event object
      //cell - cell component
      console.log(`cell: ${cell}`);
      let val = cell.getValue();
      var row = cell.getRow()
      
      console.log(row.getElement());
      if (val === false){
        console.log(`[set]: true`);
        cell.setValue(true);
        //row.getElement().classList.add("row-checked")
      } else{
        row.getElement().classList.remove("row-checked");
        //row.getElement().classList.add("tabulator-row-even");
        console.log(`[set]: false`);
        cell.setValue(false);
      }
    }, titleFormatter: makeFilter
  },

  { title: "Del", field: "erase", cssClass: "custom", width:70, hozAlign:"center",headerSort: false, cellClick:function(e, cell){
      // https://tabulator.info/docs/5.6/callbacks#column
      //e - the click event object
      //cell - cell component
      console.log(`cell: ${cell}`)
      //var row = table.getRow(cell);
      let row = cell.getRow()
      console.log(`row: ${row}`)
      row.delete();
  }, },
]