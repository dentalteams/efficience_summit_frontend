const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {}).then(async () => {
    const user = await User.findOne().sort({ createdAt: -1 });
    console.log(JSON.stringify(user, null, 2));
    process.exit(0);
});
