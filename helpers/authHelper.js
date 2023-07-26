import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    catch(err){
        console.log(err);
    }
    
};

export const comparePassword = async(password, hashedpassword) => {
    return bcrypt.compare(password, hashedpassword);
};