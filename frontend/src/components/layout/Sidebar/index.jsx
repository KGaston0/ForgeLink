import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  FolderKanban,
  Workflow,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  FolderOpen,
  Folder,
  FileText,
} from 'lucide-react';

/**
 * Recursive tree item component for displaying nested frames.
 * Supports expansion/collapse and active state highlighting.
 */
function TreeItem({ node, currentId, level = 0, onSelect }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isActive = node.id === currentId;
  const isFrame = node.is_frame === true;
  const hasChildren = node.children && node.children.length > 0;

  // ISSUE 1 & 2 FIX: Separate click handlers
  const handleToggleExpand = (e) => {
    // ISSUE 2 FIX: Stop propagation to prevent parent double-click navigation
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleNavigateFrame = () => {
    // ISSUE 1 FIX: Only navigate if it's a frame
    if (!isFrame) return;

    // Update local state in sidebar
    onSelect(node.id);
    
    // Dispatch event to notify canvas
    window.dispatchEvent(
      new CustomEvent('sidebar-navigate', { detail: node.id })
    );
  };

  // ISSUE 1 FIX: Different styling for non-frame nodes (not clickable for navigation)
  const itemClassName = cn(
    'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all duration-200',
    isFrame ? (
      isActive
        ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-400 font-semibold cursor-pointer'
        : 'text-[hsl(var(--explorer-foreground))] hover:bg-[hsl(var(--explorer-hover))] cursor-pointer'
    ) : (
      isActive
        ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-400 font-semibold'
        : 'text-[hsl(var(--explorer-foreground))]'
    )
  );

  return (
    <div>
      <button
        onClick={handleToggleExpand}
        onDoubleClick={isFrame ? handleNavigateFrame : undefined}
        className={itemClassName}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* ISSUE 2 FIX: Only show chevron for frames with children */}
        {isFrame && hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleToggleExpand(e);
            }}
            onDoubleClick={(e) => e.stopPropagation()}
            className="p-0 hover:opacity-70 transition-opacity"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 transition-transform duration-200',
                !isExpanded && '-rotate-90'
              )}
            />
          </button>
        )}
        {/* Hide chevron space for non-frames or frames without children */}
        {(!isFrame || !hasChildren) && <div className="h-4 w-4 shrink-0" />}

        {/* ISSUE 1 FIX: Different icons for frames vs non-frame nodes */}
        {isFrame ? (
          isActive ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-cyan-400" />
          ) : (
            <Folder className="h-4 w-4 shrink-0" style={{ color: 'hsl(var(--explorer-muted-foreground))' }} />
          )
        ) : (
          <FileText className="h-4 w-4 shrink-0" style={{ color: 'hsl(var(--explorer-muted-foreground))' }} />
        )}

        <span className="truncate">{node.name}</span>
      </button>

      {hasChildren && isExpanded && (
        <div className="space-y-0">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              currentId={currentId}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Sidebar navigation with collapsible state, horizontal nav icons, and recursive frame explorer.
 * Uses shadcn/ui primitives (Button, Avatar, Tooltip, Separator).
 */
export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  
  // STEP 3: Replace dummy state with dynamic state from canvas
  const [framesTree, setFramesTree] = useState([]);
  const [currentFrameId, setCurrentFrameId] = useState(null);

  // STEP 3: Listen for canvas frame updates
  useEffect(() => {
    const handleFramesUpdated = (e) => {
      setFramesTree(e.detail || []);
    };

    const handleFolderChanged = (e) => {
      setCurrentFrameId(e.detail);
    };

    window.addEventListener('canvas-frames-updated', handleFramesUpdated);
    window.addEventListener('canvas-folder-changed', handleFolderChanged);

    return () => {
      window.removeEventListener('canvas-frames-updated', handleFramesUpdated);
      window.removeEventListener('canvas-folder-changed', handleFolderChanged);
    };
  }, []);

  const NAV_ITEMS = [
    { name: t('sidebar.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('sidebar.projects'), href: '/projects', icon: FolderKanban },
    { name: t('sidebar.nodeLab'), href: '/node-types', icon: Workflow },
    { name: t('sidebar.settings'), href: '/settings', icon: Settings },
  ];

  const username = user?.user?.username || 'Usuario';
  const email = user?.user?.email || '';
  const initial = username.charAt(0).toUpperCase();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'group/sidebar flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-17' : 'w-64'
        )}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-3">
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center gap-2.5 overflow-hidden transition-opacity duration-200',
              collapsed && 'w-0 opacity-0'
            )}
          >
            {/* Brand icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-primary">
                <circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.5" />
                <circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.7" />
                <circle cx="12" cy="18" r="3" fill="currentColor" />
                <path d="M6 6L12 18M18 6L12 18" stroke="currentColor" strokeWidth="2" opacity="0.35" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
              ForgeLink
            </span>
          </Link>

          {/* Collapse toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed((c) => !c)}
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                aria-label={collapsed ? t('sidebar.expandTooltip') : t('sidebar.collapseTooltip')}
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">{t('sidebar.expandTooltip')}</TooltipContent>
            )}
          </Tooltip>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* ── Collapsible Top Navigation ──────────────────────────────────── */}
        <div className="flex flex-col gap-2 px-2 py-3 shrink-0">
          {/* Navigation toggle button */}
          {!collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNavCollapsed(!navCollapsed)}
                  className="h-8 w-full justify-between px-2 text-xs font-medium text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted"
                  aria-label={navCollapsed ? 'Expand nav' : 'Collapse nav'}
                >
                  <span className="truncate">NAVIGATION</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 transition-transform duration-200',
                      navCollapsed && '-rotate-90'
                    )}
                  />
                </Button>
              </TooltipTrigger>
            </Tooltip>
          )}

          {/* Navigation: Expanded (vertical) or collapsed (horizontal icons) */}
          <nav role="navigation">
            {navCollapsed && !collapsed ? (
              // Horizontal icon layout
              <ul role="list" className="flex flex-row gap-1 flex-wrap">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    location.pathname === item.href ||
                    (item.href !== '/' && location.pathname.startsWith(item.href + '/'));

                  return (
                    <li key={item.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              'flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200',
                              isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground'
                            )}
                          >
                            <item.icon
                              className={cn(
                                'h-[18px] w-[18px] transition-transform duration-200',
                                isActive && 'text-primary'
                              )}
                              strokeWidth={isActive ? 2.25 : 1.75}
                              aria-hidden="true"
                            />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="font-medium text-xs">
                          {item.name}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            ) : (
              // Vertical layout (default)
              <ul role="list" className="flex flex-col gap-0.5">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    location.pathname === item.href ||
                    (item.href !== '/' && location.pathname.startsWith(item.href + '/'));

                  const linkContent = (
                    <Link
                      to={item.href}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground',
                        collapsed && 'justify-center px-0'
                      )}
                    >
                      {/* Active indicator — animated left bar */}
                      <span
                        className={cn(
                          'absolute left-0 top-1/2 -translate-y-1/2 h-0 w-[3px] rounded-full bg-primary transition-all duration-300',
                          isActive && 'h-5'
                        )}
                      />

                      <item.icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110',
                          isActive ? 'text-primary' : 'text-sidebar-muted-foreground group-hover:text-sidebar-foreground'
                        )}
                        strokeWidth={isActive ? 2.25 : 1.75}
                        aria-hidden="true"
                      />

                      <span
                        className={cn(
                          'truncate transition-[opacity,width] duration-200',
                          collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                        )}
                      >
                        {item.name}
                      </span>
                    </Link>
                  );

                  return (
                    <li key={item.name}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {item.name}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        linkContent
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>
        </div>

        {/* ── Frame Explorer ──────────────────────────────────────────── */}
        {!collapsed && (
          <>
            <Separator className="bg-sidebar-border" />
            <div className="flex flex-col flex-1 overflow-hidden px-2 py-3">
              <h3 className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-sidebar-muted-foreground">
                Explorer
              </h3>
              <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                {framesTree && framesTree.length > 0 ? (
                  framesTree.map((frame) => (
                    <TreeItem
                      key={frame.id}
                      node={frame}
                      currentId={currentFrameId}
                      onSelect={setCurrentFrameId}
                    />
                  ))
                ) : (
                  <p className="px-2 py-2 text-xs text-sidebar-muted-foreground">
                    {t('sidebar.noFrames', { defaultValue: 'No frames yet' })}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── User section ────────────────────────────────────────────── */}
        <div className="mt-auto px-2 pb-3">
          <Separator className="mb-3 bg-sidebar-border" />

          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-2 py-2 transition-all duration-200',
              collapsed && 'justify-center px-0'
            )}
          >
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20 transition-shadow duration-200 hover:ring-primary/40">
              <AvatarFallback className="bg-linear-to-br from-primary to-accent text-xs font-bold text-white">
                {initial}
              </AvatarFallback>
            </Avatar>

            <div
              className={cn(
                'flex flex-1 flex-col overflow-hidden transition-[opacity,width] duration-200',
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              )}
            >
              <span className="truncate text-sm font-semibold text-sidebar-foreground">
                {username}
              </span>
              <span className="truncate text-xs text-sidebar-muted-foreground">
                {email}
              </span>
            </div>

            {!collapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label={t('sidebar.logoutTooltip')}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{t('sidebar.logoutTooltip')}</TooltipContent>
              </Tooltip>
            )}
          </div>

          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="mt-1 h-8 w-full text-muted-foreground hover:text-destructive"
                  aria-label={t('sidebar.logoutTooltip')}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{t('sidebar.logoutTooltip')}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
