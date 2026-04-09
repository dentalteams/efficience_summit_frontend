const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const promoteAdmin = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);

        const UserSchema = new mongoose.Schema({
            email: String,
            role: String
        }, { collection: 'users' });

        const User = mongoose.model('UserPromote', UserSchema);

        const email = 'amira.efficience@gmail.com';
        const result = await User.updateOne({ email }, { $set: { role: 'admin' } });

        if (result.matchedCount > 0) {
            console.log(` ${email} est maintenant ADMIN. (Modifié: ${result.modifiedCount})`);
        } else {
            console.log(` Utilisateur ${email} non trouvé.`);
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
};

promoteAdmin();
