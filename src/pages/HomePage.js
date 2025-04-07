import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function HomePage() {
  const today = new Date().toISOString().split("T")[0];
  const thisMonth = today.slice(0, 7);
  const [date, setDate] = useState(today);
  const [hours, setHours] = useState("");
  const [records, setRecords] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(thisMonth);
  const [availableMonths, setAvailableMonths] = useState([]);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (uid) {
      fetchRecords(selectedMonth);
      loadAllMonths();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, uid]);

  const handleSubmit = async () => {
    if (!hours || !date) {
      alert("請輸入完整資訊！");
      return;
    }
  
    const parsedHours = parseFloat(hours);
    if (isNaN(parsedHours) || parsedHours <= 0 || parsedHours > 24) {
      alert("⛔ 請輸入 0～24 小時之間的數字！");
      return;
    }
  
    try {
      const docRef = doc(db, `users/${uid}/work_hours`, date);
      await setDoc(docRef, {
        date: date,
        hours: parsedHours,
      });
  
      alert("✅ 工時已成功儲存！");
      setHours("");
      setDate(today);
      fetchRecords(selectedMonth);
      loadAllMonths();
    } catch (err) {
      console.error("❌ 儲存失敗", err);
      alert("❌ 儲存失敗");
    }
  };
  

  const fetchRecords = async (month) => {
    try {
      const startOfMonth = month + "-01";
      const endOfMonth = month + "-31";

      const q = query(
        collection(db, `users/${uid}/work_hours`),
        where("date", ">=", startOfMonth),
        where("date", "<=", endOfMonth)
      );

      const querySnapshot = await getDocs(q);
      const data = [];
      let sum = 0;

      querySnapshot.forEach((doc) => {
        const d = doc.data();
        if (d.date && d.hours !== undefined) {
          data.push(d);
          sum += d.hours;
        }
      });

      data.sort((a, b) => (a.date > b.date ? 1 : -1));
      setRecords(data);
      setTotalHours(sum);
    } catch (err) {
      console.error("讀取資料失敗", err);
    }
  };

  const loadAllMonths = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, `users/${uid}/work_hours`));
      const monthsSet = new Set();

      querySnapshot.forEach((doc) => {
        const d = doc.data();
        if (d.date) {
          monthsSet.add(d.date.slice(0, 7));
        }
      });

      setAvailableMonths(Array.from(monthsSet).sort().reverse());
    } catch (err) {
      console.error("無法載入所有月份", err);
    }
  };

  const handleEdit = (editDate, value) => {
    setDate(editDate);
    setHours(value);
  };

  const handleDelete = async (delDate) => {
    const confirm = window.confirm(`確定要刪除 ${delDate} 的紀錄嗎？`);
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, `users/${uid}/work_hours`, delDate));
      alert("✅ 已刪除");
      fetchRecords(selectedMonth);
      loadAllMonths();
    } catch (err) {
      console.error("❌ 刪除失敗", err);
      alert("❌ 刪除失敗");
    }
  };

  const logout = () => {
    signOut(auth);
  };

  if (!uid) return <p>🔐 尚未登入</p>;

  return (
    <div className="container">
      <h2>🕒 {auth.currentUser.email} 的工時紀錄</h2>
      <p>🚀 自動部署測試成功！</p>


      <button onClick={logout}>🚪 登出</button>
      <br /><br />

      <label>
        日期：
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <br /><br />

      <label>
        工時：
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
      </label>
      <br /><br />

      <button onClick={handleSubmit}>✅ 儲存工時</button>

      <hr />

      <label>
        🗓️ 選擇月份：
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </label>

      <h3>📅 每日紀錄</h3>
      <div>
        {records.map((item) => (
          <div key={item.date} className="record">
            <span>
              {item.date}：{item.hours} 小時
            </span>
            <div className="record-buttons">
              <button onClick={() => handleEdit(item.date, item.hours)}>
                ✏️ 編輯
              </button>
              <button onClick={() => handleDelete(item.date)}>🗑️ 刪除</button>
            </div>
          </div>
        ))}
      </div>

      <h3>📊 本月總工時：{totalHours} 小時</h3>
    </div>
  );
}
