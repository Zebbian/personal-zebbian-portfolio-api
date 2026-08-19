// ES module imports are hoisted and evaluated before any other top-level
// code in this file - so `import app from "./app.js"` below would run
// before a later `dotenv.config()` call, leaving process.env unset when
// app.js reads it (e.g. CORS's origin). "dotenv/config" loads .env as a
// side effect of the import itself, so it's guaranteed to run first as
// long as it stays the first import in this file.
import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
