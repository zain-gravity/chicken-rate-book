"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "./actions";
import { FileText, ArrowRight } from "lucide-react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    if (isLogin) {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } else {
      const res = await registerUser(formData);
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Automatically sign in after register
        const loginRes = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });
        if (loginRes.error) {
          setError(loginRes.error);
          setLoading(false);
        } else {
          router.push("/dashboard");
        }
      }
    }
  };

  return (
    <div className="container" style={{ justifyContent: 'center' }}>
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-lg)', marginBottom: '16px', color: 'white', boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)' }}>
          <FileText size={48} />
        </div>
        <h1 className="title" style={{ fontSize: '36px', marginBottom: '4px', letterSpacing: '-1px' }}>Rate Book</h1>
        <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--primary)', opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase' }}>by Mirza</p>
      </div>

      <div className="card glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', textAlign: 'center' }}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        {error && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label className="input-label" htmlFor="shopName">Shop Name</label>
              <input type="text" id="shopName" name="shopName" className="input-field" placeholder="e.g. Al-Madina Chicken Center" required={!isLogin} />
            </div>
          )}
          
          <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <input type="text" id="username" name="username" className="input-field" placeholder="Enter username" required />
          </div>

          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label className="input-label" htmlFor="password">Password</label>
            <input type="password" id="password" name="password" className="input-field" placeholder="Enter password" required />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Register")}
            {!loading && <ArrowRight size={20} style={{ marginLeft: '8px' }} />}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', marginLeft: '8px', cursor: 'pointer', fontSize: '14px' }}
            >
              {isLogin ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
