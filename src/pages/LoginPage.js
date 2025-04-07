import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert("登入失敗：" + err.message);
    }
  };

  return (
    <div className="container">
      <h2>🔐 登入</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="密碼" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={login}>登入</button>
      <p>還沒有帳號？<Link to="/register">註冊</Link></p>
      <p>忘記密碼？<Link to="/forgot">點我重設</Link></p>
    </div>
  );
}
