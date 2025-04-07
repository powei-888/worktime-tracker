import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert("註冊失敗：" + err.message);
    }
  };

  return (
    <div className="container">
      <h2>📝 註冊</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="密碼" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={register}>註冊</button>
      <p>已有帳號？<Link to="/login">登入</Link></p>
    </div>
  );
}