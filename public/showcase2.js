const updateBtn = document.querySelector('.updateBtn');
const live = document.querySelector('.live');
const static = document.querySelector('.static');


updateBtn.addEventListener('click', () => {
    live.classList.toggle('d-none');
    static.classList.toggle('d-none');
    if(updateBtn.innerHTML === '<i class="fa fa-retweet"></i>'){
        updateBtn.innerHTML = '<i class="fa fa-undo"></i>'
    } else {
        updateBtn.innerHTML = '<i class="fa fa-retweet"></i>'
    }
})

