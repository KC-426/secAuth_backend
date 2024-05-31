import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String, 
        required :true
      },
      dob: {
        type: Date,
      },
      country: {
        type: String,
      },
      image: {
        name: {
          type: String
        }, 
        url: {
          type: String
        },
        path: {
          type: String

        }
      },

      plans: [
        {
          plan_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan'
          },
          planType: {
            type: String,
            enum: ["Free", "Premium", "Commercial"],
          },
          paymentType: {
            type: String,
            enum: ["monthly", "yearly"]
          }
        }
      ]
}, {timestamps: true})

export default mongoose.model('User', userSchema)