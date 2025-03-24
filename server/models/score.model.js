import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    playerName: {
        type: String,
        required: true,
        trim: true
    },
    score: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    defeatedBoss: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        index: true
    }
}, {
    timestamps: true
});


scoreSchema.index({ score: -1 });

const Score = mongoose.model('Score', scoreSchema);

export default Score; 