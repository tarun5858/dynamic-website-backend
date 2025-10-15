import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Blog from "./models/Blog.js";
import dotenv from "dotenv";
const PORT = process.env.PORT || 5000;

const app = express();
dotenv.config();
// app.use(cors());
// app.use(cors({
//   origin: "https://dynamic-website-react.onrender.com"
// }));

const allowedOrigins = [
  "https://dynamic-website-react.onrender.com",
  "http://localhost:5173",
  "http://localhost:4173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());


// MongoDB Connection
// const uri = "mongodb+srv://prehome_website_user:1ywa7PfsUW3pPWvt@lead-tracking.jysawuj.mongodb.net/?retryWrites=true&w=majority";

// mongoose.connect(uri, {
//   dbName: "dynamic-website-blogs",
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  dbName: process.env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// ------------------- APIs -------------------

// 1) Get all blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2) Get single blog by ID
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3) Add a new blog (manual form)
app.post("/api/blogs", async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json({ message: "Blog created", blog });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// --------------------------------------------

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
















// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import Blog from "./models/Blog.js";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// // mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
// mongoose.connect("mongodb+srv://prehome_website_user:1ywa7PfsUW3pPWvt@lead-tracking.jysawuj.mongodb.net/dynamic-website-blogs", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));


// const uri = "mongodb+srv://prehome_website_user:1ywa7PfsUW3pPWvt@lead-tracking.jysawuj.mongodb.net/?retryWrites=true&w=majority";


// mongoose.connect(uri, {
//   dbName: "dynamic-website-blogs",  
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));

// // Get all blogs
// app.get("/api/blogs", async (req, res) => {
//   try {
//     const blogs = await Blog.find();
//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get single blog by ID
// app.get("/api/blogs/:id", async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }
//     res.json(blog);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
