// // Upload attachment to a task
// const uploadAttachment = async (req, res) => {
//   try {
//     const task = await Task.findOne({
//       _id: req.params.id,
//       createdBy: req.user._id,
//     });

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const result = await uploadToS3(req.file);
//     task.attachments.push({
//       key: result.Key,
//       url: await getSignedUrl(result.Key),
//     });
//     await task.save();

//     res.status(201).json(task);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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





module.exports = {
  createNewTask,
  getAllTasks,
  updateTask,
  deleteTask
};
