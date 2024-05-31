import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  planType: {
    type: String,
    enum: ["Free", "Premium", "Commercial"],
  },
  paymentType: {
    type: String,
    enum: ["monthly", "yearly"],
  },
  monthlyPrice: {
    type: Number,
    required: true,
  },
  yearlyPrice: {
    type: Number,
    required: true,
  },
  features: {
    apiRequests: {
      type: Number,
      required: true,
    },
    totalProducts: {
      type: Number,
      required: true,
    },
    customizeSecurity: {
      type: Boolean,
      required: true,
    },
  },
});

const Plan = mongoose.model("Plan", planSchema);

export default Plan;

export const plans = {
  Free: {
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: {
      apiRequests: 1000,
      totalProducts: 1,
      customizeSecurity: false,
    },
  },
  Premium: {
    monthlyPrice: 999,
    yearlyPrice: 999 * 12 * 0.8, // 20% discount for yearly payment
    features: {
      apiRequests: -1, // -1 or any other convention to represent unlimited
      totalProducts: 2,
      customizeSecurity: true,
    },
  },
  Commercial: {
    monthlyPrice: 3000,
    yearlyPrice: 3000 * 12 * 0.8, // 20% discount for yearly payment
    features: {
      apiRequests: -1, // -1 or any other convention to represent unlimited
      totalProducts: 10,
      customizeSecurity: true,
    },
  },
};
