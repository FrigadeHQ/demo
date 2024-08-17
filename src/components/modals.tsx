'use client';

import * as Frigade from '@frigade/react';
import { Dialog, useFlow } from '@frigade/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ANNOUNCEMENT_CSS } from '@/lib/frigade-styles';
import { SanityAnnouncement } from '@/components/Sanity/sanity-announcement';

const MODAL_FLOW_ID = 'flow_OMJL2QzR';
const STYLED_MODAL_FLOW_ID = 'flow_Uynd2FX0';
const CUSTOM_MODAL_FLOW_ID = 'flow_HL3Hq1KH';
const NPS_FLOW_ID = 'flow_Gd8oTupY';
const FORM_FLOW_ID = 'flow_aI9TTbI6';

export function Modals() {
  // set two constants for two different Frigade Flows
  const { flow: modalFlow } = useFlow(MODAL_FLOW_ID);
  const { flow: styledModal } = useFlow(STYLED_MODAL_FLOW_ID);
  const { flow: customModal } = useFlow(CUSTOM_MODAL_FLOW_ID);
  const { flow: npsModal } = useFlow(NPS_FLOW_ID);
  const { flow: userFeedBackModal } = useFlow(FORM_FLOW_ID);

  const [modalFlowVisible, setModalFlowVisible] = useState(false);
  const [styledModalVisible, setStyledModalVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [isUserFeedbackVisible, setIsUserFeedbackVisible] = useState(false);
  const [isNPSVisible, setIsNPSVisible] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  function resetModals() {
    setModalFlowVisible(false);
    setStyledModalVisible(false);
    setCustomModalVisible(false);
    setIsUserFeedbackVisible(false);
    setIsNPSVisible(false);
    setIsResetting(false);
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          setIsResetting(true);
          resetModals();
          await modalFlow.restart();
          setModalFlowVisible(true);
          setIsResetting(false);
        }}
        disabled={isResetting}
      >
        Modal
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          setIsResetting(true);
          resetModals();
          await styledModal.restart();
          setStyledModalVisible(true);
          setIsResetting(false);
        }}
        disabled={isResetting}
      >
        Styled Modal
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          setIsResetting(true);
          resetModals();
          await customModal.restart();
          setCustomModalVisible(true);
          setIsResetting(false);
        }}
        disabled={isResetting}
      >
        Custom Modal
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          setIsResetting(true);
          resetModals();
          await userFeedBackModal.restart();
          setIsUserFeedbackVisible(true);
          setIsResetting(false);
        }}
        disabled={isResetting}
      >
        User Feedback
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          setIsResetting(true);
          resetModals();
          await npsModal.restart();
          setIsNPSVisible(true);
          setIsResetting(false);
        }}
        disabled={isResetting}
      >
        NPS Survey
      </Button>
      {modalFlowVisible && (
        <Frigade.Announcement
          flowId={MODAL_FLOW_ID}
          dismissible={true}
          border="1px solid #FFFFFF20"
        />
      )}
      {styledModalVisible && (
        <Frigade.Announcement
          flowId={STYLED_MODAL_FLOW_ID}
          dismissible={false}
          css={ANNOUNCEMENT_CSS}
          border="1px solid #FFFFFF20"
        />
      )}
      {customModalVisible && (
        <SanityAnnouncement flowId={CUSTOM_MODAL_FLOW_ID} />
      )}
      {isNPSVisible && (
        <Frigade.Survey.NPS flowId={NPS_FLOW_ID} dismissible={true} />
      )}
      {isUserFeedbackVisible && (
        <Frigade.Form
          as={Dialog}
          flowId={FORM_FLOW_ID}
          dismissible={true}
          width="500px"
          border="1px solid #FFFFFF20"
          css={{
            '.fr-field-label-required': {
              display: 'none',
            },
          }}
        />
      )}
    </>
  );
}
