// Handles the dropdown menu in the navigation bar

function toggleMenu() {
    document.getElementById("topContent").classList.toggle("show");
    if (document.getElementById("topDChevron").src.includes("down")) {
        document.getElementById("topDChevron").src = "./icons/chevron-up.svg";
    } else document.getElementById("topDChevron").src = "./icons/chevron-down.svg";
}

window.onclick = function(event) {
    if (event.target.id === ("topDropdown") || event.target.id === ("topDChevron")) {
        toggleMenu();
    } else if (document.getElementById("topContent").classList.contains("show")) {
        document.getElementById("topContent").classList.remove("show");
    }
}