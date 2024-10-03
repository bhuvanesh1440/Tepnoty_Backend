const bcrypt = require("bcrypt");

async function checkPassword() {
//   const password = "111111";

//   // Hash the password asynchronously
//   const hashedPassword = await bcrypt.hash(password, 10);
//   console.log("Hashed Password:", hashedPassword);

//   const password1 = "111111";

//   // Hash the second password asynchronously
//   const hashedPassword1 = await bcrypt.hash(password1, 10);
//   console.log("Hashed Password 1:", hashedPassword1);

  // The hashes will always be different because bcrypt generates a new salt each time

//   const confirmpass = "111111";

  // Compare the confirmation password with the first hashed password
  const isMatch = await bcrypt.compare(
    "1",
    "$2a$10$OIx/RMPTkTW8I8zbEiy5pullzKJ5zAy2vhu8ZnY8Y2nKNp9cqULYW"
  );
  console.log("Password match:", isMatch);
}

checkPassword();
