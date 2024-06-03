import projectSchema from "../model/projectModel.js";

export const addProject = async (req, res) => {
  try {
    const { projectName, description } = req.body;

    const findproject = await projectSchema.findOne({ projectName });
    if (findproject) {
      return res.status(400).json({ message: "Project already exist !" });
    }

    const newProject = await projectSchema({
      projectName,
      description,
    });

    const newProjectData = await newProject.save();
    return res
      .status(201)
      .json({ message: "Project added successfully !", newProjectData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const editProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const updatedData = req.body;

    const findproject = await projectSchema.findById(projectId);
    if (!findproject || findproject.length <= 0) {
      return res.status(404).json({ message: "Project not found !" });
    }

    const updateProject = await projectSchema.findByIdAndUpdate(
      projectId,
      updatedData,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Project updated successfully !", updateProject });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const allProjects = await projectSchema.find();
    if (!allProjects || allProjects.length <= 0) {
      return res.status(404).json({ message: "No project found !" });
    }
    return res
      .status(200)
      .json({ message: "Projects fetched successfully !", allProjects });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await projectSchema.findById(projectId);
    if (!project || project.length <= 0) {
      return res.status(404).json({ message: "Project not found !" });
    }
    return res
      .status(200)
      .json({ message: "Project fetched successfully !", project });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export const removeProjectById = async (req, res) => {
  const { projectId } = req.params;
  try {
    const findProject = await projectSchema.findById(projectId);
    if (!findProject || findProject.length <= 0) {
      return res.status(404).json({ message: "Project not found !" });
    }

    await projectSchema.findByIdAndDelete(projectId);
    return res.status(200).json({ message: "Project deleted successfully !" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error !" });
  }
};
