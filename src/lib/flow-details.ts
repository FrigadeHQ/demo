export const USER_FEEDBACK_MODAL_FLOW_ID = 'flow_aI9TTbI6';
//This Flow's config is:
/**
steps:
  - id: page-1
    title: User Feedback
    subtitle: Trigger in-product feedback at the right time.
    primaryButton:
      title: Submit
    fields:
      - id: test-radio
        type: radio
        label: How do you like this demo?
        required: true
        options:
          - label: Like it
            value: 1
          - label: Love it
            value: 2
          - label: Gotta have it
            value: 3
      - id: test-textarea
        type: textarea
        label: Any other feedback?
        placeholder: Short response here...
**/

export const NPS_FLOW_ID = 'flow_Gd8oTupY';
//This Flow's config is:
/**
props:
  dismissible: true
steps:
  - id: nps-score-page
    title: How likely are you to recommend us to a friend or colleague?
    fields:
      - id: nps-score
        type: nps
        label: NPS input field
        positiveLabel: Extremely likely
        negativeLabel: Not likely at all
  - id: nps-feedback-page
    title: Why did you choose this rating?
    primaryButton:
      title: Submit
    fields:
      - id: nps-feedback-text
        type: textarea
        placeholder: Your answer goes here
**/

export const CUSTOM_MODAL_FLOW_ID = 'flow_HL3Hq1KH';
//This Flow's config is:
/**
steps:
  - id: feature-announcement
    title: This announcement is built with Sanity UI
    subtitle: It uses Frigade hooks and custom UI.
    primaryButton:
      title: Next
    secondaryButton:
      title: Learn more
      uri: https://docs.frigade.com/v2/guides/custom
      target: _blank
      action: false
    imageUri: https://cdn.frigade.com/b3bc4cf4-e608-49f9-ab40-8b240016c717.svg
  - id: feature-announcement-2
    title: There's no limit to what you can build
    subtitle: Feel free to reach out with questions.
    primaryButton:
      title: Finish
    imageUri: https://cdn.frigade.com/2253cbcc-51fb-4aef-89f5-b9b22e20481a.svg
**/

export const STYLED_MODAL_FLOW_ID = 'flow_Uynd2FX0';
//This Flow's config is:
/**
steps:
  - id: feature-announcement
    title: This announcement has custom styles
    subtitle: Use custom CSS or connect your design system.
    primaryButton:
      title: Got it
    secondaryButton:
      title: Learn more
      uri: https://docs.frigade.com/v2/sdk/styling/theming
      target: _blank
      action: false
    imageUri: https://cdn.frigade.com/8382f5bb-a242-4355-b1a2-25080321352c.svg
**/

export const MODAL_FLOW_ID = 'flow_OMJL2QzR';
//This Flow's config is:
/**
steps:
  - id: feature-announcement
    title: This is a basic announcement
    subtitle: It is a standard, non-styled version.
    primaryButton:
      title: Next
    secondaryButton:
      title: Learn more
      uri: https://frigade.com/
      target: _blank
      action: false
    imageUri: https://cdn.frigade.com/b7540f8f-1690-4234-b92b-adb9a42ebe36.svg
  - id: feature-announcement-2
    title: Announcements can be multi-page
    subtitle: Check out the other variations on this page
    primaryButton:
      title: Finish
    imageUri: https://cdn.frigade.com/3258935a-a150-46da-9026-54df34729b55.svg
**/

export const CHECKLIST_FLOW_ID = 'flow_lSjFTcXz';
//This Flow's config is:
/**
title: Getting started
subtitle: Build effective onboarding checklists with Frigade <a
  href='https://docs.frigade.com/v2/component/checklist/carousel'
  target='_blank' style='color:#0171F8;'>pre-built UI</a> or custom components.
steps:
  - id: checklist-step-one
    title: State Management
    subtitle: Frigade automatically tracks and remembers completion statuses for
      every user. Mark this step complete, then try closing and reopening this
      tab in your browser.
    primaryButton:
      title: Mark complete
  - id: checklist-step-two
    title: Dynamic Completion
    subtitle: Sometimes you want to mark a step complete after the user completes a
      specific action. Frigade makes this easy. Complete this step by selecting
      <strong>`User action`</strong> below.
    secondaryButton:
      title: Learn more
      action: false
      uri: https://docs.frigade.com/v2/sdk/advanced/completing-a-step
      target: _blank
  - id: checklist-step-three
    title: Conditional Logic
    subtitle: Add your own logic to automatically lock steps or mark them complete.
      For example, complete the final step to unlock this step.
    startCriteria: user.property('hasFinishedStepFour') == true
    primaryButton:
      title: Mark complete
  - id: checklist-step-four
    title: Native UI Components
    subtitle: Style every part of our pre-built UI components to fit seamlessly in
      your product, or build headless with our SDK. Write
      <strong>native</strong> in the box below to complete this step.
**/

