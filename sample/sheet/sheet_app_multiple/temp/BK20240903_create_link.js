let sheet_link_element = document.querySelector('li#sheet_link');
// ここで取得すると位置がずれるので不可
// const POSITION_SHEET_LINK  = sheet_link_element.getBoundingClientRect();
sheet_link_element.addEventListener('click',create_link);
    


 function create_link(event){
    // event.stopPropagation();
    // 既に表示されている modal は一旦消す
    if (typeof modal_sheet_link !== 'undefined'){
        console.log("Remove modal_sheet_link")
        document.body.removeChild(modal_sheet_link);
        modal_sheet_link = '';
    }

    console.log("Create modal_sheet_link")
    modal_sheet_link = document.createElement('div');
    modal_sheet_link.innerHTML = `
    <div class="modal_sheet_link">
        <div class="modal_sheet_inner">   
            <ul>
                <li><a href="#">Index</a></li>
                <li><a href="#">Brand</a></li>                
                <li><a href="#">Verification</a></li>
                <li><a href="#">priority</a></li>
                <li><a href="#">Verification_Sheet</a></li>
                <li><a href="#">Verification_Sheet</a></li>
                <li><a href="#">Verification_Sheet</a></li>
                <li><a href="#">Verification_Sheet</a></li>
                <li><a href="#">Verification_Sheet</a></li>
            </ul>
        </div>
        <div class="modal_sheet_link_scroll"></div>
        <div id="modal_sheet_link_close">x</div>
    </div>    
    `;
    
    // 作成した要素をドキュメントに追加
    document.body.appendChild(modal_sheet_link);
    // #todo ---------------------------------------------------------------------------------------------------
    // 2024/08/30  モーダルの表示位置を <ul class="navi"> の位置に合わせる → OK
    // 2024/09/03 モーダルを閉じる処理 → Now
    // マスターシート以外のシータの表示する列などデータ構造を考える。
    // ---------------------------------------------------------------------------------------------------

    // 関数内で位置を取得しないと位置がずれる
    const POSITION_SHEET_LINK  = sheet_link_element.getBoundingClientRect();
    // console.log(POSITION_SHEET_LINK["bottom"])
    // console.log(POSITION_SHEET_LINK["left"])
    // console.log(POSITION_SHEET_LINK["width"])
    const POSITION_X = POSITION_SHEET_LINK["left"] - POSITION_SHEET_LINK["width"] -20
    const POSITION_Y = POSITION_SHEET_LINK["bottom"];
    modal_sheet_link.style=`position: fixed; top: ${POSITION_Y}px; left:${POSITION_X}px;`

    // let x_mouse = event.clientX -100;
    // let y_mouse = event.clientY + 17;
    // modal.style=`position: fixed; top: ${y_mouse}px; left:${x_mouse}px;`
    
    // modal.style=`position: fixed; top: 300px; left:400px;`
    // [スクロールイベントの設定]
    // toggle により CSSを変化させる要素。
    // この要素に modal_sheet_on_scroll クラスを付けてスクロールを表示させる。
    let modal_SheetLinkElement = document.querySelector('div.modal_sheet_link');
    // 右端の　div.modal_sheet_link_scroll　にマウスが入るとスクロールバーを表示させる
    let modal_SheetLinkScrollEelment = document.querySelector('div.modal_sheet_link_scroll');
    modal_SheetLinkScrollEelment.addEventListener('mouseenter',onScroll)
    
    function onScroll(event){
        console.log("CHangeeee!!")
        modal_SheetLinkElement.classList.toggle('modal_sheet_on_scroll');
        modal_SheetLinkScrollEelment.removeEventListener('mouseenter', onScroll)
        setTimeout(() => {
            modal_SheetLinkElement.classList.toggle('modal_sheet_on_scroll');
            modal_SheetLinkScrollEelment.addEventListener('mouseenter',onScroll);
        }, "5000")
    }
    // document.addEventListener('click',function(event){
    //     console.log('event.target  ', event.target)
    //     console.log('event.target.id  ', event.target.id)
    //     // if (!modal.contains(event.target)){
    //     // クリックされた要素がモーダルに含まれていれば消去しない
    //     if(modal_sheet_link 
    //         && document.body.contains(modal_sheet_link) 
    //         && event.target.id !== 'sheet_link' 
    //         && !modal_sheet_link.contains(event.target)){
    //         console.log('Delete modal_sheet_link');
    //         document.body.removeChild(modal_sheet_link);
    //         modal_sheet_link = ''
    //         console.log(modal_sheet_link);
    //     } 
    // })
    // 閉じるボタンの設定
    let linkCloseElement = document.querySelector('div#modal_sheet_link_close');
    linkCloseElement.addEventListener('click', function(){
        document.body.removeChild(modal_sheet_link);
        modal_sheet_link = undefined;
        console.log("Remove modal_sheet_link  and  modal_sheet_link is undefined")
    }) 
}



