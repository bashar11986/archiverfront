"use client";
import { useState } from "react";
import { UserPlus } from "lucide-react";

export default function UsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
  });

  // دالة لحفظ المستخدم
  const handleSaveUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to add user");

      // إعادة تعيين البيانات وإغلاق المودال
      setUserData({ username: "", password: "", email: "", phoneNumber: "" });
      setShowModal(false);

      // يمكنك هنا استدعاء دالة لتحديث القائمة بعد الحفظ
      // fetchUsers();

    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ أثناء إضافة المستخدم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">المستخدمون</h1>

        {/* زر إضافة مستخدم */}
        <button
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
        >
          <UserPlus size={14} />
          إضافة مستخدم
        </button>
      </div>

      {/* === المودال (popup) === */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">إضافة مستخدم جديد</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="اسم المستخدم"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
                className="w-full border rounded p-2 text-sm"
              />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                className="w-full border rounded p-2 text-sm"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full border rounded p-2 text-sm"
              />
              <input
                type="text"
                placeholder="رقم الهاتف"
                value={userData.phoneNumber}
                onChange={(e) =>
                  setUserData({ ...userData, phoneNumber: e.target.value })
                }
                className="w-full border rounded p-2 text-sm"
              />
            </div>

            {/* أزرار الحفظ والإلغاء */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveUser}
                disabled={loading}
                className={`px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 transition ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "جارٍ الحفظ..." : "حفظ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
