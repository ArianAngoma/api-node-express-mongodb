const {Schema, model} = require('mongoose');

const MessageSchema = Schema({
    message: {
        type: String,
        required: [true, 'El mensaje es obligatorio']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: new Date().getTime()
    }
})

/*MessageSchema.methods.toJSON = function () {
    const {__v, ...message} = this.toObject();
    return message;
}*/

module.exports = model('Message', MessageSchema);