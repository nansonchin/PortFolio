import { forwardRef } from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import type { TransitionVariant } from "./transitionRunner";
import { useTransitionClick } from "../../hooks/useTransitionClick";

type TransitionNavLinkProps = Omit<NavLinkProps, "to"> & {
  to: string;
  variant?: TransitionVariant;
};

const TransitionNavLink = forwardRef<HTMLAnchorElement, TransitionNavLinkProps>(
  function TransitionNavLink({ to, onClick, target, variant, ...rest }, ref) {
    const handleClick = useTransitionClick(to, { onClick, target, variant });

    return <NavLink ref={ref} to={to} target={target} onClick={handleClick} {...rest} />;
  },
);

export default TransitionNavLink;