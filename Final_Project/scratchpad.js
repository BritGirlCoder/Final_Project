//Testing local storage
document.getElementById("btnMListSubmit").addEventListener("click", function populateMailingList() {
    sessionStorage.setItem('mListName', document.getElementById('mListName').value);
})
alert(sessionStorage.getItem('mListName'));