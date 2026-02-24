export function AppShell({ children, user, onSignOut }) {
  const initials = user?.email
    ? user.email
        .split("@")[0]
        .split(/[.\-_ ]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "PR";

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden md:flex md:flex-col w-72 bg-gradient-to-b from-violet-100 via-violet-50 to-slate-50 text-slate-900 shadow-xl border-r border-violet-100">
        <div className="px-6 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-violet-200 flex items-center justify-center text-sm font-semibold text-violet-900">
              TI
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Principal dashboard
              </div>
              <div className="text-sm font-semibold">Teacher Insights</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm text-slate-700">
          <NavItem label="Dashboard" active />
          <NavItem label="Teachers" />
          <NavItem label="Classrooms" />
          <NavItem label="Reports" />
        </nav>

        <div className="px-6 py-4 border-t border-violet-100 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-400 flex items-center justify-center text-xs font-semibold text-amber-950">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-slate-800 truncate">
                {user?.email || "Principal"}
              </div>
              <div className="mt-0.5 text-[11px]">
                Signed in as {user?.role || "admin"}
              </div>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="ml-auto rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-slate-900">
                Admin Companion
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                See what&apos;s happening across your school.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center justify-between md:justify-end">
              <div className="flex items-center w-full md:w-auto max-w-xs md:max-w-sm rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 shadow-sm">
                <span className="mr-2">Search</span>
                <span className="ml-auto text-[10px] text-slate-400">
                  Ask assistant
                </span>
              </div>
              <div className="flex gap-2">
                <button className="rounded-full bg-violet-600 text-white px-3 py-1.5 text-xs font-medium shadow-sm">
                  Grade 7
                </button>
                <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                  All subjects
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ label, active }) {
  return (
    <button
      type="button"
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition ${
        active
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
      }`}
    >
      <span>{label}</span>
    </button>
  );
}

