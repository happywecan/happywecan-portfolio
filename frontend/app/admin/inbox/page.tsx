import ContactManager from "@/components/admin/ContactManager";
import AdminPageHeader from "@/components/admin/shell/AdminPageHeader";

export default function InboxPage() { return <><AdminPageHeader title="聯絡訊息" description="查看訪客來信，並標記是否已閱讀或回覆。" /><ContactManager /></>; }
