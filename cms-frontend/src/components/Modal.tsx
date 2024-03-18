import React, { useEffect, useRef} from "react";
interface ModalProps {
  isOpen: boolean;
  setIsOpen:(isOpen:boolean)=>void;
  children: React.ReactNode;

}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, children}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isOpen) {
        modalElement.showModal();
      } else {

        modalElement.close();
      }
    }
  }, [isOpen]);

  const handleCloseModal = () => {

    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };
  return (
    <dialog ref={modalRef} onKeyDown={handleKeyDown} className="flex flex-col gap-3 px-8 py-6 rounded-md">
      <button className="modal-close-btn" onClick={handleCloseModal}>
        <img src="/close.png" className="size-5 opacity-50 flex justify-end"/>
      </button>
      {children}
    </dialog>
  );
};

export default Modal;
