// One-off CLI script to create (or reset the password of) the admin login
// used by the frontend's /login page. There's no register endpoint by
// design - this is the only way to provision the first user.
//
// Usage: node scripts/seed-admin.js <username> <password>
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/user.model.js";

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error("Usage: node scripts/seed-admin.js <username> <password>");
  process.exit(1);
}

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { username },
    { username, password: hashed, role: "admin" },
    { upsert: true, new: true },
  );

  console.log(`Admin user ready: ${user.username} (role: ${user.role})`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Failed to seed admin user:", error.message);
  process.exit(1);
});
