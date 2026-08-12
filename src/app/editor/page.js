import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import RateList from "@/models/RateList";
import EditorForm from "./EditorForm";

export default async function EditorPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/");
  }

  await dbConnect();
  
  // Fetch the most recent rate list to use as a template
  const lastRateList = await RateList.findOne({ userId: session.user.id })
    .sort({ date: -1 })
    .lean();

  const serializedLastList = lastRateList ? {
    id: lastRateList._id.toString(),
    date: lastRateList.date,
    items: lastRateList.items.map(item => ({
      name: item.name,
      price: item.price,
      unit: item.unit
    }))
  } : null;

  return (
    <EditorForm lastRateList={serializedLastList} />
  );
}
