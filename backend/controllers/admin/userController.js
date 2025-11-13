
import User from "../../models/User.js";

export const getAllUser = async (req, res) => {
    try{
     const users = await User.find();
     res.json(users)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
};

export const deleteUser = async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.json({message: "User Deleted"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

export const updateUser = async(req, res) => {
    try{
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.json(updateUser)
    } catch(error){
        res.json.status(500).json({message: error.message})
    }
}