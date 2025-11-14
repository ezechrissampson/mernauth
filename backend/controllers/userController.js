import User from "../models/User.js"

export const getAllUser = async (req, res) => {
    try{
     const users = await User.find();
     res.json(users)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async(req, res) => {
    try{
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.json(updateUser)
    } catch(error){
        res.json.status(500).json({message: error.message})
    }
}

