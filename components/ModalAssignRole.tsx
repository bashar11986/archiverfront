'use client';
import { useEffect, useState } from "react";
import { apiUsers, apiRoles, apiUserRoles } from "@/lib/api";
import { useTranslations } from "next-intl";
import SearchableSelect from 'components/SearchableSelect'

export default function ModalAssignRole({
  showModal,
  setShowModal,
  refreshUserRoles
}) {

  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  const [loading, setLoading] = useState(false);
  const [usersr, setUsersr] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // for search user and role
  const [searchUser, setSearchUser] = useState("");
  const [searchRole, setSearchRole] = useState("");

  // get users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentlang = localStorage.getItem("lang") || "en";

      const res = await apiUsers.get("/GetAllUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentlang
        }
      });

      setUsersr(res.data);
      console.log("users" , res.data)
    } catch (err) {
      console.error(err);
    }
  };

  // get roles
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentlang = localStorage.getItem("lang") || "en";

      const res = await apiRoles.get("/GetAllRoles", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentlang
        }
      });

      setRoles(res.data);
      console.log("roles: ",res.data)
    } catch (err) {
      console.error(err);
    }
  };

  // get data when modal opened
  useEffect(() => {
    if (showModal) {
      fetchUsers();
      fetchRoles();
    }
  }, [showModal]);


  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      alert(tCommon("selectUserRole"));
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const currentlang = localStorage.getItem("lang") || "en";

      const response = await apiUserRoles.post(
        "/AssignRoleToUser",
        {
            userName: selectedUser,
            roleName: selectedRole
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept-Language": currentlang
          }
        }
      );

      console.log(response);

      refreshUserRoles && refreshUserRoles();
      setShowModal(false);

    } catch (error) {
      console.log(error);

      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unknown error occurred";

      alert(tCommon("Error") + JSON.stringify(serverMessage));
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="bg-black/50 fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md border">

        <h2 className="text-xl font-semibold mb-4">
          {t("buttons.assignRole.modal.title")}
        </h2>

        {/* اختيار المستخدم */}
        <div className="mb-3">
          {/* <label className="text-sm font-medium">اختر المستخدم</label>
          <input
            type="text"
            placeholder="بحث..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-full border rounded p-2 text-sm mt-1"
          />

          <select
            className="w-full border rounded p-2 text-sm mt-2"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- اختر مستخدم --</option>
            {usersr
              .filter(u =>
                u.userName.toLowerCase().includes(searchUser.toLowerCase())
              )
              .map((u) => (
                <option key={u.id} value={u.userName}>
                  {u.userName}
                </option>
              ))
              }
          </select> */}
          <SearchableSelect
  label= {t("buttons.assignRole.modal.lableSelectUser")}
  options={usersr}
  selected={selectedUser}
  setSelected={setSelectedUser}
  getLabel={(u: any) => u.userName ?? u.userName ?? u.email ?? u.id}
  getValue={(u: any) => u.userName}
/>
        </div>

        {/* اختيار الدور */}
        <div className="mb-3">
          {/* <label className="text-sm font-medium">اختر الدور</label>
          <input
            type="text"
            placeholder="بحث..."
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
            className="w-full border rounded p-2 text-sm mt-1"
          />

          <select
            className="w-full border rounded p-2 text-sm mt-2"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">-- اختر دور --</option>
            {roles
              .filter(r =>
                r.name.toLowerCase().includes(searchRole.toLowerCase())
              )
              .map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
          </select> */}

<SearchableSelect
  label= {t("buttons.assignRole.modal.lableSelectRole")}
  options={roles}
  selected={selectedRole}
  setSelected={setSelectedRole}
  getLabel={(r: any) =>
    typeof r === "string"
      ? r
      : r.name ?? r.name  ?? r.id
  }
  getValue={(r: any) =>
    typeof r === "string"
      ? r
      : r.name ?? r.name  ?? r.id
  }
/>
        </div>

        {/* الأزرار */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100 transition"
          >
            {tCommon("cancel")}
          </button>

          <button
            onClick={handleAssignRole}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-md text-white  
              ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? tCommon("Saving") : tCommon("Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
