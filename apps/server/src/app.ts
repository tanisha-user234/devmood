import express from "express";
import cors from 'cors';
import authRouter from "./routes/auth";
import entryRouter from "./routes/entries";
import insightsRouter from "./routes/insights";
import { authMiddleWare } from "./middleware/auth";

const app = express();

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools and same-machine local apps.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use('/api/auth', authRouter)
app.use('/api/entries',authMiddleWare,entryRouter)
app.use('/api/insights',authMiddleWare,insightsRouter)

app.get('/health',(req,res)=>{
 res.json({status:'ok',timeStamp: new Date().toISOString()});
})


app.use((err:any,req:express.Request,res:express.Response,next:express.NextFunction)=>{
    console.error(err.stack);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({
        message:err.message || 'Internal Server Error'
    })
})

export default app;