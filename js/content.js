//document.body.style.border = "5px solid red";
let myLinks = [];
let linksFromStorage = JSON.parse(localStorage.getItem("myLinks"));
const downloadBTN = document.getElementById('download-btn');
const deleteBTN = document.getElementById('del-btn');
const saveBTN = document.getElementById('save-btn');
const helpBTN = document.getElementById('help-btn');
const noticeBTN = document.getElementById('notice-btn');
const listElement = document.getElementById('tab-list');
const inputField = document.getElementById('input-field');
const errorLabel = document.getElementById('error-label');
let note = "note";
if (linksFromStorage) {
    myLinks = linksFromStorage;
    UpdateLinks(myLinks);
};

helpBTN.addEventListener("click", () => {
    browser.tabs.create({
        active: true,
        url: "help.html",
    }, null);
});

saveBTN.addEventListener('click', (tabs) => {
    browser.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        myLinks.push(tabs[0].url);
        localStorage.setItem("myLinks", JSON.stringify(myLinks));
        UpdateLinks(myLinks);


    });
})

noticeBTN.addEventListener('click', () => {
    saveNotice();

})
deleteBTN.addEventListener('click', () => {
    deleteList();

})
downloadBTN.addEventListener('click', () => {
    downloadList();
})
browser.browserAction.onClicked.addListener(() => {
    let clearing = browser.notifications.clear(note);
    clearing.then(() => {
        console.log("cleared");
    });
})




function downloadList() {
    if (myLinks != []) {
        const header = 'Your List of Links from LinkSafer\nThanks for enjoying my software.\nS3R43o3\n\n';
        var today = new Date();
        var time = today.getDay() + "." + today.getMonth() + "." + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const footer = '\n\nFile created at:\n' + time;
        DownloadContainer(header + myLinks.join("\n") + footer, "text/list", 'LinkSafer-List.txt');

    } else {
        browser.notifications.create(note, {
            type: "basic",
            iconUrl: "assets/icon/Foursquare-icon.png",
            title: "ERROR 3o3",
            message: "Your List is empty, cant download empty value!"
        })

    }

}


function errorNoInput() {
    if (!window.Notification) {
        console.log("Browser does not support notifications");
    } else {
        if (Notification.permission === "granted") {
            var noteUser = new Notification("ERROR 3o3", {
                body: "Your Inputfield is empty, cant save empty value!",
                icon: "assets/icon/blueicon_256.png",
            });
            notifications.create(noteUser);
        } else {
            Notification.requestPermission()
                .then(function (p) {
                    if (p === "granted") {
                        var noteUser2 = new Notification("ERROR!", {
                            body: "Your Inputfield is empty, cant save empty value!",
                            icon: "assets/icon/blueicon_256.png",
                        });
                        notifications.create(noteUser2);
                    } else {
                        errorLabel.innerText = "User blocked notifications";
                    }
                })
                .catch(function (err) {
                    console.error(err);
                })
        };
    }
}


function saveNotice() {
    if (inputField.value == "") {
        browser.notifications.create(note, {
            type: "basic",
            iconUrl: "assets/icon/blueicon_256.png",
            title: "ERROR 3o3",
            message: "Your Inputfield is empty, cant save empty value!"

        })
    } else {
        myLinks.push(inputField.value);
        localStorage.setItem("myLinks", JSON.stringify(myLinks));
        UpdateLinks(myLinks);
    }
}





function UpdateLinks(links) {
    const firstPart = "<li><a id='a' style='overflow: hidden; text-decoration: underline;' target='_blank' href='";
    const secondPart = "'><br/>";
    const lastPart = '</a></li>';
    const protocol = "http";
    const withOutHttp = "<li><a id='a' style='overflow: hidden; text-decoration: none;' ";
    const withOutHttp2 = "><br/>";
    var listItems = "";
    for (let i = 0; i < links.length; i++) {
        if (links[i].includes(protocol)) {
            listItems += firstPart + links[i] + secondPart + links[i] + lastPart;
        } else {
            listItems += withOutHttp + withOutHttp2 + links[i] + lastPart;
        }
    };
    while (listElement.firstChild) {
        listElement.removeChild(listElement.firstChild);
    };
    const list = listItems;
    listElement.appendChild(document.createRange().createContextualFragment(list));
}

function DownloadContainer(text, fileType, fileName) {
    var blob = new Blob([text], {
        type: fileType
    });
    var a = document.createElement("a");
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(":");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
        URL.revokeObjectURL(a.href);
    }, 1500);
}

function deleteList() {
    localStorage.clear();
    myLinks = [];
    UpdateLinks(myLinks);
}