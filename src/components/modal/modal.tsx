import { FC, PropsWithChildren, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../ui/modal/modal.module.css'; // путь к твоему CSS

type Props = PropsWithChildren<{
  title?: string;
  onClose: () => void;
}>;

export const Modal: FC<Props> = ({ title, onClose, children }) => {
  // контейнер портала уже создан в index.tsx
  const modalRoot = document.getElementById('modal-root') as HTMLElement;

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.6)',
        zIndex: 9998
      }}
      onMouseDown={onBackdropClick}
    >
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          {title && <h3 className='text text_type_main-large'>{title}</h3>}
          <button
            className={styles.button}
            onClick={onClose}
            aria-label='close'
          >
            ×
          </button>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    modalRoot
  );
};
