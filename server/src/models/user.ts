import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
})

// hashing is done before saving password to the db, so that anybody accessing the db cna't get hold of the actual password an breach user's privacy
// salt is something added extra to the entity and so that the hashed version of two same entities are not same thus no one can compare hashed versions and get another person's actual password if the hashed verisons are same
// Before hashing a unique salt is added for every user

userSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
})

export const User = mongoose.model('User', userSchema)