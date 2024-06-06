import users from "../models/auth.js";

export const points = async (req, res) => {
  const { email } = req.query;

  try {
    if (req.method === 'GET') {
      // Fetch the user by email
      const user = await users.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("User points retrieved successfully");

      // Return the user's points
      return res.status(200).json({ points: user.points });
    } else if (req.method === 'POST') {
      // Update the points key by incrementing by 5
      const updatedUser = await users.findOneAndUpdate(
        { email },
        { $inc: { points: 5 } }, // Increment points by 5
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(updatedUser);
      console.log("User points updated successfully");

      // Return the updated user object
      return res.status(200).json({ user: updatedUser });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
