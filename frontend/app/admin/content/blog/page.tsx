import BlogManager from "@/components/admin/BlogManager";
import AdminPageHeader from "@/components/admin/shell/AdminPageHeader";

export default function BlogPage() { return <><AdminPageHeader title="部落格" description="管理文章草稿與已發布內容。" /><BlogManager /></>; }
