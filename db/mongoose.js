const mongoose = require('mongoose')
console.log('process.env.MONGODB_URL--',process.env.MONGODB_URL);
mongoose.set('debug', true);
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})