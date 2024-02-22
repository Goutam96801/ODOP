import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({

    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String,
        enum: ['buyer', 'seller'], 
        default: 'buyer' 
    },
    address: { 
      district: String,
      state: { type: String, default: 'Jammu and Kashmir' },
      country: { type: String, default: 'India' }
    },
    aadharCard: { 
        type: String,
        required: function() { return this.role === 'seller'; } 
    }, // Conditional based on role
    createdAt: { 
        type: Date, 
        default: Date.now 
    }

})

export default mongoose.model("users", userSchema);