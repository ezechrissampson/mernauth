import User from "../../models/User.js";

export const getAllUser = async (req, res) => {
    try{
     const users = User.find();
     res.json(users)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
};

