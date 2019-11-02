const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const hbs = exphbs.create({
    helpers: {
        // privateEdit:function(userId, loggedId, recipeId) {
        //     if (userId == loggedId) {
        //         return `<a href="/recipes/edit/${recipeId}" class="btn btn-warning"><i class="fa fa-pencil" ></i></a>`
        //     } 
        // },
        privateDelete: function(userId, loggedId, recipeId) {
            if(userId==loggedId){
                return `<a href="#" data-toggle="modal" data-target="#del${recipeId}" class="btn btn-danger"><i class="fa fa-trash"></i></a>`
            }
        },
        arrayLoop:function(quantityArray, measurementArray, ingredientArray) {
            let list = `<ul>`
            for(let i=0; i<quantityArray.length; i++) {
                list += `<li>${quantityArray[i]} ${measurementArray[i]} ${ingredientArray[i]}</li>`
            }
            list += `</ul>`
            return list
        },
        

        // populateFormIngredients:function(quantityArray, measurementArray, ingredientArray) {
        //     let editIngredients = '';
        //     for(let i=1; i<quantityArray.length; i++) {
        //         editIngredients += 
        //         `
        //         <div class="form-row">
        //                 <div class="form-group col-2">
                            
        //                     <input name="quantity" type="number" class="form-control" value="${quantityArray[i]}">
        //                 </div>
        //                 <div class="form-group col-3">
                            
        //                     <select name="measurement" class="custom-select measurement" value="${measurementArray[i]}">
        //                         <option selected ></option>
        //                         <option value="Drop">Drop</option>
        //                         <option value="Tsp">Tsp</option>
        //                         <option value="Tbsn">Tbsn</option>
        //                         <option value="Oz">Oz</option>
        //                         <option value="Cup">Cup</option>
        //                         <option value="Pint">Pint</option>
        //                         <option value="Qt">Qt</option>
        //                         <option value="Gal">Gal</option>
        //                         <option value="ML">ML</option>
        //                         <option value="L">L</option>
        //                         <option value="Pinch">Pinch</option>
        //                         <option value="Piece">Piece</option>
        //                     </select>
        //                 </div>
        //                 <div class="form-group col-5">
                           
        //                     <input name="ingredient" type="text" class="form-control" value="${ingredientArray[i]}">
        //                 </div>
        //                 <div class="form-group col-1 d-flex">
        //                 <button type="button" class="btn btn-danger mt-auto" style="height: 38px"><i class="fa fa-minus deleteInstructionBtn"></i></button>
        //                 </div>
        //             </div>`
        //     }
        //     return editIngredients
        // },
        // populateFormSteps:function(instructions){
        //     let addedInstructions =''
        //     for (let i=1; i<instructions.length; i++){
        //         addedInstructions+=
        //         `  <div class="form-row">
        //         <div class="form-group col-10">
        //             <div class="input-group">
        //                 <div class="input-group-prepend">
        //                     <div class="input-group-text steps">Step 1</div>
        //                 </div>
        //                 <input name="step" type="text" class="form-control" id="inlineFormInputGroup" value="${instructions[i]}">
        //             </div>
        //         </div>
        //         <div class="form-group col-1 d-flex">
        //         <button type="button" class="btn btn-danger mt-auto" style="height: 38px"><i class="fa fa-minus deleteInstructionBtn"></i></button>
        //         </div>
        //     </div>`


        //     }
        //     return addedInstructions
        // }
    }
});

const app = express();
const index = require('./routes/index');
const recipes = require('./routes/recipes')

require('./config/passport')(passport); 
const db = require('./config/database');

// Connect to Mongoose
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use("/public", express.static(__dirname + "/public"));


// Middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override middleware
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.use('/', index);
app.use('/recipes', recipes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));