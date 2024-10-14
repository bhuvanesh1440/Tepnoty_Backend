const Feedback = require('../models/feedback');
// const User=require('../models/user')

// Report a problem
exports.reportFeedback = async (req, res) => {
    const { description } = req.body; 
    const user = req.user;

    try {
        if(!user.isFeedback){
        const feedback = new Feedback({
            user: user._id,
            description: description
        });
        console.log(feedback);
        await feedback.save();
        user.isFeedback=true;
        await user.save();
        res.status(201).send({success:true, message: 'Successfully uploaded feedback' });
    }
    else{
        res.status(400).send({success:false, message: 'You have already uploaded feedback'});
    }
    } catch (error) {
        res
          .status(500)
          .send({
            success: false,
            message: "Error uploading feedback",
            error: error.message,
          });
    }
};

// Get problems for a specific user
exports.getFeedback = async (req, res) => {
    console.log("In Feedback")
    const user_id = req.user.user_id; // Assumes user_id is attached to req.user
    console.log("In get feedback decoded : ",user_id)

    try {
        // Find problems reported by the specific user
        const feedback = await Feedback.find({ user_id });
        res.status(200).send(feedback);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching problems', error: error.message });
    }
};

exports.getAllFeedback = async (req, res) => {
  console.log("In Feedback");
  const user_id = req.user.user_id; // Assumes user_id is attached to req.user
  console.log("In get feedback decoded : ", user_id);

  try {
    // Find problems reported by the specific user
    const feedback = await Feedback.find({});
    res.status(200).send(feedback);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching problems", error: error.message });
  }
};