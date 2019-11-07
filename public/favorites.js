const updateBtn = document.getElementsByClassName('updateBtn');
const live = document.getElementsByClassName('live');
const static = document.getElementsByClassName('static');

for(let i=0; i<updateBtn.length; i++){
updateBtn[i].addEventListener('click', () => {
    live[i].classList.toggle('d-none');
    static[i].classList.toggle('d-none');
    if(updateBtn[i].innerHTML === 'Check for updates'){
        updateBtn[i].innerHTML = 'Back to favorite'
    } else {
        updateBtn[i].innerHTML = 'Check for updates'
    }
})
}
