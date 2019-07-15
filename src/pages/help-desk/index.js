import React, { Fragment } from 'react';
import Collapse, { Panel } from 'rc-collapse';

import './index.css';
import 'rc-collapse/assets/index.css';

export default () => (
  <Fragment>
    <h1>Help Center</h1>
    <h3>Find all the answers you need below.</h3>
    <Collapse accordion={true}>
      <Panel header="I purchased an extended video and I didn't receive the link to view it.">
        If you purchased an extended video and didn't receive the link to view it don't panic! 
        We don't send links for the extended videos, instead all you need to do is navigate to the 
        page of the video you purchased and click on the <strong>SWITCH TO EXTENDED</strong> button
        at the bottom of the video.
      </Panel>
      <Panel 
        header="I purchased an extended video but I'm not able to access it." 
        headerClass="my-header-class"
      >
        After your purchase, the extended video should start playing automatically. In case that 
        didn't happen all you need to do is make sure that you are logged in with the same email
        address used at checkout, navigate to the page of the video you want to watch and click on
        the <strong>SWITCH TO EXTENDED</strong> button at the bottom of the video.
      </Panel>
      <Panel 
        header="I purchased an extended video but didn't sign up, can I watch the video again?" 
        headerClass="my-header-class"
      >
        Yes! All you need to do is sign up with the same email address used at checkout and in 
        automatic you will have access to all the videos you purchased with that email address.
      </Panel>
      <Panel 
        header="Where can I find all the videos I purchased?" 
        headerClass="my-header-class"
      >
        In order to have a complete list of all of your videos and promotions, make sure to log in
        and visit the <a href='/user'>User Page</a>.
      </Panel>
      <Panel 
        header="Where is my promo code?" 
        headerClass="my-header-class"
      >
        When receiving a promo code you should be able to view it immediately on the video page, also
        you will receive an email with the promo code and instructions on how to use it. Finally, if 
        you're logged in, you are able to see all of your promo codes on the <a href='/user'>User Page</a>.
      </Panel>
      <Panel 
        header="For how long do I have access to the extended videos?" 
        headerClass="my-header-class"
      >
        <strong>Forever!</strong> Once you purchase an extended video we want you to be able to watch it anytime you need,
        from any device, without any restrictions. 
      </Panel>
      <Panel 
        header="After following the instructions above I'm still experiencing issues. What can I do?" 
        headerClass="my-header-class"
      >
        Don't worry, we're here to help! We want you to have the best experience possible on Dash, feel 
        free to contact us at&nbsp;<a href="mailto:info@dashinbetween.com" target="_blank" rel="noopener noreferrer">info@dashinbetween.com</a>,
        we will answer within 24 hours.
      </Panel>
    </Collapse>
  </Fragment>
);
