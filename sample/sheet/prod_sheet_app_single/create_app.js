// グローバル変数としてTabulatorのインスタンスを宣言
var table;
const csrfToken = "{{ csrf_token }}";
// フィルター
let filterColumn = ''
let filterCheckList = []
let modal = ''

// 初期化処理
document.addEventListener('DOMContentLoaded', function () {
    // 初期化処理を非同期で実行
    initializationProcess()
        .then(function() {
            // 初期化後に実行したいコードブロック
            // [セルが編集されたときの処理]
            // データ全体を取得
            table.on("dataChanged", function(data){
                console.log('[data edited]:', data)
            });
            // 挿入時の処理
            table.on("rowAdded", function(row){
                insertCell(row)
            });
            // 削除時の処理
            table.on("rowDeleted", function(row){
                deleteCell(row)
            });
            // 編集されたセルのデータを取得
            table.on("cellEdited", function(cell){
                updateCell(cell)
            });
            //
            table.on("headerClick", function(event, column){
              // 子要素である 矢印要素
            //   console.log('event.target.tagName',event.target.tagName)
            //   console.log('event.target.tagName',event.target.className)
            //   // 親要素である header要素
            //   console.log('e.currentTarget.tagName:',event.currentTarget.tagName)
              let x_mouse = event.clientX
              let y_mouse = event.clientY
              if (event.target.className === 'filter_obj'){
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
                  // セルの列の値を取得
                  let col_vals = column.getCells().map(cell => cell.getValue());
                  //  重複要素を取り除く
                  col_vals = Array.from(new Set(col_vals));
                  // 親要素(tbody)の取得
                  let filter_table = document.querySelector('table#filter_table');
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
                      let filterCheckBoxElement = document.querySelectorAll('input[name="filter_ck"]');
                      filterCheckBoxElement.forEach(function(checkbox, index){
                          // データ属性(data-text) を利用する
                          if(filterSearchList.includes(checkbox.dataset.text)){
                              checkbox.checked = true;
                          } else {
                              checkbox.checked = false;
                              checkbox.parentElement.parentElement.classList.add('display_none');
                          }
                      })
                      // フィルター検索Box で1個もヒットしなかった場合(全て display_none)は、全件表示する
                      if (!document.querySelectorAll('table#filter_table tr:not(.display_none)').length){
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
                      // クリックされた要素がモーダルに含まれていれば消去しない
                      if(modal && document.body.contains(modal) && 
                      event.target.className !== 'filter_obj' && 
                      !modal.contains(event.target)){
                          document.body.removeChild(modal);
                          modal = ''
                      } 
                  })
              }
          });
    });
});

function initializationProcess() {
    return new Promise(function(resolve, reject) {
        // 初期化処理
	let apiUrl = "https://192.168.56.5:8081/api/sheets/";
        fetch(apiUrl, {
            method: "GET",
            //headers: headers,
        })
            .then(response => response.json())
            .then(data => {
                // 2. Create Tabulator
                table = new Tabulator("#intage_table", {
                    // data: には配列を指定する。
                    // fetch() の戻り値である data は Object であり results キーの中にデータが配列としてある。
                    data: data.results,
                    // 2024/03/28
                    // 列の定義を外部ファイルから取得
                    columns : columnDefinitions,
                });
                resolve();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                reject(error);
            });
    });
}

// 行の追加
document.getElementById("add-row").addEventListener("click", function(){
  table.addRow({});
});


//
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // ページが可視になった時の処理
        location.reload();
    } 
});

window.addEventListener('focus', function() {
    // ページにフォーカスされた時の処理
    if (!webSocketConnected) {
        location.reload()
    }
});

// リロード関数
function reloadPage(){
    // WebSocketの接続がない場合はリロードさせる
    if (!webSocketConnected) {
        confirm('リロードして下さい') ? location.reload() : null;
    } else{
        return true
    }
}

// PUT 関数
function updateCell(cell) {
    // WebSocketの接続状態をチェック
    if (!reloadPage()){
        // ページのリロードが行われなかった場合は undefined が返り return させる
        return
    }
    let data_id = cell.getData()['id'];
    const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    // ヘッダーにCSRFトークンを追加
    const headers = {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    };

    // PUT や DELETE ではモデルの IDまで指定する
    let apiUrl = `https://192.168.56.5:8081/api/sheets/${data_id}/`;
    // Create data in the database
    fetch(apiUrl, {
      method: "PUT",
      headers: headers,
      // JavaScript オブジェクトを Json文字列に変換
      body: JSON.stringify(cell.getData()),
    })
      .then(response => response.json())
      .then(data => {
        ;
      })
      .catch(error => console.error("[PUT Error]", error));
  };

  // Insert 関数
function insertCell(row) {
    // WebSocketの接続状態をチェック
    if (!reloadPage()){
        // ページのリロードが行われなかった場合は undefined が返り return させる
        return
    }
    //
    let data_id = row.getData()['id'];
    const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    // ヘッダーにCSRFトークンを追加
    const headers = {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    };

    // PUT や DELETE ではモデルの IDまで指定する
    let apiUrl = `https://192.168.56.5:8081/api/sheets/`;
    // Create data in the database
    fetch(apiUrl, {
      method: "POST",
      headers: headers,
      // JavaScript オブジェクトを Json文字列に変換
      body: JSON.stringify(row.getData()),
    })
      .then(response => response.json())
      .then(data => {
        ;
      })
      .catch(error => console.error("[POST Error]", error));
  };

// Delete 関数
function deleteCell(row) {
    // WebSocketの接続状態をチェック
    if (!reloadPage()){
        // ページのリロードが行われなかった場合は undefined が返り return させる
        return
    }
    //
    let data_id = row.getData()['id'];
    const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    // ヘッダーにCSRFトークンを追加
    const headers = {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    };

    // PUT や DELETE ではモデルの IDまで指定する
    let apiUrl = `https://192.168.56.5:8081/api/sheets/${data_id}/`;
    // Create data in the database
    fetch(apiUrl, {
      method: "DELETE",
      headers: headers,
    })
    .then(response => {
        if (response.status === 204 || response.status === 200) {
        console.log("DELETE Request: Successfully deleted.");
        } else {
        console.error(`[${response.status}] DELETE Request: Failed to delete.`);
        } 
    })
    .catch(error => console.error("[DELETE Error]", error));
  };

// WebSocketの接続状態を管理する変数
let webSocketConnected = false; 
// クライアント側のWebSocket接続:
//var socket = new WebSocket('ws://' + window.location.host + '/ws/your_model_updates/');
var socket = new WebSocket('wss://' + window.location.host + '/ws/your_model_updates/');

// 接続状態を管理
socket.onopen = () => {
  webSocketConnected = true;
  console.log('WebSocket connection established');
};
socket.onclose = () => {
  webSocketConnected = false;
  console.log('WebSocket connection closed');
};

// データの更新
socket.onmessage = function (event) {
  // Update Tabulator with the received data
  var receivedData = JSON.parse(event.data);
  table.setData(receivedData.message.results);
};

// [レスポンシブ対応]
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
