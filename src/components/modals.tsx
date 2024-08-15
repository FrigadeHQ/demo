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

  function resetModals() {
    setModalFlowVisible(false);
    setStyledModalVisible(false);
    setCustomModalVisible(false);
    setIsUserFeedbackVisible(false);
    setIsNPSVisible(false);
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          resetModals();
          setModalFlowVisible(true);
          modalFlow?.restart();
        }}
      >
        Modal
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          resetModals();
          setStyledModalVisible(true);
          styledModal.restart();
        }}
      >
        Styled Modal
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          resetModals();
          setCustomModalVisible(true);
          customModal?.restart();
        }}
      >
        Custom Modal
      </Button>
      {/*<Button size="sm" variant="outline">*/}
      {/*  Corner Modal*/}
      {/*</Button>*/}
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          resetModals();
          setIsNPSVisible(true);
          npsModal?.restart();
        }}
      >
        NPS Survey
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          resetModals();
          setIsUserFeedbackVisible(true);
          userFeedBackModal?.restart();
        }}
      >
        User Feedback
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
      {/*<Frigade.Announcement*/}
      {/*  flowId={ANNOUNCEMENT_THREE_FLOW_ID}*/}
      {/*  dismissible={true}*/}
      {/*  border="1px solid #FFFFFF20"*/}
      {/*/>*/}
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
          repeatable={true}
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
