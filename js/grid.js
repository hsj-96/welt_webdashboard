window.onload = function () {
    Sortable.create(gridList, { 
        //handle: '.handle',
        swapThreshold: 1,
        animation: 150,
    });
}

function createHandleButton() {
    const gridItems = document.querySelectorAll(".gridItem");
    gridItems.forEach(function(gridItem) {
        const handle= document.createElement('img');
        handle.className = "handle";
        handle.src = "/img/edit_arrow.png";
        gridItem.appendChild(handle);
    });
}
function removeHandleButton() {
    const handles = document.querySelectorAll(".handle");
    handles.forEach(function(handle) {
        handle.parentNode.removeChild(handle);
    });
}
