// グローバル変数としてTabulatorのインスタンスを宣言
var table;
const csrfToken = "{{ csrf_token }}";
// フィルター
let filterColumn = ''
let filterCheckList = []
let modal = ''

var table = new Tabulator("#intage_table", {
    // layout:"fitColumns",
    data: [        
        { id:991, brand: 122, script: 1045, lbc:12345678901,name: "マツモトキヨシ", url: "https://www.matsukiyo.co.jp/map/search?i=3",
        yagou:"(株)マツモトキヨシ", item1:"", item2:"", records:23, date:"2023/10/11", status:8.5, flag:0, finish:true,erase:'削除',cssClass: "custom"},        
        { id:83, brand: 2000, script:899, lbc:456,name: "ドミノ・ピザ", url: "https://www.dominos.jp/store-finder/",
        yagou:"Domino's Pizza", item1:"施設・サービス", item2:"", records:1423, date:"", status:7, flag:1, finish:false,erase:'削除',cssClass: "custom"},
        { id:331, brand: 123, script:178, lbc:12345688,name: "イオン", url: "https://www.aeon.com/store/",
        yagou:"AEON", item1:"", item2:"", records:2001, date:"", status:7, flag:false, finish:true,erase:'削除',cssClass: "custom"},
        { id:143, brand: 924, script:899, lbc:9999833,name: "吉野家", url: "https://stores.yoshinoya.com/yoshinoya/",
        yagou:"吉野家", item1:"休日", item2:"営業日", records:2423, date:"2023/09/01", status:10, flag:0, finish:false,erase:'削除',cssClass: "custom"},
        { id:873, brand: 235, script:3, lbc:7788728,name: "ユニクロ", url: "https://www.uniqlo.com/jp/ja/",
        yagou:"ユニクロ", item1:"", item2:"", records:423, date:"", status:7, flag:1, finish:false,erase:'削除',cssClass: "custom"},
        { id:1011, brand: 456, script:1334, lbc:22009434,name: "ヤマダ電機", url: "https://www.yamada-denkiweb.com/",
        yagou:"ヤマダ電機", item1:"施設・サービス", item2:"", records:23, date:"2021/11/04", status:7, flag:1, finish:false,erase:'削除',cssClass: "custom"},
        { id:1400, brand: 1123, script:45, lbc:2348844,name: "東急ハンズ", url: "https://hands.net/",
        yagou:"HANDS", item1:"駐車場", item2:"", records:33, date:"", status:10, flag:1, finish:false,erase:'削除',cssClass: "custom"},
        { id:8, brand: 987, script:88, lbc:999332,name: "高島屋", url: "https://www.takashimaya.co.jp/store/",
        yagou:"TAKASHIMAYA", item1:"", item2:"", records:32, date:"", status:7, flag:1, finish:false,erase:'削除',cssClass: "custom"},
        { id:1792, brand: 1001, script:841, lbc:234456,name: "西武そごう", url: "https://www.sogo-seibu.jp/",
        yagou:"SEIBU SOGO", item1:"営業時間", item2:"", records:3, date:"2022/01/18", status:7, flag:1, finish:false,erase:'削除',cssClass: "custom"},
        { id:279, brand: 23, script:332, lbc:798898,name: "紀伊國屋", url: "https://www.kinokuniya.co.jp/",
        yagou:"紀伊國屋", item1:"", item2:"", records:1423, date:"", status:7, flag:1, finish:true,erase:'削除',cssClass: "custom"},
    ],
    columns : columnDefinitions,  // 列の定義を外部ファイルから取得       
    });
    
