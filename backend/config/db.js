import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://skekram:skekram123@cluster0.a22xizz.mongodb.net/food-del').then(()=>console.log("DB Connected"));
   
}


