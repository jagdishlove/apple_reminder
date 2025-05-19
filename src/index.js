import express from "express";
import reminderRoutes from "./routes/reminderRoutes.js";
import errorHandle from "./middlewares/errorHandlerMiddleware.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/reminders", reminderRoutes);
app.use(errorHandle);

app.listen(port, () => {
  console.log(`The server is running in port ${port}`);
});
