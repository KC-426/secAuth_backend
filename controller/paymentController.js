import paymentHistory from "../model/paymentModel.js";
import userSchema from "../model/userModel.js";
import planSchema from "../model/subscriptionPlanSchema.js";
import verifyRazorPay from "../utils/verifyPayment.js";

export const paymentDone = async (req, res, next) => {
  const {
    order_id,
    payment_id,
    razorpay_signature,
    userId,
    planType,
    amount,
    paymentType,
  } = req.body;

  if (
    !order_id ||
    !payment_id ||
    !razorpay_signature ||
    !userId ||
    !planType ||
    !amount ||
    !paymentType
  ) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  try {
    const isVerify = verifyRazorPay(order_id, payment_id, razorpay_signature);
    console.log(isVerify);

    if (!isVerify) {
      return res.status(400).json({ message: "Payment verification failed!" });
    }

    // Find the user by their ID
    const user = await userSchema.findById(userId);

    // Find the plan by its type
    const selectedPlan = await planSchema.findOne({ planType });

    // Check if user and plan exist
    if (!user) {
      return res.status(404).json({ message: "No user found!" });
    }
    if (!selectedPlan) {
      return res.status(404).json({ message: "No plan found!" });
    }

    // Ensure user.plans is defined and is an array
    user.plans = user.plans || [];

    // Check if plan already associated with user
    const isPlanAssociated = user.plans.some(
      (ele) => ele.plan_id.toString() === selectedPlan._id.toString()
    );

    // If the plan is not already associated, associate it
    if (!isPlanAssociated) {
      user.plans.push({ plan_id: selectedPlan._id, planType, paymentType });
      await user.save();
    }

    // Log payment history
    const newPayment = await paymentHistory.create({
      paymentId: payment_id,
      amount: amount,
      userId: user._id,
      planId: selectedPlan._id,
      paymentType: paymentType,
      planType: planType,
    });

    // Log the saved payment history
    console.log(newPayment);

    res.status(200).json({
      success: true,
      message: "Payment done successfully",
      result: newPayment,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
