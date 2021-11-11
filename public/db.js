const indexedDB =
    window.indexedDB ||
    window.shimIndexeDB||
    window.msIndexeDB ||
    window.webkitIndexeDB ||
    window.mozIndexeDB;

let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
    let db = target.result;
    db.createObjectStore ("pending", {autoIncrement: true})
};

request.onsuccess = ({ target }) => {
    console.log("Success");
    db = target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = ({target}) => {
    console.log(`Error!, ${target.errorCode}`);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readWrite");
    const store = transaction.createObjectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.results.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept:"application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                return response.json();
            })
            .then(() => {
                const transaction = db.transaction(["pending"], "readWrite");
                const store = transaction.createObjectStore("pending");
                store.clear()
            });
        }
    };
}

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readWrite");
    const store = transaction.createObjectStore("pending");

    store.add(record);
}

window.addEventListener("online", checkDatabase);