import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate as useRouterNavigate,
} from "react-router-dom";
import type { ComponentProps, ReactNode } from "react";

type LinkProps = ComponentProps<typeof RouterLink> & {
  activeProps?: { className?: string };
  activeOptions?: { exact?: boolean };
};

export function Link({ activeProps, activeOptions, className, ...props }: LinkProps) {
  const location = useLocation();
  const target = String(props.to);
  const active = activeOptions?.exact
    ? location.pathname === target
    : location.pathname.startsWith(target);
  return (
    <RouterLink
      {...props}
      className={active && activeProps?.className ? activeProps.className : className}
    />
  );
}

export { Outlet, useLocation };

export function useNavigate() {
  const navigate = useRouterNavigate();
  return (to: string | { to: string; search?: Record<string, string> }) =>
    typeof to === "string" ? navigate(to) : navigate(to.to);
}

export function createFileRoute(_path: string) {
  return <T extends { component: React.ComponentType; head?: () => unknown }>(config: T) => config;
}

export function redirect({ to }: { to: string; search?: Record<string, string> }): never {
  throw new Error(`Redirect handled by application router: ${to}`);
}