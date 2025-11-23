'use client';
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { apiAccount } from "@/lib/api";


export default function ModalAddUser({
  showModal,
  setShowModal,
  userData,
  setUserData,
  refreshUser
}) {
  const [showPassword, setShowPassword] = useState(false);  
  const [loading, setLoading] = useState(false);
  const t = useTranslations('dashboard');
  const terr = useTranslations('common');


  const formData = userData.username == "" || userData.password == ""
    || userData.email == "" || userData.phoneNumber == ""
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
      console.log(response);
      refreshUser; //refresh page get users
      setUserData({ username: "", password: "", email: "", phoneNumber: "" });
      setShowModal(false);
      setLoading(false);
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unknown error occurred";


      alert(terr("Error") + JSON.stringify(serverMessage));
    } finally {
      setLoading(false);
    }
  };
  function closeFun() {
    setShowModal(false)
  }


  if (!showModal) return null;

  return (
    /* bg-black/50 not bg-black opacity-50 .. i want opacity on external div , internal div without opacity*/
    <div className="bg-black/50 fixed inset-0 flex justify-center items-center z-50 "
      //onClick={setShowModal(false)}  
      hidden={showModal ? false : true}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative border"
      // onClick={handleCloseModal2}         
      >
        <h2 className="text-xl font-semibold mb-4">
          {t("buttons.addUser.modal.title")}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder={t("buttons.addUser.modal.placeholder.username")}
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            className="w-full border rounded p-2 text-sm"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("buttons.addUser.modal.placeholder.password")}
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="w-full border rounded p-2 text-sm"
            />
            <span className={`
      absolute inset-y-0 flex items-center cursor-pointer 
      ltr:right-3 rtl:left-3
    `}
              onClick={() => setShowPassword(!showPassword)}
            >
              {/*  get emoji from keyboard => windows + .   or windows + ;*/}
              {showPassword ? "😴" : "🫣"}
            </span>
          </div>
          <input
            type="email"
            placeholder={t("buttons.addUser.modal.placeholder.email")}
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            className="w-full border rounded p-2 text-sm"
          />

          <input
            type="text"
            placeholder={t("buttons.addUser.modal.placeholder.phoneNumber")}
            value={userData.phoneNumber}
            // ...userData : three point means copy userData
            onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
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
            disabled={loading || formData}
            className={`px-4 py-2 text-sm rounded-md text-white ${formData ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700 transition"}  ${loading ? "opacity-60 cursor-not-allowed" : ""
              } `}
          >
            {loading ? "جارٍ الحفظ..." : t("buttons.addUser.modal.buttons.save")}
          </button>
        </div>
      </div>
    </div>
  );
}    