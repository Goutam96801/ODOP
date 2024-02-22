import mongoose, {Schema} from "mongoose";

const districtSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
        unique:true,
    },
    literacyRate: String,
    population:String,
    productCenters: [{
        name: String,
        address: String,
    }]
});