// 
document.addEventListener('click',function(event){
    console.log('event.target  ', event.target)
    console.log('event.target.id  ', event.target.id)
    // if (!modal.contains(event.target)){
    // クリックされた要素がモーダルに含まれていれば消去しない
    if(modal_sheet_link 
        && document.body.contains(modal_sheet_link) 
        && event.target.id !== 'sheet_link' 
        && !modal_sheet_link.contains(event.target)){
        console.log('Delete modal_sheet_link');
        document.body.removeChild(modal_sheet_link);
        modal_sheet_link = ''
        console.log(modal_sheet_link);
    } 
})    



// document.addEventListener('click',function(event){
//     // if (!modal.contains(event.target)){
//     // クリックされた要素がモーダルに含まれていれば消去しない
//     if(modal_sheet_link && document.body.contains(modal_sheet_link) && 
//     !modal_sheet_link.contains(event.target)){
//         console.log('Delete modal_sheet_link');
//         document.body.removeChild(modal_sheet_link);
//         modal_sheet_link = ''
//         console.log(modal_sheet_link);
//     } 
// })

// modal.innerHTML = `
    // <div class="modal_sheet_link">
    //     <div class="modal_sheet_inner">            
    //         <ul>
    //             <li><a href="#">Index</a></li>
    //             <li><a href="#">Brand</a></li>                
    //             <li><a href="#">Verification</a></li>
    //             <li><a href="#">priority</a></li>
    //             <li><a href="#">Verification_Sheet</a></li>
    //             <li><a href="#">Verification_Sheet</a></li>
    //             <li><a href="#">Verification_Sheet</a></li>
    //             <li><a href="#">Verification_Sheet</a></li>
    //             <li><a href="#">Verification_Sheet</a></li>
    //         </ul>
    //         <div class="modal_sheet_link_scroll"></div>                      
    //     </div>
        
    // </div>
    // `;
    // modal_SheetLinkScrollEelment.addEventListener('mouseenter',() => {   
    //     console.log("CHangeeee!!")
    //     modal_SheetLinkElement.classList.toggle('modal_sheet_on_scroll');
        
    //     // classList.add('display_none')
    //     // setTimeout(() => {
    //     //     modal_SheetLinkElement.classList.toggle('modal_sheet_on_scroll')
    //     // }, "5000")
    // });
    // modal_SheetLinkScrollEelment.addEventListener('mouseleave',() => {
    //     // modal_SheetLinkScrollEelment.addEventListener('click',() => {
    //     console.log("Deleteeee!!")
    //     modal_SheetLinkElement.classList.toggle('modal_sheet_on_scroll');
    //     // classList.add('display_none')
    // });
 

 
// let modal_SheetLinkScrollEelment = document.querySelector('div.modal_sheet_link_scroll');
// let modal_SheetInnerElement = document.querySelector('div.modal_sheet_inner');
// modal_SheetLinkScrollEelment.addEventListener('mouseover ',() => {
//     console.log("CHangeeee!!")
//     modal_SheetInnerElement.classList.toggle('modal_sheet_on_scroll');
//     // classList.add('display_none')
// });

