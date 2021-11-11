let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
    let db = target.result;
    db.createObjectStore ("budgets", {autoIncrement: true})
};

request.onsuccess = ({ target }) => {
    console.log("Success");
    db = target.result;

    if (navigator.online) {
        checkDatabase();
    }
};

function checkDatabase() {
    const transaction = db.transaction(["budgets"], readWrite);
    const store = transaction.createObjectStore("budgets");

    store.add(record)
}