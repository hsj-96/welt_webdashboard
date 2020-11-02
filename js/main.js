window.addEventListener('DOMContentLoaded', function() {
    const alarmButton = document.querySelector(".header-alarm");
    const alarmModal = document.querySelector(".alarm-modal");
    const alarmCloseButton = document.querySelector(".alarm-modal-close");

    alarmButton.onclick = function() {
        alarmModal.style.display = "block";
    }

    window.onclick = function(event) {
        if (event.target == alarmCloseButton) {
            alarmModal.style.display = "none";
        }
    }

    const userButton = document.querySelector(".header-user");
    userButton.onclick = function() {
        alert("유저 프로필 아이콘 클릭");
    }
});