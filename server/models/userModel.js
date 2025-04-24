import prisma from "../prisma_client.js"

export const createUser=async (user)=>{
    const newUser=await prisma.user.create({
        data:user,
    })
    return newUser;


}

export const findAllUsers=async()=>{
    console.log("nasdnjsa")
    const users=await prisma.user.findMany();
    return users;
}

export const getUserByEmail= async (email)=>{
    const user=await prisma.user.findUnique({
        where:{
            email:email
        },
    })
    return user;
}

export const getUserById= async (id)=>{
    const user=await prisma.user.findUnique({
        where:{
            id:id
        },
    })
    return user;
}

export const updateUser= async(id,user)=>{
    const updateUser=await prisma.user.update({
        where:{
            id:id
        },
        data:{
            user
        }
    })

    return updateUser;
    
}

export const deleteUser= async(id)=>{
    const  deleteUser= await prisma.user.delete({
        where:{
            id:id
        }
    })
    return deleteUser;
}