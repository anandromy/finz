import mongoose, { Schema } from "mongoose";

// referncing userId(a.k.a primary key of another model) enables some bug safety, even by error somewhere's code tries to insert a account whose userId has no corresponsing user in database, it won't let us do that, no other significant benefit, referncing doen't works like sql datbase though

const accountSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, required: true }
})

export const Account = mongoose.model('Account', accountSchema)