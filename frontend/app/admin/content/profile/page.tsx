import HobbyManager from "@/components/admin/HobbyManager";
import SkillManager from "@/components/admin/SkillManager";
import AdminPageHeader from "@/components/admin/shell/AdminPageHeader";

export default function ProfilePage() { return <><AdminPageHeader title="關於我" description="維護個人技能與興趣；這些內容會用於前台的自我介紹區塊。" /><div className="grid gap-6"><SkillManager /><HobbyManager /></div></>; }
