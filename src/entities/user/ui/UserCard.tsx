"use client";

import { useEffect, useState } from "react";
import { apiUsers, apiRoles } from "@/lib/api";
import { RotateCcw, UserPlus, ShieldPlus, UserCog } from "lucide-react"; // أيقونة من مكتبة lucide-react (مدعومة في Next)
import { useTranslations } from 'next-intl';
import ModalAddUser from '@/features/add-user/ui/ModalAddUser';
import ModalAddRole from '@/features/add-role/ui/ModalAddRole';
import ModalAssignRole from '@/features/assign-role/ui/ModalAssignRole';

interface User {
  id: "";
  userName: "";
  email: "";
  phoneNumber: "";
  roles: [];
}
interface Role {
  id: string;
  name: string;
}

export default function UserCard() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalRole, setShowModalRole] = useState(false);
  const [showModalUserRole, setShowModalUserRole] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
  });
  const [userDataEdit, setUserDataEdit] = useState({
    username: "",
    newUserName: "",
    email: "",
    phoneNumber: "",
    newPassword: ""
  });
  const [roleData, setRoleData] = useState({
    roleName: ""
  })
  const [collapsed, setCollapsed] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  // get users when page load
  const fetchUsers = async function () {
    setRefreshing(true);
    try {
      const response = await apiUsers.get("/GetAllUsers", {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      setUsers(response.data);
      console.log("response: " , response.data)
    } catch (err) {
      setError(t("errUserFetch"));
      console.log(err)
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(function () {
    fetchUsers();
  }, []);
  const handlAddUserBtn = async function () {
    setShowModal(true);
    setIsEditMode(false); 
  }
  const refreshAll = async function () {
    setRefreshing(true);
    fetchUsers();
  }
  const handleDelete = (email: string) => {
    setUsers(users.filter((u) => u.email !== email));
  };


  if (loading) return <p className="p-6">{tCommon("loading")}</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        {/* dashboard title */}
        <h1 className="text-3xl font-bold">{t("title")}</h1>

        <div className="flex items-center gap-2">
          {/* Add user BTN */}
          <button
            onClick={handlAddUserBtn}

            className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
          >
            <UserPlus size={14} />
            {t("buttons.addUser.title")}
          </button>
          <ModalAddUser
            isEditMode = {isEditMode}
            showModal={showModal}
            setShowModal={() => {
              setShowModal(false)
            }}
            userData={userData}
            setUserData={setUserData}
            refreshUser={fetchUsers}
            userDataEdit={userDataEdit}
            setUserDataEdit={setUserDataEdit}
          />
          <button
            onClick={() => setShowModalRole(true)}
            className="flex items-center gap-1.5 bg-green-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-700 transition"
          >
            <ShieldPlus size={14} />
            {t("buttons.addRole.title")}
          </button>
          <ModalAddRole
            showModalRole={showModalRole}
            setShowModalRole={() => { setShowModalRole(false) }}
            roleData={roleData}
            setRoleData={setRoleData}
            refreshUser
          />
          {/* assign Role BTN */}
          <button
            onClick={() => setShowModalUserRole(true)}
            className="flex items-center gap-1.5 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-purple-700 transition"
          >
            <UserCog size={14} />
            {t("buttons.assignRole.title")}
          </button>
          <ModalAssignRole
            showModal={showModalUserRole}
            setShowModal={() => setShowModalUserRole(false)}
            refreshUserRoles={fetchUsers}
          />
        </div>
      </div>
      <div className="bg-slate-100 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-2 mb-4 cursor-pointer select-none"
            onClick={() => setCollapsed(!collapsed)}
          >
            <h2 className="text-xl font-semibold">{t('table.lable')} {users.length}  </h2>

            {/* The arrow icon - collapse or not */}
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${collapsed ? "rotate-180" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button
            onClick={refreshAll}
            disabled={refreshing}
            className={`group flex items-center gap-1 bg-rose-400 text-white text-sm px-3 py-1.5 rounded-md hover:bg-rose-600 transition ${refreshing ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            <RotateCcw
              size={14}
              className={`transition-transform duration-300 ${refreshing ? "animate-spin" : "group-hover:rotate-180"
                }`}
            />
            {refreshing ? t('buttons.Refreshing') : t('buttons.Refresh')}
          </button>



        </div>

        <div
          className={`transition-all duration-500 overflow-hidden ${collapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
            }`}
        >
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
                        <button
                          onClick={() => {
                            setIsEditMode(true);
                            setEditingUser(user);
                            setUserDataEdit({
                              username: user.userName,
                              newUserName: "",
                              email: user.email,
                              phoneNumber: user.phoneNumber || "",
                              newPassword: ""
                            });
                            setShowModal(true);
                          }}
                          className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded text-sm hover:bg-indigo-300">
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
    </>
  );
}
