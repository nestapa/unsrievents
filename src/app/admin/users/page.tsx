import { adminGetAllUsers } from "@/lib/actions";
import { UserList } from "@/components/admin/user-list";
import { ExportCSVButton } from "@/components/export-csv-button";

export default async function AdminUsersPage() {
  const allUsers = await adminGetAllUsers();

  const exportColumns = [
    { key: "name", label: "Nama Pengguna" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "createdAt", label: "Tanggal Bergabung" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">KELOLA <span className="text-primary italic">PENGGUNA.</span></h1>
          <p className="text-muted-foreground mt-4 text-lg">Atur otorisasi pengguna dan pantau akun di seluruh platform.</p>
        </div>
        <div className="flex gap-3">
          <ExportCSVButton data={allUsers} filename="Data_Pengguna_Sistem" columns={exportColumns} />
        </div>
      </div>

      <UserList users={allUsers} />
    </div>
  );
}
