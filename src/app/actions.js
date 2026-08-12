"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import RateList from "@/models/RateList";
import bcrypt from "bcryptjs";

export async function registerUser(formData) {
  try {
    await dbConnect();
    
    const username = formData.get("username");
    const password = formData.get("password");
    const shopName = formData.get("shopName");

    if (!username || !password || !shopName) {
      return { error: "All fields are required" };
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return { error: "Username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      username,
      password: hashedPassword,
      shopName,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: error.message || "Failed to register user" };
  }
}

export async function saveRateList(data) {
  try {
    await dbConnect();
    
    // Validate session
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("./api/auth/[...nextauth]/route");
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return { error: "Unauthorized" };
    }

    const { date, items } = data;
    if (!date || !items || items.length === 0) {
      return { error: "Date and items are required" };
    }

    // Upsert the rate list for this date
    const rateList = await RateList.findOneAndUpdate(
      { userId: session.user.id, date },
      { items },
      { new: true, upsert: true }
    );

    return { success: true, id: rateList._id.toString() };
  } catch (error) {
    console.error(error);
    return { error: error.message || "Failed to save rate list" };
  }
}

export async function updateShopLogo(base64String) {
  try {
    await dbConnect();
    
    // Validate session
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("./api/auth/[...nextauth]/route");
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return { error: "Unauthorized" };
    }

    await User.findByIdAndUpdate(session.user.id, { logoBase64: base64String });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: error.message || "Failed to update logo" };
  }
}
