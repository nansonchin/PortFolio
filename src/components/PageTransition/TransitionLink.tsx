import { forwardRef, type MouseEvent } from "react";
import { Link, useLocation, type LinkProps } from "react-router-dom";
import { useTransitionNavigate } from "../../hooks/useTransitionNavigate";

type TransitionLinkProps = Omit<LinkProps, "to"> & { to: string };

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ to, onClick, target, ...rest }, ref) {
    const go = useTransitionNavigate();
    const { pathname, search } = useLocation();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);

      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (target && target !== "_self") return;
      if (to === pathname + search) return;

      event.preventDefault(); 
      go(to);
    };

    return <Link ref={ref} to={to} target={target} onClick={handleClick} {...rest} />;
  },
);

export default TransitionLink;