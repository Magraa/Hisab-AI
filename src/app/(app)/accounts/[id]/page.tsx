import { AccountDetailScreen } from "@/components/hisab/AccountDetailScreen";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AccountDetailScreen entityId={id} />;
}
