import bcrypt from "bcrypt";

const run = async () => {
  const password = "tuongioe123"; // mật khẩu gốc
  const hashed = await bcrypt.hash(password, 10); // salt rounds = 10
  console.log("Hashed password:", hashed);
};

run();
