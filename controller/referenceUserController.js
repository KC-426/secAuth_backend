import referenceUserSchema from "../model/referenceUser.js";
import {
  uploadImageToFirebaseStorage,
  deleteImageFromFirebaseStorage,
} from "../utils/helperFunction.js";

export const addReferenceUser = async (req, res) => {
  try {
    const { firstname, lastname, gender, country, bio } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: "Image file is required !" });
    }

    const imageUrl = await uploadImageToFirebaseStorage(req, res);

    const findUser = await referenceUserSchema.findOne({
      firstname: firstname,
      lastname: lastname,
    });
    if (findUser) {
      return res.status(400).json({ message: "User already added !" });
    }

    const newUser = await referenceUserSchema({
      firstname,
      lastname,
      gender,
      country,
      bio,
      image: {
        name: req.file.originalname,
        url: imageUrl,
      },
    });

    const newUserData = await newUser.save();
    return res
      .status(201)
      .json({ message: "User added successfully !", result: newUserData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const getAllReferenceUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 3;
    const skip = (page - 1) * limit;

    const allRefUsers = await referenceUserSchema
      .find()
      .skip(skip)
      .limit(limit);

    if (!allRefUsers || allRefUsers.length === 0) {
      return res.status(404).json({ message: "No reference user found!" });
    }

    const totalCount = await referenceUserSchema.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    const pagination = {
      currentPage: page,
      pageSize: limit,
      totalCount: totalCount,
      totalPages: totalPages,
    };

    if (page < totalPages) {
      pagination.nextPage = `/api/v1/refUser/get/all/reference/users?page=${
        page + 1
      }&limit=${limit}`;
    }

    if (page > 1) {
      pagination.prevPage = `/api/v1/refUser/get/all/reference/users?page=${
        page - 1
      }&limit=${limit}`;
    }

    return res.status(200).json({
      message: "All Reference Users fetched successfully!",
      allRefUsers,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getRefernceUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const fetchRefUser = await referenceUserSchema.findById(userId);
    if (!fetchRefUser || fetchRefUser.length <= 0) {
      return res.status(404).json({ message: "No ref user found !" });
    }
    return res
      .status(200)
      .json({ message: " Ref User fetched successfully !", fetchRefUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const removeReferenceUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const findRefUser = await referenceUserSchema.findById(userId);
    if (!findRefUser || findRefUser.length <= 0) {
      return res.status(404).json({ message: "Reference User not found !" });
    }

    if (findRefUser.image && findRefUser.image.url) {
      await deleteImageFromFirebaseStorage(findRefUser.image.url);
    }

    await referenceUserSchema.findByIdAndDelete(userId);
    return res
      .status(200)
      .json({ message: "Reference User deleted successfully !" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const editReferenceUser = async (req, res) => {
  const { refUserId } = req.params;
  try {
    const findRefUser = await referenceUserSchema.findById(refUserId);

    const updatedData = req.body;

    if (findRefUser.image && findRefUser.image.url) {
      await deleteImageFromFirebaseStorage(findRefUser.image.url);
    }

    const imageUrl = await uploadImageToFirebaseStorage(req, res);

    findRefUser.firstname = updatedData.firstname;
    findRefUser.lastname = updatedData.lastname;
    findRefUser.gender = updatedData.gender;
    findRefUser.country = updatedData.country;
    findRefUser.bio = updatedData.bio;
    findRefUser.image = {
      name: req.file.originalname,
      url: imageUrl,
    };

    await findRefUser.save();
    console.log(findRefUser);
    res.status(200).json({ message: "User updated successfully", findRefUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};
