import mongoose from "mongoose";

const connectoDB = async ()=>{

    const conn = await mongoose.connect(process.env.MONGO_URI)

}

export default connectoDB