const body = document.querySelector('body');
const ingredientContainer = document.querySelector('.ingredientContainer');
const addIngredientBtn = document.querySelector('.addIngredientBtn');
const instructionContainer = document.querySelector('.instructionContainer');
const addInstructionBtn = document.querySelector('.addInstructionBtn');
const unfollow = document.getElementsByClassName('unfollow');



// Move recipe items up and down
const list = document.getElementById('ingredientMoveContainer');
list.addEventListener("click", (event) => {
  let recipeItem = event.target.parentNode.parentNode;
  if (event.target.classList.contains('moveup')) {
    list.insertBefore(recipeItem, recipeItem.previousElementSibling);
  }
  if (event.target.classList.contains('movedown')) {
    list.insertBefore(recipeItem.nextElementSibling, recipeItem);
  }
});
// move instructions up and down
const list2 = document.getElementById('instructionMoveContainer');
list2.addEventListener("click", (event) => {
  let recipeItem = event.target.parentNode.parentNode;
  if (event.target.classList.contains('moveup')) {
    list2.insertBefore(recipeItem, recipeItem.previousElementSibling);
  }
  if (event.target.classList.contains('movedown')) {
    list2.insertBefore(recipeItem.nextElementSibling, recipeItem);
  }
});




addIngredientBtn.addEventListener('click', addIngredient)
body.addEventListener('click', deleteIngredient)

addInstructionBtn.addEventListener('click', addInstruction)
body.addEventListener('click', deleteInstruction)


function deleteIngredient(e) {
    if(e.target.classList.contains('deleteIngredientBtn') ) {
        e.target.parentNode.parentNode.remove();
    }
};

function deleteInstruction(e) {
    if(e.target.classList.contains('deleteInstructionBtn') ) {
        e.target.parentNode.parentNode.remove();
        labelInstructions();
    }
};


function addIngredient() {
    let newIngredient = document.createElement('div');
    newIngredient.classList.add('form-row', 'ingredient-row')
    newIngredient.innerHTML = 
    `
    <div class="form-group form-button col-auto d-flex flex-column justify-content-center">
    <i class="fa fa-sort-up moveup"></i>
    <i class="fa fa-sort-down movedown"></i>
</div>
    <div class="form-group col-2 form-button">
                       
    <input name="quantity" type="number" step="0.01" class="form-control">
</div>
<div class="form-group col-3 form-button">
    
    <select name="measurement" class="custom-select measurement">
        <option selected></option>
        <option value="tsp.">tsp.</option>
        <option value="tbsp.">tbsp.</option>
        <option value="oz">oz</option>
        <option value="cups">cups</option>
        <option value="pints">pints</option>
        <option value="quarts">quarts</option>
        <option value="gallons">gallons</option>
        <option value="mL">mL</option>
        <option value="L">L</option>
        <option value="lb">lb</option>
        <option value="box">box</option>
        <option value="leaves">leaves</option>
        <option value="ears">ears</option>
        <option value="bunches">bunches</option>
        <option value="whole">whole</option>
        <option value="jars">jars</option>
        <option value="bags">bags</option>
        <option value="drops">drops</option>
        <option value="pinches">pinches</option>
        <option value="sticks">sticks</option>
        <option value="sprigs">sprigs</option>
        <option value="cans">cans</option>
        <option value="jars">jars</option>
        <option value="pieces">pieces</option>
    </select>
</div>
<div class="form-group col-5 form-button">
   
    <input name="ingredient" type="text" class="form-control">
</div>
<div class="form-group col-auto form-button">
    <button type="button" class="btn btn-dark mt-auto deleteIngredientBtn" style="height: 38px"><i class="fa fa-minus"></i></button>
</div>
`
ingredientMoveContainer.appendChild(newIngredient);
};

function addInstruction() {
    let stepCount = document.querySelectorAll('.steps').length + 1;
    let newInstruction = document.createElement('div');
    newInstruction.classList.add('form-row', 'instruction-row');
    newInstruction.innerHTML = 
    `
    <div class='form-group form-button col-auto d-flex flex-column justify-content-center'>
    <i class="fa fa-sort-up moveup"></i>
    <i class="fa fa-sort-down movedown"></i>
</div>
    <div class="form-group col-10">
    <div class="input-group">
        <div class="input-group-prepend">
            <div class="input-group-text steps">Step ${stepCount}</div>
        </div>
        <input name="step" type="text" class="form-control" id="inlineFormInputGroup">
    </div>
</div>
<div class="form-group col-auto form-button">
    <button type="button" class="btn btn-dark mt-auto deleteInstructionBtn" style="height: 38px"><i class="fa fa-minus"></i></button>
</div>

  
  `
  instructionMoveContainer.appendChild(newInstruction);
};

function labelInstructions() {
    document.querySelectorAll('.steps').forEach((instruction, index) => instruction.textContent = 'Step ' + (index+1) )
};

