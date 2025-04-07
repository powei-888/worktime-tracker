import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📧 密碼重設信已寄出，請查看你的信箱");
    } catch (err) {
      setMessage("⚠️ 錯誤：" + err.message);
    }
  };

  return (
    <div className="container">
      <h2>🔐 忘記密碼</h2>
      <input
        type="email"
        placeholder="請輸入註冊的 Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReset}>寄送密碼重設信</button>
      <p>{message}</p>
      <p>
        <Link to="/login">回登入頁</Link>
      </p>
    </div>
  );
}
