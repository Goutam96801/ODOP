import mongoose, {Schema} from "mongoose";

const negotiationSchema = mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
},
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},
  initialPrice: { 
    type: Number, 
    required: true 
},
  finalPrice: Number,
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
},
  messages: [{
    senderId: mongoose.Schema.Types.ObjectId,
    text: String,
    createdAt: { 
        type: Date, 
        default: Date.now }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now }
})