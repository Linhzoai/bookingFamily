
import app from "./app.js";

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}`);
});