// レスポンシブ対応
// ブレイクポイントを設定
const mediaQuery = window.matchMedia('(min-width: 1300px)');                    
// サイズのチェック関数を定義
function checkWindow(windowSize) {                    
    if (windowSize.matches) {
        // 1300px以上                            
        document.getElementById('line_top').classList.replace('mini_line_top','large_line_top');
        document.getElementById('line_bottom').classList.replace('mini_line_bottom', 'large_line_bottom');
    } else {                            
        document.getElementById('line_top').classList.replace('large_line_top', 'mini_line_top');
        document.getElementById('line_bottom').classList.replace('large_line_bottom', 'mini_line_bottom');
    }
}
// ロード時の判定処理
checkWindow(mediaQuery);
// ブレイクポイントが切り替わったら判定
mediaQuery.addEventListener('change', checkWindow);

// [行の追加]
document.getElementById("add-row").addEventListener("click", function(){
    table.addRow({});
    // 行の削除
    //var row = table.getRow(1);
    //row.delete();
    //table.deleteRow(9);
});

// [セルが編集されたときの処理]
// データ全体を取得
table.on("dataChanged", function(data){
    console.log('[data edited]:', data);    
});

// 2024/08/27 行の挿入処理(最終行がクリックされたら行の挿入)
table.on("cellClick", function(e, cell){
    // 編集された行が最終行かどうかの判定
    // [getNextRow()]: https://tabulator.info/docs/6.2/components#component-cell
    let editedRow = cell.getRow();
    let has_NextRow = editedRow.getNextRow();
    console.log('[editedRow]:', editedRow);
    console.log('[nextRow]:', has_NextRow);
    if (!has_NextRow){
        table.addRow({});
        console.log('add row!');
    }
});


// //  検証用なので後で削除する --------------------------------------------------
// table.on("cellEdited", function(cell){     
//     //[削除処理] -----------------------------------------------------------------
//     // サーバーから返された値の中で、削除した id を取得する。
//     // 返却メッセージが delete の場合
//     // この例では cell.getValue() で代替している
//     // この id が現在のテーブルに有るかどうか検索する。
//     // 検索した結果が存在すれば削除処理を実行する。
//     // 無ければ削除処理は実行しない。
//     console.log('[cell]:', cell.getValue());
//     // RowToDelete = table.searchData("id", "=", 83);
//     // searchData: https://tabulator.info/docs/6.2/filter#search-data
//     RowToDelete = table.searchData("id", "=", cell.getValue());    
//     if (RowToDelete.length > 0){
//         console.log("[RowToDelete]: ",RowToDelete[0]["id"])
//         table.deleteRow(RowToDelete[0]["id"]) 
//     }    
//     // console.log("[searchRows] ",table.searchRows("id", "=", 83)); → これだと取得した値が proxy になる
//     // -----

//     // [更新と行の作成] ------------------------------------------------------------
//     // idが無い空白行を削除
//     let RowToInsert = table.searchRows("id", "=", undefined);
//     console.log('[id が無い行を取得]',RowToInsert);
//     if (RowToInsert.length > 0){
//         console.log('@@@@@',RowToInsert, typeof(RowToInsert));       
//         table.deleteRow(RowToInsert)        
//     }
//     // ------------------------------------------------------------
    
//     // update とcreate はこれで対応可能
//     // 返却メッセージが update の場合
//     // サーバーから返された値から更新対象の行を取得する
//     // 返却された行と
//     // この id が現在のテーブルに有るかどうか検索する。
//     // 検索した結果が存在しなければ、id が無い行(addされた行)に行全体を更新する。
    
//     // console.log('[id が無い行を取得]',table.searchData("id", "=", null));
//     // searchDataではダメ
//     // let RowToInsert = table.searchData("id", "=", undefined);
//     // let RowToInsert = table.searchRows("id", "=", undefined);

//     // var row = table.getRow(RowToInsert);
//     // console.log("vvvvv",row, typeof row)
//     // table.updateOrAddData([{id:undefined,lbc:"-999"}]);

//     // if (RowToInsert.length > 0){
//     //     console.log('@@@@@',RowToInsert, typeof(RowToInsert));
//     //     // RowToInsert[0]["id"] = 99999
//     //     // RowToInsert[0]["lbc"] = 1111
//     //     // https://tabulator.info/docs/6.2/update#addrow
//     //     // RowToInsert.delete();
        
