"use client";

import * as React from "react";
import {
  LayoutPanelLeft,
  LayoutDashboard,
  Mail,
  CheckSquare,
  MessageCircle,
  Calendar,
  Shield,
  AlertTriangle,
  Settings,
  HelpCircle,
  CreditCard,
  LayoutTemplate,
  Users,
  BarChart3,
  Zap,
  ListOrdered,
  Gavel,
  BadgeDollarSign,
  Bell,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getUser } from "@/lib/cookies";
import Image from "next/image";

const data = {
  user: {
    name: "Next js",
    email: "admin@example.com",
    avatar: "",
  },
  navGroups: [
    // {
    //   label: "Dashboards",
    //   items: [
    //     {
    //       title: "Dashboard",
    //       url: "/dashboard",
    //       icon: LayoutDashboard,
    //     },
    //   ],
    // },
    {
      label: "Apps",
      items: [
        {
          title: "Dashboards",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Users Management",
          url: "/dashboard/users",
          icon: Users,
        },
        {
          title: "Fixed Price",
          url: "/dashboard/fixed-price",
          icon: CreditCard,
        },
        {
          title: "Auction",
          url: "/dashboard/auction",
          icon: Gavel,
        },
        {
          title: "Taking Offer",
          url: "/dashboard/taking-offer",
          icon: BadgeDollarSign,
        },
        {
          title: "Authentication Management",
          url: "/dashboard/authentication",
          icon: Gavel,
        },
        {
          title: "Advertisements",
          url: "/dashboard/advertisements",
          icon: Megaphone,
        },

        // {
        //   title: "Chat",
        //   url: "/dashboard/chat",
        //   icon: MessageCircle,
        // },
        {
          title: "Notifications",
          url: "/dashboard/notification",
          icon: Bell,
        },
        {
          title: "Reports & Analytics",
          url: "/dashboard/reports",
          icon: BarChart3,
        },
      ],
    },

    // {
    //   label: "Heavy Pages",
    //   items: [
    //     {
    //       title: "Heavy Data",
    //       url: "/heavy-data",
    //       icon: BarChart3,
    //     },
    //     {
    //       title: "Heavy Charts",
    //       url: "/heavy-charts",
    //       icon: BarChart3,
    //     },
    //   ],
    // },
    // {
    //   label: "Pages",
    //   items: [
    //     {
    //       title: "Landing",
    //       url: "/landing",
    //       target: "_blank",
    //       icon: LayoutTemplate,
    //     },
    //     {
    //       title: "Auth Pages",
    //       url: "#",
    //       icon: Shield,
    //       items: [
    //         {
    //           title: "Sign In 1",
    //           url: "/sign-in",
    //         },
    //         {
    //           title: "Sign In 2",
    //           url: "/sign-in-2",
    //         },
    //         {
    //           title: "Sign In 3",
    //           url: "/sign-in-3",
    //         },
    //         {
    //           title: "Sign Up 1",
    //           url: "/sign-up",
    //         },
    //         {
    //           title: "Sign Up 2",
    //           url: "/sign-up-2",
    //         },
    //         {
    //           title: "Sign Up 3",
    //           url: "/sign-up-3",
    //         },
    //         {
    //           title: "Forgot Password 1",
    //           url: "/forgot-password",
    //         },
    //         {
    //           title: "Forgot Password 2",
    //           url: "/forgot-password-2",
    //         },
    //         {
    //           title: "Forgot Password 3",
    //           url: "/forgot-password-3",
    //         },
    //       ],
    //     },
    //     {
    //       title: "Errors",
    //       url: "#",
    //       icon: AlertTriangle,
    //       items: [
    //         {
    //           title: "Unauthorized",
    //           url: "/errors/unauthorized",
    //         },
    //         {
    //           title: "Forbidden",
    //           url: "/errors/forbidden",
    //         },
    //         {
    //           title: "Not Found",
    //           url: "/errors/not-found",
    //         },
    //         {
    //           title: "Internal Server Error",
    //           url: "/errors/internal-server-error",
    //         },
    //         {
    //           title: "Under Maintenance",
    //           url: "/errors/under-maintenance",
    //         },
    //       ],
    //     },
    //     {
    //       title: "Settings",
    //       url: "#",
    //       icon: Settings,
    //       items: [
    //         {
    //           title: "User Settings",
    //           url: "/settings/user",
    //         },
    //         {
    //           title: "Account Settings",
    //           url: "/settings/account",
    //         },
    //         {
    //           title: "Plans & Billing",
    //           url: "/settings/billing",
    //         },
    //         {
    //           title: "Appearance",
    //           url: "/settings/appearance",
    //         },
    //         {
    //           title: "Notifications",
    //           url: "/settings/notifications",
    //         },
    //         {
    //           title: "Connections",
    //           url: "/settings/connections",
    //         },
    //       ],
    //     },
    //     // {
    //     //   title: "FAQs",
    //     //   url: "/faqs",
    //     //   icon: HelpCircle,
    //     // },
    //     // {
    //     //   title: "Pricing",
    //     //   url: "/pricing",
    //     //   icon: CreditCard,
    //     // },
    //   ],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const adminProfile = getUser();
  console.log(adminProfile);
  const userData = adminProfile
    ? {
        name: adminProfile?.name,
        email: adminProfile?.email,
        avatar: "",
      }
    : {
        name: "Guest",
        email: "",
        avatar: "",
      };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex items-center gap-3">
                  <Image
                    src="images/fav-icon.png"
                    width={35}
                    height={35}
                    alt="Favicon"
                    unoptimized
                  />

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-none">
                      Bid The Bezel
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Admin Dashboard
                    </span>
                  </div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {/* <span className="truncate font-medium">Bid The Bezel</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
