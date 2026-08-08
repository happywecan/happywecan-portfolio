import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import AdminPageHeader from "@/components/admin/shell/AdminPageHeader";

export default function SettingsPage() { return <><AdminPageHeader title="網站設定" description="管理全站聯絡方式、社群連結、導覽文字與首頁區塊。" /><SiteSettingsForm /></>; }