//     //     // table.deleteRow(RowToInsert[0]['id']) 
//     //     table.deleteRow(RowToInsert) 
//     //     // table.replaceData([RowToInsert[0], {id:2,lbc:"7777"}]) 
//     //     // table.updateOrAddData([{id:999,lbc:"999"}]);
//     // }
//     // table.updateOrAddData(RowToInsert);
//     // table.updateOrAddData([{id:"", lbc:777}]);
    
//     // idが存在すれば、サーバーから取得した行と現在のシートの行の差分のみ更新する。
//     // delete は id についてき if文で切り分ける(既に削している場合は処理しない)
//     // table.deleteRow(83)
//     // https://www.homes.co.jp/realtor/
//     // ---------

//     // table.setData([{id:83, lbc:777},{id:84, lbc:777},{id:85, lbc:777},{id:86, lbc:777},{id:87, lbc:777}]);
//     // localStorage.setItem('x_mouse', event.clientX);
//     // localStorage.setItem('y_mouse', event.clientY);
//     // console.log(localStorage.getItem('x_mouse'));
//     // console.log(localStorage.getItem('y_mouse'));
//     // console.log(table);
//     // table.setData(table["data"][0])
// });
//  ---------------------------------------------------------------------------

// 挿入
table.on("rowAdded", function(row){        
    console.log('[data add]:', row.getData())
    console.log('[row id]:', row.getData()['id'])
});

// 削除
table.on("rowDeleted", function(row){
    console.log('[data delted]:', row.getData())
    console.log('[row id]:', row.getData()['id'])
});

// 編集されたセルのデータを取得
table.on("cellEdited", function(cell){
    // 編集されたセルの行番号を取得する
    console.log('[cell edited] table.getRowPosition(cell.getRow()):', table.getRowPosition(cell.getRow()));
    console.log(`cell.getData()['id']: ${cell.getData()['id']}`,cell.getData());
    // セルのデータ
    console.log(`cell.getData()`,cell.getData());
    //console.log('[cell edited]:', cell['_cell']['row']['data']['no'])
});

// ----- Filter ------------------------------------------------------------
// table.setFilter("brand", "<", 230);
// [filter] https://tabulator.info/docs/6.2/filter#search-data
// [column component] 
// https://tabulator.info/docs/6.2/events#column
// https://tabulator.info/docs/6.2/components#component-column 
// https://tabulator.info/docs/6.2/components#component-cell

