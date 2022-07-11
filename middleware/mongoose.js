import mongoose from "mongoose"

const connectDb = async () => {

    return mongoose.connect(process.env.MONGO_URI, () => { console.log("connected to Mongoddb") }, (err) => { console.log(err) })

}

export default connectDb
