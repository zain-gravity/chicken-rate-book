import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import RateList from "@/models/RateList";
import User from "@/models/User";
import PreviewActions from "./PreviewActions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PreviewPage({ params }) {
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  await dbConnect();

  const rateList = await RateList.findById(id).lean();
  
  if (!rateList || rateList.userId.toString() !== session.user.id) {
    redirect("/dashboard");
  }

  // Also fetch the user to double check shopName (though we have it in session)
  const user = await User.findById(session.user.id).lean();

  const serializedRateList = {
    date: rateList.date,
    items: rateList.items.map(i => ({ name: i.name, price: i.price, unit: i.unit })),
    note: rateList.note,
    shopName: user.shopName,
    shopAddress: user.shopAddress,
    logoBase64: user.logoBase64,
  };

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ padding: '0 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/dashboard" style={{ color: 'var(--text-main)' }}>
          <div style={{ padding: '8px', backgroundColor: 'var(--surface)', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex' }}>
            <ArrowLeft size={20} />
          </div>
        </Link>
        <h1 className="title" style={{ fontSize: '24px' }}>Rate List Preview</h1>
      </div>
      
      <PreviewActions rateList={serializedRateList} />
    </div>
  );
}
