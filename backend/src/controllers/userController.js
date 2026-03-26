import supabase from "../config/db.js";
import { approveEmail } from "../services/emailService.js";

export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const requestAgent = async (req, res) => {
  try {
    const { name, email, phonenum, password, expertise_area } = req.body;
    if (!name || !email || !phonenum || !password || !expertise_area) {
      return res.status(400).json({
        error: "Please fill all requirements",
      });
    }
    let formattedPhone = phonenum.replace(/\D/g, ""); // Remove non-digit characters
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "60" + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith("60")) {
      formattedPhone = "60" + formattedPhone;
    }
    // Create user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });
    // Auth check
    if (authError) {
      console.error("Supabase Auth Error:", authError.message);
      throw authError;
    }
    // Insert data to users table
    const { error: userError } = await supabase.from("users").insert([
      {
        user_id: authData.user.id,
        name: name,
        email: email,
        phonenum: formattedPhone,
        role: "agent",
        status: "pending",
        expertise_area: expertise_area || null,
      },
    ]);
    if (userError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw userError;
    }
    res.status(201).json({
      message: "Agent registered successfully, please wait for approval.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("users")
      .update({ status: "active" })
      .eq("id", id)
      .select();
    if (error) throw error;
    if (data.length === 0)
      return res.status(404).json({ error: "User not found" });
    const agent = data[0];
    //Email integration
    try {
      await approveEmail(agent.email, agent.name);
      console.log("Email sent successfully to " + agent.email);
      res.status(200).json({
        message:
          "Agent " +
          agent.name +
          " approved successfully, Email has been sent.",
      });
    } catch (emailErr) {
      console.error("Email failed to send:", emailErr.message);
      res.status(200).json({
        message: `Agent ${agent.name} approved successfully, BUT email notification failed.`,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addAdmin = async (req, res) => {
  try {
    const { name, email, phonenum, password } = req.body;
    if (!name || !email || !phonenum || !password) {
      return res.status(400).json({ error: "Please fill all requirements" });
    }
    let formattedPhone = phonenum.replace(/\D/g, ""); // Remove non-digit characters
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "60" + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith("60")) {
      formattedPhone = "60" + formattedPhone;
    }
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });
    if (authError) {
      console.error("Supabase Auth Error:", authError.message);
      throw authError;
    }
    const { error: userError } = await supabase.from("users").insert([
      {
        user_id: authData.user.id,
        name: name,
        email: email,
        phonenum: formattedPhone,
        role: "admin",
        status: "active",
      },
    ]);
    if (userError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw userError;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
