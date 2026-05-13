"use client";
import { useParams } from "next/navigation";
import { useGetUserById } from "@/app/feature/users/hooks";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useActiveInactiveUser } from "@/app/feature/users/hooks";
const Page = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading } = useGetUserById(id);
  const user = data?.data?.user;

  const { mutate: toggleUserStatus, isPending } = useActiveInactiveUser();

  const handleToggle = () => {
    toggleUserStatus({
      userId: user._id,
    });
  };
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-1/3 bg-gray-400" />
        <Skeleton className="h-6 w-1/2 bg-gray-400" />
        <Skeleton className="h-40 w-full bg-gray-400" />
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-muted-foreground">User not found</div>;
  }

  const initials = (user.userName || user.email || "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-4 p-5 border rounded-xl bg-background">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-base font-medium shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium truncate">
            {user.userName || "No Username"}
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Badge
            className={
              user.isEmailVerified
                ? "rounded-full bg-green-100 text-green-700 border-0"
                : "rounded-full bg-red-100 text-red-600 border-0"
            }
          >
            {user.isEmailVerified ? "Verified" : "Not Verified"}
          </Badge>
          <Badge
            className={
              user.isSubscribed
                ? "rounded-full bg-green-100 text-green-700 border-0"
                : "rounded-full bg-muted text-muted-foreground border-0"
            }
          >
            {user.isSubscribed ? "Subscribed" : "Free"}
          </Badge>
          {/* <button
            onClick={handleToggle}
            disabled={isPending}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
              user?.isDeactivatedByAdmin
                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>
                  {user?.isDeactivatedByAdmin
                    ? "Deactivating..."
                    : "Activating..."}
                </span>
              </>
            ) : user?.isDeactivatedByAdmin ? (
             <>
              
                <ToggleLeft className="size-4 text-red-600" />
                <span>Deactivate User</span>
              </>
            ) : (
                           <>
                <ToggleRight className="size-4 text-green-600" />
                <span>Activate User</span>
              </>
            )}
          </button> */}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Spending",
            value: `$${data?.data?.totalSpending ?? 0}`,
          },
          {
            label: "Total Earnings",
            value: `$${data?.data?.totalEarnings ?? 0}`,
          },
          {
            label: "Active Subs",
            value: data?.data?.activeSubscriptions?.length ?? 0,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-medium">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* RATINGS */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Rating", value: user.rating?.toFixed(1) ?? "0.0" },
          { label: "Reviews received", value: user.reviewsReceived ?? 0 },
          { label: "Reviews given", value: user.reviewsGiven ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-medium">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ACCOUNT INFO */}
      <div className="p-5 border rounded-xl space-y-3">
        <h2 className="text-sm font-medium">Account info</h2>
        <div className="border-t pt-3 space-y-2.5">
          {[
            { label: "First name", value: user.firstName },
            { label: "Last name", value: user.lastName },
            { label: "Phone", value: user.phone },
            { label: "Account type", value: user.type?.join(", ") },
            {
              label: "Joined",
              value: new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            },
            {
              label: "Last updated",
              value: new Date(user.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span>{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
