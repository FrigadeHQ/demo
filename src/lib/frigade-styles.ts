const frigadePromoCardStyles = {
  fontSize: '12px',
  fontWeight: '500',
  color: 'var(--fr-colors-x-sub-header-text)',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: 'var(--fr-colors-x-promo-background)',
  paddingTop: '12px',
  paddingBottom: '14px',
  borderTop: '1px solid',
  borderColor: 'var(--fr-colors-neutral-border)',
  order: '4',
  margin: '0 -32px -32px -32px',
  borderRightBottomRadius: '8px',
  borderRightLeftRadius: '8px',
  overflow: 'hidden',
};

export const ANNOUNCEMENT_CSS = {
  '.fr-dialog:not(.sdk-preview):not(.sdk-preview *)': {
    overflow: 'hidden',
    borderRadius: '8px',
    outline: 'none',

    '&:after:not(.sdk-preview):not(.sdk-preview *)': {
      content: '"<Frigade.Announcement />"',
      ...frigadePromoCardStyles,
    },
  },
  '.fr-announcement-header:not(.sdk-preview):not(.sdk-preview *)': {
    order: 2,
  },
  '.fr-image:not(.sdk-preview):not(.sdk-preview *)': {
    order: 0,
    borderBottom: '1px solid var(--fr-colors-neutral-border)',
    borderRadius: '8px 8px 0 0',
    aspectRatio: '1.9047619048',
    margin: '-32px -32px 0 -32px',
    width: 'calc(100% + 64px)',
    maxWidth: 'calc(100% + 64px)',
  },
  '.fr-progress:not(.sdk-preview):not(.sdk-preview *)': {
    order: 1,
  },
  '.fr-announcement-footer:not(.sdk-preview):not(.sdk-preview *)': {
    order: 3,
  },
  '.fr-button-primary': {
    backgroundColor: 'primary',
  },
};
