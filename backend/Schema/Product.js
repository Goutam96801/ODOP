import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description :{
        type:String,
        required:true
    },
    price : {
        type:Number,
        required:true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: { 
        type: String 
    },
    district: {
        type: String,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    createdAt: 
    { type: Date, 
        default: Date.now 
    }
})

export default mongoose.model('product', productSchema);