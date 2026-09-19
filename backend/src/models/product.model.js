import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    price:{
       type: Number,
       required: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    images:[
        {
            url:{
                type: String,
                required: true
            }
        }
    ],
}, { timestamps: true });

const productModel = mongoose.model('product', productSchema);

export default productModel;