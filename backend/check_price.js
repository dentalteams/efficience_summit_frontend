const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {}).then(async () => {
    const users = await User.find()
    const noPriceUsers = users.filter(u => u.totalPrice === undefined || u.totalPrice === null);
    console.log('Total users without totalPrice:', noPriceUsers.length);
    if(noPriceUsers.length > 0) {
        console.log('Sample empty price user:', noPriceUsers[0].email);
    }
    process.exit(0);
});
