"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";



interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("")

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;


    const handleSubmit = async () => {
    if (!email || !password) return alert("Fill in all fields.");

    setLoading(true);

    try {
        if (authMode === "signin") {
        const result = await signIn("credentials", {
          email: email,
          password,
          redirect: false,
        });

        if (!result?.error) {
          onClose();
        };
        onClose();
        } else {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email: email, password }),
        });

        const data = await res.json();
        console.log("Register response:", data);

        if (!res.ok) {
          alert(data.error || "Signup failed");
          setLoading(false);
          return;
          
        } else {
            alert("Account created! Now sign in.");
            setAuthMode("signin");
        }
        }
    } catch (err) {
        alert("Something went wrong.");
    }

    setLoading(false);
    };
  
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 999999,
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          background: "#1f2937",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          color: "white",
          animation: "scaleIn 0.2s ease-out",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            color: "#9ca3af",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {authMode === "signin" ? "Welcome Back" : "Create Account"}
        </h2>

        <input

          placeholder="Nickname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...inputStyle, marginTop: "1rem" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...inputStyle, marginTop: "1rem" }}
        />

        <button
        disabled={loading}
        onClick={handleSubmit}
        style={{
            ...primaryButton,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
        }}
        >
        {loading
            ? "Processing..."
            : authMode === "signin"
            ? "Sign In Now"
            : "Sign Up Now"}
        </button>

        <div style={switchStyle}>
          {authMode === "signin" ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setAuthMode("signup")} style={linkStyle}>
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setAuthMode("signin")} style={linkStyle}>
                Sign In
              </span>
            </>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0 }
            to { transform: scale(1); opacity: 1 }
          }
        `}
      </style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  background: "#374151",
  borderRadius: "0.5rem",
  border: "none",
  color: "white",
};

const primaryButton = {
  width: "100%",
  marginTop: "1.5rem",
  padding: "0.6rem",
  backgroundColor: "#10b981",
  borderRadius: "0.5rem",
  border: "none",
  fontWeight: 500,
  cursor: "pointer",
  color: "white",
};

const switchStyle = {
  marginTop: "1rem",
  textAlign: "center" as const,
  fontSize: "0.875rem",
  color: "#9ca3af",
};

const linkStyle = {
  color: "#10b981",
  cursor: "pointer",
};