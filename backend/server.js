import "dotenv/config";
import app from "./src/app.js";
import connectoDB from "./src/config/database.js";

connectoDB()
.catch((err) => {
  console.error("Failed to connect to the database:", err);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});