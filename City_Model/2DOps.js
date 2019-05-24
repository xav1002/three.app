var menu = document.createElement('div');
menu.id = 'menu';
menu.style.width = window.innerWidth / 4 + 'px';
menu.style.height = window.innerHeight / 3 + 'px';

document.body.appendChild(menu);

window.addEventListener('keydown', function(e) {
    e.preventDefault();
    if(e.keyCode === 69) {
        console.log('works');
        if(menu.style.display === 'none') {
        controls.unlock();
        menu.style.display = 'block';
        } else {
            controls.lock();
            menu.style.display = 'none';
        }
    }
})