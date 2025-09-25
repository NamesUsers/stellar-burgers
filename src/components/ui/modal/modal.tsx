import { FC, memo } from 'react';

import styles from './modal.module.css';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children, dataCy }) => (
    <>
      <div className={styles.modal} data-cy={dataCy}>
        {' '}
        {/* Используем dataCy проп */}
        <div className={styles.header}>
          <h3 className={`${styles.title} text text_type_main-large`}>
            {title}
          </h3>
          <button
            className={styles.button}
            type='button'
            data-cy='modal-close-button'
          >
            <CloseIcon type='primary' onClick={onClose} />
          </button>
        </div>
        <div className={styles.content}>
          {children} {/* Отображение переданного контента (номер заказа) */}
        </div>
      </div>
      <ModalOverlayUI onClick={onClose} data-cy='modal-overlay' />
    </>
  )
);
