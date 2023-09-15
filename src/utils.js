import {dirname} from 'path';
import {fileURLToPath} from 'url';
import bcrypt from 'bcrypt';

export const __dirname= dirname(fileURLToPath(import.meta.url))

export const URI ="mongodb+srv://rickyfernandez210:123456.@cluster0.ublusye.mongodb.net/ecomerce?retryWrites=true&w=majority"


export const hashdata=  async (data)=>{
    return bcrypt.hash(data, 10)
}

export const compareHash = async (data, hash)=>{
    return bcrypt.compare(data, hash)
}
