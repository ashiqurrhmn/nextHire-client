"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bars } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { signOut, useSession } from "@/lib/auth-client";

// Custom SVG Icons matching the design
const HomeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const GridIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const CompanyIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 21h18" />
    <path d="M9 8h1v1H9V8zm0 4h1v1H9v-1zm0 4h1v1H9v-1zm4-8h1v1h-1V8zm0 4h1v1h-1v-1zm0 4h1v1h-1v-1zm4-8h1v1h-1V8zm0 4h1v1h-1v-1z" />
    <path d="M5 21V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18" />
  </svg>
);

const BriefcaseIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const FileTextIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const SettingsIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BookmarkIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const CreditCardIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const UsersIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);



export function DashboardSideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isAuthenticated = !isPending && Boolean(user);
  const userRole = user?.role || "seeker";
  const userName = user?.name || user?.email || "User";
  const userImage = user?.image;
  const userPlan = user?.plan || "seeker_free";
  const normalizedPlan = userPlan.toLowerCase();
  const isPremium = normalizedPlan.includes("premium") || 
                    normalizedPlan.includes("pro") || 
                    normalizedPlan.includes("enterprise");
  
  let displayPlanName = "PREMIUM";
  if (normalizedPlan.includes("pro")) displayPlanName = "PRO";
  else if (normalizedPlan.includes("enterprise")) displayPlanName = "ENTERPRISE";

  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "NH";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.refresh();
      router.push("/");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    if (userRole === "recruiter") {
      return [
        { icon: HomeIcon, label: "Home", href: "/" },
        { icon: GridIcon, label: "Dashboard", href: "/dashboard/recruiter" },
        { icon: CompanyIcon, label: "My Company", href: "/dashboard/recruiter/company" },
        { icon: BriefcaseIcon, label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
        { icon: FileTextIcon, label: "Applications", href: "/dashboard/recruiter/applications" },
        { icon: CreditCardIcon, label: "Billing", href: "/dashboard/recruiter/billing" },
        { icon: SettingsIcon, label: "Settings", href: "/dashboard/recruiter/settings" },
      ];
    }

    if (userRole === "admin") {
      return [
        { icon: GridIcon, label: "Dashboard", href: "/dashboard/admin" },
        { icon: UsersIcon, label: "Users", href: "/dashboard/admin/users" },
        { icon: CompanyIcon, label: "Companies", href: "/dashboard/admin/companies" },
        { icon: BriefcaseIcon, label: "Jobs", href: "/dashboard/admin/jobs" },
        { icon: CreditCardIcon, label: "Payments", href: "/dashboard/admin/payments" },
        { icon: SettingsIcon, label: "Settings", href: "/dashboard/admin/settings" },
      ];
    }

    return [
      { icon: GridIcon, label: "Dashboard", href: "/dashboard/seeker" },
      { icon: SearchIcon, label: "Jobs", href: "/browse-jobs" },
      { icon: BookmarkIcon, label: "Saved Jobs", href: "/dashboard/seeker/saved-jobs" },
      { icon: FileTextIcon, label: "Applications", href: "/dashboard/seeker/applications" },
      { icon: CreditCardIcon, label: "Billing", href: "/dashboard/seeker/billing" },
      { icon: SettingsIcon, label: "Settings", href: "/dashboard/seeker/settings" },
    ];
  };

  const navItems = getNavItems();

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/dashboard/seeker" || href === "/dashboard/recruiter" || href === "/dashboard/admin") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const navContent = (
    <nav className="flex flex-col gap-2 w-full">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex items-center justify-between rounded-xl pl-3 pr-4 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden ${
              active
                ? "text-white bg-gradient-to-r from-[#0088FF]/10 to-transparent border-r-2 border-[#0088FF]"
                : "text-zinc-450 hover:text-white hover:bg-zinc-900/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon
                className={`size-5 transition-colors duration-200 ${
                  active ? "text-[#0088FF]" : "text-zinc-500 group-hover:text-zinc-300"
                }`}
              />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );

  const profileHeader = (
    <div className="flex flex-col gap-3 px-1 py-4 border-b border-zinc-900 w-full mb-4">
      <div className="flex items-center gap-3">
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover border border-zinc-800"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0088FF] to-[#FF5E00] text-sm font-bold text-white shadow-lg shadow-[#0088FF]/10">
            {userInitials}
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-white truncate max-w-[130px]">
            {userName}
          </span>
          <span className="text-[11px] text-zinc-500 capitalize truncate">
            {userRole}
          </span>
        </div>
      </div>
      {isPremium ? (
        <div className="inline-flex">
          <span className="rounded-md border border-[#FF5E00]/30 bg-[#FF5E00]/5 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-[#FF5E00] uppercase">
            {displayPlanName} ACCOUNT
          </span>
        </div>
      ) : (
        <div className="inline-flex">
          <span className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
            FREE ACCOUNT
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-zinc-900 bg-[#0a0a0c] p-6 h-full shrink-0">
        <div className="flex flex-col gap-2">
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-2 outline-none px-1 py-2 mb-2 hover:opacity-80 transition-opacity cursor-pointer block">
            <Image src="/assets/logo.png" alt="Logo" width={150} height={100} style={{ width: "auto", height: "auto" }} />
          </Link>

          {/* Profile Header (Top) */}
          {isAuthenticated && profileHeader}

          {/* Navigation Links */}
          {navContent}
        </div>

        {/* Bottom Actions / Sign Out */}
        <div className="border-t border-zinc-900 pt-4 w-full">
          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-3 w-full rounded-xl px-3 py-3 text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer disabled:opacity-50"
              type="button"
            >
              {isSigningOut ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <LogoutIcon className="size-5" />
              )}
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/auth/signin"
                className="flex items-center justify-center w-full py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors text-center"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sticky Header Bar */}
      <div className="lg:hidden flex items-center justify-between w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-4 py-3 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="Logo" width={120} height={80} style={{ width: "auto", height: "auto" }} />
        </Link>

        <Drawer>
          <Button
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-900 bg-zinc-900/60 text-xs font-semibold text-zinc-300 hover:text-white transition-all min-w-0"
            variant="secondary"
          >
            <Bars className="size-4" />
            Menu
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content
              placement="left"
              className="bg-[#0a0a0c] border-r border-zinc-900 text-white max-w-[280px]"
            >
              <Drawer.Dialog className="h-full flex flex-col justify-between p-5 bg-[#0a0a0c]">
                <Drawer.CloseTrigger className="absolute right-4 top-4 text-zinc-400 hover:text-white" />
                <Drawer.Header className="pt-2 pb-4 border-b border-zinc-900">
                  <Drawer.Heading className="text-lg font-bold text-white flex items-center gap-2">
                    <Link href="/" className="hover:opacity-80 transition-opacity cursor-pointer block">
                      <Image src="/assets/logo.png" alt="Logo" width={120} height={80} style={{ width: "auto", height: "auto" }} />
                    </Link>
                  </Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body className="flex-1 py-4 overflow-y-auto">
                  {isAuthenticated && profileHeader}
                  {navContent}
                </Drawer.Body>
                <div className="border-t border-zinc-900 pt-4">
                  {isAuthenticated && (
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex items-center gap-3 w-full rounded-xl px-3 py-3 text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
                      type="button"
                    >
                      <LogoutIcon className="size-5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}
