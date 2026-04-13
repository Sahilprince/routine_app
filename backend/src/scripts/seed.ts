import { connectDB } from "../config/db";
import { User } from "../models/User";
import { Routine } from "../models/Routine";
import { hashPassword } from "../utils/password";

const run = async () => {
  await connectDB();
  await User.deleteMany({});
  await Routine.deleteMany({});
  const password = await hashPassword("password123");
  const user = await User.create({
    name: "Demo",
    email: "demo@example.com",
    password,
    inviteCode: "DEMO1",
  });
  await Routine.create({
    userId: user.id,
    title: "Morning Run",
    time: "07:00",
    category: "Health",
    frequency: { type: "daily" },
    shared: false,
  });
  process.exit(0);
};

void run();
