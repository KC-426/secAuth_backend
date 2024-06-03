import orderSchema from "../model/orderModel.js";
import userSchema from "../model/userModel.js";
import planSchema from "../model/subscriptionPlanSchema.js";
import Razorpay from "razorpay";
import { plans } from "../model/subscriptionPlanSchema.js";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const paymentOrder = async (req, res) => {
  const { userId, planId } = req.params;
  const { newPlanType, paymentType } = req.body;

  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "No user found!" });
    }

    // Find plan by planId and validate newPlanType
    const selectedPlan = await planSchema.findById(planId);
    if (!selectedPlan || selectedPlan.planType !== newPlanType) {
      return res
        .status(404)
        .json({ message: "Selected plan not found or mismatched plan type!" });
    }

    // Calculate the amount based on the payment type
    let amount =
      paymentType === "yearly"
        ? selectedPlan.yearlyPrice
        : selectedPlan.monthlyPrice;

    // Adjust minimum amount for Free plan
    if (newPlanType === "Free") {
      amount = Math.max(amount, 1); // Minimum amount of 1 INR
    }

    // Razorpay order creation options
    const options = {
      amount: amount * 100, // Razorpay expects the amount in paise
      currency: "INR",
    };

    // Create Razorpay order
    const order = await instance.orders.create(options);
    console.log(order);

    const orderData = new orderSchema({
      userId: user._id,
      planType: newPlanType,
      planId: selectedPlan._id,
      amount: amount,
      paymentType: paymentType,
    });

    await orderData.save();

    res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      order,
      orderData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const updatePaymentOrder = async (req, res) => {
  const { userId, planId } = req.params;
  const { newPlanType, paymentType } = req.body;

  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "No user found!" });
    }

    const selectedPlan = await planSchema.findById(planId);
    if (!selectedPlan || selectedPlan.planType !== newPlanType) {
      return res
        .status(404)
        .json({ message: "Selected plan not found or mismatched plan type!" });
    }

    const orderData = await orderSchema.findOneAndUpdate(
      { userId: user._id, planType: newPlanType, planId: selectedPlan._id },
      { paymentType: paymentType },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment order updated successfully",
      orderData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
