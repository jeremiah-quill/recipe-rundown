const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");


// // Load Recipe Model
require('./models/Recipe');
const Recipe = mongoose.model('recipes');

const hbs = exphbs.create({
    helpers: {
        isFollowing: function(user, following, userId) {
            if(user){
                let followValue = false
            for(let i=0; i<following.length; i++) {
                if(following[i].id == userId){
                    followValue = true
                } 
            }
            if(followValue) {return `<a href="/unfollow/${userId}" class="unfollow ml-auto mr-3">Following <i class="fa fa-check"></i>
                    </a>`} else {
                        return `<a href="/follow/${userId}" class="follow ml-auto mr-3">Follow <i class="fa fa-user-plus"></i>
                </a>`
                    }
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
        populateFormIngredients:function(quantityArray, measurementArray, ingredientArray) {
            let editIngredients = '';
            for(let i=1; i<quantityArray.length; i++) {
                editIngredients += 
                `
                <div class="form-row ingredient-row">
                <div class="form-group form-button col-auto d-flex flex-column justify-content-center">
                    <i class="fa fa-sort-up moveup"></i>
                    <i class="fa fa-sort-down movedown"></i>
                </div>
                        <div class="form-group col-2 form-button">
                            
                            <input name="quantity" step="0.01" type="number" class="form-control" value="${quantityArray[i]}">
                        </div>
                        <div class="form-group col-3 form-button">
                            
                            <select name="measurement" class="custom-select measurement">
                                <option selected >${measurementArray[i]}</option>
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
                            <input name="ingredient" type="text" class="form-control" value="${ingredientArray[i]}">
                        </div>
                        <div class="form-group col-auto form-button">
                        <button type="button" class="btn btn-dark mt-auto deleteInstructionBtn" style="height: 38px"><i class="fa fa-minus"></i></button>
                        </div>
                      
                    </div>
                    `
            }
            return editIngredients
        },
        populateFormSteps:function(instructions){
            let addedInstructions =''
            for (let i=1; i<instructions.length; i++){
                addedInstructions+=
                `  <div class="form-row instruction-row">
                <div class="form-group form-button col-auto d-flex flex-column justify-content-center">
                <i class="fa fa-sort-up moveup"></i>
                <i class="fa fa-sort-down movedown"></i>
            </div>
                <div class="form-group col-10 form-button">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text steps">Step ${i+1}</div>
                        </div>
                        <input name="step" type="text" class="form-control" id="inlineFormInputGroup" value="${instructions[i]}">
                    </div>
                </div>
                <div class="form-group col-auto form-button">
                <button type="button" class="btn btn-dark mt-auto deleteInstructionBtn" style="height: 38px"><i class="fa fa-minus"></i></button>
                </div>
                
            </div>
           `
            }
            return addedInstructions
        }
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

cloudinary.config({
    cloud_name: 'dww49dex1',
    api_key: '487467146668313',
    api_secret: 'rNImiqE4Ml81RHV5cJOqW1l9A24'
    });
    const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "demo",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 348, height: 236.81, crop: "limit" }]
    });
    const parser = multer({ storage: storage });



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