
const mongoose = require('mongoose')
const { Schema } = mongoose;
const { customAlphabet} = require('nanoid')
const nanoid = customAlphabet('1234567890', 8)
const URLSchema = new Schema(
    {
        originalURL: {
            type: String,
            required: true
        },
        shortid: {
            type: Number,
            required: true,
            default: () => Number(nanoid())
        }
    }
)

const URL = mongoose.model('URL', URLSchema);
module.exports = {
    URL
}