import React, { Dispatch, SetStateAction, useRef } from "react";
import { EtherInput } from "~~/components/scaffold-eth";

interface AllocateRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllocate: () => void;
  rewardAmount: string;
  setRewardAmount: Dispatch<SetStateAction<string>>;
}

const AllocateRewardModal: React.FC<AllocateRewardModalProps> = ({
  isOpen,
  onClose,
  onAllocate,
  rewardAmount,
  setRewardAmount,
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  if (isOpen) {
    modalRef.current?.showModal();
  } else {
    modalRef.current?.close();
  }

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Allocate Reward</h3>
        <EtherInput value={rewardAmount} onChange={amount => setRewardAmount(amount)} />
        <button onClick={onAllocate} className="btn btn-primary mt-4">
          Allocate
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default AllocateRewardModal;
