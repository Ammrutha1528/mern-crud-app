import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || "mongodb+srv://amruthakande0_db_user:2bNmUKwwhRO2XqQk@cluster0.xzvaat5.mongodb.net/fsd_db?retryWrites=true&w=majority";

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  res.json({ message: "MERN CRUD API is live and healthy", status: "OK", endpoints: "/api/v1/posts" });
});

app.post("/api/v1/posts", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json({ message: "Post created successfully", data: post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/v1/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ message: "Posts retrieved successfully", data: posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/v1/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post retrieved successfully", data: post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
