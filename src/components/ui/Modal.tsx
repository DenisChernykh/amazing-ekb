import { useOutsideClick } from "@/hooks/useOutsideClick";
import {
  cloneElement,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface ModalContextType {
  openName: string;
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);
function Modal({ children }: { children: React.ReactNode }) {
  const [openName, setOpenName] = useState("");
  const open = setOpenName;
  const close = () => setOpenName("");
  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({
  children,
  opens: openWindowName,
}: {
  children: React.ReactElement<{ onClick?: () => void }>;
  opens: string;
}) {
  const { open } = useContext(ModalContext) ?? {};
  if (!open) {
    throw new Error("Open must be used within a Modal");
  }
  return cloneElement(children, { onClick: () => open(openWindowName) });
}
function Window({
  children,
  name,
}: {
  children: React.ReactElement<{ onCloseModal?: () => void }>;
  name: string;
}) {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Window must be used within a Modal");
  }

  const { openName, close } = context;
  const ref = useOutsideClick(close);
  if (name !== openName) return null;

  return createPortal(
    <div className=" fixed top-0 left-0 w-full h-screen backdrop-blur-[4px] z-50">
      <div
        className=" fixed top-1/2 left-1/2 transform op -translate-x-1/2 -translate-y-1/2 bg-amber-200"
        ref={ref}
      >
        <button onClick={close}>X</button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;
export default Modal;
