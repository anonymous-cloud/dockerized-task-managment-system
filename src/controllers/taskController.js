const { uploadFile } = require('../services/s3');

const User = require("../models/User");
 const Task = require('../models/task');

// Function To create new task
const createNewTask = async (req, res) => {
  try {

            var { title , description ,attachments} = req.body;
            var userId = req.params.userId
            console.log(req.params.userId,"userId")
            const createNewTaskData = new Task({
            title:title,
            // attachments:attachments,
            description:description,
            title:title,
            attachments:attachments,
            createdBy:userId,
            });

            await createNewTaskData.save();

            if (!createNewTaskData) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            }
            res.status(200).json({
            success: true,
            message: "User profile retrive successfully",
            data: createNewTaskData,
            });
    // res.json(data);
  } catch (err) {
    console.log(err,"err")
    res.status(500).json({
      success: true,
      message: "Server error",
      data: err,
    });
  }
};
//Fuction to get all task if admin or If user then user task
const getAllTasks = async (req, res) => {
  try {
     const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const getAllTaskData = await Task.find(filter);

    if (!getAllTaskData) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User profile retrive successfully",
      data: getAllTaskData,
    });
    // res.json(data);
  } catch (err) {
    res.status(500).json({
      success: true,
      message: "Server error",
      data: err,
    });
  }
};

//function to update task if usertask or else admin can update 
const updateTask = async (req, res) => {
  try {
    console.log(req.user.role,"req.user._id req.user._id req.user._id " )
   const task = await Task.findOne({
      _id: req.body._id,
      ...(req.user.role === 'user' ? { createdBy: req.user._id } : {}),
    });
    console.log(task,"task")

    if (!task) {
      return res.status(404).json({ success : false,
        message: 'Task not found' });
    }

    Object.assign(task, req.body);
    await task.save();

    res.status(200).json({
      success: true,
      message: "User profile retrive successfully",
      data: task,
    });
  } catch (err) {
    console.log(err,"hhh")
    res.status(500).json({ message: "Update failed" });
  }
};

//function to delete user task if user is deleting its ouwn task or admin can delete
const deleteTask = async (req, res) => {
  try {
    const userId = req.params.userId;

        const deleteTasks = await Task.findOneAndDelete({
      _id: req.params._id,
      ...(req.user.role === 'user' ? { createdBy: req.user._id } : {}),
    });

    if (!deleteTasks) return res.status(404).json({ success : false, 
        message: "Only admin or user who created the task can delete" });
    res.json({ message: "user deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Delete failed" });
  }
};


//function to upload attachment using s3 
const uploadAttachment = async (req, res) => {
  try {
    const { _id } = req.params; // task ID
    const task = await Task.findById(_id);

    var userIdForCheck = req.user._id

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only allow admin or the owner of the task
    if (req.user.role !== 'admin' && req.params.userId.toString() !== userIdForCheck.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Construct a unique S3 key
    const fileName = `${req.user._id}/${Date.now()}-${req.file.originalname}`;

    // Upload to AWS S3
    await uploadFile(req.file.buffer, fileName, req.file.mimetype);

    res.status(200).json({ message: 'File uploaded successfully', fileKey: fileName });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};





module.exports = {
  createNewTask,
  getAllTasks,
  updateTask,
  deleteTask,
  uploadAttachment
};
