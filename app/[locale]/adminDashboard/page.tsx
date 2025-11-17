"use client";

import { useEffect, useState } from "react";
import { apiUsers, apiAccount } from "@/lib/api";
import { RotateCcw, UserPlus, ShieldPlus, UserCog } from "lucide-react"; // أيقونة من مكتبة lucide-react (مدعومة في Next)
import { useTranslations } from 'next-intl';

interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
}

export default function AdminDashboard() {
  //const t = useTranslations(); // الترجمة
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
  });
  const handleSaveUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const currentlang = localStorage.getItem("lang") || "en";
      const response = await apiAccount.post('/NewUser',
        {
          username: userData.username,
          password: userData.password,
          email: userData.email,
          phoneNumber: userData.phoneNumber
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept-Language": currentlang
          },
        }
      );
      fetchUsers(); //refresh page get users
      setUserData({ username: "", password: "", email: "", phoneNumber: "" });
      setShowModal(false);

    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ أثناء إضافة المستخدم");
    } finally {
      setLoading(false);
    }
  };

  const t = useTranslations('dashboard');
  // get users when page load
  const fetchUsers = async function () {
    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await apiUsers.get("/GetAllUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setError("فشل في جلب بيانات المستخدمين");
      console.log(err)
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(function () {
    fetchUsers();
  }, []);

  const handleDelete = (email: string) => {
    setUsers(users.filter((u) => u.email !== email));
  };

  if (loading) return <p className="p-6">جاري التحميل...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        {/* العنوان */}
        <h1 className="text-3xl font-bold">{t("title")}</h1>

        {/* الأزرار المصغرة */}
        <div className="flex items-center gap-2">
          {/* زر إضافة مستخدم */}
          <button
            onClick={() => setShowModal(true)}

            className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
          >
            <UserPlus size={14} />
            {t("buttons.addUser.title")}
          </button>

          {/* زر إضافة دور */}
          <button
            // onClick={handleAddRole}
            className="flex items-center gap-1.5 bg-green-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-700 transition"
          >
            <ShieldPlus size={14} />
            {t("buttons.addRole")}
          </button>

          {/* زر إسناد دور */}
          <button
            // onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-purple-700 transition"
          >
            <UserCog size={14} />
            {t("buttons.assignRole")}
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative border">
              <h2 className="text-xl font-semibold mb-4">{t("buttons.addUser.modal.title")}</h2>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder={t("buttons.addUser.modal.placeholder.username")}
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="password"
                  placeholder={t("buttons.addUser.modal.placeholder.password")}
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="email"
                  placeholder={t("buttons.addUser.modal.placeholder.email")}
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder={t("buttons.addUser.modal.placeholder.phoneNumber")}
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
                 {t("buttons.addUser.modal.buttons.cancel")}
                </button>
                <button
                  onClick={handleSaveUser}
                  disabled={loading}
                  className={`px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? "جارٍ الحفظ..." : t("buttons.addUser.modal.buttons.save")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">{t('table.lable')} {users.length}</h2>
          <button
            onClick={fetchUsers}
            disabled={refreshing}
            className={`group flex items-center gap-1 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700 transition ${refreshing ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            <RotateCcw
              size={14}
              // className={refreshing ? "animate-spin" : ""}
              className={`transition-transform duration-300 ${refreshing ? "animate-spin" : "group-hover:rotate-180"
                }`}
            />
            {refreshing ? t('buttons.Refreshing') : t('buttons.Refresh')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-right font-medium  text-blue-900 border-l-1 border-blue-600">
                  {t('table.columns.Name')}
                </th>
                <th className="py-3 px-4 border-b text-right font-medium  text-blue-900 border-l-1 border-blue-600">
                  {t('table.columns.Email')}
                </th>
                <th className="py-3 px-4 border-b text-right font-medium  text-blue-900 border-l-1 border-blue-600">
                  {t('table.columns.phoneNumber')}
                </th>
                <th className="py-3 px-4 border-b text-right font-medium  text-blue-900 border-l-1 border-blue-600">
                  {t('table.columns.Roles')}
                </th>
                <th className="py-3 px-4 border-b text-right font-medium text-blue-900  border-blue-600">
                  {t('table.columns.Tools')}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-r text-right  border-blue-600">{user.userName}</td>
                  <td className="py-3 px-4 border-r text-right   border-blue-600">{user.email}</td>
                  <td className="py-3 px-4 border-r text-right   border-blue-600">{user.phoneNumber || "-"}</td>
                  <td className="py-3 px-4 border-r text-right  border-blue-600">
                    {user.roles && user.roles.length > 0 ? (
                      <div className="flex flex-wrap gap-1 justify-end">
                        {user.roles.map((role, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded text-xs"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic text-sm">بدون دور</span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-r text-right border-blue-600">
                    <div className="flex justify-end gap-2">
                      <button className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded text-sm hover:bg-indigo-300">
                        {t('table.buttons.Edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(user.email)}
                        className="bg-rose-200 text-rose-800 px-3 py-1 rounded text-sm hover:bg-rose-300"
                      >
                        {t('table.buttons.Delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
