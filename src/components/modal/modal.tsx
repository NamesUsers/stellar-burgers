// src/components/modal/modal.tsx
import { FC, PropsWithChildren, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../ui/modal/modal.module.css'; // Путь к твоему CSS
import { useLocation, useNavigate } from 'react-router-dom';

type Props = PropsWithChildren<{
  title?: string;
  onClose: () => void;
}>;

export const Modal: FC<Props> = ({ title, onClose, children }) => {
  const modalRoot = document.getElementById('modal-root') as HTMLElement;

  const location = useLocation();
  const navigate = useNavigate();

  // Состояние для восстановления фона (previous page) при перезагрузке страницы
  const backgroundLocation = location.state?.backgroundLocation;

  useEffect(() => {
    // Закрытие модального окна по клавише Escape
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleClose = () => {
    // После закрытия попапа, возвращаемся на фоновую страницу
    navigate(backgroundLocation || '/'); // Если фоновая страница существует, возвращаемся на неё
    onClose();
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
            onClick={handleClose}
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
