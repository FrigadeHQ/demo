'use client';
import * as Frigade from '@frigade/react';
import { Dialog, useFlow } from '@frigade/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ANNOUNCEMENT_CSS } from '@/lib/frigade-styles';
import { SanityAnnouncement } from '@/components/Sanity/sanity-announcement';

const ANNOUNCEMENT_ONE_FLOW_ID = 'flow_OMJL2QzR';
const ANNOUNCEMENT_TWO_FLOW_ID = 'flow_Uynd2FX0';
const ANNOUNCEMENT_THREE_FLOW_ID = 'flow_CTwUzb9X';
const ANNOUNCEMENT_FOUR_FLOW_ID = 'flow_HL3Hq1KH';
const NPS_FLOW_ID = 'flow_Gd8oTupY';
const FORM_FLOW_ID = 'flow_aI9TTbI6';

export default function Modals() {
  // set two constants for two different Frigade Flows
  const { flow: announcementOne } = useFlow(ANNOUNCEMENT_ONE_FLOW_ID);
  const { flow: announcementTwo } = useFlow(ANNOUNCEMENT_TWO_FLOW_ID);
  const { flow: announcementFour } = useFlow(ANNOUNCEMENT_FOUR_FLOW_ID);
  const { flow: NPS } = useFlow(NPS_FLOW_ID);
  const { flow: UserFeedback } = useFlow(FORM_FLOW_ID);

  const [isAnnouncementOneVisible, setIsAnnouncementOneVisible] =
    useState(false);
  const [isAnnouncementTwoVisible, setIsAnnouncementTwoVisible] =
    useState(false);
  const [isAnnouncementFourVisible, setIsAnnouncementFourVisible] =
    useState(false);
  const [isUserFeedbackVisible, setIsUserFeedbackVisible] = useState(false);
  const [isNPSVisible, setIsNPSVisible] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await announcementOne?.restart();
              setIsAnnouncementOneVisible(true);
            }}
          >
            Modal
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await announcementTwo?.restart();
              setIsAnnouncementTwoVisible(true);
            }}
          >
            Styled Modal
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await announcementFour?.restart();
              setIsAnnouncementFourVisible(true);
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
              await NPS?.restart();
              setIsNPSVisible(true);
            }}
          >
            NPS Survey
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await UserFeedback?.restart();
              setIsUserFeedbackVisible(true);
            }}
          >
            User Feedback
          </Button>
        </div>
      </div>
      {isAnnouncementOneVisible && (
        <Frigade.Announcement
          flowId={ANNOUNCEMENT_ONE_FLOW_ID}
          dismissible={true}
          border="1px solid #FFFFFF20"
        />
      )}
      {isAnnouncementTwoVisible && (
        <Frigade.Announcement
          flowId={ANNOUNCEMENT_TWO_FLOW_ID}
          dismissible={false}
          css={ANNOUNCEMENT_CSS}
          border="1px solid #FFFFFF20"
        />
      )}
      <Frigade.Announcement
        flowId={ANNOUNCEMENT_THREE_FLOW_ID}
        dismissible={true}
        border="1px solid #FFFFFF20"
      />
      {isAnnouncementFourVisible && (
        <SanityAnnouncement flowId={ANNOUNCEMENT_FOUR_FLOW_ID} />
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
        />
      )}
    </>
  );
}
