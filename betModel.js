const mongoose = require("mongoose")

const betSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    outcome: { type: String },
    stake: {type:Number},
    payout: {type:Number},
    
    
}, {timestamps: true})


const Bet = new mongoose.model("Bet", betSchema)

module.exports = Bet