import React, { useEffect } from 'react';
import '../confirm/confirm.scss';
import { IoCloseSharp } from "react-icons/io5";


const Confirm = ({ onConfirmYes, onConfirmNo })=> {
  useEffect(() => {
    // When modal opens, set overflow to hidden
    document.body.style.overflow = "hidden";

    // Cleanup function: when the modal closes, reset the overflow
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []); 
  return (
    <div className='confirmContainer'>
        <div className="confirmMain">
            <div className="textClose">
                <h5>CONFİRMATİON</h5>
                <IoCloseSharp className='sharp' onClick={onConfirmNo}/>
            </div>
            <div className="mainText">
                Silmək istədiyinizə əminsiniz mi?
            </div>
            <div className="btns">
            <button onClick={onConfirmYes}>Bəli</button>
            <button onClick={onConfirmNo}>Xeyr</button>
            </div>
        </div>
    </div>
  )
}

export default Confirm