import bcrypt from "bcryptjs";

const saltRounds = 10;

export const hashPassword = (plain: string) => bcrypt.hash(plain, saltRounds);
export const comparePassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);
