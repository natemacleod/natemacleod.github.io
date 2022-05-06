function toggleMenu() {
    document.getElementById("topContent").classList.toggle("show");
}

window.onclick = function(event) {
    if (event.target.id === ("topDropdown")) {
        toggleMenu();
    } else if (document.getElementById("topContent").classList.contains("show")) {
        document.getElementById("topContent").classList.remove("show");
    }
}