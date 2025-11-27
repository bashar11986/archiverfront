import {useState} from  'react'
import { useTranslations } from 'next-intl';
import { apiRoles } from '@/lib/api'

export default function ModalAddRole(
    {
        showModalRole,
        setShowModalRole,
        roleData,
        setRoleData,
        refreshUser
    }
) {
    const [loading, setLoading] = useState(false);
    const t = useTranslations('dashboard');
    const tCommon = useTranslations('common');
    function closeFun() {
        setShowModalRole(false)
      }
    const handleSaveUser = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const currentlang = localStorage.getItem("lang") || "en";
          const response = await apiRoles.post('/NewRole',  `"${roleData.roleName}"`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,   
                "Accept-Language": currentlang
              },
            }
          );
         console.log(response);
          refreshUser; //refresh page get users
          setShowModalRole(false);
          setLoading(false);
        } catch (error) {
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
    if (!showModalRole) return null;
    return (
        <div className="bg-black/50 fixed inset-0 flex justify-center items-center z-50 "
        //onClick={setShowModal(false)}  
        hidden={showModalRole ? false : true}
      >
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative border"
        // onClick={handleCloseModal2}         
        >
          <h2 className="text-xl font-semibold mb-4">
            {t("buttons.addRole.modal.title")}
          </h2>
  
          <div className="space-y-3">
            <input
              type="text"
              placeholder={t("buttons.addRole.modal.placeholder.rolename")}
              value= {roleData.roleName}
              onChange={(e) => setRoleData({...roleData,roleName: e.target.value })}
              className="w-full border rounded p-2 text-sm"
            />                       
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={closeFun}
            className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100 transition"
          >
            {t("buttons.addUser.modal.buttons.cancel")}
          </button>

          <button
            onClick={handleSaveUser}
            disabled={loading || !roleData.roleName}
            className={`px-4 py-2 text-sm rounded-md text-white ${!roleData.roleName ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700 transition"}  ${loading ? "opacity-60 cursor-not-allowed" : ""
              } `}
          >
            {loading ? tCommon("Saving") : tCommon("Save")}
          </button>
        </div>
        </div>
      </div>
    )
}

