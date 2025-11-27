import UserCard from '@/entities/user/ui/UserCard'
import RoleCard from '@/entities/role/ui/RoleCard'

export default function AdminDashboard() {
  return   ( <>
  <div className="min-h-screen bg-gray-50 p-8">
  <UserCard /> <RoleCard/> 
  </div>
     </>  )  
 }
