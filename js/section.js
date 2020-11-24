let isEditLayer = 0;
let currentDate = new Date();

window.addEventListener('DOMContentLoaded', function() {
    setTodayDate();
});

// ========== Section-Header 날씨 관련 ==========
function setTodayDate() {
    currentDate = new Date();
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
    alert("데이터 갱신 버튼");
}

function shareInfo() { // 공유버튼
    alert("공유 버튼");
}

