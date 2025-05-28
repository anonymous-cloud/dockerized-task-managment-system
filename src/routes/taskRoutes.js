const express = require("express");
const router = express.Router();

const multer = require('multer');
const { uploadFile } = require('../services/s3');
const upload = multer({ storage: multer.memoryStorage() });

var {createNewTask,getAllTasks,updateTask,deleteTask,uploadAttachment} = require("../controllers/taskController")

const { authJwt } = require("../middleware/authMiddleware");
const { allowAdminOrSelf } = require("../middleware/roleMiddleware");


// api To create new task
router.post("/createNewTask/:userId", authJwt, allowAdminOrSelf, createNewTask);

//api to get all task if admin or If user then user task
router.get("/getAllTasks/:userId", authJwt, allowAdminOrSelf, getAllTasks);

//api to update task if usertask or else admin can update 
router.put("/updateTask/:userId", authJwt, allowAdminOrSelf, updateTask);

//api to delete user task if user is deleting its ouwn task or admin can delete
router.post("/deleteTask/:userId/:_id", authJwt, allowAdminOrSelf, deleteTask);

//router to add attachment
//api to delete user task if user is deleting its ouwn task or admin can delete
router.post("/uploadAttachment/:userId/:_id", authJwt, allowAdminOrSelf, upload.single('file'),uploadAttachment);

module.exports = router;
