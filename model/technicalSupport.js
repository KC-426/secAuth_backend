import mongoose from "mongoose"

const technicalSupportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    message: {
        type: String
    },
}, {timestamps: true})

export default mongoose.model('TechnicalSupport', technicalSupportSchema)