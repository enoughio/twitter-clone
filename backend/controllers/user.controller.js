import Notification from "../models/notefications.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req,res) => {

    const { username } = req.params;

    try {
        const user = await User.findOne({username}).select("-password");

        if(!user)
            return res.status(404).json({error: "User not Found"});

        res.status(200).json(user);

    } catch (error) {
        console.log(error, "error in getUserProfile Controller");
        res.status(500).json({error: error.message})

    }
}



export const followUnfollowUser = async (req,res) => {

      try{
    
            const { id } = req.params;
            const userToModify = await User.findById(id);
            const currentUserID = await User.findById(req.user._id);

            if(id == req.user._id.toString()) return res.status(400).json({error: "you cant follow yourself"})

            if( !userToModify || !currentUserID ) return res.status(400).json({error: "user not found"});

        
            const isFollowing = currentUserID.following.includes(id);
           
            if (isFollowing)
            {
                //unfollow

                await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
                await User.findByIdAndUpdate(req.user._id, {$pull: {following: id } });

                //TODO return id of user as response 
                res.status(200).json({message: "user unfollowed"+ isFollowing,});
            }
            else  //follow
            {   
                await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
                await User.findByIdAndUpdate(req.user._id, {$push: {following: id } });
                // send notification to user 
                const newNotification = new Notification({
                    type: "follow",
                    from: req.user._id,
                    to: userToModify,
                })

                await newNotification.save();

                //TODO return id of user as response 
                res.status(200).json({message: "user followed"});
            }    

        } catch (error) {

            console.log(error, "error in followUnfollowUser Controller");
            res.status(500).json({error: error.message})

        }
}