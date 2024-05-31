import mongoose from "mongoose"

const serviceRequestSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    message: {
        type: String
    },
}, {timestamps: true})

export default mongoose.model('ServiceRequest', serviceRequestSchema)