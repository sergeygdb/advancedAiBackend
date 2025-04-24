import { User } from '../model/user';
import { RegisterUser } from '../types';
import database from '../util/database';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByUsername = async ({ username }: { username: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { username },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

// export type RegisterUser = {
//     id?: number;
//     username: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//     email: string;
// }

const registerUser = async (user: RegisterUser): Promise<User> => {
    if (!user) {
        throw new Error('User is undefined');
    }

    try {
        const { username, password, firstName, lastName, email } = user;

        const userPrisma = await database.user.create({
            data: {
                username,
                password,
                firstName,
                lastName,
                email,
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const userDb = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    registerUser,
};

export default userDb;
