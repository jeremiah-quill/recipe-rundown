const updateBtn = document.querySelector('.updateBtn');
const live = document.querySelector('.live');
const static = document.querySelector('.static');

updateBtn.addEventListener('click', () => {
    live.classList.toggle('d-none');
    static.classList.toggle('d-none');
    if(updateBtn.innerHTML === 'Update'){
        updateBtn.innerHTML = 'Back'
    } else {
        updateBtn.innerHTML = 'Update'
    }
});