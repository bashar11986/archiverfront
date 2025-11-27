"use client";

import {  useEffect, useState } from "react";
import {  apiRoles} from "@/lib/api";
import { useTranslations } from 'next-intl';
import { RotateCcw } from "lucide-react"; // أيقونة من مكتبة lucide-react (مدعومة في Next)



interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
}
interface Role{
  id: string;
  name: string;
}

export default function RoleCard() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
   
  const [collapsedRole, setCollapsedRole] = useState(false);
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  // get users when page load
 
  const fetchRoles = async function () {
    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await apiRoles.get("/GetAllRoles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data);
      console.log("roles: ",roles)
    } catch (err) {
      setError(t("errRolesFetch"));
      console.log(err)
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };
  useEffect(function () {
    fetchRoles();
  }, []);
  const refreshCard = async function () {
    setRefreshing(true);
    fetchRoles();
  }
  const handleDeleteRole = (name: string) => {
    setRoles(roles.filter((u) => u.name !== name));
  };

  if (loading) return <p className="p-6">{tCommon("loading")}</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
       
 <div className="bg-slate-100 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-2 mb-4 cursor-pointer select-none"
            onClick={() => setCollapsedRole(!collapsedRole)}
          >
            <h2 className="text-xl font-semibold">{t('roleTable.lable')} {roles.length}  </h2>

            {/* The arrow icon - collapse or not */}
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${collapsedRole ? "rotate-180" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>   
          <button
            onClick={refreshCard}
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
          className={`transition-all duration-500 overflow-hidden ${collapsedRole ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
            }`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-right font-medium  text-blue-900 border-l-1 border-blue-600">
                    {t('roleTable.columns.Name')}
                  </th>
                  
                  <th className="py-3 px-4 border-b text-right font-medium text-blue-900  border-blue-600">
                    {t('roleTable.columns.Tools')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-r text-right  border-blue-600">{role.name}</td>
                  
                    <td className="py-3 px-4 border-r text-right border-blue-600">
                      <div className="flex justify-end gap-2">
                        <button className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded text-sm hover:bg-indigo-300">
                          {t('roleTable.buttons.Edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.name)}
                          className="bg-rose-200 text-rose-800 px-3 py-1 rounded text-sm hover:bg-rose-300"
                        >
                          {t('roleTable.buttons.Delete')}
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
