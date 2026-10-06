import { createPortal } from "react-dom";

type LightboxPortalProps = {
  children: React.ReactNode;
};

function LightboxPortal({ children }: LightboxPortalProps) {
  const portalElement = document.getElementById("portal-root");

  if (!portalElement) {
    return null;
  }

  return createPortal(
    children,

    portalElement,
  );
}

export default LightboxPortal;