//  クラス属性を操作して　overflow-y: scroll;　を付けたり消したりする
// 右端に何か div要素を作成し、それに対するマウスオーバーとマウスインイベントを発生させる。
// デザイン
// https://colorlib.com/wp/bootstrap-hamburger-menu/




    // modal = document.createElement('div');
    // modal.innerHTML = `
    // <div class="modal_filter">
    //     <div class="modal_filter_inner"">
    //         <div id="filter_button">
             
    //         </div>
            
            
    //     </div>
    // </div>
    // `;

    // // 作成した要素をドキュメントに追加
    // document.body.appendChild(modal);
    // // modal.style=`position: fixed; top: ${y_mouse}px; left:${x_mouse}px;`
    // modal.style=`position: fixed; top: 300px; left:400px;`


    // 
    // let col_vals = column.getCells().map(cell => cell.getValue());
    //  重複要素を取り除く
    // col_vals = Array.from(new Set(col_vals));
    // 親要素(tbody)の取得
    // let filter_table = document.querySelector('table#filter_table');
    // console.log('[filterCheckList]',filterCheckList)
    // let tdHTML = col_vals.map((value, index, array) => {
    //     if (filterColumn !== column.getField()){
    //         filterCheckList.length = 0;
    //     }
    //     let td_html = ''
    //     // 値がない場合は Nothing の表記にする
    //     value = value == ""? 'Nothing': value;
    //     if(filterCheckList.includes(index)){
    //         td_html = `<tr><td><input type="checkbox" name="filter_ck" checked id="filter_td_${index}" value=${index} data-text=${value} />${value}</td></tr>`
    //     }else{
    //         td_html =`<tr><td><input type="checkbox" name="filter_ck" id="filter_td_${index}" value=${index} data-text=${value} />${value}</td></tr>`
    //     }
    //     return td_html
    // }).join('');
    // filter_table.innerHTML = tdHTML;

        // // フィルター実行ボタンの設定
        // let filterOnElement = document.querySelector('button#filter_on');
        // filterOnElement.addEventListener('click',function(){
        //     filterOn();
        // })
        // // フィルター解除ボタンの設定
        // let filterOffElement = document.querySelector('button#filter_off');
        // filterOffElement.addEventListener('click', function(){
        //     filterOff();
        // })
        // // 閉じるボタンの設定
        // let filterCloseElement = document.querySelector('button#modal_close');
        // filterCloseElement.addEventListener('click', function(){
        //     document.body.removeChild(modal);
        //     modal = '';
        // })
        // // フィルター検索Box
        // let filterSearchElement = document.querySelector('input#filter_text');
        // filterSearchElement.addEventListener('blur', function(){
        //     filterSearchList = filterSearchElement.value.split(/\s+/);
        //     console.log(filterSearchList,"@@@@");
        //     let filterCheckBoxElement = document.querySelectorAll('input[name="filter_ck"]');
        //     filterCheckBoxElement.forEach(function(checkbox, index){
        //         // データ属性(data-text) を利用する if(filterSearchList.length[0])
        //         if(filterSearchList.includes(checkbox.dataset.text)){
        //             console.log('[checked] checkBox.dataset.text ', checkbox.dataset.text);
        //             checkbox.checked = true;
        //         } else {
        //             checkbox.checked = false;
        //             console.log("[display_none] partent ",checkbox.parentElement)
        //             checkbox.parentElement.parentElement.classList.add('display_none');
        //         }
        //     })

        //     // フィルター検索Box で1個もヒットしなかった場合(全て display_none)は、全件表示する
        //     if (!document.querySelectorAll('table#filter_table tr:not(.display_none)').length){
        //         console.log("Nothing!");
        //         filterCheckBoxElement.forEach(function(checkbox){
        //             checkbox.parentElement.parentElement.classList.remove('display_none');
        //         });
        //     }
        // })
        
        // function getFilterCkeck(){
        //     let filter_value = []
        //     // ユーザが選択した checkBox を反映させるため以前のチェックリストを削除する
        //     filterCheckList.length = 0;
        //     let filter_checkbox = modal.querySelectorAll('input[name=filter_ck]');
        //     filter_checkbox.forEach(function(checkbox,index) {
        //         if (checkbox.checked) {
        //             // index でやればよかった
        //             console.log('チェックされています:', checkbox,"index:" ,index);
        //             console.log('[値]:', Number(checkbox.value));
        //             filterCheckList.push(index);
        //             filter_value.push(col_vals[Number(checkbox.value)]);
        //         }
        //     })
        //     return filter_value
        // };
       
        // function filterOn(){
        //     document.body.removeChild(modal);
        //     filterColumn = column.getField();
        //     table.setFilter(filterColumn, "in", getFilterCkeck());
        //     modal = ''
        // }

        // function filterOff(){
        //     document.body.removeChild(modal);
        //     table.clearFilter();
        //     filterCheckList.length = 0;
        //     modal = ''
        // }

        // document.addEventListener('click',function(event){
        //     // if (!modal.contains(event.target)){
        //     // クリックされた要素がモーダルに含まれていれば消去しない
        //     if(modal && document.body.contains(modal) && 
        //     event.target.className !== 'filter_obj' && 
        //     !modal.contains(event.target)){
        //         console.log('Delete');
        //         document.body.removeChild(modal);
        //         modal = ''
        //         console.log(modal);
        //     } 
        // })
//     }
// });