// フィルター処理
table.on("headerClick", function(event, column){   
    // 子要素である 矢印要素
    console.log('event.target.tagName',event.target.tagName)
    console.log('event.target.tagName',event.target.className)
    // 親要素である header要素
    console.log('e.currentTarget.tagName:',event.currentTarget.tagName)
    //
    console.log('e.clientX:',event.clientX)
    let x_mouse = event.clientX
    let y_mouse = event.clientY
    if (event.target.className === 'filter_obj'){
        console.log(column.getField());
        console.log(column.getCells().map(cell => cell.getValue()));

        // 既に表示されている modal は一旦消す
        if (modal){
            document.body.removeChild(modal);
            modal = '';
        }
        
        modal = document.createElement('div');
        modal.innerHTML = `
        <div class="modal_filter">
            <div class="modal_filter_inner"">
                <div id="filter_button">
                    <button id="filter_on" class="filter_on_off">filter</button>
                    <button id="filter_off" class="filter_on_off">clear</button>
                    <button id="modal_close">X</button>
                </div>
                <div><input type="text" id="filter_text" placeholder=" search ... "></div>
                <table id="filter_table"></table>
            </div>
        </div>
        `;

        // 作成した要素をドキュメントに追加
        document.body.appendChild(modal);
        modal.style=`position: fixed; top: ${y_mouse}px; left:${x_mouse}px;`
        // 
        let col_vals = column.getCells().map(cell => cell.getValue());
        //  重複要素を取り除く
        col_vals = Array.from(new Set(col_vals));
        // 親要素(tbody)の取得
        let filter_table = document.querySelector('table#filter_table');
        console.log('[filterCheckList]',filterCheckList)
        let tdHTML = col_vals.map((value, index, array) => {
            if (filterColumn !== column.getField()){
                filterCheckList.length = 0;
            }
            let td_html = ''
            // 値がない場合は Nothing の表記にする
            value = value == ""? 'Nothing': value;
            if(filterCheckList.includes(index)){
                td_html = `<tr><td><input type="checkbox" name="filter_ck" checked id="filter_td_${index}" value=${index} data-text=${value} />${value}</td></tr>`
            }else{
                td_html =`<tr><td><input type="checkbox" name="filter_ck" id="filter_td_${index}" value=${index} data-text=${value} />${value}</td></tr>`
            }
            return td_html
        }).join('');
        filter_table.innerHTML = tdHTML;

        // フィルター実行ボタンの設定
        let filterOnElement = document.querySelector('button#filter_on');
        filterOnElement.addEventListener('click',function(){
            filterOn();
        })
        // フィルター解除ボタンの設定
        let filterOffElement = document.querySelector('button#filter_off');
        filterOffElement.addEventListener('click', function(){
            filterOff();
        })
        // 閉じるボタンの設定
        let filterCloseElement = document.querySelector('button#modal_close');
        filterCloseElement.addEventListener('click', function(){
            document.body.removeChild(modal);
            modal = '';
        })
        // フィルター検索Box
        let filterSearchElement = document.querySelector('input#filter_text');
        filterSearchElement.addEventListener('blur', function(){
            filterSearchList = filterSearchElement.value.split(/\s+/);
            console.log(filterSearchList,"@@@@");
            let filterCheckBoxElement = document.querySelectorAll('input[name="filter_ck"]');
            filterCheckBoxElement.forEach(function(checkbox, index){
                // データ属性(data-text) を利用する if(filterSearchList.length[0])
                if(filterSearchList.includes(checkbox.dataset.text)){
                    console.log('[checked] checkBox.dataset.text ', checkbox.dataset.text);
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                    console.log("[display_none] partent ",checkbox.parentElement)
                    checkbox.parentElement.parentElement.classList.add('display_none');
                }
            })

            // フィルター検索Box で1個もヒットしなかった場合(全て display_none)は、全件表示する
            if (!document.querySelectorAll('table#filter_table tr:not(.display_none)').length){
                console.log("Nothing!");
                filterCheckBoxElement.forEach(function(checkbox){
                    checkbox.parentElement.parentElement.classList.remove('display_none');
                });
            }
        })
        
        function getFilterCkeck(){
            let filter_value = []
            // ユーザが選択した checkBox を反映させるため以前のチェックリストを削除する
            filterCheckList.length = 0;
            let filter_checkbox = modal.querySelectorAll('input[name=filter_ck]');
            filter_checkbox.forEach(function(checkbox,index) {
                if (checkbox.checked) {
                    // index でやればよかった
                    console.log('チェックされています:', checkbox,"index:" ,index);
                    console.log('[値]:', Number(checkbox.value));
                    filterCheckList.push(index);
                    filter_value.push(col_vals[Number(checkbox.value)]);
                }
            })
            return filter_value
        };
       
        function filterOn(){
            document.body.removeChild(modal);
            filterColumn = column.getField();
            table.setFilter(filterColumn, "in", getFilterCkeck());
            modal = ''
        }

        function filterOff(){
            document.body.removeChild(modal);
            table.clearFilter();
            filterCheckList.length = 0;
            modal = ''
        }

        document.addEventListener('click',function(event){
            // if (!modal.contains(event.target)){
            // クリックされた要素がモーダルに含まれていれば消去しない
            if(modal && document.body.contains(modal) && 
            event.target.className !== 'filter_obj' && 
            !modal.contains(event.target)){
                console.log('Delete');
                document.body.removeChild(modal);
                modal = ''
                console.log(modal);
            } 
        })
    }
});









