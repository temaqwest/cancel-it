(() => {
    const headerMenu = document.querySelector('.js-menu');
    const menuButton = document.querySelector('.menu__button')

    menuButton.addEventListener('click', () => {
        headerMenu.classList.toggle('menu--open');
    })

})();