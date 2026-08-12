import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import RateList from "@/models/RateList";
import Link from "next/link";
import { Plus, Calendar, ChevronRight, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";
import LogoUpload from "./LogoUpload";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/");
  }

  await dbConnect();
  
  // Fetch user to get logo
  const user = await User.findById(session.user.id).lean();
  
  // Fetch rate lists sorted by date descending
  const rateLists = await RateList.find({ userId: session.user.id }).sort({ date: -1 }).lean();

  return (
    <div className="container">
      <div className="header animate-fade-in">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">{session.user.shopName}</p>
        </div>
        <LogoutButton />
      </div>

      <LogoUpload initialLogo={user.logoBase64} />

      <Link href="/editor" style={{ textDecoration: 'none', marginBottom: '32px', display: 'block' }}>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px', cursor: 'pointer', backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}>
          <Plus size={24} />
          <span style={{ fontSize: '18px', fontWeight: '600' }}>Create New Rate List</span>
        </div>
      </Link>

      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Past Rate Lists</h2>
        
        {rateLists.length === 0 ? (
          <div className="card glass-panel" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
            <p>No rate lists found. Create your first one today!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rateLists.map((list) => {
              // format date nicely
              const dateObj = new Date(list.date);
              const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <Link key={list._id.toString()} href={`/preview/${list._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateX(4px)' } }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{formattedDate}</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{list.items.length} items</p>
                      </div>
                    </div>
                    <ChevronRight size={20} color="var(--text-muted)" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
