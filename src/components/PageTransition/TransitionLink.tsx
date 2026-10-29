import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import type { TransitionVariant } from "./transitionRunner";
import { useTransitionClick } from "../../hooks/useTransitionClick";

type TransitionLinkProps = Omit<LinkProps, "to"> & {
  to: string;
  variant?: TransitionVariant;
};


const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ to, onClick, target, variant, ...rest }, ref) {
    const handleClick = useTransitionClick(to, { onClick, target, variant });

    return <Link ref={ref} to={to} target={target} onClick={handleClick} {...rest} />;
  },
);

export default TransitionLink;