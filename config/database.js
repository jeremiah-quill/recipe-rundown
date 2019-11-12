
if(process.env.NODE_ENV === 'production') {
    module.exports = require('./database-prod');
} else {
    module.exports = require('./database-dev')
}