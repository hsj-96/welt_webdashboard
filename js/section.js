let isEditLayer = 0;
let isShareClick = 0;
let currentDate = new Date();

window.addEventListener('DOMContentLoaded', function() {
    setTodayDate();
});

// ========== Section-Header 날짜 관련 ==========
function setTodayDate() {
    currentDate = new Date();
    currentDate.setFullYear(2019);
    currentDate.setMonth(6 - 1);
    currentDate.setDate(20);


    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();
    const day = currentDate.getDay();
    const dayName = ["일", "월", "화", "수", "목", "금", "토"];

    const gridItems = document.querySelector(".todayDate");
    gridItems.innerHTML = `${year}. ${month}. ${date}. (${dayName[day]})`
}
// ==================================================

// ========== 커스터마이징 기능 ==========
function editLayout() { 
    if(isEditLayer == 0) { 
        createHandleButton();
        isEditLayer = 1;
    }
    else {
        removeHandleButton();
        isEditLayer = 0;
    }
}

function createHandleButton() {
    const gridItems = document.querySelectorAll(".gridItem");
    gridItems.forEach(function(gridItem) {
        const handle= document.createElement('img');
        handle.className = "handle";
        handle.src = "./img/edit_arrow.png";
        gridItem.appendChild(handle);
    });

    const editButton = document.querySelector(".dashNavEventIcon");
    editButton.src = "./img/icon/layout-icon-select.png";
}
function removeHandleButton() {
    const handles = document.querySelectorAll(".handle");
    handles.forEach(function(handle) {
        handle.parentNode.removeChild(handle);
    });

    const editButton = document.querySelector(".dashNavEventIcon");
    editButton.src = "./img/icon/layout-icon-black.png";
}
// ==================================================

function refreshLayout() { // 데이터 갱신
    //alert("데이터 갱신 버튼");
    window.location.reload();
}

// ==================================================

function shareInfo() { // 공유버튼
    if(isShareClick == 0) { 
        createShareSection();
        isShareClick = 1;
    }
    else {
        removeShareSection();
        isShareClick = 0;
    }
}

function createShareSection() {
    const gridItems = document.querySelectorAll(".gridItem");
    gridItems.forEach(function(gridItem, idx) {
        const shareEl = document.createElement('div');
        shareEl.className = "shareDiv";

        const shareIcon = document.createElement('img');
        shareIcon.className = "shareDivIcon";
        shareIcon.id = idx;
        shareIcon.src = "./img/icon/share-icon.png";

        shareIcon.addEventListener('click', function() {
            const el = document.querySelectorAll('.shareDiv');
            el.forEach(function(el) {
                el.style.display = 'none';
            });

            html2canvas(document.querySelector(`#item${idx+1}`)).then(function(canvas)
            {
                const canUri = canvas.toDataURL();
                const filename = ['기간별 데이터', '소모 칼로리', '앉은 시간', '걸음수 걸음걸이', '오늘의 랭킹', '운동 정보'];
                saveAs(canUri, filename[idx]);
            });

            el.forEach(function(el) {
                el.style.display = 'flex';
            });
        });

        shareEl.appendChild(shareIcon);

        gridItem.appendChild(shareEl);
    });
}

function removeShareSection() {
    const shareEl = document.querySelectorAll(".shareDiv");
    shareEl.forEach(function(el) {
        el.parentNode.removeChild(el);
    });
}


    /*html2canvas(document.querySelector("#item1")).then(function(canvas)
    {
        var canUri = canvas.toDataURL();
        saveAs(canUri, '다운로드');
    })*/

function saveAs(uri, filename)  {
    var link = document.createElement('a');
    link.href = uri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
