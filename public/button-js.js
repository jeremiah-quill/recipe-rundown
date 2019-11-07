const buttonContainer = document.getElementsByClassName('buttonContainer')
const recipeDisplay = document.getElementsByClassName('recipeDisplay')

for(let i=0; i<recipeDisplay.length; i++){
    recipeDisplay[i].addEventListener('mouseenter', () => {
        buttonContainer[i].classList.toggle('d-none');
    })
    }

    for(let i=0; i<recipeDisplay.length; i++){
        recipeDisplay[i].addEventListener('mouseleave', () => {
            buttonContainer[i].classList.toggle('d-none');
        })
        }