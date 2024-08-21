document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        const filter = document.getElementById('filter');
        filter.classList.add('active');
    }, 2);
});

var win = navigator.platform.indexOf('Win') > -1;
if (win && document.querySelector('#sidenav-scrollbar')) {
    var options = {
        damping: '0.5'
    }
    Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
}

function datasensor() {
    var http = new XMLHttpRequest();
    http.open("GET", "http://api-dti.azycloud.my.id/GetCurrent", true);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var len = data.length;
            main(data, len);
        }
    }
}
function Upper(data, len) {
    document.getElementById("tbdproduct").innerHTML = data[data.length - 1].Turbidity_Product.toFixed(2);
    document.getElementById("TBDSA").innerHTML = data[data.length - 1].Turbidity_Sedimentation_A.toFixed(2);
    document.getElementById("TBDSB").innerHTML = data[data.length - 1].Turbidity_Sedimentation_B.toFixed(2);
}

function main(data, len) {
    Upper(data, len);
}
datasensor();
setInterval(datasensor, 5000);

function toggleMode(option, thisID, otherID, nID) {
    var url = "http://api-dti.azycloud.my.id/getFilterMode?";
    if (option === 'A') {
        document.getElementById(otherID).checked = false;
        document.getElementById("AutoF" + nID).style.display = "block";
        document.getElementById("ManualF" + nID).style.display = "none";
        url = url + "ID=" + thisID + "&Mode" + "=1"
    } else if (option === 'B') {
        document.getElementById(otherID).checked = false;
        document.getElementById("AutoF" + nID).style.display = "none";
        document.getElementById("ManualF" + nID).style.display = "block";
        url = url + "ID=" + thisID + "&Mode" + "=0"
    }

    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.send();
}


function btnExecute(buttonId) {
    updateFlag = false;
    var buttonElement = document.getElementById(buttonId);
    var originalColor = buttonElement.style.backgroundColor;
    document.querySelectorAll("button").forEach(function (buttonElement) {
        buttonElement.disabled = true;
    })
    setTimeout(() => {
        document.querySelectorAll("button").forEach(function (buttonElement) {
            buttonElement.disabled = false;
        })

    }, 4500)
    buttonElement.style.backgroundColor = "#f75e05";
    buttonElement.style.color = "#fff";
    buttonElement.innerHTML = '<i class="btn bx bxs-bolt-circle bx-flashing btn-loading-run"></i>';

    if (originalColor === "rgb(94, 114, 228)") {
        var action = 1;
    } else if (originalColor === "rgb(0, 247, 21)") {
        var action = 0;
    }
    var http = new XMLHttpRequest();
    var url = "http://api-dti.azycloud.my.id/getTombol?" + buttonId + "=" + action;
    console.log(url);
    http.open("GET", url, true);
    http.send();
    setTimeout(function () {
        updateFlag = true;
        updateButton();
    }, 4500);
}

var updateFlag = true;
function updateButton() {
    if (updateFlag) {
        var http = new XMLHttpRequest();
        var url = "http://api-dti.azycloud.my.id/dti-get-update-sensor?";
        http.open("GET", url, true);
        http.send();
        http.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var data = JSON.parse(this.responseText);
                // console.log(data);
                var btnID = ['FC1IN', 'FC1OU', 'FC1DR', 'FC1BL', 'FC1BW', 'FC2IN', 'FC2OU', 'FC2DR', 'FC2BL', 'FC2BW'];
                var btnNM = ['Inlet', 'Outlet', 'Drain', 'Blower', 'Backwash'];

                for (let i = 0; i < 10; i++) {
                    for (let j = 1; j <= 4; j++) {
                        buttonElement = document.getElementById(btnID[i] + j);
                        if (data[0][`${btnID[i] + j}`] === 1) {
                            buttonElement.style.backgroundColor = "rgb(0, 247, 21)";
                        } else if (data[0][`${btnID[i] + j}`] === 0) {
                            buttonElement.style.backgroundColor = "rgb(94, 114, 228)";
                        }
                        buttonElement.textContent = btnNM[i % 5];
                    }
                }

            }
        }
    }
}

updateButton();
setInterval(updateButton, 5000);