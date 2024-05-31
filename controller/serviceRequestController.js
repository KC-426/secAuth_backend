import serviceRequestSchema from "../model/serviceRequest.js";

export const createServiceRequest = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newRequest = new serviceRequestSchema({
      name,
      email,
      phone,
      message,
    });

    const result = await newRequest.save();

    return res
      .status(201)
      .json({ message: "Service Request created successfully !", result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const fetchServiceRequest = async (req, res) => {
  try {
    const findRequests = await serviceRequestSchema.find();
    if (!findRequests) {
      return res.status(404).json({ message: "No Service Request found!" });
    }

    return res
      .status(200)
      .json({
        message: "Service Request fetched successfully !",
        findRequests,
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};
