// responsiveMenu.js handles the mobile nav menu (appears when viewport width < 660 px)

const toggle = document.getElementById("hm"); // The hamburger menu button
const toggleImg = document.querySelector("#hm img"); // The hamburger menu icon
const menu = document.getElementById("mobileMenu"); // The mobile menu
const links = document.querySelectorAll("#mobileMenu .link"); // An array containing all four mobile menu links

// Toggles the mobile menu and changes the icon
const toggleMenu = () => {
    if (menu.classList.contains("inactive")) {
        menu.classList.remove("inactive");
        toggleImg.src = "./files/icons/x-lg.svg";
    } else {
        menu.classList.add("inactive");
        toggleImg.src = "./files/icons/list.svg";
    }
}

// Clicking on the menu button should toggle the menu
toggle.addEventListener("click", toggleMenu, false);
// Clicking on a link in the menu should close the menu
links.forEach(link => link.addEventListener("click", toggleMenu, false));
