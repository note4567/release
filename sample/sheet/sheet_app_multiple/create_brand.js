// グローバル変数としてTabulatorのインスタンスを宣言
var table;
const csrfToken = "{{ csrf_token }}";
// フィルター
let filterColumn = ''
let filterCheckList = []
let modal = ''

table = new Tabulator("#brand_table", {
    data: [        
        { id:991, brand:34, table: 1045, type:"変更", before:"Mister Donut", after:"ミスタードーナツ", date:"2023/10/11", memo:"表記変更", erase:'削除',cssClass: "custom"},
        { id:83, brand:78, table:899, type:"新規", before: "", after: "ピザBENTO", date:"2023/12/09", memo:"", erase:'削除',cssClass: "custom"},
        { id:331, brand:3001, table:178, type: "削除", before:"イオンバイク（株）", after:"", date:"2023/12/15", memo:"表記変更", erase:'削除',cssClass: "custom"},        
        { id:143, brand:3002, table:1501, type:"新規", before: "", after: "イオン北海道（株）", date:"2024/01/09", memo:"", erase:'削除',cssClass: "custom"},        
    ],
    columns : columnDefinitions,  // 列の定義を外部ファイルから取得
    layout:"fitDataFill",
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


//  検証用なので後で削除する --------------------------------------------------
table.on("cellEdited", function(cell){     
    //[削除処理] -----------------------------------------------------------------
    // サーバーから返された値の中で、削除した id を取得する。
    // 返却メッセージが delete の場合
    // この例では cell.getValue() で代替している
    // この id が現在のテーブルに有るかどうか検索する。
    // 検索した結果が存在すれば削除処理を実行する。
    // 無ければ削除処理は実行しない。
    console.log('[cell]:', cell.getValue());
    // RowToDelete = table.searchData("id", "=", 83);
    // searchData: https://tabulator.info/docs/6.2/filter#search-data
    RowToDelete = table.searchData("id", "=", cell.getValue());    
    if (RowToDelete.length > 0){
        console.log("[RowToDelete]: ",RowToDelete[0]["id"])
        table.deleteRow(RowToDelete[0]["id"]) 
    }    
    // console.log("[searchRows] ",table.searchRows("id", "=", 83)); → これだと取得した値が proxy になる
    // -----

    // [更新と行の作成] ------------------------------------------------------------
    // idが無い空白行を削除
    let RowToInsert = table.searchRows("id", "=", undefined);
    console.log('[id が無い行を取得]',RowToInsert);
    if (RowToInsert.length > 0){
        console.log('@@@@@',RowToInsert, typeof(RowToInsert));       
        table.deleteRow(RowToInsert)        
    }
    // ------------------------------------------------------------
    
    // update とcreate はこれで対応可能
    // 返却メッセージが update の場合
    // サーバーから返された値から更新対象の行を取得する
    // 返却された行と
    // この id が現在のテーブルに有るかどうか検索する。
    // 検索した結果が存在しなければ、id が無い行(addされた行)に行全体を更新する。
    
    // console.log('[id が無い行を取得]',table.searchData("id", "=", null));
    // searchDataではダメ
    // let RowToInsert = table.searchData("id", "=", undefined);
    // let RowToInsert = table.searchRows("id", "=", undefined);

    // var row = table.getRow(RowToInsert);
    // console.log("vvvvv",row, typeof row)
    // table.updateOrAddData([{id:undefined,lbc:"-999"}]);

    // if (RowToInsert.length > 0){
    //     console.log('@@@@@',RowToInsert, typeof(RowToInsert));
    //     // RowToInsert[0]["id"] = 99999
    //     // RowToInsert[0]["lbc"] = 1111
    //     // https://tabulator.info/docs/6.2/update#addrow
    //     // RowToInsert.delete();
        
    //     // table.deleteRow(RowToInsert[0]['id']) 
    //     table.deleteRow(RowToInsert) 
    //     // table.replaceData([RowToInsert[0], {id:2,lbc:"7777"}]) 
    //     // table.updateOrAddData([{id:999,lbc:"999"}]);
    // }
    // table.updateOrAddData(RowToInsert);
    // table.updateOrAddData([{id:"", lbc:777}]);
    
    // idが存在すれば、サーバーから取得した行と現在のシートの行の差分のみ更新する。
    // delete は id についてき if文で切り分ける(既に削している場合は処理しない)
    // table.deleteRow(83)
    // https://www.homes.co.jp/realtor/
    // ---------

    // table.setData([{id:83, lbc:777},{id:84, lbc:777},{id:85, lbc:777},{id:86, lbc:777},{id:87, lbc:777}]);
    // localStorage.setItem('x_mouse', event.clientX);
    // localStorage.setItem('y_mouse', event.clientY);
    // console.log(localStorage.getItem('x_mouse'));
    // console.log(localStorage.getItem('y_mouse'));
    // console.log(table);
    // table.setData(table["data"][0])
});
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









