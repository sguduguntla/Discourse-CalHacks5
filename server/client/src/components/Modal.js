import React from 'react';

const Modal = ({ id, title, body, btnOkText, btnCloseText, onSubmit }) => {
    return (
        <div className="modal fade" id={ id } tabIndex="-1" role="dialog" aria-labelledby={ id + "Label" } aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">{ title }</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  { body }
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">{ btnCloseText }</button>
                  { onSubmit ? <button type="button" onClick={onSubmit} className="btn btn-primary" data-dismiss="modal">{ btnOkText }</button> : ""}
                </div>
              </div>
            </div>
          </div>
    );
};

export default Modal;