export const BANNER_FLOW_ID = 'flow_LrVN8xha';
//This Flow's config is:
/**
steps:
  - id: banner-announcement
    title: You completed the tour!
    subtitle: This is a Frigade banner that uses <a
      href='https://docs.frigade.com/v2/platform/targeting' target='_blank'
      style='color:#0171F8;'>targeting</a> to automatically show after the tour.
**/

export const BANNER_CARD_FLOW_ID = 'flow_yupOQHJs';
//This Flow's config is:
/**
steps:
  - id: banner-announcement
    title: Inline UI Components
    subtitle: Frigade components like this banner and the below card sit within your
      product, not on top of it.
    primaryButton:
      title: Hide
      action: step.complete
**/

export const CARD_FLOW_ID = 'flow_89rqfLTS';
//This Flow's config is:
/**
steps:
  - id: my-card
    title: Frigade Card
    subtitle: Dismiss this card.
**/

export const TOUR_FLOW_ID = 'flow_F0MP8vnI';
//This Flow's config is:
/**
steps:
  - id: tour-step-one
    title: This is a Frigade tour
    subtitle: It can be customized to fit your brand, or built from the ground up
      with your own UI components.
    primaryButton:
      title: Next
    selector: "#demo-card-subtitle"
  - id: tour-step-two
    title: Tours can interact with user inputs
    subtitle: Enter a number larger than 100 to advance to the next step of the tour.
    secondaryButton:
      title: Learn more
      action: false
      uri: https://docs.frigade.com/v2/component/tour
      target: _blank
    selector: "#stock-1"
  - id: tour-step-three
    imageUri: https://cdn.frigade.com/bde697dd-445e-4d70-a395-340096a97a29.png
    title: Push the button
    subtitle: Select the Medium (M) button to complete the final step of this tour.
    selector: "#demo-button-group"
**/

export const FORM_FLOW_ID = 'flow_kTB2fci9';
//This Flow's config is:
/**
steps:
  - id: welcome
    title: Forms
    subtitle: Build powerful, native forms with Frigade. Flexible like Typeform, but
      fully customizable and within your own product –&nbsp;not just iframes.
    primaryButton:
      title: Get started
  - id: branching
    title: Branching
    subtitle: Frigade supports form branching based on user inputs. Try it yourself
      by choosing an option below.
    secondaryButton:
      title: Back
      action: flow.back
    primaryButton:
      title: Continue
    fields:
      - id: input
        type: radio
        required: true
        options:
          - label: Show me a dropdown
            value: dropdown
          - label: Show me a text input
            value: text
          - label: Show me a multi-select
            value: multi
  - id: choice-dropdown
    title: Frigade has dropdown components
    visibilityCriteria: user.flowStepData('flow_kTB2fci9', 'branching', 'input') == 'dropdown'
    secondaryButton:
      title: Back
      action: flow.back
    primaryButton:
      title: Next
    fields:
      - id: dropdown
        type: select
        label: Dropdown
        required: true
        options:
          - label: One
            value: one
          - label: Two
            value: two
          - label: Three
            value: three
  - id: choice-text
    title: Frigade has text components
    visibilityCriteria: user.flowStepData('flow_kTB2fci9', 'branching', 'input') == 'text'
    secondaryButton:
      title: Back
      action: flow.back
    primaryButton:
      title: Next
    fields:
      - id: text
        type: text
        label: Text
        required: true
        placeholder: Write anything...
  - id: choice-multi
    title: Frigade has multi-select components
    visibilityCriteria: user.flowStepData('flow_kTB2fci9', 'branching', 'input') == 'multi'
    secondaryButton:
      title: Back
      action: flow.back
    primaryButton:
      title: Next
    fields:
      - id: multi
        type: select
        multiple: true
        label: Multi-select
        required: true
        options:
          - label: One
            value: one
          - label: Two
            value: two
          - label: Three
            value: three
  - id: custom-components
    title: Custom components
    subtitle: Frigade supports embedding components within forms. The below is a
      custom component that talks to an external movie API and populates the
      dropdown list dynamically.
    secondaryButton:
      title: Back
      action: flow.back
    primaryButton:
      title: Continue
    fields:
      - id: movie-typeahead
        type: movie-typeahead
  - id: contact-us
    title: Learn more
    subtitle: Visit our developer docs to see all Form options, or feel free to grab
      time with our team to discuss your usecase.
    secondaryButton:
      title: Visit docs
      action: false
      uri: https://docs.frigade.com/v2/component/form
      target: _blank
    primaryButton:
      title: Finish
    fields:
      - id: custom-typeahead
        type: custom-typeahead
**/

