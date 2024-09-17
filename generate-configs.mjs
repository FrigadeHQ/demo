// nodejs client script that uses @frigade/js calls get flows
import {Frigade} from "@frigade/js";
import {stringify} from 'yaml';
import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({path: '.env.local'});

if (!process.env.NEXT_PUBLIC_FRIGADE_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_FRIGADE_API_KEY');
}

const frigade = new Frigade(process.env.NEXT_PUBLIC_FRIGADE_API_KEY);

const demoFlowIds = {
  "flow_F0MP8vnI": "TOUR_FLOW_ID",
  "flow_QoSHPAnV": "HINT_FLOW_ID",
  "flow_LrVN8xha": "BANNER_FLOW_ID",
  "flow_kTB2fci9": "FORM_FLOW_ID",
  "flow_lSjFTcXz": "CHECKLIST_FLOW_ID",
  "flow_OMJL2QzR": "MODAL_FLOW_ID",
  "flow_Uynd2FX0": "STYLED_MODAL_FLOW_ID",
  "flow_HL3Hq1KH": "CUSTOM_MODAL_FLOW_ID",
  "flow_Gd8oTupY": "NPS_FLOW_ID",
  "flow_aI9TTbI6": "USER_FEEDBACK_MODAL_FLOW_ID",
  "flow_89rqfLTS": "CARD_FLOW_ID",
  "flow_yupOQHJs": "BANNER_CARD_FLOW_ID",
}

async function main() {
  const flows = await frigade.getFlows();
  let flowFileContents = '';

  flows.forEach(flow => {
    let data = flow.rawData.data;

    // remove all $state fields from the data.steps array
    if (data.steps && data.steps.length > 0) {
      data.steps.forEach(step => {
        delete step.$state;
      });
    }

    const yamlString = stringify(
      data
    );

    if (demoFlowIds[flow.id]) {
      flowFileContents += `export const ${demoFlowIds[flow.id]} = '${flow.id}';\n//This Flow's config is:\n/**\n${yamlString}**/\n\n`;
    }
  });

  fs.writeFileSync('src/lib/flow-details.ts', flowFileContents);
}


main();
