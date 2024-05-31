import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
}, {timestamps: true})

export default mongoose.model('Faq', faqSchema)