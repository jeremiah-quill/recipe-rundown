// const buttonContainer = document.getElementsByClassName('buttonContainer')
// const recipeDisplay = document.getElementsByClassName('recipeDisplay')

// for(let i=0; i<recipeDisplay.length; i++){
//     recipeDisplay[i].addEventListener('mouseenter', () => {
//         buttonContainer[i].classList.toggle('d-none');
//     })
//     }

//     for(let i=0; i<recipeDisplay.length; i++){
//         recipeDisplay[i].addEventListener('mouseleave', () => {
//             buttonContainer[i].classList.toggle('d-none');
//         })
//         }

const unfollow = document.getElementsByClassName('unfollow');

        for(let i=0; i<unfollow.length; i++){
            unfollow[i].addEventListener('mouseenter', () => {
                unfollow[i].innerHTML = 'Unfollow <i class="fa fa-trash"></i>'
            })
            unfollow[i].addEventListener('mouseleave', () => {
                unfollow[i].innerHTML = 'Following <i class="fa fa-check"></i>'
            })
        }
        