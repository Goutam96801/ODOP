import mongoose, { Schema } from "mongoose";

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema = mongoose.Schema({

    fullname: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    profile_img: {
        type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
            }   
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