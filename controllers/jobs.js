const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async(req, res) => {
  const jobs = await Job.find({ createdBy : req.user.userId }).sort('createdAt')
  res.status(StatusCodes.ACCEPTED).send({jobs , count : jobs.length })

};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  console.log( userId , jobId);
  
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  console.log(jobId);

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({job});
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  if (!job) {
    throw new BadRequestError("No job created");
  }
  res.json({ job });
};
const updateJob =async (req, res) => {
  const {  body: { company, position },user : {userId} , params : {id : jobId} } = req
  if(company === '' || position=== ''){
    throw new BadRequestError('Enter Company and Position')
  }
  const job = await Job.findByIdAndUpdate({_id : jobId , createdBy : userId } , req.body , {new : true , runValidators : true})
  if(!job){
    throw new NotFoundError('Job not Found')
  }
  res.status(StatusCodes.ACCEPTED).json({job})
};
const deleteJob = async(req, res) => {
  const {  params : {id : jobId} , user: {userId}} = req
  const job  = await Job.findByIdAndDelete({_id : jobId , createdBy : userId})
  if(!job){
    throw new NotFoundError('Job not Found')
  }
  res.status(StatusCodes.ACCEPTED).json({job})

};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
