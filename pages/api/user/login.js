import { SHA256 as sha256 } from "crypto-js";
// import prisma client
import prisma from '../../../prisma/client';

export default async function handle(req, res) {
    if (req.method === "POST") {
        //login uer
        await loginUserHandler(req, res);
    } else {
        return res.status(405);
    }
}
async function loginUserHandler(req, res) {
    console.log(req.body)
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "invalid inputs" });
    }
    try {
        console.log(email)
        console.log(req.body)
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                image: true,
            },
        });
        console.log(user)
        const hashPassword = (string) => {
            return sha256(string).toString();
        };
        if (user && user.password === hashPassword(password)) {
            // exclude password from json response
            return res.status(200).json(exclude(user, ["password"]));
        } else {
            return res.status(401).json({ message: "invalid credentials" });
        }
    } catch (e) {
        console.log('-----')
        console.log(e)
        console.log('-----')
        throw new Error(e);
    }
}
// Function to exclude user password returned from prisma
function exclude(user, keys) {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}