import planSchema from "../model/subscriptionPlanSchema.js";
import userSchema from "../model/userModel.js";

export const addPlan = async (req, res) => {
  const { userId } = req.params;
  const { newPlanType, paymentType } = req.body;

  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPlanAlreadyAdded = user.plans.some(
      (plan) =>
        plan.planType === newPlanType && plan.paymentType === paymentType
    );

    if (isPlanAlreadyAdded) {
      return res
        .status(400)
        .json({ message: "Plan already exists for this user" });
    }

    const existingPlan = await planSchema.findOne({ planType: newPlanType });
    if (!existingPlan) {
      return res
        .status(404)
        .json({ message: "Plan type not found in the system" });
    }

    const newPlan = {
      plan_id: existingPlan._id,
      planType: newPlanType,
      paymentType: paymentType,
    };

    user.plans.push(newPlan);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Plan added successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePlan = async (req, res) => {
  const { userId, planId } = req.params;
  const { newPlanType, paymentType } = req.body;

  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const planIndex = user.plans.findIndex(
      (plan) => plan.plan_id.toString() === planId
    );
    if (planIndex === -1) {
      return res.status(404).json({ message: "Plan not found for this user" });
    }

    const existingPlan = await planSchema.findOne({ planType: newPlanType });
    if (!existingPlan) {
      return res
        .status(404)
        .json({ message: "Plan type not found in the system" });
    }

    user.plans[planIndex].plan_id = existingPlan._id;
    user.plans[planIndex].planType = newPlanType;
    user.plans[planIndex].paymentType = paymentType;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
