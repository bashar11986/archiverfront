'use client';
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { apiUsers, apiAccount } from "@/lib/api";
import toast from "react-hot-toast";

export default function ModalAddUser({
    showModal,
    setShowModal,
    userData,
    setUserData,
    userDataEdit,
    setUserDataEdit,
    refreshUser,
    isEditMode,   
    editingUser = null      // ← بيانات المستخدم القديم
}) {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const t = useTranslations('dashboard');
    const tCommon = useTranslations('common');
    
    useEffect(() => {
        //alert("isEditMode: " + isEditMode)
        console.log("userDataEdit: " , userDataEdit)
        if (isEditMode && editingUser) {
            setUserDataEdit({
                username: editingUser.userName,
                newUserName: "",
                email: editingUser.email,
                phoneNumber: editingUser.phoneNumber || "",
                newPassword: ""             // كلمة مرور جديدة إذا أراد
            });
        }
    }, [isEditMode, editingUser]);


    //// Validation
    // const validateForm = () => {
    //     if (!userData.username.trim()) return "اسم المستخدم مطلوب";
    //     if (!userData.email.trim()) return "البريد الإلكتروني مطلوب";

    //     if (!isEditMode && !userData.password.trim())
    //         return "كلمة المرور مطلوبة عند الإضافة";

    //     if (userData.phoneNumber.trim().length < 9)
    //         return "رقم الهاتف غير صالح";

    //     return null;
    // };

    const handleSaveUser = async () => {
        //alert("isEditMode .. " + isEditMode)
        // const validationError = validateForm();
        // if (validationError) {
        //     alert("validationError")
        //     toast.error(validationError);
        //     return;
        // }
        setLoading(true);
        try {
            // const token = localStorage.getItem("token");
             const lang = localStorage.getItem("lang") || "en";

            if (isEditMode) {
              //  alert("in if iseditmode: " + isEditMode)
                const response = await apiUsers.put(
                    "/EditUser",
                    {
                        userName: editingUser.userName,      // القديم
                        newUserName: userData.username,      // الجديد
                        email: userData.email,
                        phoneNumber: userData.phoneNumber,
                        newPassword: userData.password || ""
                    },
                    {
                        headers: {
                           // Authorization: `Bearer ${token}`,
                            "Accept-Language": lang
                        }
                    }
                );
console.log("response in edit: " ,response)
                // toast.success("تم تعديل المستخدم بنجاح");

            } else {
                // 🟩 إضافة مستخدم
                await apiAccount.post(
                    "/NewUser",
                    {
                        username: userData.username,
                        password: userData.password,
                        email: userData.email,
                        phoneNumber: userData.phoneNumber
                    },
                    {
                        headers: {
                            // Authorization: `Bearer ${token}`,
                            // "Content-Type": "application/json",
                            "Accept-Language": lang
                        }
                    }
                );

                // toast.success("تم إضافة المستخدم بنجاح");
            }

            refreshUser();
            setUserData({ username: "", password: "", email: "", phoneNumber: "" });
            setShowModal(false);

        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data ||
                error?.message ||
                "حدث خطأ غير معروف";

            // toast.error(msg);

        } finally {
            setLoading(false);
        }
    };


    if (!showModal) return null;

    return (
        <div className="bg-black/50 fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative border">

                <h2 className="text-xl font-semibold mb-4">
                    {isEditMode ? "تعديل مستخدم" : t("buttons.addUser.modal.title")}
                </h2>

                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="اسم المستخدم"
                        value={isEditMode ? userDataEdit.username : userData.username}
                        onChange={isEditMode ? (e) => setUserDataEdit({ ...userDataEdit, newUserName: e.target.value })
                            :
                            (e) => setUserData({ ...userData, username: e.target.value })
                        }
                        className="w-full border rounded p-2 text-sm"
                    />

                    {/* كلمة المرور - اختيارية عند التعديل */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={isEditMode ? tCommon("newPassword") : tCommon("Password")}
                            value={userDataEdit.newPassword}
                            onChange={isEditMode ? (e) => setUserDataEdit({ ...userDataEdit, newPassword: e.target.value })
                                :
                                (e) => setUserData({ ...userData, password: e.target.value })}
                            className="w-full border rounded p-2 text-sm"
                        />
                        <span
                            className="absolute inset-y-0 flex items-center cursor-pointer ltr:right-3 rtl:left-3"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "😴" : "🫣"}
                        </span>
                    </div>

                    <input
                        type="email"
                        placeholder={isEditMode ? tCommon("newEmail") : tCommon("email")}
                        value={userDataEdit.email}
                        onChange={isEditMode ? (e) => setUserDataEdit({ ...userDataEdit, email: e.target.value })
                            : (e) => setUserData({ ...userData, email: e.target.value })}
                        className="w-full border rounded p-2 text-sm"
                    />

                    <input
                        type="text"
                        placeholder="رقم الجوال"
                        value={userDataEdit.phoneNumber}
                        onChange={isEditMode? (e) => setUserDataEdit({ ...userDataEdit, phoneNumber: e.target.value })
                            :(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                        className="w-full border rounded p-2 text-sm"
                    />
                </div>

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
                        className={`px-4 py-2 text-sm rounded-md text-white 
            ${loading ? "bg-blue-300 opacity-60" : "bg-blue-600 hover:bg-blue-700"} `}
                    >
                        {loading ? "جارٍ الحفظ..." : (isEditMode ? "حفظ التعديلات" : "حفظ")}
                    </button>
                </div>

            </div>
        </div>
    );
}
