const express = require("express");
const router = express.Router();

var {createNewTask,getAllTasks,updateTask,deleteTask} = require("../controllers/taskController")

const { protect } = require("../middleware/authMiddleware");
const { allowAdminOrSelf , adminOnly } = require("../middleware/roleMiddleware");


// api To create new task
router.post("/createNewTask/:userId", protect, allowAdminOrSelf, createNewTask);

//api to get all task if admin or If user then user task
router.get("/getAllTasks/:userId", protect, allowAdminOrSelf, getAllTasks);

//api to update task if usertask or else admin can update 
router.put("/updateTask/:userId", protect, allowAdminOrSelf, updateTask);

//api to delete user task if user is deleting its ouwn task or admin can delete
router.post("/deleteTask/:userId/:_id", protect, allowAdminOrSelf, deleteTask);

module.exports = router;
