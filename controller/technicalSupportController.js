import technicalSupportSchema from "../model/technicalSupport.js";

export const createTechnicalSupportRequest = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is missing from request" });
    }

    console.log(userId);

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const supportRequest = new technicalSupportSchema({
      userId,
      message,
    });

    const result = await supportRequest.save();

    return res.status(201).json({
      message: "Technical Support Request created successfully!",
      result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
