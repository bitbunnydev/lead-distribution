import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const connectDB = async () => {
  try {
    const { error } = await supabase.from("users").select("user_id").limit(1);
    if (error && error.code !== "PGRST116") throw error;
    console.log("Supabase connection verified");
  } catch (err) {
    console.error("Supabase connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
