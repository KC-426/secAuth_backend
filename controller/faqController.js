import faqSchema from "../model/faqModel.js";

export const addFaq = async (req, res) => {
  try {
    const { title, description } = req.body;

    const findFaq = await faqSchema.findOne({ title });
    if (findFaq) {
      return res.status(400).json({ message: "Faq already exist !" });
    }

    const newFaq = await faqSchema({
      title,
      description,
    });

    const newFaqData = await newFaq.save();
    return res
      .status(201)
      .json({ message: "Faq added successfully !", newFaqData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const editFaq = async (req, res) => {
  const { faqId } = req.params;
  try {
    const updatedData = req.body;

    const findFaq = await faqSchema.findById(faqId);
    if (!findFaq || findFaq.length <= 0) {
      return res.status(404).json({ message: "Faq not found !" });
    }

    const updateFaq = await faqSchema.findByIdAndUpdate(faqId, updatedData, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Faq updated successfully !", updateFaq });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const getAllFaqs = async (req, res) => {
  try {
    const allFaqs = await faqSchema.find();
    if (!allFaqs || allFaqs.length <= 0) {
      return res.status(404).json({ message: "No faq found !" });
    }
    return res
      .status(200)
      .json({ message: "Faqs fetched successfully !", allFaqs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const getFaqById = async (req, res) => {
  const { faqId } = req.params;
  try {
    const faq = await faqSchema.findById(faqId);
    if (!faq || faq.length <= 0) {
      return res.status(404).json({ message: "Faq not found !" });
    }
    return res.status(200).json({ message: "Faq fetched successfully !", faq });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const removeFaqById = async (req, res) => {
  const { faqId } = req.params;
  try {
    const findFaq = await faqSchema.findById(faqId);
    if (!findFaq || findFaq.length <= 0) {
      return res.status(404).json({ message: "Faq not found !" });
    }

    await faqSchema.findByIdAndDelete(faqId);
    return res.status(200).json({ message: "Faq deleted successfully !" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};
